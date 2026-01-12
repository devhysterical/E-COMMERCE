"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const supabase_service_1 = require("../supabase/supabase.service");
const email_service_1 = require("../email/email.service");
const otp_cache_service_1 = require("./otp-cache.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    supabaseService;
    emailService;
    otpCacheService;
    constructor(usersService, jwtService, supabaseService, emailService, otpCacheService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.supabaseService = supabaseService;
        this.emailService = emailService;
        this.otpCacheService = otpCacheService;
    }
    async sendOtp(dto) {
        const { canResend, waitSeconds } = this.otpCacheService.canResend(dto.email);
        if (!canResend) {
            throw new common_1.BadRequestException(`Vui lòng đợi ${waitSeconds} giây trước khi gửi lại mã OTP`);
        }
        const userExists = await this.usersService.findOne(dto.email);
        if (userExists) {
            if (userExists.authProvider === 'google') {
                throw new common_1.ConflictException('Email này đã được sử dụng để đăng nhập với Google. Vui lòng sử dụng tính năng "Đăng nhập với Google" thay thế.');
            }
            throw new common_1.ConflictException('Email đã được đăng ký');
        }
        const otp = this.otpCacheService.generateOtp();
        this.otpCacheService.set(dto.email, otp);
        await this.emailService.sendOtpEmail(dto.email, otp);
        return { message: 'Mã OTP đã được gửi đến email của bạn' };
    }
    async register(dto) {
        const isOtpValid = this.otpCacheService.verify(dto.email, dto.otp);
        if (!isOtpValid) {
            throw new common_1.BadRequestException('Mã OTP không đúng hoặc đã hết hạn');
        }
        const userExists = await this.usersService.findOne(dto.email);
        if (userExists) {
            throw new common_1.ConflictException('Email đã tồn tại');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            fullName: dto.fullName,
        });
        const { password, ...result } = user;
        return result;
    }
    async login(dto) {
        const user = await this.usersService.findOne(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không chính xác');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không chính xác');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
    async forgotPassword(dto) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = `${frontendUrl}/reset-password`;
        try {
            await this.supabaseService.sendPasswordResetEmail(dto.email, redirectUrl);
        }
        catch {
        }
        return {
            message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.',
        };
    }
    async googleAuth(dto) {
        const googleUser = await this.supabaseService.getUserFromAccessToken(dto.accessToken);
        if (!googleUser) {
            throw new common_1.UnauthorizedException('Token không hợp lệ');
        }
        let user = await this.usersService.findOne(googleUser.email);
        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
            user = await this.usersService.create({
                email: googleUser.email,
                password: randomPassword,
                fullName: googleUser.fullName || undefined,
                authProvider: 'google',
            });
            if (googleUser.avatarUrl) {
                await this.usersService.updateProfile(user.id, {
                    avatarUrl: googleUser.avatarUrl,
                });
            }
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        supabase_service_1.SupabaseService,
        email_service_1.EmailService,
        otp_cache_service_1.OtpCacheService])
], AuthService);
//# sourceMappingURL=auth.service.js.map