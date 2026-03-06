"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CreateNotificationDto () {
        return CreateNotificationDto;
    },
    get QueryNotificationDto () {
        return QueryNotificationDto;
    }
});
const _classvalidator = require("class-validator");
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
let CreateNotificationDto = class CreateNotificationDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateNotificationDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_client.NotificationType),
    _ts_metadata("design:type", typeof _client.NotificationType === "undefined" ? Object : _client.NotificationType)
], CreateNotificationDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], CreateNotificationDto.prototype, "metadata", void 0);
let QueryNotificationDto = class QueryNotificationDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], QueryNotificationDto.prototype, "page", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], QueryNotificationDto.prototype, "limit", void 0);

//# sourceMappingURL=notification.dto.js.map