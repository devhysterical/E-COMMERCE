"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const carts_service_1 = require("../carts/carts.service");
const email_service_1 = require("../email/email.service");
let OrdersService = class OrdersService {
    prisma;
    cartsService;
    emailService;
    constructor(prisma, cartsService, emailService) {
        this.prisma = prisma;
        this.cartsService = cartsService;
        this.emailService = emailService;
    }
    async createOrder(userId, address, phone, paymentMethod = 'COD', couponId) {
        const cart = await this.cartsService.getCart(userId);
        if (!cart.cartItems.length) {
            throw new common_1.BadRequestException('Giỏ hàng trống');
        }
        const totalAmount = cart.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        let discountAmount = 0;
        let validCouponId = undefined;
        if (couponId) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { id: couponId },
            });
            if (coupon && coupon.isActive) {
                const existingUsage = await this.prisma.couponUsage.findUnique({
                    where: { couponId_userId: { couponId, userId } },
                });
                if (!existingUsage) {
                    if (coupon.discountType === 'PERCENTAGE') {
                        discountAmount = Math.floor((totalAmount * coupon.discountValue) / 100);
                        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                            discountAmount = coupon.maxDiscount;
                        }
                    }
                    else {
                        discountAmount = coupon.discountValue;
                        if (discountAmount > totalAmount) {
                            discountAmount = totalAmount;
                        }
                    }
                    validCouponId = couponId;
                }
            }
        }
        const finalAmount = totalAmount - discountAmount;
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount: finalAmount,
                    discountAmount,
                    couponId: validCouponId,
                    address,
                    phone,
                    paymentMethod,
                    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
                },
            });
            for (const item of cart.cartItems) {
                if (item.product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Sản phẩm ${item.product.name} không đủ tồn kho`);
                }
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    },
                });
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: item.product.stock - item.quantity },
                });
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            if (validCouponId) {
                await tx.couponUsage.create({
                    data: {
                        couponId: validCouponId,
                        userId,
                        orderId: order.id,
                    },
                });
                await tx.coupon.update({
                    where: { id: validCouponId },
                    data: { usedCount: { increment: 1 } },
                });
            }
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (user?.email) {
                void this.emailService.sendOrderConfirmationEmail(user.email, {
                    orderId: order.id,
                    totalAmount: finalAmount,
                    discountAmount,
                    items: cart.cartItems.map((item) => ({
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price * item.quantity,
                    })),
                    address,
                    paymentMethod,
                });
            }
            return order;
        });
    }
    async findAll(userId) {
        return this.prisma.order.findMany({
            where: { userId, deletedAt: null },
            include: {
                orderItems: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        return this.prisma.order.findFirst({
            where: { id, userId, deletedAt: null },
            include: {
                orderItems: {
                    include: { product: true },
                },
            },
        });
    }
    async findAllAdmin() {
        return this.prisma.order.findMany({
            where: { deletedAt: null },
            include: {
                user: {
                    select: { id: true, email: true, fullName: true },
                },
                orderItems: {
                    include: {
                        product: { select: { id: true, name: true, imageUrl: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, status) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: { product: true },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
            return this.prisma.$transaction(async (tx) => {
                for (const item of order.orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } },
                    });
                }
                return tx.order.update({
                    where: { id },
                    data: { status },
                    include: {
                        user: {
                            select: { id: true, email: true, fullName: true },
                        },
                        orderItems: {
                            include: { product: { select: { id: true, name: true } } },
                        },
                    },
                });
            });
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: { id: true, email: true, fullName: true },
                },
                orderItems: {
                    include: { product: { select: { id: true, name: true } } },
                },
            },
        });
        if (updatedOrder.user?.email) {
            const statusLabels = {
                PENDING: 'Chờ xử lý',
                PROCESSING: 'Đang xử lý',
                SHIPPED: 'Đang giao hàng',
                DELIVERED: 'Đã giao hàng',
                CANCELLED: 'Đã hủy',
            };
            void this.emailService.sendOrderStatusUpdateEmail(updatedOrder.user.email, {
                orderId: id,
                status,
                statusLabel: statusLabels[status] || status,
            });
        }
        return updatedOrder;
    }
    async getStats() {
        const [totalOrders, totalRevenue, ordersByStatus] = await Promise.all([
            this.prisma.order.count({ where: { deletedAt: null } }),
            this.prisma.order.aggregate({
                where: { deletedAt: null, status: { not: 'CANCELLED' } },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.groupBy({
                by: ['status'],
                _count: { status: true },
                where: { deletedAt: null },
            }),
        ]);
        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            ordersByStatus: ordersByStatus.reduce((acc, item) => {
                acc[item.status] = item._count.status;
                return acc;
            }, {}),
        };
    }
    async updatePaymentStatus(orderId, status, momoTransId) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: status,
                momoTransId: momoTransId,
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        carts_service_1.CartsService,
        email_service_1.EmailService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map