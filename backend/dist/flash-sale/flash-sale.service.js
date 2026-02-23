"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlashSaleService", {
    enumerable: true,
    get: function() {
        return FlashSaleService;
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
let FlashSaleService = class FlashSaleService {
    async create(dto) {
        const start = new Date(dto.startTime);
        const end = new Date(dto.endTime);
        if (end <= start) {
            throw new _common.BadRequestException('endTime phải sau startTime');
        }
        return this.prisma.flashSale.create({
            data: {
                name: dto.name,
                startTime: start,
                endTime: end,
                items: {
                    create: dto.items.map((item)=>({
                            productId: item.productId,
                            salePrice: item.salePrice,
                            saleQty: item.saleQty,
                            limitPerUser: item.limitPerUser ?? 1
                        }))
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }
        });
    }
    async findAll() {
        return this.prisma.flashSale.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }
        });
    }
    async findOne(id) {
        const sale = await this.prisma.flashSale.findUnique({
            where: {
                id
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrl: true,
                                stock: true
                            }
                        }
                    }
                }
            }
        });
        if (!sale) throw new _common.NotFoundException('Flash Sale not found');
        return sale;
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = {};
        if (dto.name !== undefined) data.name = dto.name;
        if (dto.isActive !== undefined) data.isActive = dto.isActive;
        if (dto.startTime) data.startTime = new Date(dto.startTime);
        if (dto.endTime) data.endTime = new Date(dto.endTime);
        return this.prisma.flashSale.update({
            where: {
                id
            },
            data,
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.flashSale.delete({
            where: {
                id
            }
        });
    }
    async addItem(flashSaleId, dto) {
        await this.findOne(flashSaleId);
        const existing = await this.prisma.flashSaleItem.findUnique({
            where: {
                flashSaleId_productId: {
                    flashSaleId,
                    productId: dto.productId
                }
            }
        });
        if (existing) {
            throw new _common.BadRequestException('Product already in this flash sale');
        }
        return this.prisma.flashSaleItem.create({
            data: {
                flashSaleId,
                productId: dto.productId,
                salePrice: dto.salePrice,
                saleQty: dto.saleQty,
                limitPerUser: dto.limitPerUser ?? 1
            },
            include: {
                product: {
                    select: {
                        name: true,
                        price: true,
                        imageUrl: true
                    }
                }
            }
        });
    }
    async removeItem(flashSaleId, itemId) {
        const item = await this.prisma.flashSaleItem.findFirst({
            where: {
                id: itemId,
                flashSaleId
            }
        });
        if (!item) throw new _common.NotFoundException('Flash sale item not found');
        return this.prisma.flashSaleItem.delete({
            where: {
                id: itemId
            }
        });
    }
    async getActiveFlashSales() {
        const now = new Date();
        return this.prisma.flashSale.findMany({
            where: {
                isActive: true,
                startTime: {
                    lte: now
                },
                endTime: {
                    gte: now
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrl: true,
                                stock: true
                            }
                        }
                    }
                }
            }
        });
    }
    async checkFlashSalePrice(productId, userId) {
        const now = new Date();
        const flashSaleItem = await this.prisma.flashSaleItem.findFirst({
            where: {
                productId,
                flashSale: {
                    isActive: true,
                    startTime: {
                        lte: now
                    },
                    endTime: {
                        gte: now
                    }
                }
            },
            include: {
                flashSale: {
                    select: {
                        startTime: true
                    }
                }
            }
        });
        if (!flashSaleItem) return null;
        // Check stock availability
        if (flashSaleItem.soldQty >= flashSaleItem.saleQty) return null;
        // Check user purchase limit during this flash sale
        const userPurchaseCount = await this.prisma.orderItem.count({
            where: {
                productId,
                order: {
                    userId,
                    status: {
                        notIn: [
                            'CANCELLED'
                        ]
                    },
                    createdAt: {
                        gte: flashSaleItem.flashSale.startTime
                    }
                }
            }
        });
        if (userPurchaseCount >= flashSaleItem.limitPerUser) return null;
        return {
            salePrice: flashSaleItem.salePrice,
            flashSaleItemId: flashSaleItem.id
        };
    }
    async incrementSoldQty(flashSaleItemId, qty) {
        return this.prisma.flashSaleItem.update({
            where: {
                id: flashSaleItemId
            },
            data: {
                soldQty: {
                    increment: qty
                }
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
FlashSaleService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], FlashSaleService);

//# sourceMappingURL=flash-sale.service.js.map