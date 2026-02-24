"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoyaltyController", {
    enumerable: true,
    get: function() {
        return LoyaltyController;
    }
});
const _common = require("@nestjs/common");
const _loyaltyservice = require("./loyalty.service");
const _redeempointsdto = require("./dto/redeem-points.dto");
const _adjustpointsdto = require("./dto/adjust-points.dto");
const _createtierdto = require("./dto/create-tier.dto");
const _updatetierdto = require("./dto/update-tier.dto");
const _createrewarddto = require("./dto/create-reward.dto");
const _updaterewarddto = require("./dto/update-reward.dto");
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
let LoyaltyController = class LoyaltyController {
    // --- User endpoints ---
    getBalance(req) {
        return this.loyaltyService.getBalance(req.user.sub);
    }
    getHistory(req) {
        return this.loyaltyService.getHistory(req.user.sub);
    }
    getActiveRewards() {
        return this.loyaltyService.getActiveRewards();
    }
    getTiers() {
        return this.loyaltyService.getAllTiers();
    }
    redeem(req, dto) {
        return this.loyaltyService.redeemPoints(req.user.sub, dto.rewardId);
    }
    // --- Admin endpoints ---
    adminGetTiers() {
        return this.loyaltyService.getAllTiers();
    }
    adminCreateTier(dto) {
        return this.loyaltyService.createTier(dto);
    }
    adminUpdateTier(id, dto) {
        return this.loyaltyService.updateTier(id, dto);
    }
    adminDeleteTier(id) {
        return this.loyaltyService.deleteTier(id);
    }
    adminGetRewards() {
        return this.loyaltyService.getAllRewards();
    }
    adminCreateReward(dto) {
        return this.loyaltyService.createReward(dto);
    }
    adminUpdateReward(id, dto) {
        return this.loyaltyService.updateReward(id, dto);
    }
    adminDeleteReward(id) {
        return this.loyaltyService.deleteReward(id);
    }
    adminAdjustPoints(dto) {
        return this.loyaltyService.adjustPoints(dto);
    }
    adminGetUsersWithPoints() {
        return this.loyaltyService.getUsersWithPoints();
    }
    constructor(loyaltyService){
        this.loyaltyService = loyaltyService;
    }
};
_ts_decorate([
    (0, _common.Get)('balance'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getBalance", null);
_ts_decorate([
    (0, _common.Get)('history'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getHistory", null);
_ts_decorate([
    (0, _common.Get)('rewards'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getActiveRewards", null);
_ts_decorate([
    (0, _common.Get)('tiers'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getTiers", null);
_ts_decorate([
    (0, _common.Post)('redeem'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _redeempointsdto.RedeemPointsDto === "undefined" ? Object : _redeempointsdto.RedeemPointsDto
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "redeem", null);
_ts_decorate([
    (0, _common.Get)('admin/tiers'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminGetTiers", null);
_ts_decorate([
    (0, _common.Post)('admin/tiers'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createtierdto.CreateTierDto === "undefined" ? Object : _createtierdto.CreateTierDto
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminCreateTier", null);
_ts_decorate([
    (0, _common.Patch)('admin/tiers/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updatetierdto.UpdateTierDto === "undefined" ? Object : _updatetierdto.UpdateTierDto
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminUpdateTier", null);
_ts_decorate([
    (0, _common.Delete)('admin/tiers/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminDeleteTier", null);
_ts_decorate([
    (0, _common.Get)('admin/rewards'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminGetRewards", null);
_ts_decorate([
    (0, _common.Post)('admin/rewards'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createrewarddto.CreateRewardDto === "undefined" ? Object : _createrewarddto.CreateRewardDto
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminCreateReward", null);
_ts_decorate([
    (0, _common.Patch)('admin/rewards/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updaterewarddto.UpdateRewardDto === "undefined" ? Object : _updaterewarddto.UpdateRewardDto
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminUpdateReward", null);
_ts_decorate([
    (0, _common.Delete)('admin/rewards/:id'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminDeleteReward", null);
_ts_decorate([
    (0, _common.Post)('admin/adjust'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adjustpointsdto.AdjustPointsDto === "undefined" ? Object : _adjustpointsdto.AdjustPointsDto
    ]),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminAdjustPoints", null);
_ts_decorate([
    (0, _common.Get)('admin/users'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], LoyaltyController.prototype, "adminGetUsersWithPoints", null);
LoyaltyController = _ts_decorate([
    (0, _common.Controller)('loyalty'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loyaltyservice.LoyaltyService === "undefined" ? Object : _loyaltyservice.LoyaltyService
    ])
], LoyaltyController);

//# sourceMappingURL=loyalty.controller.js.map