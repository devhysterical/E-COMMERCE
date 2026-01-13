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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.product.create({
            data: dto,
        });
    }
    async findAll(categoryId, search, page = 1, limit = 12) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(categoryId && { categoryId }),
            ...(search && {
                name: { contains: search, mode: 'insensitive' },
            }),
        };
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
            include: {
                category: true,
                reviews: true,
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm');
        }
        return product;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async addImage(productId, imageUrl, isPrimary = false) {
        await this.findOne(productId);
        if (isPrimary) {
            await this.prisma.productImage.updateMany({
                where: { productId },
                data: { isPrimary: false },
            });
        }
        const lastImage = await this.prisma.productImage.findFirst({
            where: { productId },
            orderBy: { sortOrder: 'desc' },
        });
        const sortOrder = lastImage ? lastImage.sortOrder + 1 : 0;
        return this.prisma.productImage.create({
            data: {
                productId,
                imageUrl,
                isPrimary,
                sortOrder,
            },
        });
    }
    async removeImage(productId, imageId) {
        const image = await this.prisma.productImage.findFirst({
            where: { id: imageId, productId },
        });
        if (!image) {
            throw new common_1.NotFoundException('Ảnh không tồn tại');
        }
        await this.prisma.productImage.delete({
            where: { id: imageId },
        });
        return { message: 'Đã xóa ảnh' };
    }
    async setPrimaryImage(productId, imageId) {
        const image = await this.prisma.productImage.findFirst({
            where: { id: imageId, productId },
        });
        if (!image) {
            throw new common_1.NotFoundException('Ảnh không tồn tại');
        }
        await this.prisma.productImage.updateMany({
            where: { productId },
            data: { isPrimary: false },
        });
        return this.prisma.productImage.update({
            where: { id: imageId },
            data: { isPrimary: true },
        });
    }
    async getImages(productId) {
        await this.findOne(productId);
        return this.prisma.productImage.findMany({
            where: { productId },
            orderBy: { sortOrder: 'asc' },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map