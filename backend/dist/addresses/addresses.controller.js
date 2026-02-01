"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddressesController", {
    enumerable: true,
    get: function() {
        return AddressesController;
    }
});
const _common = require("@nestjs/common");
const _addressesservice = require("./addresses.service");
const _dto = require("./dto");
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
let AddressesController = class AddressesController {
    findAll(userId) {
        return this.addressesService.findAll(userId);
    }
    findOne(id, userId) {
        return this.addressesService.findOne(id, userId);
    }
    create(userId, dto) {
        return this.addressesService.create(userId, dto);
    }
    update(id, userId, dto) {
        return this.addressesService.update(id, userId, dto);
    }
    remove(id, userId) {
        return this.addressesService.remove(id, userId);
    }
    setDefault(id, userId) {
        return this.addressesService.setDefault(id, userId);
    }
    constructor(addressesService){
        this.addressesService = addressesService;
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
], AddressesController.prototype, "findAll", null);
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
], AddressesController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _dto.CreateAddressDto === "undefined" ? Object : _dto.CreateAddressDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AddressesController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _getuserdecorator.GetUser)('userId')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _dto.UpdateAddressDto === "undefined" ? Object : _dto.UpdateAddressDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AddressesController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AddressesController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Patch)(':id/default'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AddressesController.prototype, "setDefault", null);
AddressesController = _ts_decorate([
    (0, _common.Controller)('addresses'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _addressesservice.AddressesService === "undefined" ? Object : _addressesservice.AddressesService
    ])
], AddressesController);

//# sourceMappingURL=addresses.controller.js.map