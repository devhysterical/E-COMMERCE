"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersController", {
    enumerable: true,
    get: function() {
        return UsersController;
    }
});
const _common = require("@nestjs/common");
const _usersservice = require("./users.service");
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
let UsersController = class UsersController {
    getProfile(req) {
        return this.usersService.getProfile(req.user.userId);
    }
    updateProfile(req, dto) {
        return this.usersService.updateProfile(req.user.userId, dto);
    }
    changePassword(req, dto) {
        return this.usersService.changePassword(req.user.userId, dto);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('profile'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Patch)('profile'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof UpdateProfileDto === "undefined" ? Object : UpdateProfileDto
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Patch)('change-password'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof ChangePasswordDto === "undefined" ? Object : ChangePasswordDto
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "changePassword", null);
UsersController = _ts_decorate([
    (0, _common.Controller)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map