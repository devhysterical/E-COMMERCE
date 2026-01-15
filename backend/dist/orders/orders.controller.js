"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrdersController", {
    enumerable: true,
    get: function() {
        return OrdersController;
    }
});
const _common = require("@nestjs/common");
const _ordersservice = require("./orders.service");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _getuserdecorator = require("../common/decorators/get-user.decorator");
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
let OrdersController = class OrdersController {
    createOrder(userId, dto) {
        return this.ordersService.createOrder(userId, dto.address, dto.phone, dto.paymentMethod || 'COD', dto.couponId);
    }
    findAll(userId) {
        return this.ordersService.findAll(userId);
    }
    findOne(id, userId) {
        return this.ordersService.findOne(id, userId);
    }
    // Admin APIs
    findAllAdmin() {
        return this.ordersService.findAllAdmin();
    }
    getStats() {
        return this.ordersService.getStats();
    }
    updateStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto.status);
    }
    constructor(ordersService){
        this.ordersService = ordersService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], OrdersController.prototype, "createOrder", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Get)('admin/all'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], OrdersController.prototype, "findAllAdmin", null);
_ts_decorate([
    (0, _common.Get)('admin/stats'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], OrdersController.prototype, "getStats", null);
_ts_decorate([
    (0, _common.Patch)('admin/:id/status'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
OrdersController = _ts_decorate([
    (0, _common.Controller)('orders'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ordersservice.OrdersService === "undefined" ? Object : _ordersservice.OrdersService
    ])
], OrdersController);

//# sourceMappingURL=orders.controller.js.map