"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminController", {
    enumerable: true,
    get: function() {
        return AdminController;
    }
});
const _common = require("@nestjs/common");
const _classvalidator = require("class-validator");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _usersservice = require("../users/users.service");
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
let UpdateRoleDto = class UpdateRoleDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Role không được để trống'
    }),
    (0, _classvalidator.IsIn)([
        'USER',
        'ADMIN'
    ], {
        message: 'Role phải là USER hoặc ADMIN'
    }),
    _ts_metadata("design:type", String)
], UpdateRoleDto.prototype, "role", void 0);
let AdminController = class AdminController {
    getAllUsers() {
        return this.usersService.findAll();
    }
    updateUserRole(id, dto) {
        return this.usersService.updateRole(id, dto.role);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _common.Get)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
_ts_decorate([
    (0, _common.Patch)('users/:id/role'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof UpdateRoleDto === "undefined" ? Object : UpdateRoleDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserRole", null);
AdminController = _ts_decorate([
    (0, _common.Controller)('admin'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('ADMIN'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], AdminController);

//# sourceMappingURL=admin.controller.js.map