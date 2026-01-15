"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OtpCacheService", {
    enumerable: true,
    get: function() {
        return OtpCacheService;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OtpCacheService = class OtpCacheService {
    // Tạo mã OTP 6 ký tự (A-Za-z0-9)
    generateOtp() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let otp = '';
        for(let i = 0; i < 6; i++){
            otp += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return otp;
    }
    // Lưu OTP cho email
    set(email, otp) {
        const normalizedEmail = email.toLowerCase();
        this.cache.set(normalizedEmail, {
            otp,
            expiresAt: Date.now() + this.TTL_MS
        });
        // Tự động xóa sau khi hết hạn
        setTimeout(()=>{
            this.delete(normalizedEmail);
        }, this.TTL_MS);
    }
    // Lấy OTP theo email
    get(email) {
        const normalizedEmail = email.toLowerCase();
        const entry = this.cache.get(normalizedEmail);
        if (!entry) {
            return null;
        }
        // Kiểm tra hết hạn
        if (Date.now() > entry.expiresAt) {
            this.delete(normalizedEmail);
            return null;
        }
        return entry.otp;
    }
    // Xác thực OTP
    verify(email, otp) {
        const storedOtp = this.get(email);
        if (!storedOtp) {
            return false;
        }
        const isValid = storedOtp === otp;
        if (isValid) {
            // Xóa OTP sau khi dùng
            this.delete(email);
        }
        return isValid;
    }
    // Xóa OTP
    delete(email) {
        this.cache.delete(email.toLowerCase());
    }
    // Kiểm tra có thể gửi lại OTP không (cooldown 60s)
    canResend(email) {
        const normalizedEmail = email.toLowerCase();
        const entry = this.cache.get(normalizedEmail);
        if (!entry) {
            return {
                canResend: true,
                waitSeconds: 0
            };
        }
        // Chỉ cho phép gửi lại sau 60s
        const timeSinceCreated = Date.now() - (entry.expiresAt - this.TTL_MS);
        const cooldownMs = 60 * 1000;
        if (timeSinceCreated < cooldownMs) {
            const waitSeconds = Math.ceil((cooldownMs - timeSinceCreated) / 1000);
            return {
                canResend: false,
                waitSeconds
            };
        }
        return {
            canResend: true,
            waitSeconds: 0
        };
    }
    constructor(){
        this.cache = new Map();
        this.TTL_MS = 5 * 60 * 1000; // 5 phút
    }
};
OtpCacheService = _ts_decorate([
    (0, _common.Injectable)()
], OtpCacheService);

//# sourceMappingURL=otp-cache.service.js.map