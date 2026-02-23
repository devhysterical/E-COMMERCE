import { Module } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { FlashSaleController } from './flash-sale.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FlashSaleController],
  providers: [FlashSaleService],
  exports: [FlashSaleService],
})
export class FlashSaleModule {}
