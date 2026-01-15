"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ForgotPasswordDto () {
        return ForgotPasswordDto;
    },
    get GoogleAuthDto () {
        return GoogleAuthDto;
    },
    get LoginDto () {
        return LoginDto;
    },
    get RegisterDto () {
        return RegisterDto;
    },
    get ResetPasswordDto () {
        return ResetPasswordDto;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RegisterDto = class RegisterDto {
};
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email không hợp lệ'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email không được để trống'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Mật khẩu không được để trống'
    }),
    (0, _classvalidator.MinLength)(8, {
        message: 'Mật khẩu phải có ít nhất 8 ký tự'
    }),
    (0, _classvalidator.MaxLength)(16, {
        message: 'Mật khẩu không được quá 16 ký tự'
    }),
    (0, _classvalidator.Matches)(/[A-Z]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa'
    }),
    (0, _classvalidator.Matches)(/[a-z]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 chữ thường'
    }),
    (0, _classvalidator.Matches)(/[0-9]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 số'
    }),
    (0, _classvalidator.Matches)(/[!@#$%^&*(),.?":{}|<>]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Tên không được để trống'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Mã OTP không được để trống'
    }),
    (0, _classvalidator.Length)(6, 6, {
        message: 'Mã OTP phải có 6 ký tự'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "otp", void 0);
let LoginDto = class LoginDto {
};
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email không hợp lệ'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email không được để trống'
    }),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Mật khẩu không được để trống'
    }),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let ForgotPasswordDto = class ForgotPasswordDto {
};
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email không hợp lệ'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email không được để trống'
    }),
    _ts_metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
let ResetPasswordDto = class ResetPasswordDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Token không được để trống'
    }),
    _ts_metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Mật khẩu không được để trống'
    }),
    (0, _classvalidator.MinLength)(8, {
        message: 'Mật khẩu phải có ít nhất 8 ký tự'
    }),
    (0, _classvalidator.MaxLength)(16, {
        message: 'Mật khẩu không được quá 16 ký tự'
    }),
    (0, _classvalidator.Matches)(/[A-Z]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa'
    }),
    (0, _classvalidator.Matches)(/[a-z]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 chữ thường'
    }),
    (0, _classvalidator.Matches)(/[0-9]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 số'
    }),
    (0, _classvalidator.Matches)(/[!@#$%^&*(),.?":{}|<>]/, {
        message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'
    }),
    _ts_metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
let GoogleAuthDto = class GoogleAuthDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Access token không được để trống'
    }),
    _ts_metadata("design:type", String)
], GoogleAuthDto.prototype, "accessToken", void 0);

//# sourceMappingURL=auth.dto.js.map