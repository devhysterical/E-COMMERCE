interface MoMoPaymentRequest {
    orderId: string;
    amount: number;
    orderInfo: string;
    redirectUrl: string;
    ipnUrl: string;
}
interface MoMoPaymentResponse {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
    deeplink?: string;
    qrCodeUrl?: string;
}
export declare class PaymentService {
    private readonly partnerCode;
    private readonly accessKey;
    private readonly secretKey;
    private readonly apiEndpoint;
    constructor();
    createMoMoPayment(request: MoMoPaymentRequest): Promise<MoMoPaymentResponse>;
    verifyMoMoSignature(data: Record<string, string | number>): boolean;
}
export {};
