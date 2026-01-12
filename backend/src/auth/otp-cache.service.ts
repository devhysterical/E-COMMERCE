import { Injectable } from '@nestjs/common';

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class OtpCacheService {
  private cache = new Map<string, OtpEntry>();
  private readonly TTL_MS = 5 * 60 * 1000; // 5 phút

  // Tạo mã OTP 6 ký tự (A-Za-z0-9)
  generateOtp(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
  }

  // Lưu OTP cho email
  set(email: string, otp: string): void {
    const normalizedEmail = email.toLowerCase();
    this.cache.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + this.TTL_MS,
    });

    // Tự động xóa sau khi hết hạn
    setTimeout(() => {
      this.delete(normalizedEmail);
    }, this.TTL_MS);
  }

  // Lấy OTP theo email
  get(email: string): string | null {
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
  verify(email: string, otp: string): boolean {
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
  delete(email: string): void {
    this.cache.delete(email.toLowerCase());
  }

  // Kiểm tra có thể gửi lại OTP không (cooldown 60s)
  canResend(email: string): { canResend: boolean; waitSeconds: number } {
    const normalizedEmail = email.toLowerCase();
    const entry = this.cache.get(normalizedEmail);

    if (!entry) {
      return { canResend: true, waitSeconds: 0 };
    }

    // Chỉ cho phép gửi lại sau 60s
    const timeSinceCreated = Date.now() - (entry.expiresAt - this.TTL_MS);
    const cooldownMs = 60 * 1000;

    if (timeSinceCreated < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - timeSinceCreated) / 1000);
      return { canResend: false, waitSeconds };
    }

    return { canResend: true, waitSeconds: 0 };
  }
}
