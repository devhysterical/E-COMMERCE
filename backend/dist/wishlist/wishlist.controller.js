"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WishlistController", {
    enumerable: true,
    get: function() {
        return WishlistController;
    }
});
const _common = require("@nestjs/common");
const _wishlistservice = require("./wishlist.service");
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
let WishlistController = class WishlistController {
    // GET /wishlist - Lấy danh sách wishlist
    getWishlist(req) {
        return this.wishlistService.getWishlist(req.user.userId);
    }
    // POST /wishlist/:productId - Thêm vào wishlist
    addToWishlist(req, productId) {
        return this.wishlistService.addToWishlist(req.user.userId, productId);
    }
    // DELETE /wishlist/:productId - Xóa khỏi wishlist
    removeFromWishlist(req, productId) {
        return this.wishlistService.removeFromWishlist(req.user.userId, productId);
    }
    // POST /wishlist/:productId/toggle - Toggle wishlist
    toggleWishlist(req, productId) {
        return this.wishlistService.toggleWishlist(req.user.userId, productId);
    }
    // GET /wishlist/:productId/check - Kiểm tra sản phẩm có trong wishlist
    async checkWishlist(req, productId) {
        const inWishlist = await this.wishlistService.isInWishlist(req.user.userId, productId);
        return {
            inWishlist
        };
    }
    constructor(wishlistService){
        this.wishlistService = wishlistService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], WishlistController.prototype, "getWishlist", null);
_ts_decorate([
    (0, _common.Post)(':productId'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('productId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], WishlistController.prototype, "addToWishlist", null);
_ts_decorate([
    (0, _common.Delete)(':productId'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('productId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], WishlistController.prototype, "removeFromWishlist", null);
_ts_decorate([
    (0, _common.Post)(':productId/toggle'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('productId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], WishlistController.prototype, "toggleWishlist", null);
_ts_decorate([
    (0, _common.Get)(':productId/check'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('productId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WishlistController.prototype, "checkWishlist", null);
WishlistController = _ts_decorate([
    (0, _common.Controller)('wishlist'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _wishlistservice.WishlistService === "undefined" ? Object : _wishlistservice.WishlistService
    ])
], WishlistController);

//# sourceMappingURL=wishlist.controller.js.map