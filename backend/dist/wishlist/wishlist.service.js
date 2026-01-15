"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WishlistService", {
    enumerable: true,
    get: function() {
        return WishlistService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WishlistService = class WishlistService {
    // Lấy danh sách wishlist của user
    async getWishlist(userId) {
        const items = await this.prisma.wishlistItem.findMany({
            where: {
                userId
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return items.map((item)=>({
                id: item.id,
                productId: item.productId,
                createdAt: item.createdAt,
                product: item.product
            }));
    }
    // Thêm sản phẩm vào wishlist
    async addToWishlist(userId, productId) {
        // Kiểm tra product tồn tại
        const product = await this.prisma.product.findUnique({
            where: {
                id: productId,
                deletedAt: null
            }
        });
        if (!product) {
            throw new _common.NotFoundException('Sản phẩm không tồn tại');
        }
        // Thêm vào wishlist (upsert để tránh duplicate)
        const item = await this.prisma.wishlistItem.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            update: {},
            create: {
                userId,
                productId
            },
            include: {
                product: true
            }
        });
        return item;
    }
    // Xóa sản phẩm khỏi wishlist
    async removeFromWishlist(userId, productId) {
        const item = await this.prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
        if (!item) {
            throw new _common.NotFoundException('Sản phẩm không có trong danh sách yêu thích');
        }
        await this.prisma.wishlistItem.delete({
            where: {
                id: item.id
            }
        });
        return {
            message: 'Đã xóa khỏi danh sách yêu thích'
        };
    }
    // Kiểm tra sản phẩm có trong wishlist không
    async isInWishlist(userId, productId) {
        const item = await this.prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
        return !!item;
    }
    // Toggle wishlist (thêm nếu chưa có, xóa nếu đã có)
    async toggleWishlist(userId, productId) {
        const isInWishlist = await this.isInWishlist(userId, productId);
        if (isInWishlist) {
            await this.removeFromWishlist(userId, productId);
            return {
                inWishlist: false,
                message: 'Đã xóa khỏi danh sách yêu thích'
            };
        } else {
            await this.addToWishlist(userId, productId);
            return {
                inWishlist: true,
                message: 'Đã thêm vào danh sách yêu thích'
            };
        }
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
WishlistService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], WishlistService);

//# sourceMappingURL=wishlist.service.js.map