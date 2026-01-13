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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CouponsService = class CouponsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
                isActive: dto.isActive ?? true,
            },
        });
    }
    async findAll() {
        return this.prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { usages: true, orders: true },
                },
            },
        });
    }
    async findOne(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { usages: true, orders: true },
                },
            },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Mã giảm giá không tồn tại');
        }
        return coupon;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.coupon.update({
            where: { id },
            data: {
                ...(dto.code && { code: dto.code.toUpperCase() }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.discountType && { discountType: dto.discountType }),
                ...(dto.discountValue !== undefined && {
                    discountValue: dto.discountValue,
                }),
                ...(dto.minOrderAmount !== undefined && {
                    minOrderAmount: dto.minOrderAmount,
                }),
                ...(dto.maxDiscount !== undefined && { maxDiscount: dto.maxDiscount }),
                ...(dto.maxUses !== undefined && { maxUses: dto.maxUses }),
                ...(dto.startDate && { startDate: new Date(dto.startDate) }),
                ...(dto.expiresAt && { expiresAt: new Date(dto.expiresAt) }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.coupon.delete({ where: { id } });
        return { message: 'Đã xóa mã giảm giá' };
    }
    async getAvailableCoupons() {
        const now = new Date();
        return this.prisma.coupon.findMany({
            where: {
                isActive: true,
                startDate: { lte: now },
                AND: [
                    {
                        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
                    },
                ],
            },
            select: {
                id: true,
                code: true,
                description: true,
                discountType: true,
                discountValue: true,
                minOrderAmount: true,
                maxDiscount: true,
                expiresAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async validateCoupon(dto, userId) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: dto.code.toUpperCase() },
        });
        if (!coupon) {
            throw new common_1.BadRequestException('Mã giảm giá không tồn tại');
        }
        if (!coupon.isActive) {
            throw new common_1.BadRequestException('Mã giảm giá đã bị vô hiệu hóa');
        }
        if (coupon.startDate > new Date()) {
            throw new common_1.BadRequestException('Mã giảm giá chưa có hiệu lực');
        }
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Mã giảm giá đã hết hạn');
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            throw new common_1.BadRequestException('Mã giảm giá đã hết lượt sử dụng');
        }
        if (dto.orderAmount < coupon.minOrderAmount) {
            throw new common_1.BadRequestException(`Đơn hàng tối thiểu ${coupon.minOrderAmount.toLocaleString('vi-VN')}đ`);
        }
        const existingUsage = await this.prisma.couponUsage.findUnique({
            where: {
                couponId_userId: { couponId: coupon.id, userId },
            },
        });
        if (existingUsage) {
            throw new common_1.BadRequestException('Bạn đã sử dụng mã giảm giá này rồi');
        }
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = Math.floor((dto.orderAmount * coupon.discountValue) / 100);
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        }
        else {
            discountAmount = coupon.discountValue;
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
            message: `Giảm ${discountAmount.toLocaleString('vi-VN')}đ`,
        };
    }
    async useCoupon(couponId, userId, orderId) {
        await this.prisma.coupon.update({
            where: { id: couponId },
            data: { usedCount: { increment: 1 } },
        });
        await this.prisma.couponUsage.create({
            data: {
                couponId,
                userId,
                orderId,
            },
        });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map