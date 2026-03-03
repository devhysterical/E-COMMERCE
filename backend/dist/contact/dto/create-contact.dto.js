"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateContactDto", {
    enumerable: true,
    get: function() {
        return CreateContactDto;
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
let CreateContactDto = class CreateContactDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)({
        message: 'Họ tên phải là chuỗi'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Họ tên không được để trống'
    }),
    (0, _classvalidator.MaxLength)(100),
    _ts_metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email không hợp lệ'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email không được để trống'
    }),
    _ts_metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)({
        message: 'Chủ đề phải là chuỗi'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Chủ đề không được để trống'
    }),
    (0, _classvalidator.MaxLength)(200),
    _ts_metadata("design:type", String)
], CreateContactDto.prototype, "subject", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)({
        message: 'Nội dung phải là chuỗi'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Nội dung không được để trống'
    }),
    (0, _classvalidator.MaxLength)(2000),
    _ts_metadata("design:type", String)
], CreateContactDto.prototype, "message", void 0);

//# sourceMappingURL=create-contact.dto.js.map