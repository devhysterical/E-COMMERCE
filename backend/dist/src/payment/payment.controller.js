"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const orders_service_1 = require("../orders/orders.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PaymentController = class PaymentController {
    paymentService;
    ordersService;
    constructor(paymentService, ordersService) {
        this.paymentService = paymentService;
        this.ordersService = ordersService;
    }
    async createMoMoPayment(dto, req) {
        const order = await this.ordersService.findOne(dto.orderId, req.user.userId);
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
    async handleMoMoCallback(data) {
        const isValid = this.paymentService.verifyMoMoSignature(data);
        if (!isValid) {
            return { resultCode: 1, message: 'Invalid signature' };
        }
        const orderId = String(data.orderId);
        const resultCode = Number(data.resultCode);
        const transId = String(data.transId);
        if (resultCode === 0) {
            await this.ordersService.updatePaymentStatus(orderId, 'COMPLETED', transId);
        }
        else {
            await this.ordersService.updatePaymentStatus(orderId, 'FAILED', null);
        }
        return { resultCode: 0, message: 'OK' };
    }
    handleMoMoReturn(orderId, resultCode, res) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (resultCode === '0') {
            return res.redirect(`${frontendUrl}/orders?payment=success`);
        }
        return res.redirect(`${frontendUrl}/orders?payment=failed`);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('momo/create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createMoMoPayment", null);
__decorate([
    (0, common_1.Post)('momo/callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleMoMoCallback", null);
__decorate([
    (0, common_1.Get)('momo/return'),
    __param(0, (0, common_1.Query)('orderId')),
    __param(1, (0, common_1.Query)('resultCode')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "handleMoMoReturn", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        orders_service_1.OrdersService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map