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
}
