import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';
import { OtpCacheService } from './otp-cache.service';
import * as bcrypt from 'bcrypt';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  GoogleAuthDto,
} from './dto/auth.dto';
import { SendOtpDto } from './dto/otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
    private emailService: EmailService,
    private otpCacheService: OtpCacheService,
  ) {}

  // Gửi OTP đến email
  async sendOtp(dto: SendOtpDto) {
    // Kiểm tra cooldown
    const { canResend, waitSeconds } = this.otpCacheService.canResend(
      dto.email,
    );
    if (!canResend) {
      throw new BadRequestException(
        `Vui lòng đợi ${waitSeconds} giây trước khi gửi lại mã OTP`,
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const userExists = await this.usersService.findOne(dto.email);
    if (userExists) {
      // Kiểm tra nếu user đã đăng ký qua Google
      if (userExists.authProvider === 'google') {
        throw new ConflictException(
          'Email này đã được sử dụng để đăng nhập với Google. Vui lòng sử dụng tính năng "Đăng nhập với Google" thay thế.',
        );
      }
      throw new ConflictException('Email đã được đăng ký');
    }

    // Tạo và lưu OTP
    const otp = this.otpCacheService.generateOtp();
    this.otpCacheService.set(dto.email, otp);

    // Gửi email qua EmailService
    await this.emailService.sendOtpEmail(dto.email, otp);

    return { message: 'Mã OTP đã được gửi đến email của bạn' };
  }

  async register(dto: RegisterDto) {
    // Verify OTP
    const isOtpValid = this.otpCacheService.verify(dto.email, dto.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Mã OTP không đúng hoặc đã hết hạn');
    }

    const userExists = await this.usersService.findOne(dto.email);
    if (userExists) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOne(dto.email);
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
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

  async forgotPassword(dto: ForgotPasswordDto) {
    // Không tiết lộ user có tồn tại hay không (bảo mật)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/reset-password`;

    try {
      await this.supabaseService.sendPasswordResetEmail(dto.email, redirectUrl);
    } catch {
      // Không throw error để không tiết lộ email có tồn tại hay không
    }

    return {
      message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.',
    };
  }

  async googleAuth(dto: GoogleAuthDto) {
    // Lấy thông tin user từ access token của Supabase
    const googleUser = await this.supabaseService.getUserFromAccessToken(
      dto.accessToken,
    );

    if (!googleUser) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // Kiểm tra user đã tồn tại chưa
    let user = await this.usersService.findOne(googleUser.email);

    if (!user) {
      // Tạo user mới nếu chưa tồn tại
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await this.usersService.create({
        email: googleUser.email,
        password: randomPassword,
        fullName: googleUser.fullName || undefined,
        authProvider: 'google',
      });

      // Cập nhật avatar nếu có
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
}
