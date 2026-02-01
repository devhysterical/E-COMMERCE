"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateAddressDto", {
    enumerable: true,
    get: function() {
        return CreateAddressDto;
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
let CreateAddressDto = class CreateAddressDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(1),
    _ts_metadata("design:type", String)
], CreateAddressDto.prototype, "label", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(1),
    _ts_metadata("design:type", String)
], CreateAddressDto.prototype, "fullName", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(1),
    _ts_metadata("design:type", String)
], CreateAddressDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(1),
    _ts_metadata("design:type", String)
], CreateAddressDto.prototype, "province", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(1),
    _ts_metadata("design:type", String)
], CreateAddressDto.prototype, "district", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateAddressDto.prototype, "ward", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(1),
    _ts_metadata("design:type", String)
], CreateAddressDto.prototype, "street", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateAddressDto.prototype, "isDefault", void 0);

//# sourceMappingURL=create-address.dto.js.map