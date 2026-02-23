"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReportsController", {
    enumerable: true,
    get: function() {
        return ReportsController;
    }
});
const _common = require("@nestjs/common");
const _reportsservice = require("./reports.service");
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
let ReportsController = class ReportsController {
    async exportOrders(startDate, endDate, res) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        const file = await this.reportsService.exportOrders(start, end);
        res?.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="orders_${Date.now()}.xlsx"`
        });
        return file;
    }
    async exportProducts(res) {
        const file = await this.reportsService.exportProducts();
        res?.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="products_inventory_${Date.now()}.xlsx"`
        });
        return file;
    }
    // ===== ANALYTICS v2 =====
    getRevenueChart(period) {
        return this.reportsService.getRevenueChart(period || '30d');
    }
    getOrderChart(period) {
        return this.reportsService.getOrderChart(period || '30d');
    }
    getTopProducts(limit) {
        return this.reportsService.getTopProducts(limit ? parseInt(limit, 10) : 10);
    }
    getTopCustomers(limit) {
        return this.reportsService.getTopCustomers(limit ? parseInt(limit, 10) : 10);
    }
    getCategoryBreakdown() {
        return this.reportsService.getCategoryBreakdown();
    }
    getConversionStats() {
        return this.reportsService.getConversionStats();
    }
    constructor(reportsService){
        this.reportsService = reportsService;
    }
};
_ts_decorate([
    (0, _common.Get)('export/orders'),
    _ts_param(0, (0, _common.Query)('startDate')),
    _ts_param(1, (0, _common.Query)('endDate')),
    _ts_param(2, (0, _common.Res)({
        passthrough: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof Response === "undefined" ? Object : Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ReportsController.prototype, "exportOrders", null);
_ts_decorate([
    (0, _common.Get)('export/products'),
    _ts_param(0, (0, _common.Res)({
        passthrough: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Response === "undefined" ? Object : Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ReportsController.prototype, "exportProducts", null);
_ts_decorate([
    (0, _common.Get)('analytics/revenue'),
    _ts_param(0, (0, _common.Query)('period')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getRevenueChart", null);
_ts_decorate([
    (0, _common.Get)('analytics/orders'),
    _ts_param(0, (0, _common.Query)('period')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getOrderChart", null);
_ts_decorate([
    (0, _common.Get)('analytics/top-products'),
    _ts_param(0, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopProducts", null);
_ts_decorate([
    (0, _common.Get)('analytics/top-customers'),
    _ts_param(0, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopCustomers", null);
_ts_decorate([
    (0, _common.Get)('analytics/categories'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getCategoryBreakdown", null);
_ts_decorate([
    (0, _common.Get)('analytics/conversion'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getConversionStats", null);
ReportsController = _ts_decorate([
    (0, _common.Controller)('reports'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _reportsservice.ReportsService === "undefined" ? Object : _reportsservice.ReportsService
    ])
], ReportsController);

//# sourceMappingURL=reports.controller.js.map