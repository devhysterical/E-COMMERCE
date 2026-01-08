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
let OrdersService = class OrdersService {
    prisma;
    cartsService;
    constructor(prisma, cartsService) {
        this.prisma = prisma;
        this.cartsService = cartsService;
    }
    async createOrder(userId, address, phone, paymentMethod = 'COD') {
        const cart = await this.cartsService.getCart(userId);
        if (!cart.cartItems.length) {
            throw new common_1.BadRequestException('Giỏ hàng trống');
        }
        const totalAmount = cart.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
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
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        return this.prisma.order.update({
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
        carts_service_1.CartsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map