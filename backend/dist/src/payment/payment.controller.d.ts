import type { Response } from 'express';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service';
interface CreateMoMoPaymentDto {
    orderId: string;
}
export declare class PaymentController {
    private readonly paymentService;
    private readonly ordersService;
    constructor(paymentService: PaymentService, ordersService: OrdersService);
    createMoMoPayment(dto: CreateMoMoPaymentDto, req: {
        user: {
            userId: string;
        };
    }): Promise<{
        success: boolean;
        message: string;
        payUrl?: undefined;
        deeplink?: undefined;
        qrCodeUrl?: undefined;
    } | {
        success: boolean;
        payUrl: string;
        deeplink: string | undefined;
        qrCodeUrl: string | undefined;
        message?: undefined;
    }>;
    handleMoMoCallback(data: Record<string, string | number>): Promise<{
        resultCode: number;
        message: string;
    }>;
    handleMoMoReturn(orderId: string, resultCode: string, res: Response): void;
}
export {};
