"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContactController", {
    enumerable: true,
    get: function() {
        return ContactController;
    }
});
const _common = require("@nestjs/common");
const _throttler = require("@nestjs/throttler");
const _passport = require("@nestjs/passport");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _client = require("@prisma/client");
const _contactservice = require("./contact.service");
const _createcontactdto = require("./dto/create-contact.dto");
const _updateticketdto = require("./dto/update-ticket.dto");
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
let ContactController = class ContactController {
    create(dto) {
        return this.contactService.create(dto);
    }
    findAll(status, page, limit) {
        return this.contactService.findAll({
            status,
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined
        });
    }
    findOne(id) {
        return this.contactService.findOne(id);
    }
    updateStatus(id, dto) {
        return this.contactService.updateStatus(id, dto);
    }
    constructor(contactService){
        this.contactService = contactService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _throttler.Throttle)({
        default: {
            ttl: 60000,
            limit: 3
        }
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createcontactdto.CreateContactDto === "undefined" ? Object : _createcontactdto.CreateContactDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ContactController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt'), _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Query)('status')),
    _ts_param(1, (0, _common.Query)('page')),
    _ts_param(2, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ContactController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt'), _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ContactController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _common.UseGuards)((0, _passport.AuthGuard)('jwt'), _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateticketdto.UpdateTicketDto === "undefined" ? Object : _updateticketdto.UpdateTicketDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ContactController.prototype, "updateStatus", null);
ContactController = _ts_decorate([
    (0, _common.Controller)('contact'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _contactservice.ContactService === "undefined" ? Object : _contactservice.ContactService
    ])
], ContactController);

//# sourceMappingURL=contact.controller.js.map