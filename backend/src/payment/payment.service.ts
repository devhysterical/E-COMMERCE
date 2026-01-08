import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

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

@Injectable()
export class PaymentService {
  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly apiEndpoint: string;

  constructor() {
    this.partnerCode = process.env.MOMO_PARTNER_CODE || '';
    this.accessKey = process.env.MOMO_ACCESS_KEY || '';
    this.secretKey = process.env.MOMO_SECRET_KEY || '';
    this.apiEndpoint =
      process.env.MOMO_API_ENDPOINT || 'https://test-payment.momo.vn';
  }

  async createMoMoPayment(
    request: MoMoPaymentRequest,
  ): Promise<MoMoPaymentResponse> {
    const requestId = `${this.partnerCode}_${Date.now()}`;
    const requestType = 'captureWallet';
    const extraData = '';
    const lang = 'vi';

    // Tạo raw signature string theo thứ tự của MoMo
    const rawSignature = `accessKey=${this.accessKey}&amount=${request.amount}&extraData=${extraData}&ipnUrl=${request.ipnUrl}&orderId=${request.orderId}&orderInfo=${request.orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${request.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Tạo signature bằng HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount: request.amount,
      orderId: request.orderId,
      orderInfo: request.orderInfo,
      redirectUrl: request.redirectUrl,
      ipnUrl: request.ipnUrl,
      extraData,
      requestType,
      signature,
      lang,
    };

    // Gọi API MoMo
    const response = await fetch(`${this.apiEndpoint}/v2/gateway/api/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result: MoMoPaymentResponse =
      (await response.json()) as MoMoPaymentResponse;
    return result;
  }

  verifyMoMoSignature(data: Record<string, string | number>): boolean {
    const accessKey = String(data.accessKey ?? '');
    const amount = String(data.amount ?? '');
    const extraData = String(data.extraData ?? '');
    const message = String(data.message ?? '');
    const orderId = String(data.orderId ?? '');
    const orderInfo = String(data.orderInfo ?? '');
    const orderType = String(data.orderType ?? '');
    const partnerCode = String(data.partnerCode ?? '');
    const payType = String(data.payType ?? '');
    const requestId = String(data.requestId ?? '');
    const responseTime = String(data.responseTime ?? '');
    const resultCode = String(data.resultCode ?? '');
    const transId = String(data.transId ?? '');
    const signature = String(data.signature ?? '');

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    return signature === expectedSignature;
  }
}
