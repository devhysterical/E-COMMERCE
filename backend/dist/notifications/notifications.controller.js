"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationsController", {
    enumerable: true,
    get: function() {
        return NotificationsController;
    }
});
const _common = require("@nestjs/common");
const _notificationsservice = require("./notifications.service");
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
let NotificationsController = class NotificationsController {
    findAll(userId, page, limit) {
        return this.notificationsService.findAll(userId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
    }
    getUnreadCount(userId) {
        return this.notificationsService.getUnreadCount(userId);
    }
    markAsRead(id, userId) {
        return this.notificationsService.markAsRead(id, userId);
    }
    markAllAsRead(userId) {
        return this.notificationsService.markAllAsRead(userId);
    }
    constructor(notificationsService){
        this.notificationsService = notificationsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_param(1, (0, _common.Query)('page')),
    _ts_param(2, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('unread-count'),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], NotificationsController.prototype, "getUnreadCount", null);
_ts_decorate([
    (0, _common.Patch)(':id/read'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
_ts_decorate([
    (0, _common.Patch)('read-all'),
    _ts_param(0, (0, _getuserdecorator.GetUser)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
NotificationsController = _ts_decorate([
    (0, _common.Controller)('notifications'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _notificationsservice.NotificationsService === "undefined" ? Object : _notificationsservice.NotificationsService
    ])
], NotificationsController);

//# sourceMappingURL=notifications.controller.js.map