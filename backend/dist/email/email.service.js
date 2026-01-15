"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailService", {
    enumerable: true,
    get: function() {
        return EmailService;
    }
});
const _common = require("@nestjs/common");
const _nodemailer = /*#__PURE__*/ _interop_require_wildcard(require("nodemailer"));
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
let EmailService = class EmailService {
    async sendOtpEmail(email, otp) {
        const mailOptions = {
            from: `"E-Commerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Mã xác thực đăng ký tài khoản',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5; text-align: center;">Xác thực đăng ký tài khoản</h2>
          <p>Xin chào,</p>
          <p>Mã OTP của bạn là:</p>
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">Mã này có hiệu lực trong <strong>5 phút</strong>.</p>
          <p style="color: #666;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 E-Commerce. All rights reserved.
          </p>
        </div>
      `
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`[EMAIL] OTP sent successfully to ${email}`);
        } catch (error) {
            console.error(`[EMAIL] Failed to send OTP to ${email}:`, error);
            throw error;
        }
    }
    async sendPasswordResetEmail(email, resetLink) {
        const mailOptions = {
            from: `"E-Commerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Đặt lại mật khẩu',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5; text-align: center;">Đặt lại mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn nút bên dưới để đặt mật khẩu mới:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="color: #666;">Link này có hiệu lực trong <strong>1 giờ</strong>.</p>
          <p style="color: #666;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 E-Commerce. All rights reserved.
          </p>
        </div>
      `
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Password reset email sent to ${email}`);
        } catch (error) {
            console.error(`[EMAIL] Failed to send password reset to ${email}:`, error);
            throw error;
        }
    }
    async sendOrderConfirmationEmail(email, orderData) {
        const itemsHtml = orderData.items.map((item)=>`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
        </tr>
      `).join('');
        const finalAmount = orderData.totalAmount - orderData.discountAmount;
        const mailOptions = {
            from: `"E-Commerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Xác nhận đơn hàng #${orderData.orderId.slice(0, 8).toUpperCase()}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5; text-align: center;">Đặt hàng thành công!</h2>
          <p>Cảm ơn bạn đã đặt hàng tại E-Commerce.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Mã đơn hàng:</strong> #${orderData.orderId.slice(0, 8).toUpperCase()}</p>
            <p style="margin: 10px 0 0;"><strong>Địa chỉ giao hàng:</strong> ${orderData.address}</p>
            <p style="margin: 10px 0 0;"><strong>Phương thức thanh toán:</strong> ${orderData.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'MoMo'}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #4F46E5; color: white;">
                <th style="padding: 12px; text-align: left;">Sản phẩm</th>
                <th style="padding: 12px; text-align: center;">SL</th>
                <th style="padding: 12px; text-align: right;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; padding: 10px 0;">
            <p style="margin: 5px 0;">Tạm tính: <strong>${(orderData.totalAmount + orderData.discountAmount).toLocaleString('vi-VN')}đ</strong></p>
            ${orderData.discountAmount > 0 ? `<p style="margin: 5px 0; color: #16a34a;">Giảm giá: <strong>-${orderData.discountAmount.toLocaleString('vi-VN')}đ</strong></p>` : ''}
            <p style="margin: 5px 0; font-size: 18px; color: #4F46E5;">Tổng cộng: <strong>${finalAmount.toLocaleString('vi-VN')}đ</strong></p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 E-Commerce. All rights reserved.
          </p>
        </div>
      `
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Order confirmation sent to ${email}`);
        } catch (error) {
            console.error(`[EMAIL] Failed to send order confirmation to ${email}:`, error);
        // Don't throw - order was already created, just log the error
        }
    }
    async sendOrderStatusUpdateEmail(email, orderData) {
        const statusColors = {
            PENDING: '#eab308',
            PROCESSING: '#3b82f6',
            SHIPPED: '#8b5cf6',
            DELIVERED: '#22c55e',
            CANCELLED: '#ef4444'
        };
        const color = statusColors[orderData.status] || '#4F46E5';
        const mailOptions = {
            from: `"E-Commerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Cập nhật đơn hàng #${orderData.orderId.slice(0, 8).toUpperCase()}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5; text-align: center;">Cập nhật trạng thái đơn hàng</h2>
          <p>Đơn hàng <strong>#${orderData.orderId.slice(0, 8).toUpperCase()}</strong> của bạn đã được cập nhật.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="background: ${color}; color: white; padding: 15px 30px; border-radius: 10px; font-weight: bold; font-size: 18px;">
              ${orderData.statusLabel}
            </span>
          </div>

          <p style="color: #666; text-align: center;">
            Bạn có thể theo dõi đơn hàng trong phần "Lịch sử đơn hàng" trên website của chúng tôi.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 E-Commerce. All rights reserved.
          </p>
        </div>
      `
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Order status update sent to ${email}`);
        } catch (error) {
            console.error(`[EMAIL] Failed to send status update to ${email}:`, error);
        }
    }
    constructor(){
        // Cấu hình SMTP transporter
        this.transporter = _nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
};
EmailService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], EmailService);

//# sourceMappingURL=email.service.js.map