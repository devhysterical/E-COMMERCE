import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @GetUser('userId') userId: string,
    @Body() dto: { address: string; phone: string },
  ) {
    return this.ordersService.createOrder(userId, dto.address, dto.phone);
  }

  @Get()
  findAll(@GetUser('userId') userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.ordersService.findOne(id, userId);
  }
}
