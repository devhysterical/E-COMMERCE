import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface CreateMoMoPaymentDto {
  orderId: string;
}

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('momo/create')
  @UseGuards(JwtAuthGuard)
  async createMoMoPayment(
    @Body() dto: CreateMoMoPaymentDto,
    @Request() req: { user: { userId: string } },
  ) {
    const order = await this.ordersService.findOne(
      dto.orderId,
      req.user.userId,
    );

    if (!order) {
      return { success: false, message: 'Đơn hàng không tồn tại' };
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';

    const result = await this.paymentService.createMoMoPayment({
      orderId: dto.orderId,
      amount: order.totalAmount,
      orderInfo: `Thanh toán đơn hàng #${dto.orderId.slice(0, 8)}`,
      redirectUrl: `${frontendUrl}/orders?payment=success`,
      ipnUrl: `${backendUrl}/payment/momo/callback`,
    });

    if (result.resultCode === 0) {
      return {
        success: true,
        payUrl: result.payUrl,
        deeplink: result.deeplink,
        qrCodeUrl: result.qrCodeUrl,
      };
    }

    return {
      success: false,
      message: result.message,
    };
  }

  @Post('momo/callback')
  async handleMoMoCallback(@Body() data: Record<string, string | number>) {
    // Verify signature
    const isValid = this.paymentService.verifyMoMoSignature(data);

    if (!isValid) {
      return { resultCode: 1, message: 'Invalid signature' };
    }

    const orderId = String(data.orderId);
    const resultCode = Number(data.resultCode);
    const transId = String(data.transId);

    if (resultCode === 0) {
      // Thanh toán thành công
      await this.ordersService.updatePaymentStatus(
        orderId,
        'COMPLETED',
        transId,
      );
    } else {
      // Thanh toán thất bại
      await this.ordersService.updatePaymentStatus(orderId, 'FAILED', null);
    }

    return { resultCode: 0, message: 'OK' };
  }

  @Get('momo/return')
  handleMoMoReturn(
    @Query('orderId') orderId: string,
    @Query('resultCode') resultCode: string,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (resultCode === '0') {
      return res.redirect(`${frontendUrl}/orders?payment=success`);
    }

    return res.redirect(`${frontendUrl}/orders?payment=failed`);
  }
}
