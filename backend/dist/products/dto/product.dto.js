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
    get CreateProductDto () {
        return CreateProductDto;
    },
    get UpdateProductDto () {
        return UpdateProductDto;
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
let CreateProductDto = class CreateProductDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Tên sản phẩm không được để trống'
    }),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)({
        message: 'Giá phải là số nguyên'
    }),
    (0, _classvalidator.Min)(0, {
        message: 'Giá không được nhỏ hơn 0'
    }),
    _ts_metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "imageUrl", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'CategoryId không được để trống'
    }),
    _ts_metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
let UpdateProductDto = class UpdateProductDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], UpdateProductDto.prototype, "stock", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProductDto.prototype, "imageUrl", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProductDto.prototype, "categoryId", void 0);

//# sourceMappingURL=product.dto.js.map