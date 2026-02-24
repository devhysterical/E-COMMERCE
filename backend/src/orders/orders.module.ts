import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { InvoiceService } from './invoice.service';
import { CartsModule } from '../carts/carts.module';
import { EmailModule } from '../email/email.module';
import { ShippingModule } from '../shipping/shipping.module';
import { FlashSaleModule } from '../flash-sale/flash-sale.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';

@Module({
  imports: [
    CartsModule,
    EmailModule,
    ShippingModule,
    FlashSaleModule,
    LoyaltyModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, InvoiceService],
  exports: [OrdersService],
})
export class OrdersModule {}
