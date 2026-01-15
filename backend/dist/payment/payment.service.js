"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentService", {
    enumerable: true,
    get: function() {
        return PaymentService;
    }
});
const _common = require("@nestjs/common");
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaymentService = class PaymentService {
    async createMoMoPayment(request) {
        const requestId = `${this.partnerCode}_${Date.now()}`;
        const requestType = 'captureWallet';
        const extraData = '';
        const lang = 'vi';
        // Tạo raw signature string theo thứ tự của MoMo
        const rawSignature = `accessKey=${this.accessKey}&amount=${request.amount}&extraData=${extraData}&ipnUrl=${request.ipnUrl}&orderId=${request.orderId}&orderInfo=${request.orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${request.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        // Tạo signature bằng HMAC-SHA256
        const signature = _crypto.createHmac('sha256', this.secretKey).update(rawSignature).digest('hex');
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
            lang
        };
        // Gọi API MoMo
        const response = await fetch(`${this.apiEndpoint}/v2/gateway/api/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        const result = await response.json();
        return result;
    }
    verifyMoMoSignature(data) {
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
        const expectedSignature = _crypto.createHmac('sha256', this.secretKey).update(rawSignature).digest('hex');
        return signature === expectedSignature;
    }
    constructor(){
        this.partnerCode = process.env.MOMO_PARTNER_CODE || '';
        this.accessKey = process.env.MOMO_ACCESS_KEY || '';
        this.secretKey = process.env.MOMO_SECRET_KEY || '';
        this.apiEndpoint = process.env.MOMO_API_ENDPOINT || 'https://test-payment.momo.vn';
    }
};
PaymentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], PaymentService);

//# sourceMappingURL=payment.service.js.map