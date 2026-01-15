"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReviewsService", {
    enumerable: true,
    get: function() {
        return ReviewsService;
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
let ReviewsService = class ReviewsService {
    async create(userId, dto) {
        // Kiểm tra sản phẩm tồn tại
        const product = await this.prisma.product.findUnique({
            where: {
                id: dto.productId,
                deletedAt: null
            }
        });
        if (!product) {
            throw new _common.NotFoundException('Sản phẩm không tồn tại');
        }
        return this.prisma.review.create({
            data: {
                rating: dto.rating,
                comment: dto.comment,
                userId,
                productId: dto.productId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
    }
    async findByProduct(productId) {
        return this.prisma.review.findMany({
            where: {
                productId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findOne(id) {
        const review = await this.prisma.review.findUnique({
            where: {
                id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        if (!review) {
            throw new _common.NotFoundException('Đánh giá không tồn tại');
        }
        return review;
    }
    async update(id, userId, userRole, dto) {
        const review = await this.findOne(id);
        // Chỉ owner hoặc admin mới được sửa
        if (review.userId !== userId && userRole !== 'ADMIN') {
            throw new _common.ForbiddenException('Bạn không có quyền sửa đánh giá này');
        }
        return this.prisma.review.update({
            where: {
                id
            },
            data: dto,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
    }
    async remove(id, userId, userRole) {
        const review = await this.findOne(id);
        // Chỉ owner hoặc admin mới được xóa
        if (review.userId !== userId && userRole !== 'ADMIN') {
            throw new _common.ForbiddenException('Bạn không có quyền xóa đánh giá này');
        }
        return this.prisma.review.delete({
            where: {
                id
            }
        });
    }
    async getProductStats(productId) {
        const stats = await this.prisma.review.aggregate({
            where: {
                productId
            },
            _avg: {
                rating: true
            },
            _count: {
                rating: true
            }
        });
        return {
            averageRating: stats._avg.rating ?? 0,
            totalReviews: stats._count.rating
        };
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
ReviewsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ReviewsService);

//# sourceMappingURL=reviews.service.js.map