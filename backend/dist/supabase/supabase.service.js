"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupabaseService", {
    enumerable: true,
    get: function() {
        return SupabaseService;
    }
});
const _common = require("@nestjs/common");
const _supabasejs = require("@supabase/supabase-js");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SupabaseService = class SupabaseService {
    async uploadImage(bucket, file, fileName, contentType) {
        const { data, error } = await this.supabase.storage.from(bucket).upload(fileName, file, {
            contentType,
            upsert: true
        });
        if (error) {
            throw new Error(`Lỗi upload: ${error.message}`);
        }
        const { data: { publicUrl } } = this.supabase.storage.from(bucket).getPublicUrl(data.path);
        return {
            url: publicUrl
        };
    }
    async deleteImage(bucket, path) {
        const { error } = await this.supabase.storage.from(bucket).remove([
            path
        ]);
        if (error) {
            throw new Error(`Lỗi xóa file: ${error.message}`);
        }
    }
    // Auth methods
    async sendPasswordResetEmail(email, redirectUrl) {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl
        });
        if (error) {
            throw new Error(`Lỗi gửi email reset: ${error.message}`);
        }
    }
    async getUserFromAccessToken(accessToken) {
        const { data, error } = await this.supabase.auth.getUser(accessToken);
        if (error || !data.user) {
            return null;
        }
        const metadata = data.user.user_metadata || {};
        return {
            id: data.user.id,
            email: data.user.email || '',
            fullName: metadata.full_name || metadata.name || null,
            avatarUrl: metadata.avatar_url || metadata.picture || null
        };
    }
    // Gửi email OTP sử dụng Supabase Edge Function hoặc custom SMTP
    // Tạm thời sử dụng console.log để demo, thực tế cần setup email template
    async sendOtpEmail(email, otp) {
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
    constructor(){
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_KEY trong .env');
        }
        this.supabase = (0, _supabasejs.createClient)(supabaseUrl, supabaseServiceKey);
    }
};
SupabaseService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], SupabaseService);

//# sourceMappingURL=supabase.service.js.map