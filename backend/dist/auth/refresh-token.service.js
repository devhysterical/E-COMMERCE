"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RefreshTokenService", {
    enumerable: true,
    get: function() {
        return RefreshTokenService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _crypto = require("crypto");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
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
let RefreshTokenService = class RefreshTokenService {
    async createRefreshToken(userId) {
        // Xóa tất cả refresh tokens cũ của user (token rotation)
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId
            }
        });
        const rawToken = (0, _crypto.randomUUID)();
        const hashedToken = await _bcrypt.hash(rawToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: hashedToken,
                expiresAt
            }
        });
        return rawToken;
    }
    async validateRefreshToken(rawToken) {
        // Tìm tất cả refresh tokens chưa hết hạn
        const tokens = await this.prisma.refreshToken.findMany({
            where: {
                expiresAt: {
                    gt: new Date()
                }
            }
        });
        for (const tokenRecord of tokens){
            const isMatch = await _bcrypt.compare(rawToken, tokenRecord.token);
            if (isMatch) {
                return {
                    userId: tokenRecord.userId
                };
            }
        }
        return null;
    }
    async revokeUserTokens(userId) {
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId
            }
        });
    }
    async cleanupExpiredTokens() {
        await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
        this.REFRESH_TOKEN_EXPIRY_DAYS = 7;
    }
};
RefreshTokenService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], RefreshTokenService);

//# sourceMappingURL=refresh-token.service.js.map