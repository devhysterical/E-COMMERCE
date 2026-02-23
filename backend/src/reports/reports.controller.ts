import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Response } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('export/orders')
  async exportOrders(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const file = await this.reportsService.exportOrders(start, end);

    res?.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="orders_${Date.now()}.xlsx"`,
    });

    return file;
  }

  @Get('export/products')
  async exportProducts(@Res({ passthrough: true }) res?: Response) {
    const file = await this.reportsService.exportProducts();

    res?.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="products_inventory_${Date.now()}.xlsx"`,
    });

    return file;
  }

  // ===== ANALYTICS v2 =====

  @Get('analytics/revenue')
  getRevenueChart(@Query('period') period?: string) {
    return this.reportsService.getRevenueChart(period || '30d');
  }

  @Get('analytics/orders')
  getOrderChart(@Query('period') period?: string) {
    return this.reportsService.getOrderChart(period || '30d');
  }

  @Get('analytics/top-products')
  getTopProducts(@Query('limit') limit?: string) {
    return this.reportsService.getTopProducts(limit ? parseInt(limit, 10) : 10);
  }

  @Get('analytics/top-customers')
  getTopCustomers(@Query('limit') limit?: string) {
    return this.reportsService.getTopCustomers(
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('analytics/categories')
  getCategoryBreakdown() {
    return this.reportsService.getCategoryBreakdown();
  }

  @Get('analytics/conversion')
  getConversionStats() {
    return this.reportsService.getConversionStats();
  }
}
