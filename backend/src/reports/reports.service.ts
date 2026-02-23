import { Injectable, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // Export Orders to Excel
  async exportOrders(
    startDate?: Date,
    endDate?: Date,
  ): Promise<StreamableFile> {
    const where: Record<string, unknown> = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        (where.createdAt as Record<string, unknown>).gte = startDate;
      }
      if (endDate) {
        (where.createdAt as Record<string, unknown>).lte = endDate;
      }
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        user: { select: { fullName: true, email: true } },
        orderItems: {
          include: { product: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'E-Commerce Admin';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Đơn hàng');

    // Headers
    sheet.columns = [
      { header: 'Mã đơn', key: 'id', width: 36 },
      { header: 'Khách hàng', key: 'customer', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Sản phẩm', key: 'products', width: 40 },
      { header: 'Tổng tiền', key: 'total', width: 15 },
      { header: 'Giảm giá', key: 'discount', width: 12 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Thanh toán', key: 'payment', width: 12 },
      { header: 'Địa chỉ', key: 'address', width: 35 },
      { header: 'Ngày đặt', key: 'date', width: 18 },
    ];

    // Style header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Data rows
    const statusLabels: Record<string, string> = {
      PENDING: 'Chờ xử lý',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy',
    };

    orders.forEach((order) => {
      const products = order.orderItems
        .map((item) => `${item.product.name} x${item.quantity}`)
        .join(', ');

      sheet.addRow({
        id: order.id,
        customer: order.user?.fullName || 'N/A',
        email: order.user?.email || 'N/A',
        products,
        total: order.totalAmount,
        discount: order.discountAmount || 0,
        status: statusLabels[order.status] || order.status,
        payment: order.paymentMethod,
        address: order.address,
        date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      });
    });

    // Auto-fit và thêm border
    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber > 1) {
          cell.alignment = { vertical: 'middle', wrapText: true };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new StreamableFile(Buffer.from(buffer), {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="orders_${Date.now()}.xlsx"`,
    });
  }

  // Export Products Inventory to Excel
  async exportProducts(): Promise<StreamableFile> {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
      include: { category: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'E-Commerce Admin';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Tồn kho sản phẩm');

    // Headers
    sheet.columns = [
      { header: 'Mã sản phẩm', key: 'id', width: 36 },
      { header: 'Tên sản phẩm', key: 'name', width: 40 },
      { header: 'Danh mục', key: 'category', width: 20 },
      { header: 'Giá (đ)', key: 'price', width: 15 },
      { header: 'Tồn kho', key: 'stock', width: 12 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 18 },
    ];

    // Style header
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Data rows
    products.forEach((product) => {
      const row = sheet.addRow({
        id: product.id,
        name: product.name,
        category: product.category?.name || 'N/A',
        price: product.price,
        stock: product.stock,
        status:
          product.stock === 0
            ? 'Hết hàng'
            : product.stock <= 10
              ? 'Sắp hết'
              : 'Còn hàng',
        createdAt: new Date(product.createdAt).toLocaleDateString('vi-VN'),
      });

      // Highlight low stock
      if (product.stock <= 10) {
        row.getCell('stock').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: product.stock === 0 ? 'FFFECACA' : 'FFFEF3C7' },
        };
      }
    });

    // Add borders
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new StreamableFile(Buffer.from(buffer), {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="products_inventory_${Date.now()}.xlsx"`,
    });
  }

  // ===== ANALYTICS v2 =====

  private getDateRange(period: string): Date {
    const now = new Date();
    switch (period) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '30d':
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  async getRevenueChart(period: string = '30d') {
    const startDate = this.getDateRange(period);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' },
      },
      select: {
        totalAmount: true,
        discountAmount: true,
        shippingFee: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const grouped = new Map<string, number>();
    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const revenue = order.totalAmount - order.discountAmount;
      grouped.set(dateKey, (grouped.get(dateKey) || 0) + revenue);
    });

    return Array.from(grouped.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }

  async getOrderChart(period: string = '30d') {
    const startDate = this.getDateRange(period);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date with status breakdown
    const grouped = new Map<
      string,
      { total: number; delivered: number; cancelled: number }
    >();
    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const current = grouped.get(dateKey) || {
        total: 0,
        delivered: 0,
        cancelled: 0,
      };
      current.total++;
      if (order.status === 'DELIVERED') current.delivered++;
      if (order.status === 'CANCELLED') current.cancelled++;
      grouped.set(dateKey, current);
    });

    return Array.from(grouped.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  }

  async getTopProducts(limit: number = 10) {
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: { status: { not: 'CANCELLED' } },
      },
      select: {
        productId: true,
        quantity: true,
        price: true,
        product: {
          select: {
            name: true,
            imageUrl: true,
            price: true,
          },
        },
      },
    });

    // Aggregate by product
    const productMap = new Map<
      string,
      {
        name: string;
        imageUrl: string | null;
        currentPrice: number;
        totalQuantity: number;
        totalRevenue: number;
      }
    >();

    orderItems.forEach((item) => {
      const current = productMap.get(item.productId) || {
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        currentPrice: item.product.price,
        totalQuantity: 0,
        totalRevenue: 0,
      };
      current.totalQuantity += item.quantity;
      current.totalRevenue += item.price * item.quantity;
      productMap.set(item.productId, current);
    });

    return Array.from(productMap.entries())
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  async getTopCustomers(limit: number = 10) {
    const orders = await this.prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: {
        userId: true,
        totalAmount: true,
        discountAmount: true,
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Aggregate by user
    const userMap = new Map<
      string,
      {
        fullName: string | null;
        email: string;
        avatarUrl: string | null;
        orderCount: number;
        totalSpent: number;
      }
    >();

    orders.forEach((order) => {
      const current = userMap.get(order.userId) || {
        fullName: order.user.fullName,
        email: order.user.email,
        avatarUrl: order.user.avatarUrl,
        orderCount: 0,
        totalSpent: 0,
      };
      current.orderCount++;
      current.totalSpent += order.totalAmount - order.discountAmount;
      userMap.set(order.userId, current);
    });

    return Array.from(userMap.entries())
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  async getCategoryBreakdown() {
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: { status: { not: 'CANCELLED' } },
      },
      select: {
        quantity: true,
        price: true,
        product: {
          select: {
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    const categoryMap = new Map<
      string,
      { name: string; revenue: number; quantity: number }
    >();

    orderItems.forEach((item) => {
      const catId = item.product.category.id;
      const catName = item.product.category.name;
      const current = categoryMap.get(catId) || {
        name: catName,
        revenue: 0,
        quantity: 0,
      };
      current.revenue += item.price * item.quantity;
      current.quantity += item.quantity;
      categoryMap.set(catId, current);
    });

    return Array.from(categoryMap.entries())
      .map(([categoryId, data]) => ({ categoryId, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getConversionStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalCarts, totalOrders, deliveredOrders, cancelledOrders] =
      await Promise.all([
        this.prisma.cart.count({
          where: {
            cartItems: { some: {} },
          },
        }),
        this.prisma.order.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.order.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
            status: 'DELIVERED',
          },
        }),
        this.prisma.order.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
            status: 'CANCELLED',
          },
        }),
      ]);

    const revenueResult = await this.prisma.order.aggregate({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalAmount: true, discountAmount: true },
      _avg: { totalAmount: true },
    });

    return {
      activeCarts: totalCarts,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      conversionRate:
        totalCarts > 0
          ? Math.round((totalOrders / totalCarts) * 100 * 10) / 10
          : 0,
      deliveryRate:
        totalOrders > 0
          ? Math.round((deliveredOrders / totalOrders) * 100 * 10) / 10
          : 0,
      cancellationRate:
        totalOrders > 0
          ? Math.round((cancelledOrders / totalOrders) * 100 * 10) / 10
          : 0,
      totalRevenue:
        (revenueResult._sum.totalAmount || 0) -
        (revenueResult._sum.discountAmount || 0),
      avgOrderValue: revenueResult._avg.totalAmount || 0,
    };
  }
}
