"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CartsController", {
    enumerable: true,
    get: function() {
        return CartsController;
    }
});
const _common = require("@nestjs/common");
const _cartsservice = require("./carts.service");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
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
let CartsController = class CartsController {
    getCart(userId) {
        return this.cartsService.getCart(userId);
    }
    async addToCart(userId, dto) {
        return this.cartsService.addToCart(userId, dto.productId, dto.quantity);
    }
    updateQuantity(itemId, quantity) {
        return this.cartsService.updateQuantity(itemId, quantity);
    }
    removeItem(itemId) {
        return this.cartsService.removeItem(itemId);
    }
    constructor(cartsService){
        this.cartsService = cartsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CartsController.prototype, "getCart", null);
_ts_decorate([
    (0, _common.Post)('add'),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CartsController.prototype, "addToCart", null);
_ts_decorate([
    (0, _common.Patch)('item/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)('quantity')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], CartsController.prototype, "updateQuantity", null);
_ts_decorate([
    (0, _common.Delete)('item/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CartsController.prototype, "removeItem", null);
CartsController = _ts_decorate([
    (0, _common.Controller)('carts'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cartsservice.CartsService === "undefined" ? Object : _cartsservice.CartsService
    ])
], CartsController);

//# sourceMappingURL=carts.controller.js.map