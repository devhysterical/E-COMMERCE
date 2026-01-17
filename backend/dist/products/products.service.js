"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductsService", {
    enumerable: true,
    get: function() {
        return ProductsService;
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
let ProductsService = class ProductsService {
    async create(dto) {
        return this.prisma.product.create({
            data: dto
        });
    }
    async findAll(categoryId, search, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc', minPrice, maxPrice) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...categoryId && {
                categoryId
            },
            ...search && {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            ...(minPrice !== undefined || maxPrice !== undefined) && {
                price: {
                    ...minPrice !== undefined && {
                        gte: minPrice
                    },
                    ...maxPrice !== undefined && {
                        lte: maxPrice
                    }
                }
            }
        };
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    images: {
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder
                }
            }),
            this.prisma.product.count({
                where
            })
        ]);
        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    // Search Autocomplete - gợi ý sản phẩm khi gõ
    async searchSuggest(query, limit = 5) {
        if (!query.trim()) {
            return [];
        }
        return this.prisma.product.findMany({
            where: {
                deletedAt: null,
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
            },
            take: limit,
            orderBy: {
                name: 'asc'
            }
        });
    }
    // Related Products - sản phẩm cùng category (trừ sản phẩm hiện tại)
    async getRelatedProducts(productId, limit = 4) {
        const product = await this.prisma.product.findUnique({
            where: {
                id: productId
            },
            select: {
                categoryId: true
            }
        });
        if (!product) {
            return [];
        }
        return this.prisma.product.findMany({
            where: {
                deletedAt: null,
                categoryId: product.categoryId,
                id: {
                    not: productId
                }
            },
            select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    // Low Stock Products - sản phẩm tồn kho thấp
    async getLowStockProducts(threshold = 10) {
        const products = await this.prisma.product.findMany({
            where: {
                deletedAt: null,
                stock: {
                    lte: threshold
                }
            },
            select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                imageUrl: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                stock: 'asc'
            }
        });
        return {
            products,
            total: products.length,
            threshold
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                deletedAt: null
            },
            include: {
                category: true,
                reviews: true,
                images: {
                    orderBy: {
                        sortOrder: 'asc'
                    }
                }
            }
        });
        if (!product) {
            throw new _common.NotFoundException('Không tìm thấy sản phẩm');
        }
        return product;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: {
                id
            },
            data: dto
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
    // ===== Product Images Management =====
    async addImage(productId, imageUrl, isPrimary = false) {
        await this.findOne(productId);
        // Nếu đặt làm ảnh chính, bỏ primary của các ảnh khác
        if (isPrimary) {
            await this.prisma.productImage.updateMany({
                where: {
                    productId
                },
                data: {
                    isPrimary: false
                }
            });
        }
        // Lấy sortOrder tiếp theo
        const lastImage = await this.prisma.productImage.findFirst({
            where: {
                productId
            },
            orderBy: {
                sortOrder: 'desc'
            }
        });
        const sortOrder = lastImage ? lastImage.sortOrder + 1 : 0;
        return this.prisma.productImage.create({
            data: {
                productId,
                imageUrl,
                isPrimary,
                sortOrder
            }
        });
    }
    async removeImage(productId, imageId) {
        const image = await this.prisma.productImage.findFirst({
            where: {
                id: imageId,
                productId
            }
        });
        if (!image) {
            throw new _common.NotFoundException('Ảnh không tồn tại');
        }
        await this.prisma.productImage.delete({
            where: {
                id: imageId
            }
        });
        return {
            message: 'Đã xóa ảnh'
        };
    }
    async setPrimaryImage(productId, imageId) {
        const image = await this.prisma.productImage.findFirst({
            where: {
                id: imageId,
                productId
            }
        });
        if (!image) {
            throw new _common.NotFoundException('Ảnh không tồn tại');
        }
        // Bỏ primary của tất cả ảnh
        await this.prisma.productImage.updateMany({
            where: {
                productId
            },
            data: {
                isPrimary: false
            }
        });
        // Đặt ảnh này làm primary
        return this.prisma.productImage.update({
            where: {
                id: imageId
            },
            data: {
                isPrimary: true
            }
        });
    }
    async getImages(productId) {
        await this.findOne(productId);
        return this.prisma.productImage.findMany({
            where: {
                productId
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
ProductsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ProductsService);

//# sourceMappingURL=products.service.js.map