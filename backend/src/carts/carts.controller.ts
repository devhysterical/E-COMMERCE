import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getCart(@GetUser('userId') userId: string) {
    return this.cartsService.getCart(userId);
  }

  @Post('add')
  async addToCart(
    @GetUser('userId') userId: string,
    @Body() dto: { productId: string; quantity: number },
  ) {
    return this.cartsService.addToCart(userId, dto.productId, dto.quantity);
  }

  @Patch('item/:id')
  updateQuantity(
    @Param('id') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartsService.updateQuantity(itemId, quantity);
  }

  @Delete('item/:id')
  removeItem(@Param('id') itemId: string) {
    return this.cartsService.removeItem(itemId);
  }
}
