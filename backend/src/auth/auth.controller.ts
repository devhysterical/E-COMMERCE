import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  GoogleAuthDto,
} from './dto/auth.dto';
import { SendOtpDto } from './dto/otp.dto';

@Controller('auth')
@ApiTags('Auth')
@Throttle({ default: { ttl: 60000, limit: 5 } })
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
  }

  /** Set access_token + refresh_token as httpOnly cookies */
  private setTokenCookies(
    res: express.Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  /** Clear both auth cookies */
  private clearTokenCookies(res: express.Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(dto);
    this.setTokenCookies(res, result.access_token, result.refresh_token);
    return { user: result.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    // Read refresh token from cookie first, fallback to body
    const cookies = req.cookies as Record<string, string> | undefined;
    const body = req.body as Record<string, string> | undefined;
    const refreshToken = cookies?.refresh_token || body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token không tồn tại');
    }

    const result = await this.authService.refreshTokens(refreshToken);
    this.setTokenCookies(res, result.access_token, result.refresh_token);
    return { message: 'Token refreshed' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  logout(
    @Request() req: { user: { userId: string } },
    @Res({ passthrough: true }) res: express.Response,
  ) {
    this.clearTokenCookies(res);
    return this.authService.logout(req.user.userId);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(
    @Body() dto: GoogleAuthDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.googleAuth(dto);
    this.setTokenCookies(res, result.access_token, result.refresh_token);
    return { user: result.user };
  }
}
