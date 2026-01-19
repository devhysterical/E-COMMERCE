"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReviewsController", {
    enumerable: true,
    get: function() {
        return ReviewsController;
    }
});
const _common = require("@nestjs/common");
const _reviewsservice = require("./reviews.service");
const _reviewdto = require("./dto/review.dto");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ReviewsController = class ReviewsController {
    create(req, dto) {
        return this.reviewsService.create(req.user.userId, dto);
    }
    findByProduct(productId) {
        return this.reviewsService.findByProduct(productId);
    }
    getProductStats(productId) {
        return this.reviewsService.getProductStats(productId);
    }
    findOne(id) {
        return this.reviewsService.findOne(id);
    }
    update(id, req, dto) {
        return this.reviewsService.update(id, req.user.userId, req.user.role, dto);
    }
    remove(id, req) {
        return this.reviewsService.remove(id, req.user.userId, req.user.role);
    }
    constructor(reviewsService){
        this.reviewsService = reviewsService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _reviewdto.CreateReviewDto === "undefined" ? Object : _reviewdto.CreateReviewDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ReviewsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)('product/:productId'),
    _ts_param(0, (0, _common.Param)('productId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReviewsController.prototype, "findByProduct", null);
_ts_decorate([
    (0, _common.Get)('product/:productId/stats'),
    _ts_param(0, (0, _common.Param)('productId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReviewsController.prototype, "getProductStats", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReviewsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof _reviewdto.UpdateReviewDto === "undefined" ? Object : _reviewdto.UpdateReviewDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ReviewsController.prototype, "update", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ReviewsController.prototype, "remove", null);
ReviewsController = _ts_decorate([
    (0, _common.Controller)('reviews'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _reviewsservice.ReviewsService === "undefined" ? Object : _reviewsservice.ReviewsService
    ])
], ReviewsController);

//# sourceMappingURL=reviews.controller.js.map