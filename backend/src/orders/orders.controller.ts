import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { OrderStatus, PaymentMethod } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @GetUser('userId') userId: string,
    @Body()
    dto: {
      address: string;
      phone: string;
      paymentMethod?: PaymentMethod;
      couponId?: string;
    },
  ) {
    return this.ordersService.createOrder(
      userId,
      dto.address,
      dto.phone,
      dto.paymentMethod || 'COD',
      dto.couponId,
    );
  }

  @Get()
  findAll(@GetUser('userId') userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  // Admin APIs
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getStats() {
    return this.ordersService.getStats();
  }

  @Patch('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: { status: OrderStatus }) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
