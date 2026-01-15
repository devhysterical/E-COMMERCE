"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductsController", {
    enumerable: true,
    get: function() {
        return ProductsController;
    }
});
const _common = require("@nestjs/common");
const _productsservice = require("./products.service");
const _productdto = require("./dto/product.dto");
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
let ProductsController = class ProductsController {
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    findAll(categoryId, search, page, limit, sortBy, sortOrder, minPrice, maxPrice) {
        return this.productsService.findAll(categoryId, search, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 12, sortBy || 'createdAt', sortOrder || 'desc', minPrice ? parseInt(minPrice, 10) : undefined, maxPrice ? parseInt(maxPrice, 10) : undefined);
    }
    // Search Autocomplete - gợi ý khi gõ tìm kiếm
    searchSuggest(query, limit) {
        return this.productsService.searchSuggest(query || '', limit ? parseInt(limit, 10) : 5);
    }
    // Related Products - sản phẩm cùng category
    getRelated(id, limit) {
        return this.productsService.getRelatedProducts(id, limit ? parseInt(limit, 10) : 4);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
    // ===== Product Images Endpoints =====
    getImages(id) {
        return this.productsService.getImages(id);
    }
    addImage(id, body) {
        return this.productsService.addImage(id, body.imageUrl, body.isPrimary);
    }
    removeImage(id, imageId) {
        return this.productsService.removeImage(id, imageId);
    }
    setPrimaryImage(id, imageId) {
        return this.productsService.setPrimaryImage(id, imageId);
    }
    constructor(productsService){
        this.productsService = productsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productdto.CreateProductDto === "undefined" ? Object : _productdto.CreateProductDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('categoryId')),
    _ts_param(1, (0, _common.Query)('search')),
    _ts_param(2, (0, _common.Query)('page')),
    _ts_param(3, (0, _common.Query)('limit')),
    _ts_param(4, (0, _common.Query)('sortBy')),
    _ts_param(5, (0, _common.Query)('sortOrder')),
    _ts_param(6, (0, _common.Query)('minPrice')),
    _ts_param(7, (0, _common.Query)('maxPrice')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('search/suggest'),
    _ts_param(0, (0, _common.Query)('q')),
    _ts_param(1, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "searchSuggest", null);
_ts_decorate([
    (0, _common.Get)('related/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getRelated", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _productdto.UpdateProductDto === "undefined" ? Object : _productdto.UpdateProductDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Get)(':id/images'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getImages", null);
_ts_decorate([
    (0, _common.Post)(':id/images'),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "addImage", null);
_ts_decorate([
    (0, _common.Delete)(':id/images/:imageId'),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Param)('imageId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "removeImage", null);
_ts_decorate([
    (0, _common.Patch)(':id/images/:imageId/primary'),
    (0, _rolesdecorator.Roles)(_client.Role.ADMIN),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Param)('imageId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "setPrimaryImage", null);
ProductsController = _ts_decorate([
    (0, _common.Controller)('products'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService
    ])
], ProductsController);

//# sourceMappingURL=products.controller.js.map