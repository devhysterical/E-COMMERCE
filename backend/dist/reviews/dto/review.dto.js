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
    get CreateReviewDto () {
        return CreateReviewDto;
    },
    get UpdateReviewDto () {
        return UpdateReviewDto;
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
let CreateReviewDto = class CreateReviewDto {
};
_ts_decorate([
    (0, _classvalidator.IsInt)({
        message: 'Rating phải là số nguyên'
    }),
    (0, _classvalidator.Min)(1, {
        message: 'Rating tối thiểu là 1'
    }),
    (0, _classvalidator.Max)(5, {
        message: 'Rating tối đa là 5'
    }),
    _ts_metadata("design:type", Number)
], CreateReviewDto.prototype, "rating", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateReviewDto.prototype, "comment", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'ProductId không được để trống'
    }),
    _ts_metadata("design:type", String)
], CreateReviewDto.prototype, "productId", void 0);
let UpdateReviewDto = class UpdateReviewDto {
};
_ts_decorate([
    (0, _classvalidator.IsInt)({
        message: 'Rating phải là số nguyên'
    }),
    (0, _classvalidator.Min)(1, {
        message: 'Rating tối thiểu là 1'
    }),
    (0, _classvalidator.Max)(5, {
        message: 'Rating tối đa là 5'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateReviewDto.prototype, "rating", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateReviewDto.prototype, "comment", void 0);

//# sourceMappingURL=review.dto.js.map