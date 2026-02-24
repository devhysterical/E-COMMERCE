"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrdersService", {
    enumerable: true,
    get: function() {
        return OrdersService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _cartsservice = require("../carts/carts.service");
const _emailservice = require("../email/email.service");
const _shippingservice = require("../shipping/shipping.service");
const _flashsaleservice = require("../flash-sale/flash-sale.service");
const _loyaltyservice = require("../loyalty/loyalty.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OrdersService = class OrdersService {
    async createOrder(userId, address, phone, paymentMethod = 'COD', couponId, province) {
        const cart = await this.cartsService.getCart(userId);
        if (!cart.cartItems.length) {
            throw new _common.BadRequestException('Giỏ hàng trống');
        }
        // Kiểm tra flash sale price cho từng sản phẩm
        const flashSaleMap = new Map();
        for (const item of cart.cartItems){
            const flashSaleInfo = await this.flashSaleService.checkFlashSalePrice(item.productId, userId);
            if (flashSaleInfo) {
                flashSaleMap.set(item.productId, flashSaleInfo);
            }
        }
        const totalAmount = cart.cartItems.reduce((sum, item)=>{
            const flashInfo = flashSaleMap.get(item.productId);
            const price = flashInfo ? flashInfo.salePrice : item.product.price;
            return sum + price * item.quantity;
        }, 0);
        // Xử lý coupon nếu có
        let discountAmount = 0;
        let validCouponId = undefined;
        if (couponId) {
            const coupon = await this.prisma.coupon.findUnique({
                where: {
                    id: couponId
                }
            });
            if (coupon && coupon.isActive) {
                // Kiểm tra user đã dùng coupon chưa
                const existingUsage = await this.prisma.couponUsage.findUnique({
                    where: {
                        couponId_userId: {
                            couponId,
                            userId
                        }
                    }
                });
                if (!existingUsage) {
                    // Tính discount
                    if (coupon.discountType === 'PERCENTAGE') {
                        discountAmount = Math.floor(totalAmount * coupon.discountValue / 100);
                        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                            discountAmount = coupon.maxDiscount;
                        }
                    } else {
                        discountAmount = coupon.discountValue;
                        if (discountAmount > totalAmount) {
                            discountAmount = totalAmount;
                        }
                    }
                    validCouponId = couponId;
                }
            }
        }
        // Tính phí vận chuyển
        let shippingFee = 0;
        if (province) {
            const shippingResult = await this.shippingService.calculateFee(province, totalAmount - discountAmount);
            shippingFee = shippingResult.fee;
        }
        const finalAmount = totalAmount - discountAmount + shippingFee;
        // Sử dụng transaction để đảm bảo tính toàn vẹn
        return this.prisma.$transaction(async (tx)=>{
            // 1. Tạo Order
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount: finalAmount,
                    discountAmount,
                    shippingFee,
                    couponId: validCouponId,
                    address,
                    phone,
                    paymentMethod,
                    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING'
                }
            });
            // 2. Tạo OrderItems và Cập nhật Stock
            for (const item of cart.cartItems){
                if (item.product.stock < item.quantity) {
                    throw new _common.BadRequestException(`Sản phẩm ${item.product.name} không đủ tồn kho`);
                }
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: flashSaleMap.get(item.productId)?.salePrice ?? item.product.price
                    }
                });
                await tx.product.update({
                    where: {
                        id: item.productId
                    },
                    data: {
                        stock: item.product.stock - item.quantity
                    }
                });
            }
            // 3. Cập nhật soldQty cho flash sale items
            for (const [productId, flashInfo] of flashSaleMap){
                const cartItem = cart.cartItems.find((ci)=>ci.productId === productId);
                if (cartItem) {
                    await this.flashSaleService.incrementSoldQty(flashInfo.flashSaleItemId, cartItem.quantity);
                }
            }
            // 4. Xóa giỏ hàng
            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id
                }
            });
            // 5. Ghi nhận sử dụng coupon
            if (validCouponId) {
                await tx.couponUsage.create({
                    data: {
                        couponId: validCouponId,
                        userId,
                        orderId: order.id
                    }
                });
                await tx.coupon.update({
                    where: {
                        id: validCouponId
                    },
                    data: {
                        usedCount: {
                            increment: 1
                        }
                    }
                });
            }
            // 6. Gửi email xác nhận đơn hàng
            const user = await tx.user.findUnique({
                where: {
                    id: userId
                }
            });
            if (user?.email) {
                void this.emailService.sendOrderConfirmationEmail(user.email, {
                    orderId: order.id,
                    totalAmount: finalAmount,
                    discountAmount,
                    items: cart.cartItems.map((item)=>({
                            name: item.product.name,
                            quantity: item.quantity,
                            price: item.product.price * item.quantity
                        })),
                    address,
                    paymentMethod
                });
            }
            return order;
        });
    }
    async findAll(userId) {
        return this.prisma.order.findMany({
            where: {
                userId,
                deletedAt: null
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findOne(id, userId) {
        return this.prisma.order.findFirst({
            where: {
                id,
                userId,
                deletedAt: null
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
    // Admin APIs
    async findAllAdmin() {
        return this.prisma.order.findMany({
            where: {
                deletedAt: null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true
                    }
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async updateStatus(id, status) {
        const order = await this.prisma.order.findUnique({
            where: {
                id
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!order) {
            throw new _common.NotFoundException('Đơn hàng không tồn tại');
        }
        // Nếu chuyển sang CANCELLED và đơn hàng trước đó không phải CANCELLED
        // thì hoàn lại tồn kho
        if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
            return this.prisma.$transaction(async (tx)=>{
                // Hoàn lại stock cho từng sản phẩm
                for (const item of order.orderItems){
                    await tx.product.update({
                        where: {
                            id: item.productId
                        },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    });
                }
                // Cập nhật status đơn hàng
                return tx.order.update({
                    where: {
                        id
                    },
                    data: {
                        status
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true
                            }
                        },
                        orderItems: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
        // Nếu không phải CANCELLED, chỉ cập nhật status bình thường
        const updatedOrder = await this.prisma.order.update({
            where: {
                id
            },
            data: {
                status
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true
                    }
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        // Gửi email thông báo cập nhật status
        if (updatedOrder.user?.email) {
            const statusLabels = {
                PENDING: 'Chờ xử lý',
                PROCESSING: 'Đang xử lý',
                SHIPPED: 'Đang giao hàng',
                DELIVERED: 'Đã giao hàng',
                CANCELLED: 'Đã hủy'
            };
            void this.emailService.sendOrderStatusUpdateEmail(updatedOrder.user.email, {
                orderId: id,
                status,
                statusLabel: statusLabels[status] || status
            });
        }
        // Tich diem loyalty khi DELIVERED
        if (status === 'DELIVERED' && updatedOrder.user?.id) {
            void this.loyaltyService.earnPoints(updatedOrder.user.id, id, order.totalAmount);
        }
        return updatedOrder;
    }
    async getStats() {
        const [totalOrders, totalRevenue, ordersByStatus] = await Promise.all([
            this.prisma.order.count({
                where: {
                    deletedAt: null
                }
            }),
            this.prisma.order.aggregate({
                where: {
                    deletedAt: null,
                    status: {
                        not: 'CANCELLED'
                    }
                },
                _sum: {
                    totalAmount: true
                }
            }),
            this.prisma.order.groupBy({
                by: [
                    'status'
                ],
                _count: {
                    status: true
                },
                where: {
                    deletedAt: null
                }
            })
        ]);
        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            ordersByStatus: ordersByStatus.reduce((acc, item)=>{
                acc[item.status] = item._count.status;
                return acc;
            }, {})
        };
    }
    async updatePaymentStatus(orderId, status, momoTransId) {
        return this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                paymentStatus: status,
                momoTransId: momoTransId
            }
        });
    }
    constructor(prisma, cartsService, emailService, shippingService, flashSaleService, loyaltyService){
        this.prisma = prisma;
        this.cartsService = cartsService;
        this.emailService = emailService;
        this.shippingService = shippingService;
        this.flashSaleService = flashSaleService;
        this.loyaltyService = loyaltyService;
    }
};
OrdersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _cartsservice.CartsService === "undefined" ? Object : _cartsservice.CartsService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService,
        typeof _shippingservice.ShippingService === "undefined" ? Object : _shippingservice.ShippingService,
        typeof _flashsaleservice.FlashSaleService === "undefined" ? Object : _flashsaleservice.FlashSaleService,
        typeof _loyaltyservice.LoyaltyService === "undefined" ? Object : _loyaltyservice.LoyaltyService
    ])
], OrdersService);

//# sourceMappingURL=orders.service.js.map