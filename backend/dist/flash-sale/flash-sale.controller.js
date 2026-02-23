"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlashSaleController", {
    enumerable: true,
    get: function() {
        return FlashSaleController;
    }
});
const _common = require("@nestjs/common");
const _flashsaleservice = require("./flash-sale.service");
const _createflashsaledto = require("./dto/create-flash-sale.dto");
const _updateflashsaledto = require("./dto/update-flash-sale.dto");
const _additemdto = require("./dto/add-item.dto");
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
let FlashSaleController = class FlashSaleController {
    // === Public ===
    getActive() {
        return this.flashSaleService.getActiveFlashSales();
    }
    // === Admin ===
    findAll() {
        return this.flashSaleService.findAll();
    }
    findOne(id) {
        return this.flashSaleService.findOne(id);
    }
    create(dto) {
        return this.flashSaleService.create(dto);
    }
    update(id, dto) {
        return this.flashSaleService.update(id, dto);
    }
    remove(id) {
        return this.flashSaleService.remove(id);
    }
    addItem(id, dto) {
        return this.flashSaleService.addItem(id, dto);
    }
    removeItem(id, itemId) {
        return this.flashSaleService.removeItem(id, itemId);
    }
    constructor(flashSaleService){
        this.flashSaleService = flashSaleService;
    }
};
_ts_decorate([
    (0, _common.Get)('active'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "getActive", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createflashsaledto.CreateFlashSaleDto === "undefined" ? Object : _createflashsaledto.CreateFlashSaleDto
    ]),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "create", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateflashsaledto.UpdateFlashSaleDto === "undefined" ? Object : _updateflashsaledto.UpdateFlashSaleDto
    ]),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "update", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "remove", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    (0, _common.Post)(':id/items'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _additemdto.AddFlashSaleItemDto === "undefined" ? Object : _additemdto.AddFlashSaleItemDto
    ]),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "addItem", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    (0, _common.Delete)(':id/items/:itemId'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Param)('itemId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], FlashSaleController.prototype, "removeItem", null);
FlashSaleController = _ts_decorate([
    (0, _common.Controller)('flash-sales'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _flashsaleservice.FlashSaleService === "undefined" ? Object : _flashsaleservice.FlashSaleService
    ])
], FlashSaleController);

//# sourceMappingURL=flash-sale.controller.js.map