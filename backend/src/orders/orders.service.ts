import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartsService } from '../carts/carts.service';
import { EmailService } from '../email/email.service';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartsService: CartsService,
    private emailService: EmailService,
  ) {}

  async createOrder(
    userId: string,
    address: string,
    phone: string,
    paymentMethod: PaymentMethod = 'COD',
    couponId?: string,
  ) {
    const cart = await this.cartsService.getCart(userId);
    if (!cart.cartItems.length) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // Xử lý coupon nếu có
    let discountAmount = 0;
    let validCouponId: string | undefined = undefined;

    if (couponId) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { id: couponId },
      });

      if (coupon && coupon.isActive) {
        // Kiểm tra user đã dùng coupon chưa
        const existingUsage = await this.prisma.couponUsage.findUnique({
          where: { couponId_userId: { couponId, userId } },
        });

        if (!existingUsage) {
          // Tính discount
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = Math.floor(
              (totalAmount * coupon.discountValue) / 100,
            );
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

    const finalAmount = totalAmount - discountAmount;

    // Sử dụng transaction để đảm bảo tính toàn vẹn
    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo Order
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

      // 4. Ghi nhận sử dụng coupon
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

      // 5. Gửi email xác nhận đơn hàng
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
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Nếu chuyển sang CANCELLED và đơn hàng trước đó không phải CANCELLED
    // thì hoàn lại tồn kho
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      return this.prisma.$transaction(async (tx) => {
        // Hoàn lại stock cho từng sản phẩm
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        // Cập nhật status đơn hàng
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

    // Nếu không phải CANCELLED, chỉ cập nhật status bình thường
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

    // Gửi email thông báo cập nhật status
    if (updatedOrder.user?.email) {
      const statusLabels: Record<string, string> = {
        PENDING: 'Chờ xử lý',
        PROCESSING: 'Đang xử lý',
        SHIPPED: 'Đang giao hàng',
        DELIVERED: 'Đã giao hàng',
        CANCELLED: 'Đã hủy',
      };
      void this.emailService.sendOrderStatusUpdateEmail(
        updatedOrder.user.email,
        {
          orderId: id,
          status,
          statusLabel: statusLabels[status] || status,
        },
      );
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
      ordersByStatus: ordersByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
    momoTransId: string | null,
  ) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status,
        momoTransId: momoTransId,
      },
    });
  }
}
