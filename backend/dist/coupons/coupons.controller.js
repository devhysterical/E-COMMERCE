"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CouponsController", {
    enumerable: true,
    get: function() {
        return CouponsController;
    }
});
const _common = require("@nestjs/common");
const _couponsservice = require("./coupons.service");
const _coupondto = require("./dto/coupon.dto");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _client = require("@prisma/client");
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
let CouponsController = class CouponsController {
    // ===== User Endpoints =====
    // GET /coupons/available - Lấy danh sách mã giảm giá khả dụng
    getAvailableCoupons() {
        return this.couponsService.getAvailableCoupons();
    }
    // POST /coupons/validate - Validate coupon code
    validateCoupon(dto, req) {
        return this.couponsService.validateCoupon(dto, req.user.userId);
    }
    // ===== Admin Endpoints =====
    // GET /coupons/admin - Lấy tất cả coupons
    findAll() {
        return this.couponsService.findAll();
    }
    // GET /coupons/admin/:id - Lấy chi tiết coupon
    findOne(id) {
        return this.couponsService.findOne(id);
    }
    // POST /coupons/admin - Tạo coupon mới
    create(dto) {
        return this.couponsService.create(dto);
    }
    // PATCH /coupons/admin/:id - Cập nhật coupon
    update(id, dto) {
        return this.couponsService.update(id, dto);
    }
    // DELETE /coupons/admin/:id - Xóa coupon
    remove(id) {
        return this.couponsService.remove(id);
    }
    constructor(couponsService){
        this.couponsService = couponsService;
    }
};
_ts_decorate([
    (0, _common.Get)('available'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], CouponsController.prototype, "getAvailableCoupons", null);
_ts_decorate([
    (0, _common.Post)('validate'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _coupondto.ValidateCouponDto === "undefined" ? Object : _coupondto.ValidateCouponDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], CouponsController.prototype, "validateCoupon", null);
_ts_decorate([
    (0, _common.Get)('admin'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], CouponsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('admin/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CouponsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)('admin'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _coupondto.CreateCouponDto === "undefined" ? Object : _coupondto.CreateCouponDto
    ]),
    _ts_metadata("design:returntype", void 0)
], CouponsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)('admin/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _coupondto.UpdateCouponDto === "undefined" ? Object : _coupondto.UpdateCouponDto
    ]),
    _ts_metadata("design:returntype", void 0)
], CouponsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)('admin/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CouponsController.prototype, "remove", null);
CouponsController = _ts_decorate([
    (0, _common.Controller)('coupons'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _couponsservice.CouponsService === "undefined" ? Object : _couponsservice.CouponsService
    ])
], CouponsController);

//# sourceMappingURL=coupons.controller.js.map