"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWishlist(userId) {
        const items = await this.prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return items.map((item) => ({
            id: item.id,
            productId: item.productId,
            createdAt: item.createdAt,
            product: item.product,
        }));
    }
    async addToWishlist(userId, productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId, deletedAt: null },
        });
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        const item = await this.prisma.wishlistItem.upsert({
            where: {
                userId_productId: { userId, productId },
            },
            update: {},
            create: {
                userId,
                productId,
            },
            include: {
                product: true,
            },
        });
        return item;
    }
    async removeFromWishlist(userId, productId) {
        const item = await this.prisma.wishlistItem.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Sản phẩm không có trong danh sách yêu thích');
        }
        await this.prisma.wishlistItem.delete({
            where: { id: item.id },
        });
        return { message: 'Đã xóa khỏi danh sách yêu thích' };
    }
    async isInWishlist(userId, productId) {
        const item = await this.prisma.wishlistItem.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });
        return !!item;
    }
    async toggleWishlist(userId, productId) {
        const isInWishlist = await this.isInWishlist(userId, productId);
        if (isInWishlist) {
            await this.removeFromWishlist(userId, productId);
            return { inWishlist: false, message: 'Đã xóa khỏi danh sách yêu thích' };
        }
        else {
            await this.addToWishlist(userId, productId);
            return { inWishlist: true, message: 'Đã thêm vào danh sách yêu thích' };
        }
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map