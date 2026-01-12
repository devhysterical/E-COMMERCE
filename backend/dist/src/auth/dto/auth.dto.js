"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.LoginDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
    email;
    password;
    fullName;
    otp;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu không được để trống' }),
    (0, class_validator_1.MinLength)(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
    (0, class_validator_1.MaxLength)(16, { message: 'Mật khẩu không được quá 16 ký tự' }),
    (0, class_validator_1.Matches)(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa' }),
    (0, class_validator_1.Matches)(/[a-z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ thường' }),
    (0, class_validator_1.Matches)(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất 1 số' }),
    (0, class_validator_1.Matches)(/[!@#$%^&*(),.?":{}|<>]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên không được để trống' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã OTP không được để trống' }),
    (0, class_validator_1.Length)(6, 6, { message: 'Mã OTP phải có 6 ký tự' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "otp", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu không được để trống' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class ForgotPasswordDto {
    email;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
    token;
    newPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Token không được để trống' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu không được để trống' }),
    (0, class_validator_1.MinLength)(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
    (0, class_validator_1.MaxLength)(16, { message: 'Mật khẩu không được quá 16 ký tự' }),
    (0, class_validator_1.Matches)(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa' }),
    (0, class_validator_1.Matches)(/[a-z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ thường' }),
    (0, class_validator_1.Matches)(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất 1 số' }),
    (0, class_validator_1.Matches)(/[!@#$%^&*(),.?":{}|<>]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
    }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class GoogleAuthDto {
    accessToken;
}
exports.GoogleAuthDto = GoogleAuthDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Access token không được để trống' }),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "accessToken", void 0);
//# sourceMappingURL=auth.dto.js.map