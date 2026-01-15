"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentController", {
    enumerable: true,
    get: function() {
        return PaymentController;
    }
});
const _common = require("@nestjs/common");
const _paymentservice = require("./payment.service");
const _ordersservice = require("../orders/orders.service");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let PaymentController = class PaymentController {
    async createMoMoPayment(dto, req) {
        const order = await this.ordersService.findOne(dto.orderId, req.user.userId);
        if (!order) {
            return {
                success: false,
                message: 'Đơn hàng không tồn tại'
            };
        }
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
        const result = await this.paymentService.createMoMoPayment({
            orderId: dto.orderId,
            amount: order.totalAmount,
            orderInfo: `Thanh toán đơn hàng #${dto.orderId.slice(0, 8)}`,
            redirectUrl: `${frontendUrl}/orders?payment=success`,
            ipnUrl: `${backendUrl}/payment/momo/callback`
        });
        if (result.resultCode === 0) {
            return {
                success: true,
                payUrl: result.payUrl,
                deeplink: result.deeplink,
                qrCodeUrl: result.qrCodeUrl
            };
        }
        return {
            success: false,
            message: result.message
        };
    }
    async handleMoMoCallback(data) {
        // Verify signature
        const isValid = this.paymentService.verifyMoMoSignature(data);
        if (!isValid) {
            return {
                resultCode: 1,
                message: 'Invalid signature'
            };
        }
        const orderId = String(data.orderId);
        const resultCode = Number(data.resultCode);
        const transId = String(data.transId);
        if (resultCode === 0) {
            // Thanh toán thành công
            await this.ordersService.updatePaymentStatus(orderId, 'COMPLETED', transId);
        } else {
            // Thanh toán thất bại
            await this.ordersService.updatePaymentStatus(orderId, 'FAILED', null);
        }
        return {
            resultCode: 0,
            message: 'OK'
        };
    }
    handleMoMoReturn(orderId, resultCode, res) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (resultCode === '0') {
            return res.redirect(`${frontendUrl}/orders?payment=success`);
        }
        return res.redirect(`${frontendUrl}/orders?payment=failed`);
    }
    constructor(paymentService, ordersService){
        this.paymentService = paymentService;
        this.ordersService = ordersService;
    }
};
_ts_decorate([
    (0, _common.Post)('momo/create'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateMoMoPaymentDto === "undefined" ? Object : CreateMoMoPaymentDto,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentController.prototype, "createMoMoPayment", null);
_ts_decorate([
    (0, _common.Post)('momo/callback'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Record === "undefined" ? Object : Record
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentController.prototype, "handleMoMoCallback", null);
_ts_decorate([
    (0, _common.Get)('momo/return'),
    _ts_param(0, (0, _common.Query)('orderId')),
    _ts_param(1, (0, _common.Query)('resultCode')),
    _ts_param(2, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof Response === "undefined" ? Object : Response
    ]),
    _ts_metadata("design:returntype", void 0)
], PaymentController.prototype, "handleMoMoReturn", null);
PaymentController = _ts_decorate([
    (0, _common.Controller)('payment'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paymentservice.PaymentService === "undefined" ? Object : _paymentservice.PaymentService,
        typeof _ordersservice.OrdersService === "undefined" ? Object : _ordersservice.OrdersService
    ])
], PaymentController);

//# sourceMappingURL=payment.controller.js.map