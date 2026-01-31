import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { InvoiceService } from './invoice.service';
import { CartsModule } from '../carts/carts.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [CartsModule, EmailModule],
  controllers: [OrdersController],
  providers: [OrdersService, InvoiceService],
  exports: [OrdersService],
})
export class OrdersModule {}
