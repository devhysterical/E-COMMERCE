import api from "../api/axios";

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  pointMultiplier: number;
  benefits: string | null;
  createdAt: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: "EARN" | "REDEEM" | "EXPIRE" | "ADJUST";
  points: number;
  description: string;
  orderId: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface PointReward {
  id: string;
  name: string;
  pointsCost: number;
  rewardType: string;
  couponValue: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface LoyaltyBalance {
  totalPoints: number;
  tier: { name: string; multiplier: number } | null;
}

export interface LoyaltyUser {
  id: string;
  email: string;
  fullName: string | null;
  totalPoints: number;
}

export const LoyaltyService = {
  getBalance: async (): Promise<LoyaltyBalance> => {
    const response = await api.get("/loyalty/balance");
    return response.data;
  },

  getHistory: async (): Promise<PointTransaction[]> => {
    const response = await api.get("/loyalty/history");
    return response.data;
  },

  getRewards: async (): Promise<PointReward[]> => {
    const response = await api.get("/loyalty/rewards");
    return response.data;
  },

  getTiers: async (): Promise<LoyaltyTier[]> => {
    const response = await api.get("/loyalty/tiers");
    return response.data;
  },

  redeem: async (
    rewardId: string,
  ): Promise<{
    couponCode: string;
    pointsUsed: number;
    remainingPoints: number;
  }> => {
    const response = await api.post("/loyalty/redeem", { rewardId });
    return response.data;
  },

  adminGetTiers: async (): Promise<LoyaltyTier[]> => {
    const response = await api.get("/loyalty/admin/tiers");
    return response.data;
  },

  adminCreateTier: async (data: {
    name: string;
    minPoints: number;
    pointMultiplier?: number;
    benefits?: string;
  }): Promise<LoyaltyTier> => {
    const response = await api.post("/loyalty/admin/tiers", data);
    return response.data;
  },

  adminUpdateTier: async (
    id: string,
    data: Partial<{
      name: string;
      minPoints: number;
      pointMultiplier: number;
      benefits: string;
    }>,
  ): Promise<LoyaltyTier> => {
    const response = await api.patch(`/loyalty/admin/tiers/${id}`, data);
    return response.data;
  },

  adminDeleteTier: async (id: string): Promise<void> => {
    await api.delete(`/loyalty/admin/tiers/${id}`);
  },

  adminGetRewards: async (): Promise<PointReward[]> => {
    const response = await api.get("/loyalty/admin/rewards");
    return response.data;
  },

  adminCreateReward: async (data: {
    name: string;
    pointsCost: number;
    rewardType: string;
    couponValue?: number;
    isActive?: boolean;
  }): Promise<PointReward> => {
    const response = await api.post("/loyalty/admin/rewards", data);
    return response.data;
  },

  adminUpdateReward: async (
    id: string,
    data: Partial<{
      name: string;
      pointsCost: number;
      rewardType: string;
      couponValue: number;
      isActive: boolean;
    }>,
  ): Promise<PointReward> => {
    const response = await api.patch(`/loyalty/admin/rewards/${id}`, data);
    return response.data;
  },

  adminDeleteReward: async (id: string): Promise<void> => {
    await api.delete(`/loyalty/admin/rewards/${id}`);
  },

  adminAdjustPoints: async (data: {
    userId: string;
    points: number;
    description: string;
  }): Promise<{ newTotal: number }> => {
    const response = await api.post("/loyalty/admin/adjust", data);
    return response.data;
  },

  adminGetUsers: async (): Promise<LoyaltyUser[]> => {
    const response = await api.get("/loyalty/admin/users");
    return response.data;
  },
};
