"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BannersController", {
    enumerable: true,
    get: function() {
        return BannersController;
    }
});
const _common = require("@nestjs/common");
const _bannersservice = require("./banners.service");
const _bannerdto = require("./dto/banner.dto");
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
let BannersController = class BannersController {
    // Public: Lấy danh sách banners đang active (không cần auth)
    findAllActive() {
        return this.bannersService.findAllActive();
    }
    // Admin APIs
    findAll() {
        return this.bannersService.findAll();
    }
    findOne(id) {
        return this.bannersService.findOne(id);
    }
    create(createBannerDto) {
        return this.bannersService.create(createBannerDto);
    }
    update(id, updateBannerDto) {
        return this.bannersService.update(id, updateBannerDto);
    }
    remove(id) {
        return this.bannersService.remove(id);
    }
    constructor(bannersService){
        this.bannersService = bannersService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], BannersController.prototype, "findAllActive", null);
_ts_decorate([
    (0, _common.Get)('admin/all'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], BannersController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('admin/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], BannersController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)('admin'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _bannerdto.CreateBannerDto === "undefined" ? Object : _bannerdto.CreateBannerDto
    ]),
    _ts_metadata("design:returntype", void 0)
], BannersController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)('admin/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _bannerdto.UpdateBannerDto === "undefined" ? Object : _bannerdto.UpdateBannerDto
    ]),
    _ts_metadata("design:returntype", void 0)
], BannersController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)('admin/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], BannersController.prototype, "remove", null);
BannersController = _ts_decorate([
    (0, _common.Controller)('banners'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _bannersservice.BannersService === "undefined" ? Object : _bannersservice.BannersService
    ])
], BannersController);

//# sourceMappingURL=banners.controller.js.map