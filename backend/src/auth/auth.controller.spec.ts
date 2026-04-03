/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

const mockAuthService = {
  sendOtp: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  refreshTokens: jest.fn(),
  logout: jest.fn(),
  forgotPassword: jest.fn(),
  googleAuth: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      NODE_ENV: 'test',
    };
    return config[key];
  }),
};

const createMockResponse = () => {
  const res: Partial<Response> = {
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };
  return res as Response;
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set cookies and return user', async () => {
      const mockResult = {
        access_token: 'jwt-token',
        refresh_token: 'refresh-token',
        user: {
          id: '1',
          email: 'test@test.com',
          fullName: 'Test',
          role: 'USER',
        },
      };
      mockAuthService.login.mockResolvedValue(mockResult);

      const res = createMockResponse();

      const result = await controller.login(
        { email: 'test@test.com', password: 'pass' },
        res,
      );

      expect(result).toEqual({ user: mockResult.user });
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'jwt-token',
        expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        expect.objectContaining({ httpOnly: true, path: '/auth/refresh' }),
      );
    });
  });

  describe('logout', () => {
    it('should clear cookies and call service', async () => {
      mockAuthService.logout.mockResolvedValue({
        message: 'Đăng xuất thành công',
      });

      const res = createMockResponse();

      const result = await controller.logout(
        { user: { userId: 'user-1' } },
        res,
      );

      expect(result).toEqual({ message: 'Đăng xuất thành công' });
      expect(res.clearCookie).toHaveBeenCalledWith('access_token', {
        path: '/',
      });
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', {
        path: '/auth/refresh',
      });
    });
  });

  describe('googleAuth', () => {
    it('should set cookies and return user', async () => {
      const mockResult = {
        access_token: 'jwt-token',
        refresh_token: 'refresh-token',
        user: {
          id: '1',
          email: 'google@test.com',
          fullName: 'Google User',
          role: 'USER',
        },
      };
      mockAuthService.googleAuth.mockResolvedValue(mockResult);

      const res = createMockResponse();

      const result = await controller.googleAuth(
        { accessToken: 'google-token' },
        res,
      );

      expect(result).toEqual({ user: mockResult.user });
      expect(res.cookie).toHaveBeenCalledTimes(2);
    });
  });
});
