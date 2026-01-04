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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId, deletedAt: null },
        });
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        return this.prisma.review.create({
            data: {
                rating: dto.rating,
                comment: dto.comment,
                userId,
                productId: dto.productId,
            },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        });
    }
    async findByProduct(productId) {
        return this.prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const review = await this.prisma.review.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        });
        if (!review) {
            throw new common_1.NotFoundException('Đánh giá không tồn tại');
        }
        return review;
    }
    async update(id, userId, userRole, dto) {
        const review = await this.findOne(id);
        if (review.userId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Bạn không có quyền sửa đánh giá này');
        }
        return this.prisma.review.update({
            where: { id },
            data: dto,
            include: {
                user: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        });
    }
    async remove(id, userId, userRole) {
        const review = await this.findOne(id);
        if (review.userId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Bạn không có quyền xóa đánh giá này');
        }
        return this.prisma.review.delete({
            where: { id },
        });
    }
    async getProductStats(productId) {
        const stats = await this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        return {
            averageRating: stats._avg.rating ?? 0,
            totalReviews: stats._count.rating,
        };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map