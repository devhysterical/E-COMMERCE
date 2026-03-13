import api from "../api/axios";

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  maxUses: number | null;
  usedCount: number;
  startDate: string;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    usages: number;
    orders: number;
  };
}

export interface ValidateCouponResult {
  valid: boolean;
  couponId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  message: string;
}

export interface CreateCouponDto {
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

export type UpdateCouponDto = Partial<CreateCouponDto>;

export const CouponService = {
  getAvailable: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons/available");
    return response.data;
  },

  validate: async (
    code: string,
    orderAmount: number,
  ): Promise<ValidateCouponResult> => {
    const response = await api.post("/coupons/validate", { code, orderAmount });
    return response.data;
  },

  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons/admin");
    return response.data;
  },

  getOne: async (id: string): Promise<Coupon> => {
    const response = await api.get(`/coupons/admin/${id}`);
    return response.data;
  },

  create: async (dto: CreateCouponDto): Promise<Coupon> => {
    const response = await api.post("/coupons/admin", dto);
    return response.data;
  },

  update: async (id: string, dto: UpdateCouponDto): Promise<Coupon> => {
    const response = await api.patch(`/coupons/admin/${id}`, dto);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/coupons/admin/${id}`);
  },
};
