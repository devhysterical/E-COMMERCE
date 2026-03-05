import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';
import { OtpCacheService } from './otp-cache.service';
import { RefreshTokenService } from './refresh-token.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUsersService = {
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateProfile: jest.fn(),
  restoreUser: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
};

const mockSupabaseService = {
  sendPasswordResetEmail: jest.fn(),
  getUserFromAccessToken: jest.fn(),
};

const mockEmailService = {
  sendOtpEmail: jest.fn(),
};

const mockOtpCacheService = {
  canResend: jest.fn(),
  generateOtp: jest.fn(),
  set: jest.fn(),
  verify: jest.fn(),
};

const mockRefreshTokenService = {
  createRefreshToken: jest.fn().mockResolvedValue('mock-refresh-token'),
  validateRefreshToken: jest.fn(),
  revokeUserTokens: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: OtpCacheService, useValue: mockOtpCacheService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');
    mockRefreshTokenService.createRefreshToken.mockResolvedValue(
      'mock-refresh-token',
    );
  });

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashed-password',
    fullName: 'Test User',
    role: 'USER',
    authProvider: null,
    deletedAt: null,
  };

  // ==================== SEND OTP ====================
  describe('sendOtp', () => {
    it('should send OTP successfully', async () => {
      mockOtpCacheService.canResend.mockReturnValue({
        canResend: true,
        waitSeconds: 0,
      });
      mockUsersService.findOne.mockResolvedValue(null);
      mockOtpCacheService.generateOtp.mockReturnValue('ABC123');
      mockEmailService.sendOtpEmail.mockResolvedValue(undefined);

      const result = await service.sendOtp({ email: 'new@example.com' });

      expect(result.message).toContain('OTP');
      expect(mockEmailService.sendOtpEmail).toHaveBeenCalledWith(
        'new@example.com',
        'ABC123',
      );
    });

    it('should throw if cooldown not expired', async () => {
      mockOtpCacheService.canResend.mockReturnValue({
        canResend: false,
        waitSeconds: 30,
      });

      await expect(
        service.sendOtp({ email: 'test@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if email already registered', async () => {
      mockOtpCacheService.canResend.mockReturnValue({
        canResend: true,
        waitSeconds: 0,
      });
      mockUsersService.findOne.mockResolvedValue(mockUser);

      await expect(
        service.sendOtp({ email: 'test@example.com' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw specific error for Google-registered email', async () => {
      mockOtpCacheService.canResend.mockReturnValue({
        canResend: true,
        waitSeconds: 0,
      });
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        authProvider: 'google',
      });

      await expect(
        service.sendOtp({ email: 'test@example.com' }),
      ).rejects.toThrow(/Google/);
    });

    it('should throw if user is soft-deleted', async () => {
      mockOtpCacheService.canResend.mockReturnValue({
        canResend: true,
        waitSeconds: 0,
      });
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        deletedAt: new Date(),
      });

      await expect(
        service.sendOtp({ email: 'test@example.com' }),
      ).rejects.toThrow(/vô hiệu hoá/);
    });
  });

  // ==================== REGISTER ====================
  describe('register', () => {
    it('should register a new user', async () => {
      mockOtpCacheService.verify.mockReturnValue(true);
      mockUsersService.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'new@example.com',
        password: 'Password123',
        fullName: 'New User',
        otp: 'ABC123',
      });

      expect(result.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw if OTP is invalid', async () => {
      mockOtpCacheService.verify.mockReturnValue(false);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'pass',
          fullName: 'Name',
          otp: 'WRONG',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if email already exists', async () => {
      mockOtpCacheService.verify.mockReturnValue(true);
      mockUsersService.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'pass',
          fullName: 'Name',
          otp: 'ABC123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ==================== LOGIN ====================
  describe('login', () => {
    it('should login successfully', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'correct-password',
      });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.refresh_token).toBe('mock-refresh-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw if user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if user is soft-deleted', async () => {
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        deletedAt: new Date(),
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ==================== REFRESH TOKENS ====================
  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
        userId: 'user-1',
      });
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.refreshTokens('valid-refresh-token');

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.refresh_token).toBe('mock-refresh-token');
    });

    it('should throw if refresh token is invalid', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue(null);

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if user is soft-deleted', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
        userId: 'user-1',
      });
      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        deletedAt: new Date(),
      });

      await expect(service.refreshTokens('valid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ==================== LOGOUT ====================
  describe('logout', () => {
    it('should revoke all user tokens', async () => {
      mockRefreshTokenService.revokeUserTokens.mockResolvedValue(undefined);

      const result = await service.logout('user-1');

      expect(result.message).toContain('thành công');
      expect(mockRefreshTokenService.revokeUserTokens).toHaveBeenCalledWith(
        'user-1',
      );
    });
  });

  // ==================== FORGOT PASSWORD ====================
  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      mockSupabaseService.sendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await service.forgotPassword({
        email: 'test@example.com',
      });

      expect(result.message).toContain('email');
    });

    it('should not throw even if Supabase fails', async () => {
      mockSupabaseService.sendPasswordResetEmail.mockRejectedValue(
        new Error('fail'),
      );

      const result = await service.forgotPassword({
        email: 'test@example.com',
      });

      expect(result.message).toContain('email');
    });
  });

  // ==================== GOOGLE AUTH ====================
  describe('googleAuth', () => {
    it('should login existing Google user', async () => {
      mockSupabaseService.getUserFromAccessToken.mockResolvedValue({
        email: 'google@example.com',
        fullName: 'Google User',
        avatarUrl: null,
      });
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        email: 'google@example.com',
        authProvider: 'google',
      });

      const result = await service.googleAuth({
        accessToken: 'valid-google-token',
      });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should create new user for new Google login', async () => {
      const newGoogleUser = {
        ...mockUser,
        email: 'new-google@example.com',
        authProvider: 'google',
      };
      mockSupabaseService.getUserFromAccessToken.mockResolvedValue({
        email: 'new-google@example.com',
        fullName: 'New User',
        avatarUrl: null,
      });
      mockUsersService.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('random-hashed');
      mockUsersService.create.mockResolvedValue(newGoogleUser);

      const result = await service.googleAuth({ accessToken: 'new-token' });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw if token is invalid', async () => {
      mockSupabaseService.getUserFromAccessToken.mockResolvedValue(null);

      await expect(
        service.googleAuth({ accessToken: 'invalid' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
