export declare enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED = "FIXED"
}
export declare class CreateCouponDto {
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    maxUses?: number;
    startDate?: string;
    expiresAt?: string;
    isActive?: boolean;
}
export declare class UpdateCouponDto {
    code?: string;
    description?: string;
    discountType?: DiscountType;
    discountValue?: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    maxUses?: number;
    startDate?: string;
    expiresAt?: string;
    isActive?: boolean;
}
export declare class ValidateCouponDto {
    code: string;
    orderAmount: number;
}
