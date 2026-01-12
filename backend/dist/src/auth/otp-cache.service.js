"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpCacheService = void 0;
const common_1 = require("@nestjs/common");
let OtpCacheService = class OtpCacheService {
    cache = new Map();
    TTL_MS = 5 * 60 * 1000;
    generateOtp() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return otp;
    }
    set(email, otp) {
        const normalizedEmail = email.toLowerCase();
        this.cache.set(normalizedEmail, {
            otp,
            expiresAt: Date.now() + this.TTL_MS,
        });
        setTimeout(() => {
            this.delete(normalizedEmail);
        }, this.TTL_MS);
    }
    get(email) {
        const normalizedEmail = email.toLowerCase();
        const entry = this.cache.get(normalizedEmail);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expiresAt) {
            this.delete(normalizedEmail);
            return null;
        }
        return entry.otp;
    }
    verify(email, otp) {
        const storedOtp = this.get(email);
        if (!storedOtp) {
            return false;
        }
        const isValid = storedOtp === otp;
        if (isValid) {
            this.delete(email);
        }
        return isValid;
    }
    delete(email) {
        this.cache.delete(email.toLowerCase());
    }
    canResend(email) {
        const normalizedEmail = email.toLowerCase();
        const entry = this.cache.get(normalizedEmail);
        if (!entry) {
            return { canResend: true, waitSeconds: 0 };
        }
        const timeSinceCreated = Date.now() - (entry.expiresAt - this.TTL_MS);
        const cooldownMs = 60 * 1000;
        if (timeSinceCreated < cooldownMs) {
            const waitSeconds = Math.ceil((cooldownMs - timeSinceCreated) / 1000);
            return { canResend: false, waitSeconds };
        }
        return { canResend: true, waitSeconds: 0 };
    }
};
exports.OtpCacheService = OtpCacheService;
exports.OtpCacheService = OtpCacheService = __decorate([
    (0, common_1.Injectable)()
], OtpCacheService);
//# sourceMappingURL=otp-cache.service.js.map