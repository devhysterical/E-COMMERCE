import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
export declare class CouponsController {
    private couponsService;
    constructor(couponsService: CouponsService);
    getAvailableCoupons(): Promise<{
        id: string;
        description: string | null;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderAmount: number;
        maxDiscount: number | null;
        expiresAt: Date | null;
    }[]>;
    validateCoupon(dto: ValidateCouponDto, req: {
        user: {
            userId: string;
        };
    }): Promise<{
        valid: boolean;
        couponId: string;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: number;
        discountAmount: number;
        message: string;
    }>;
    findAll(): Promise<({
        _count: {
            orders: number;
            usages: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderAmount: number;
        maxDiscount: number | null;
        maxUses: number | null;
        usedCount: number;
        startDate: Date;
        expiresAt: Date | null;
        isActive: boolean;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            orders: number;
            usages: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderAmount: number;
        maxDiscount: number | null;
        maxUses: number | null;
        usedCount: number;
        startDate: Date;
        expiresAt: Date | null;
        isActive: boolean;
    }>;
    create(dto: CreateCouponDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderAmount: number;
        maxDiscount: number | null;
        maxUses: number | null;
        usedCount: number;
        startDate: Date;
        expiresAt: Date | null;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateCouponDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderAmount: number;
        maxDiscount: number | null;
        maxUses: number | null;
        usedCount: number;
        startDate: Date;
        expiresAt: Date | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
