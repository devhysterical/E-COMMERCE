import { Injectable, StreamableFile } from '@nestjs/common';
import { AppLanguage } from './language';

type DynamicTranslationRule = {
  vi: RegExp;
  en: RegExp;
  toEn: (match: RegExpMatchArray) => string;
  toVi: (match: RegExpMatchArray) => string;
};

@Injectable()
export class MessageLocalizationService {
  private readonly exactPairs: Array<[string, string]> = [
    ['Bad Request', 'Bad Request'],
    ['Unauthorized', 'Unauthorized'],
    ['Forbidden', 'Forbidden'],
    ['Not Found', 'Not Found'],
    ['Conflict', 'Conflict'],
    ['Internal Server Error', 'Internal Server Error'],
    ['Internal server error', 'Internal server error'],
    ['Validation failed', 'Validation failed'],
    ['Invalid signature', 'Invalid signature'],
    ['OK', 'OK'],
    ['Yêu cầu không hợp lệ', 'Bad Request'],
    ['Không được phép', 'Unauthorized'],
    ['Bị từ chối truy cập', 'Forbidden'],
    ['Không tìm thấy', 'Not Found'],
    ['Xung đột dữ liệu', 'Conflict'],
    ['Lỗi máy chủ nội bộ', 'Internal server error'],
    ['Dữ liệu không hợp lệ', 'Validation failed'],
    ['Chữ ký không hợp lệ', 'Invalid signature'],
    ['Thành công', 'OK'],
    ['Refresh token không tồn tại', 'Refresh token not found'],
    ['Token đã được làm mới', 'Token refreshed'],
    [
      'Tài khoản này đã bị vô hiệu hoá. Vui lòng liên hệ hỗ trợ.',
      'This account has been disabled. Please contact support.',
    ],
    [
      'Email này đã được sử dụng để đăng nhập với Google. Vui lòng sử dụng tính năng "Đăng nhập với Google" thay thế.',
      'This email is already linked to Google sign-in. Please use "Sign in with Google" instead.',
    ],
    ['Email đã được đăng ký', 'Email is already registered'],
    [
      'Mã OTP đã được gửi đến email của bạn',
      'An OTP code has been sent to your email',
    ],
    [
      'Mã OTP không đúng hoặc đã hết hạn',
      'The OTP code is invalid or has expired',
    ],
    ['Email đã tồn tại', 'Email already exists'],
    ['Thông tin đăng nhập không chính xác', 'Invalid login credentials'],
    [
      'Refresh token không hợp lệ hoặc đã hết hạn',
      'Refresh token is invalid or expired',
    ],
    ['Người dùng không tồn tại', 'User not found'],
    ['Đăng xuất thành công', 'Logged out successfully'],
    [
      'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.',
      'If the email exists, you will receive a password reset link.',
    ],
    ['Token không hợp lệ', 'Invalid token'],
    [
      'Không thể xác thực tài khoản. Vui lòng thử lại.',
      'Unable to verify the account. Please try again.',
    ],
    [
      'Tài khoản không tồn tại hoặc đã bị vô hiệu hoá',
      'Account not found or disabled',
    ],
    ['Mật khẩu hiện tại không đúng', 'Current password is incorrect'],
    ['Đổi mật khẩu thành công', 'Password changed successfully'],
    ['Đã xoá tài khoản thành công', 'Account deleted successfully'],
    [
      'Không thể xoá tài khoản có vai trò Admin. Hãy hạ vai trò về User trước.',
      'Admin accounts cannot be deleted. Please change the role to User first.',
    ],
    ['Không tìm thấy danh mục', 'Category not found'],
    ['Địa chỉ không tồn tại', 'Address not found'],
    ['Đã xóa địa chỉ', 'Address deleted'],
    ['Không tìm thấy file', 'File not found'],
    [
      'Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG, WebP, GIF',
      'Invalid file format. Only JPEG, PNG, WebP, and GIF are allowed',
    ],
    ['File quá lớn. Tối đa 5MB', 'File is too large. Maximum size is 5MB'],
    ['Sản phẩm không tồn tại', 'Product not found'],
    ['Không tìm thấy sản phẩm', 'Product not found'],
    ['Ảnh không tồn tại', 'Image not found'],
    ['Đã xóa ảnh', 'Image deleted'],
    ['Giỏ hàng trống', 'Cart is empty'],
    ['Đơn hàng không tồn tại', 'Order not found'],
    ['Đánh giá không tồn tại', 'Review not found'],
    [
      'Bạn không có quyền sửa đánh giá này',
      'You do not have permission to edit this review',
    ],
    [
      'Bạn không có quyền xóa đánh giá này',
      'You do not have permission to delete this review',
    ],
    [
      'Sản phẩm không có trong danh sách yêu thích',
      'Product is not in the wishlist',
    ],
    ['Đã xóa khỏi danh sách yêu thích', 'Removed from wishlist'],
    ['Đã thêm vào danh sách yêu thích', 'Added to wishlist'],
    ['Mã giảm giá không tồn tại', 'Coupon not found'],
    ['Đã xóa mã giảm giá', 'Coupon deleted'],
    ['Mã giảm giá đã bị vô hiệu hóa', 'Coupon has been disabled'],
    ['Mã giảm giá chưa có hiệu lực', 'Coupon is not active yet'],
    ['Mã giảm giá đã hết hạn', 'Coupon has expired'],
    ['Mã giảm giá đã hết lượt sử dụng', 'Coupon usage limit has been reached'],
    ['Bạn đã sử dụng mã giảm giá này rồi', 'You have already used this coupon'],
    ['Phần thưởng không tồn tại', 'Reward not found'],
    ['Phần thưởng đã ngừng hoạt động', 'Reward is inactive'],
    [
      'Yêu cầu hỗ trợ đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
      'Your support request has been sent successfully. We will get back to you as soon as possible.',
    ],
    ['endTime phải sau startTime', 'End time must be after start time'],
    ['Banner không tồn tại', 'Banner not found'],
    ['Role không được để trống', 'Role is required'],
    ['Role phải là USER hoặc ADMIN', 'Role must be USER or ADMIN'],
    ['Refresh token phải là chuỗi', 'Refresh token must be a string'],
    ['Refresh token không được để trống', 'Refresh token is required'],
    ['Email không hợp lệ', 'Invalid email address'],
    ['Email không được để trống', 'Email is required'],
    ['Mã OTP không được để trống', 'OTP code is required'],
    ['Mã OTP phải có 6 ký tự', 'OTP code must be 6 characters long'],
    ['Mật khẩu không được để trống', 'Password is required'],
    [
      'Mật khẩu phải có ít nhất 8 ký tự',
      'Password must be at least 8 characters long',
    ],
    [
      'Mật khẩu không được quá 16 ký tự',
      'Password must be at most 16 characters long',
    ],
    [
      'Mật khẩu phải chứa ít nhất 1 chữ hoa',
      'Password must contain at least 1 uppercase letter',
    ],
    [
      'Mật khẩu phải chứa ít nhất 1 chữ thường',
      'Password must contain at least 1 lowercase letter',
    ],
    [
      'Mật khẩu phải chứa ít nhất 1 số',
      'Password must contain at least 1 number',
    ],
    [
      'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
      'Password must contain at least 1 special character',
    ],
    ['Tên không được để trống', 'Name is required'],
    ['Token không được để trống', 'Token is required'],
    ['Access token không được để trống', 'Access token is required'],
    ['Tên sản phẩm không được để trống', 'Product name is required'],
    ['Giá phải là số nguyên', 'Price must be an integer'],
    ['Giá không được nhỏ hơn 0', 'Price cannot be less than 0'],
    ['CategoryId không được để trống', 'Category ID is required'],
    ['Tên danh mục không được để trống', 'Category name is required'],
    ['Rating phải là số nguyên', 'Rating must be an integer'],
    ['Rating tối thiểu là 1', 'Rating must be at least 1'],
    ['Rating tối đa là 5', 'Rating must be at most 5'],
    ['ProductId không được để trống', 'Product ID is required'],
    ['Họ tên phải là chuỗi', 'Full name must be a string'],
    ['Họ tên không được để trống', 'Full name is required'],
    ['Chủ đề phải là chuỗi', 'Subject must be a string'],
    ['Chủ đề không được để trống', 'Subject is required'],
    ['Nội dung phải là chuỗi', 'Message must be a string'],
    ['Nội dung không được để trống', 'Message is required'],
    ['Trạng thái không hợp lệ', 'Invalid status'],
    ['Ghi chú phải là chuỗi', 'Admin note must be a string'],
    ['Chờ xử lý', 'Pending'],
    ['Đang xử lý', 'Processing'],
    ['Đang giao', 'Shipped'],
    ['Đang giao hàng', 'Shipping'],
    ['Đã giao', 'Delivered'],
    ['Đã giao hàng', 'Delivered'],
    ['Đã hủy', 'Cancelled'],
    ['Mở', 'Open'],
    ['Đã giải quyết', 'Resolved'],
    ['Đã đóng', 'Closed'],
  ];

  private readonly dynamicRules: DynamicTranslationRule[] = [
    {
      vi: /^Vui lòng đợi (\d+) giây trước khi gửi lại mã OTP$/,
      en: /^Please wait (\d+) seconds before requesting another OTP$/,
      toEn: ([, seconds]) =>
        `Please wait ${this.formatNumber(seconds, 'en')} seconds before requesting another OTP`,
      toVi: ([, seconds]) =>
        `Vui lòng đợi ${this.formatNumber(seconds, 'vi')} giây trước khi gửi lại mã OTP`,
    },
    {
      vi: /^Đơn hàng tối thiểu ([\d.,]+)đ$/,
      en: /^Minimum order amount is ([\d.,\sA-Z]+)$/,
      toEn: ([, amount]) =>
        `Minimum order amount is ${this.formatCurrency(amount, 'en')}`,
      toVi: ([, amount]) =>
        `Đơn hàng tối thiểu ${this.formatCurrency(amount, 'vi')}`,
    },
    {
      vi: /^Giảm ([\d.,]+)đ$/,
      en: /^Save ([\d.,\sA-Z]+)$/,
      toEn: ([, amount]) => `Save ${this.formatCurrency(amount, 'en')}`,
      toVi: ([, amount]) => `Giảm ${this.formatCurrency(amount, 'vi')}`,
    },
    {
      vi: /^Miễn phí vận chuyển cho đơn từ ([\d.,]+)đ$/,
      en: /^Free shipping for orders from ([\d.,\sA-Z]+)$/,
      toEn: ([, amount]) =>
        `Free shipping for orders from ${this.formatCurrency(amount, 'en')}`,
      toVi: ([, amount]) =>
        `Miễn phí vận chuyển cho đơn từ ${this.formatCurrency(amount, 'vi')}`,
    },
    {
      vi: /^Sản phẩm (.+) không đủ tồn kho$/,
      en: /^Product (.+) does not have enough stock$/,
      toEn: ([, productName]) =>
        `Product ${productName} does not have enough stock`,
      toVi: ([, productName]) => `Sản phẩm ${productName} không đủ tồn kho`,
    },
    {
      vi: /^Đánh giá mới cho "(.+)"$/,
      en: /^New review for "(.+)"$/,
      toEn: ([, productName]) => `New review for "${productName}"`,
      toVi: ([, productName]) => `Đánh giá mới cho "${productName}"`,
    },
    {
      vi: /^(.+) đã đánh giá (\d+) sao$/,
      en: /^(.+) rated (\d+) stars$/,
      toEn: ([, name, rating]) =>
        `${name} rated ${this.formatNumber(rating, 'en')} stars`,
      toVi: ([, name, rating]) =>
        `${name} đã đánh giá ${this.formatNumber(rating, 'vi')} sao`,
    },
    {
      vi: /^Đơn hàng #([A-Za-z0-9-]+) — (.+)$/,
      en: /^Order #([A-Za-z0-9-]+) — (.+)$/,
      toEn: ([, orderId, statusLabel]) =>
        `Order #${orderId} — ${this.localizeText(statusLabel, 'en')}`,
      toVi: ([, orderId, statusLabel]) =>
        `Đơn hàng #${orderId} — ${this.localizeText(statusLabel, 'vi')}`,
    },
    {
      vi: /^Đơn hàng của bạn đã được cập nhật trạng thái: (.+)$/,
      en: /^Your order status has been updated: (.+)$/,
      toEn: ([, statusLabel]) =>
        `Your order status has been updated: ${this.localizeText(statusLabel, 'en')}`,
      toVi: ([, statusLabel]) =>
        `Đơn hàng của bạn đã được cập nhật trạng thái: ${this.localizeText(statusLabel, 'vi')}`,
    },
    {
      vi: /^Thanh toán đơn hàng #([A-Za-z0-9-]+)$/,
      en: /^Payment for order #([A-Za-z0-9-]+)$/,
      toEn: ([, orderId]) => `Payment for order #${orderId}`,
      toVi: ([, orderId]) => `Thanh toán đơn hàng #${orderId}`,
    },
    {
      vi: /^Tích điểm đơn hàng #([A-Za-z0-9-]+)$/,
      en: /^Earned points from order #([A-Za-z0-9-]+)$/,
      toEn: ([, orderId]) => `Earned points from order #${orderId}`,
      toVi: ([, orderId]) => `Tích điểm đơn hàng #${orderId}`,
    },
    {
      vi: /^Đổi điểm: (.+)$/,
      en: /^Redeemed points: (.+)$/,
      toEn: ([, rewardName]) => `Redeemed points: ${rewardName}`,
      toVi: ([, rewardName]) => `Đổi điểm: ${rewardName}`,
    },
    {
      vi: /^Không đủ điểm\. Cần ([\d.,]+), hiện có ([\d.,]+)$/,
      en: /^Not enough points\. Required ([\d.,]+), currently ([\d.,]+)$/,
      toEn: ([, required, current]) =>
        `Not enough points. Required ${this.formatNumber(required, 'en')}, currently ${this.formatNumber(current, 'en')}`,
      toVi: ([, required, current]) =>
        `Không đủ điểm. Cần ${this.formatNumber(required, 'vi')}, hiện có ${this.formatNumber(current, 'vi')}`,
    },
    {
      vi: /^Lỗi upload: (.+)$/,
      en: /^Upload error: (.+)$/,
      toEn: ([, errorMessage]) => `Upload error: ${errorMessage}`,
      toVi: ([, errorMessage]) => `Lỗi upload: ${errorMessage}`,
    },
    {
      vi: /^Lỗi xóa file: (.+)$/,
      en: /^Delete file error: (.+)$/,
      toEn: ([, errorMessage]) => `Delete file error: ${errorMessage}`,
      toVi: ([, errorMessage]) => `Lỗi xóa file: ${errorMessage}`,
    },
    {
      vi: /^Lỗi gửi email reset: (.+)$/,
      en: /^Reset email error: (.+)$/,
      toEn: ([, errorMessage]) => `Reset email error: ${errorMessage}`,
      toVi: ([, errorMessage]) => `Lỗi gửi email reset: ${errorMessage}`,
    },
    {
      vi: /^Property (.+) should not exist$/,
      en: /^Thuộc tính (.+) không được phép$/,
      toEn: ([, propertyName]) => `Property ${propertyName} should not exist`,
      toVi: ([, propertyName]) => `Thuộc tính ${propertyName} không được phép`,
    },
  ];

  private readonly viToEn = new Map(this.exactPairs);

  private readonly enToVi = new Map(
    this.exactPairs.map(([vi, en]) => [en, vi] as const),
  );

  localizeText(value: string, language: AppLanguage): string {
    const normalized = value.trim();
    if (!normalized) {
      return value;
    }

    const directMap = language === 'en' ? this.viToEn : this.enToVi;
    const directTranslation = directMap.get(normalized);
    if (directTranslation) {
      return directTranslation;
    }

    for (const rule of this.dynamicRules) {
      const matcher = language === 'en' ? rule.vi : rule.en;
      const match = normalized.match(matcher);
      if (match) {
        return language === 'en' ? rule.toEn(match) : rule.toVi(match);
      }
    }

    return value;
  }

  localizeValue(value: unknown, language: AppLanguage): unknown {
    if (typeof value === 'string') {
      return this.localizeText(value, language);
    }

    if (
      value == null ||
      value instanceof Date ||
      value instanceof StreamableFile ||
      Buffer.isBuffer(value) ||
      value instanceof Uint8Array
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.localizeValue(item, language));
    }

    if (this.isPlainRecord(value)) {
      const localizedRecord: Record<string, unknown> = {};

      for (const [key, item] of Object.entries(value)) {
        localizedRecord[key] = this.localizeValue(item, language);
      }

      return localizedRecord;
    }

    return value;
  }

  private isPlainRecord(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  private formatCurrency(
    rawValue: string | number,
    language: AppLanguage,
  ): string {
    const parsedValue = this.parseNumericValue(rawValue);
    if (parsedValue === null) {
      return String(rawValue);
    }

    const formatted = new Intl.NumberFormat(
      language === 'en' ? 'en-US' : 'vi-VN',
    ).format(parsedValue);

    return language === 'en' ? `${formatted} VND` : `${formatted}đ`;
  }

  private formatNumber(
    rawValue: string | number,
    language: AppLanguage,
  ): string {
    const parsedValue = this.parseNumericValue(rawValue);
    if (parsedValue === null) {
      return String(rawValue);
    }

    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'vi-VN').format(
      parsedValue,
    );
  }

  private parseNumericValue(rawValue: string | number): number | null {
    if (typeof rawValue === 'number') {
      return Number.isFinite(rawValue) ? rawValue : null;
    }

    const digitsOnly = rawValue.replace(/[^\d-]/g, '');
    if (!digitsOnly) {
      return null;
    }

    const parsedValue = Number.parseInt(digitsOnly, 10);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }
}
