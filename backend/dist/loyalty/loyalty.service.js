"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoyaltyService", {
    enumerable: true,
    get: function() {
        return LoyaltyService;
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
let LoyaltyService = class LoyaltyService {
    // --- Points Logic ---
    async earnPoints(userId, orderId, amount) {
        const tier = await this.getTier(userId);
        const multiplier = tier?.pointMultiplier ?? 1.0;
        const points = Math.floor(amount / 1000 * multiplier);
        if (points <= 0) return;
        // Check if points already earned for this order
        const existing = await this.prisma.pointTransaction.findFirst({
            where: {
                userId,
                orderId,
                type: 'EARN'
            }
        });
        if (existing) return;
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 12);
        await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    userId,
                    type: 'EARN',
                    points,
                    description: `Tích điểm đơn hàng #${orderId.slice(0, 8)}`,
                    orderId,
                    expiresAt
                }
            }),
            this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    totalPoints: {
                        increment: points
                    }
                }
            })
        ]);
        return {
            points,
            newTotal: (await this.getBalance(userId)).totalPoints
        };
    }
    async redeemPoints(userId, rewardId) {
        const reward = await this.prisma.pointReward.findUnique({
            where: {
                id: rewardId
            }
        });
        if (!reward) throw new _common.NotFoundException('Phần thưởng không tồn tại');
        if (!reward.isActive) throw new _common.BadRequestException('Phần thưởng đã ngừng hoạt động');
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new _common.NotFoundException('Người dùng không tồn tại');
        if (user.totalPoints < reward.pointsCost) throw new _common.BadRequestException(`Không đủ điểm. Cần ${reward.pointsCost}, hiện có ${user.totalPoints}`);
        // Generate unique coupon code
        const couponCode = `LOYALTY-${Date.now().toString(36).toUpperCase()}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const result = await this.prisma.$transaction(async (tx)=>{
            // Deduct points
            await tx.user.update({
                where: {
                    id: userId
                },
                data: {
                    totalPoints: {
                        decrement: reward.pointsCost
                    }
                }
            });
            // Create point transaction
            await tx.pointTransaction.create({
                data: {
                    userId,
                    type: 'REDEEM',
                    points: -reward.pointsCost,
                    description: `Đổi điểm: ${reward.name}`
                }
            });
            // Create coupon
            const coupon = await tx.coupon.create({
                data: {
                    code: couponCode,
                    description: `Loyalty Reward: ${reward.name}`,
                    discountType: reward.rewardType === 'FREE_SHIPPING' ? 'FIXED' : 'FIXED',
                    discountValue: reward.couponValue ?? 0,
                    minOrderAmount: 0,
                    maxUses: 1,
                    startDate: new Date(),
                    expiresAt,
                    isActive: true
                }
            });
            return coupon;
        });
        return {
            couponCode: result.code,
            pointsUsed: reward.pointsCost,
            remainingPoints: user.totalPoints - reward.pointsCost
        };
    }
    async getBalance(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                totalPoints: true
            }
        });
        if (!user) throw new _common.NotFoundException('Người dùng không tồn tại');
        const tier = await this.getTier(userId);
        return {
            totalPoints: user.totalPoints,
            tier: tier ? {
                name: tier.name,
                multiplier: tier.pointMultiplier
            } : null
        };
    }
    async getTier(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                totalPoints: true
            }
        });
        if (!user) return null;
        return this.prisma.loyaltyTier.findFirst({
            where: {
                minPoints: {
                    lte: user.totalPoints
                }
            },
            orderBy: {
                minPoints: 'desc'
            }
        });
    }
    async getHistory(userId) {
        return this.prisma.pointTransaction.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });
    }
    async adjustPoints(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: dto.userId
            }
        });
        if (!user) throw new _common.NotFoundException('Người dùng không tồn tại');
        await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
                data: {
                    userId: dto.userId,
                    type: 'ADJUST',
                    points: dto.points,
                    description: dto.description
                }
            }),
            this.prisma.user.update({
                where: {
                    id: dto.userId
                },
                data: {
                    totalPoints: {
                        increment: dto.points
                    }
                }
            })
        ]);
        return {
            newTotal: user.totalPoints + dto.points
        };
    }
    // --- Tiers CRUD ---
    async getAllTiers() {
        return this.prisma.loyaltyTier.findMany({
            orderBy: {
                minPoints: 'asc'
            }
        });
    }
    async createTier(dto) {
        return this.prisma.loyaltyTier.create({
            data: {
                name: dto.name,
                minPoints: dto.minPoints,
                pointMultiplier: dto.pointMultiplier ?? 1.0,
                benefits: dto.benefits
            }
        });
    }
    async updateTier(id, dto) {
        return this.prisma.loyaltyTier.update({
            where: {
                id
            },
            data: dto
        });
    }
    async deleteTier(id) {
        return this.prisma.loyaltyTier.delete({
            where: {
                id
            }
        });
    }
    // --- Rewards CRUD ---
    async getAllRewards() {
        return this.prisma.pointReward.findMany({
            orderBy: {
                pointsCost: 'asc'
            }
        });
    }
    async getActiveRewards() {
        return this.prisma.pointReward.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                pointsCost: 'asc'
            }
        });
    }
    async createReward(dto) {
        return this.prisma.pointReward.create({
            data: {
                name: dto.name,
                pointsCost: dto.pointsCost,
                rewardType: dto.rewardType,
                couponValue: dto.couponValue,
                isActive: dto.isActive ?? true
            }
        });
    }
    async updateReward(id, dto) {
        return this.prisma.pointReward.update({
            where: {
                id
            },
            data: dto
        });
    }
    async deleteReward(id) {
        return this.prisma.pointReward.delete({
            where: {
                id
            }
        });
    }
    // --- Admin: Users with points ---
    async getUsersWithPoints() {
        return this.prisma.user.findMany({
            where: {
                totalPoints: {
                    gt: 0
                }
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                totalPoints: true
            },
            orderBy: {
                totalPoints: 'desc'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
LoyaltyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], LoyaltyService);

//# sourceMappingURL=loyalty.service.js.map