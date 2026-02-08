"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ShippingController", {
    enumerable: true,
    get: function() {
        return ShippingController;
    }
});
const _common = require("@nestjs/common");
const _shippingservice = require("./shipping.service");
const _dto = require("./dto");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
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
let ShippingController = class ShippingController {
    // ===== PUBLIC ENDPOINTS =====
    // Get all active zones (public)
    async getActiveZones() {
        return this.shippingService.getActiveZones();
    }
    // Calculate shipping fee by province (public)
    async calculateFee(province, orderTotal) {
        const total = orderTotal ? parseInt(orderTotal, 10) : undefined;
        return this.shippingService.calculateFee(province, total);
    }
    // Get all provinces with zones (public)
    async getAllProvinces() {
        return this.shippingService.getAllProvinces();
    }
    // ===== ADMIN ENDPOINTS =====
    // Get all zones (admin)
    async getAllZones() {
        return this.shippingService.getAllZones();
    }
    // Get zone by ID (admin)
    async getZoneById(id) {
        return this.shippingService.getZoneById(id);
    }
    // Create zone (admin)
    async createZone(dto) {
        return this.shippingService.createZone(dto);
    }
    // Update zone (admin)
    async updateZone(id, dto) {
        return this.shippingService.updateZone(id, dto);
    }
    // Delete zone (admin)
    async deleteZone(id) {
        return this.shippingService.deleteZone(id);
    }
    // Assign provinces to zone (admin)
    async assignProvinces(id, dto) {
        return this.shippingService.assignProvinces(id, dto.provinces);
    }
    constructor(shippingService){
        this.shippingService = shippingService;
    }
};
_ts_decorate([
    (0, _common.Get)('zones'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "getActiveZones", null);
_ts_decorate([
    (0, _common.Get)('fee'),
    _ts_param(0, (0, _common.Query)('province')),
    _ts_param(1, (0, _common.Query)('orderTotal')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "calculateFee", null);
_ts_decorate([
    (0, _common.Get)('provinces'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "getAllProvinces", null);
_ts_decorate([
    (0, _common.Get)('admin/zones'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "getAllZones", null);
_ts_decorate([
    (0, _common.Get)('admin/zones/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "getZoneById", null);
_ts_decorate([
    (0, _common.Post)('admin/zones'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dto.CreateShippingZoneDto === "undefined" ? Object : _dto.CreateShippingZoneDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "createZone", null);
_ts_decorate([
    (0, _common.Patch)('admin/zones/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _dto.UpdateShippingZoneDto === "undefined" ? Object : _dto.UpdateShippingZoneDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "updateZone", null);
_ts_decorate([
    (0, _common.Delete)('admin/zones/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "deleteZone", null);
_ts_decorate([
    (0, _common.Post)('admin/zones/:id/provinces'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _dto.AssignProvincesDto === "undefined" ? Object : _dto.AssignProvincesDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ShippingController.prototype, "assignProvinces", null);
ShippingController = _ts_decorate([
    (0, _common.Controller)('shipping'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _shippingservice.ShippingService === "undefined" ? Object : _shippingservice.ShippingService
    ])
], ShippingController);

//# sourceMappingURL=shipping.controller.js.map