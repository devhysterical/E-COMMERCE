"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CouponsService", {
    enumerable: true,
    get: function() {
        return CouponsService;
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
let CouponsService = class CouponsService {
    // Admin: Tạo coupon mới
    async create(dto) {
        return this.prisma.coupon.create({
            data: {
                code: dto.code.toUpperCase(),
                description: dto.description,
                discountType: dto.discountType,
                discountValue: dto.discountValue,
                minOrderAmount: dto.minOrderAmount || 0,
                maxDiscount: dto.maxDiscount,
                maxUses: dto.maxUses,
                startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
                isActive: dto.isActive ?? true
            }
        });
    }
    // Admin: Lấy tất cả coupons
    async findAll() {
        return this.prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: {
                        usages: true,
                        orders: true
                    }
                }
            }
        });
    }
    // Admin: Lấy chi tiết coupon
    async findOne(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: {
                id
            },
            include: {
                _count: {
                    select: {
                        usages: true,
                        orders: true
                    }
                }
            }
        });
        if (!coupon) {
            throw new _common.NotFoundException('Mã giảm giá không tồn tại');
        }
        return coupon;
    }
    // Admin: Cập nhật coupon
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.coupon.update({
            where: {
                id
            },
            data: {
                ...dto.code && {
                    code: dto.code.toUpperCase()
                },
                ...dto.description !== undefined && {
                    description: dto.description
                },
                ...dto.discountType && {
                    discountType: dto.discountType
                },
                ...dto.discountValue !== undefined && {
                    discountValue: dto.discountValue
                },
                ...dto.minOrderAmount !== undefined && {
                    minOrderAmount: dto.minOrderAmount
                },
                ...dto.maxDiscount !== undefined && {
                    maxDiscount: dto.maxDiscount
                },
                ...dto.maxUses !== undefined && {
                    maxUses: dto.maxUses
                },
                ...dto.startDate && {
                    startDate: new Date(dto.startDate)
                },
                ...dto.expiresAt && {
                    expiresAt: new Date(dto.expiresAt)
                },
                ...dto.isActive !== undefined && {
                    isActive: dto.isActive
                }
            }
        });
    }
    // Admin: Xóa coupon
    async remove(id) {
        await this.findOne(id);
        await this.prisma.coupon.delete({
            where: {
                id
            }
        });
        return {
            message: 'Đã xóa mã giảm giá'
        };
    }
    // User: Lấy danh sách mã giảm giá khả dụng
    async getAvailableCoupons() {
        const now = new Date();
        return this.prisma.coupon.findMany({
            where: {
                isActive: true,
                startDate: {
                    lte: now
                },
                AND: [
                    {
                        OR: [
                            {
                                expiresAt: null
                            },
                            {
                                expiresAt: {
                                    gt: now
                                }
                            }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                code: true,
                description: true,
                discountType: true,
                discountValue: true,
                minOrderAmount: true,
                maxDiscount: true,
                expiresAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    // User: Validate và tính discount
    async validateCoupon(dto, userId) {
        const coupon = await this.prisma.coupon.findUnique({
            where: {
                code: dto.code.toUpperCase()
            }
        });
        if (!coupon) {
            throw new _common.BadRequestException('Mã giảm giá không tồn tại');
        }
        // Kiểm tra coupon còn active không
        if (!coupon.isActive) {
            throw new _common.BadRequestException('Mã giảm giá đã bị vô hiệu hóa');
        }
        // Kiểm tra ngày bắt đầu
        if (coupon.startDate > new Date()) {
            throw new _common.BadRequestException('Mã giảm giá chưa có hiệu lực');
        }
        // Kiểm tra ngày hết hạn
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            throw new _common.BadRequestException('Mã giảm giá đã hết hạn');
        }
        // Kiểm tra số lần sử dụng tối đa
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            throw new _common.BadRequestException('Mã giảm giá đã hết lượt sử dụng');
        }
        // Kiểm tra đơn hàng tối thiểu
        if (dto.orderAmount < coupon.minOrderAmount) {
            throw new _common.BadRequestException(`Đơn hàng tối thiểu ${coupon.minOrderAmount.toLocaleString('vi-VN')}đ`);
        }
        // Kiểm tra user đã dùng coupon này chưa
        const existingUsage = await this.prisma.couponUsage.findUnique({
            where: {
                couponId_userId: {
                    couponId: coupon.id,
                    userId
                }
            }
        });
        if (existingUsage) {
            throw new _common.BadRequestException('Bạn đã sử dụng mã giảm giá này rồi');
        }
        // Tính số tiền giảm giá
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = Math.floor(dto.orderAmount * coupon.discountValue / 100);
            // Áp dụng maxDiscount nếu có
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            // FIXED
            discountAmount = coupon.discountValue;
            // Không giảm quá giá trị đơn hàng
            if (discountAmount > dto.orderAmount) {
                discountAmount = dto.orderAmount;
            }
        }
        return {
            valid: true,
            couponId: coupon.id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
            message: `Giảm ${discountAmount.toLocaleString('vi-VN')}đ`
        };
    }
    // Internal: Sử dụng coupon khi checkout
    async useCoupon(couponId, userId, orderId) {
        // Tăng usedCount
        await this.prisma.coupon.update({
            where: {
                id: couponId
            },
            data: {
                usedCount: {
                    increment: 1
                }
            }
        });
        // Tạo usage record
        await this.prisma.couponUsage.create({
            data: {
                couponId,
                userId,
                orderId
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
CouponsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CouponsService);

//# sourceMappingURL=coupons.service.js.map