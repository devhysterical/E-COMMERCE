"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _usersservice = require("../users/users.service");
const _supabaseservice = require("../supabase/supabase.service");
const _emailservice = require("../email/email.service");
const _otpcacheservice = require("./otp-cache.service");
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
let AuthService = class AuthService {
    // Gửi OTP đến email
    async sendOtp(dto) {
        // Kiểm tra cooldown
        const { canResend, waitSeconds } = this.otpCacheService.canResend(dto.email);
        if (!canResend) {
            throw new _common.BadRequestException(`Vui lòng đợi ${waitSeconds} giây trước khi gửi lại mã OTP`);
        }
        // Kiểm tra email đã tồn tại chưa
        const userExists = await this.usersService.findOne(dto.email);
        if (userExists) {
            // Kiểm tra nếu user đã đăng ký qua Google
            if (userExists.authProvider === 'google') {
                throw new _common.ConflictException('Email này đã được sử dụng để đăng nhập với Google. Vui lòng sử dụng tính năng "Đăng nhập với Google" thay thế.');
            }
            throw new _common.ConflictException('Email đã được đăng ký');
        }
        // Tạo và lưu OTP
        const otp = this.otpCacheService.generateOtp();
        this.otpCacheService.set(dto.email, otp);
        // Gửi email qua EmailService
        await this.emailService.sendOtpEmail(dto.email, otp);
        return {
            message: 'Mã OTP đã được gửi đến email của bạn'
        };
    }
    async register(dto) {
        // Verify OTP
        const isOtpValid = this.otpCacheService.verify(dto.email, dto.otp);
        if (!isOtpValid) {
            throw new _common.BadRequestException('Mã OTP không đúng hoặc đã hết hạn');
        }
        const userExists = await this.usersService.findOne(dto.email);
        if (userExists) {
            throw new _common.ConflictException('Email đã tồn tại');
        }
        const hashedPassword = await _bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            fullName: dto.fullName
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }
    async login(dto) {
        const user = await this.usersService.findOne(dto.email);
        if (!user) {
            throw new _common.UnauthorizedException('Thông tin đăng nhập không chính xác');
        }
        const isPasswordValid = await _bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new _common.UnauthorizedException('Thông tin đăng nhập không chính xác');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        };
    }
    async forgotPassword(dto) {
        // Không tiết lộ user có tồn tại hay không (bảo mật)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = `${frontendUrl}/reset-password`;
        try {
            await this.supabaseService.sendPasswordResetEmail(dto.email, redirectUrl);
        } catch  {
        // Không throw error để không tiết lộ email có tồn tại hay không
        }
        return {
            message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.'
        };
    }
    async googleAuth(dto) {
        // Lấy thông tin user từ access token của Supabase
        const googleUser = await this.supabaseService.getUserFromAccessToken(dto.accessToken);
        if (!googleUser) {
            throw new _common.UnauthorizedException('Token không hợp lệ');
        }
        // Kiểm tra user đã tồn tại chưa
        let user = await this.usersService.findOne(googleUser.email);
        if (!user) {
            // Tạo user mới nếu chưa tồn tại
            const randomPassword = await _bcrypt.hash(Math.random().toString(36), 10);
            user = await this.usersService.create({
                email: googleUser.email,
                password: randomPassword,
                fullName: googleUser.fullName || undefined,
                authProvider: 'google'
            });
            // Cập nhật avatar nếu có
            if (googleUser.avatarUrl) {
                await this.usersService.updateProfile(user.id, {
                    avatarUrl: googleUser.avatarUrl
                });
            }
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        };
    }
    constructor(usersService, jwtService, supabaseService, emailService, otpCacheService){
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.supabaseService = supabaseService;
        this.emailService = emailService;
        this.otpCacheService = otpCacheService;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _supabaseservice.SupabaseService === "undefined" ? Object : _supabaseservice.SupabaseService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService,
        typeof _otpcacheservice.OtpCacheService === "undefined" ? Object : _otpcacheservice.OtpCacheService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map