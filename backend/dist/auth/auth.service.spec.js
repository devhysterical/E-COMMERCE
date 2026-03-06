"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _authservice = require("./auth.service");
const _usersservice = require("../users/users.service");
const _supabaseservice = require("../supabase/supabase.service");
const _emailservice = require("../email/email.service");
const _otpcacheservice = require("./otp-cache.service");
const _refreshtokenservice = require("./refresh-token.service");
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
jest.mock('bcrypt');
const mockUsersService = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateProfile: jest.fn(),
    restoreUser: jest.fn()
};
const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-jwt-token')
};
const mockSupabaseService = {
    sendPasswordResetEmail: jest.fn(),
    getUserFromAccessToken: jest.fn()
};
const mockEmailService = {
    sendOtpEmail: jest.fn()
};
const mockOtpCacheService = {
    canResend: jest.fn(),
    generateOtp: jest.fn(),
    set: jest.fn(),
    verify: jest.fn()
};
const mockRefreshTokenService = {
    createRefreshToken: jest.fn().mockResolvedValue('mock-refresh-token'),
    validateRefreshToken: jest.fn(),
    revokeUserTokens: jest.fn()
};
describe('AuthService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _authservice.AuthService,
                {
                    provide: _usersservice.UsersService,
                    useValue: mockUsersService
                },
                {
                    provide: _jwt.JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: _supabaseservice.SupabaseService,
                    useValue: mockSupabaseService
                },
                {
                    provide: _emailservice.EmailService,
                    useValue: mockEmailService
                },
                {
                    provide: _otpcacheservice.OtpCacheService,
                    useValue: mockOtpCacheService
                },
                {
                    provide: _refreshtokenservice.RefreshTokenService,
                    useValue: mockRefreshTokenService
                }
            ]
        }).compile();
        service = module.get(_authservice.AuthService);
        jest.clearAllMocks();
        mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');
        mockRefreshTokenService.createRefreshToken.mockResolvedValue('mock-refresh-token');
    });
    const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        fullName: 'Test User',
        role: 'USER',
        authProvider: null,
        deletedAt: null
    };
    // ==================== SEND OTP ====================
    describe('sendOtp', ()=>{
        it('should send OTP successfully', async ()=>{
            mockOtpCacheService.canResend.mockReturnValue({
                canResend: true,
                waitSeconds: 0
            });
            mockUsersService.findOne.mockResolvedValue(null);
            mockOtpCacheService.generateOtp.mockReturnValue('ABC123');
            mockEmailService.sendOtpEmail.mockResolvedValue(undefined);
            const result = await service.sendOtp({
                email: 'new@example.com'
            });
            expect(result.message).toContain('OTP');
            expect(mockEmailService.sendOtpEmail).toHaveBeenCalledWith('new@example.com', 'ABC123');
        });
        it('should throw if cooldown not expired', async ()=>{
            mockOtpCacheService.canResend.mockReturnValue({
                canResend: false,
                waitSeconds: 30
            });
            await expect(service.sendOtp({
                email: 'test@example.com'
            })).rejects.toThrow(_common.BadRequestException);
        });
        it('should throw if email already registered', async ()=>{
            mockOtpCacheService.canResend.mockReturnValue({
                canResend: true,
                waitSeconds: 0
            });
            mockUsersService.findOne.mockResolvedValue(mockUser);
            await expect(service.sendOtp({
                email: 'test@example.com'
            })).rejects.toThrow(_common.ConflictException);
        });
        it('should throw specific error for Google-registered email', async ()=>{
            mockOtpCacheService.canResend.mockReturnValue({
                canResend: true,
                waitSeconds: 0
            });
            mockUsersService.findOne.mockResolvedValue({
                ...mockUser,
                authProvider: 'google'
            });
            await expect(service.sendOtp({
                email: 'test@example.com'
            })).rejects.toThrow(/Google/);
        });
        it('should throw if user is soft-deleted', async ()=>{
            mockOtpCacheService.canResend.mockReturnValue({
                canResend: true,
                waitSeconds: 0
            });
            mockUsersService.findOne.mockResolvedValue({
                ...mockUser,
                deletedAt: new Date()
            });
            await expect(service.sendOtp({
                email: 'test@example.com'
            })).rejects.toThrow(/vô hiệu hoá/);
        });
    });
    // ==================== REGISTER ====================
    describe('register', ()=>{
        it('should register a new user', async ()=>{
            mockOtpCacheService.verify.mockReturnValue(true);
            mockUsersService.findOne.mockResolvedValue(null);
            _bcrypt.hash.mockResolvedValue('hashed-pw');
            mockUsersService.create.mockResolvedValue(mockUser);
            const result = await service.register({
                email: 'new@example.com',
                password: 'Password123',
                fullName: 'New User',
                otp: 'ABC123'
            });
            expect(result.email).toBe('test@example.com');
            expect(result).not.toHaveProperty('password');
        });
        it('should throw if OTP is invalid', async ()=>{
            mockOtpCacheService.verify.mockReturnValue(false);
            await expect(service.register({
                email: 'test@example.com',
                password: 'pass',
                fullName: 'Name',
                otp: 'WRONG'
            })).rejects.toThrow(_common.BadRequestException);
        });
        it('should throw if email already exists', async ()=>{
            mockOtpCacheService.verify.mockReturnValue(true);
            mockUsersService.findOne.mockResolvedValue(mockUser);
            await expect(service.register({
                email: 'test@example.com',
                password: 'pass',
                fullName: 'Name',
                otp: 'ABC123'
            })).rejects.toThrow(_common.ConflictException);
        });
    });
    // ==================== LOGIN ====================
    describe('login', ()=>{
        it('should login successfully', async ()=>{
            mockUsersService.findOne.mockResolvedValue(mockUser);
            _bcrypt.compare.mockResolvedValue(true);
            const result = await service.login({
                email: 'test@example.com',
                password: 'correct-password'
            });
            expect(result.access_token).toBe('mock-jwt-token');
            expect(result.refresh_token).toBe('mock-refresh-token');
            expect(result.user.email).toBe('test@example.com');
        });
        it('should throw if user not found', async ()=>{
            mockUsersService.findOne.mockResolvedValue(null);
            await expect(service.login({
                email: 'nonexistent@example.com',
                password: 'pass'
            })).rejects.toThrow(_common.UnauthorizedException);
        });
        it('should throw if user is soft-deleted', async ()=>{
            mockUsersService.findOne.mockResolvedValue({
                ...mockUser,
                deletedAt: new Date()
            });
            await expect(service.login({
                email: 'test@example.com',
                password: 'pass'
            })).rejects.toThrow(_common.UnauthorizedException);
        });
        it('should throw if password is invalid', async ()=>{
            mockUsersService.findOne.mockResolvedValue(mockUser);
            _bcrypt.compare.mockResolvedValue(false);
            await expect(service.login({
                email: 'test@example.com',
                password: 'wrong-password'
            })).rejects.toThrow(_common.UnauthorizedException);
        });
    });
    // ==================== REFRESH TOKENS ====================
    describe('refreshTokens', ()=>{
        it('should refresh tokens successfully', async ()=>{
            mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
                userId: 'user-1'
            });
            mockUsersService.findById.mockResolvedValue(mockUser);
            const result = await service.refreshTokens('valid-refresh-token');
            expect(result.access_token).toBe('mock-jwt-token');
            expect(result.refresh_token).toBe('mock-refresh-token');
        });
        it('should throw if refresh token is invalid', async ()=>{
            mockRefreshTokenService.validateRefreshToken.mockResolvedValue(null);
            await expect(service.refreshTokens('invalid-token')).rejects.toThrow(_common.UnauthorizedException);
        });
        it('should throw if user is soft-deleted', async ()=>{
            mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
                userId: 'user-1'
            });
            mockUsersService.findById.mockResolvedValue({
                ...mockUser,
                deletedAt: new Date()
            });
            await expect(service.refreshTokens('valid-token')).rejects.toThrow(_common.UnauthorizedException);
        });
    });
    // ==================== LOGOUT ====================
    describe('logout', ()=>{
        it('should revoke all user tokens', async ()=>{
            mockRefreshTokenService.revokeUserTokens.mockResolvedValue(undefined);
            const result = await service.logout('user-1');
            expect(result.message).toContain('thành công');
            expect(mockRefreshTokenService.revokeUserTokens).toHaveBeenCalledWith('user-1');
        });
    });
    // ==================== FORGOT PASSWORD ====================
    describe('forgotPassword', ()=>{
        it('should send password reset email', async ()=>{
            mockSupabaseService.sendPasswordResetEmail.mockResolvedValue(undefined);
            const result = await service.forgotPassword({
                email: 'test@example.com'
            });
            expect(result.message).toContain('email');
        });
        it('should not throw even if Supabase fails', async ()=>{
            mockSupabaseService.sendPasswordResetEmail.mockRejectedValue(new Error('fail'));
            const result = await service.forgotPassword({
                email: 'test@example.com'
            });
            expect(result.message).toContain('email');
        });
    });
    // ==================== GOOGLE AUTH ====================
    describe('googleAuth', ()=>{
        it('should login existing Google user', async ()=>{
            mockSupabaseService.getUserFromAccessToken.mockResolvedValue({
                email: 'google@example.com',
                fullName: 'Google User',
                avatarUrl: null
            });
            mockUsersService.findOne.mockResolvedValue({
                ...mockUser,
                email: 'google@example.com',
                authProvider: 'google'
            });
            const result = await service.googleAuth({
                accessToken: 'valid-google-token'
            });
            expect(result.access_token).toBe('mock-jwt-token');
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
        it('should create new user for new Google login', async ()=>{
            const newGoogleUser = {
                ...mockUser,
                email: 'new-google@example.com',
                authProvider: 'google'
            };
            mockSupabaseService.getUserFromAccessToken.mockResolvedValue({
                email: 'new-google@example.com',
                fullName: 'New User',
                avatarUrl: null
            });
            mockUsersService.findOne.mockResolvedValue(null);
            _bcrypt.hash.mockResolvedValue('random-hashed');
            mockUsersService.create.mockResolvedValue(newGoogleUser);
            const result = await service.googleAuth({
                accessToken: 'new-token'
            });
            expect(result.access_token).toBe('mock-jwt-token');
            expect(mockUsersService.create).toHaveBeenCalled();
        });
        it('should throw if token is invalid', async ()=>{
            mockSupabaseService.getUserFromAccessToken.mockResolvedValue(null);
            await expect(service.googleAuth({
                accessToken: 'invalid'
            })).rejects.toThrow(_common.UnauthorizedException);
        });
    });
});

//# sourceMappingURL=auth.service.spec.js.map