import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartsService } from '../carts/carts.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartsService: CartsService,
  ) {}

  async createOrder(userId: string, address: string, phone: string) {
    const cart = await this.cartsService.getCart(userId);
    if (!cart.cartItems.length) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // Sử dụng transaction để đảm bảo tính toàn vẹn
    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo Order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          address,
          phone,
        },
      });

      // 2. Tạo OrderItems và Cập nhật Stock
      for (const item of cart.cartItems) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm ${item.product.name} không đủ tồn kho`,
          );
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

      // 3. Xóa giỏ hàng
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async findAll(userId: string) {
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

  async findOne(id: string, userId: string) {
    return this.prisma.order.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });
  }

  // Admin APIs
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

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
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
      ordersByStatus: ordersByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
