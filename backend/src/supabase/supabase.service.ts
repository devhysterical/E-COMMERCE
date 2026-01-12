import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_KEY trong .env',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async uploadImage(
    bucket: string,
    file: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<{ url: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Lỗi upload: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl };
  }

  async deleteImage(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`Lỗi xóa file: ${error.message}`);
    }
  }

  // Auth methods
  async sendPasswordResetEmail(
    email: string,
    redirectUrl: string,
  ): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw new Error(`Lỗi gửi email reset: ${error.message}`);
    }
  }

  async getUserFromAccessToken(accessToken: string): Promise<{
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
  } | null> {
    const { data, error } = await this.supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return null;
    }

    const metadata = (data.user.user_metadata || {}) as Record<
      string,
      string | undefined
    >;

    return {
      id: data.user.id,
      email: data.user.email || '',
      fullName: metadata.full_name || metadata.name || null,
      avatarUrl: metadata.avatar_url || metadata.picture || null,
    };
  }

  // Gửi email OTP sử dụng Supabase Edge Function hoặc custom SMTP
  // Tạm thời sử dụng console.log để demo, thực tế cần setup email template
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    // Supabase không có built-in OTP email, nên ta sẽ tự gửi
    // Option 1: Sử dụng Supabase Edge Function
    // Option 2: Sử dụng nodemailer với SMTP
    // Hiện tại log ra console để test, sau đó tích hợp thực tế

    console.log(`[OTP] Sending OTP ${otp} to ${email}`);

    // TODO: Tích hợp gửi email thực tế
    // Ví dụ với nodemailer:
    // await this.transporter.sendMail({
    //   to: email,
    //   subject: 'Mã xác thực đăng ký',
    //   html: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p>`,
    // });

    // Placeholder await để fix lint
    await Promise.resolve();
  }
}
