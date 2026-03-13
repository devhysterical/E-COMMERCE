import api from "../api/axios";

export interface ShippingProvince {
  id: string;
  zoneId: string;
  province: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  fee: number;
  minOrderFree: number | null;
  estimatedDays: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  provinces: ShippingProvince[];
}

export interface ShippingFeeResult {
  fee: number;
  zone: {
    id: string;
    name: string;
    estimatedDays: string | null;
    minOrderFree: number | null;
  } | null;
  isFreeShipping: boolean;
  message: string | null;
}

export const ShippingService = {
  getActiveZones: async (): Promise<ShippingZone[]> => {
    const response = await api.get("/shipping/zones");
    return response.data;
  },

  calculateFee: async (
    province: string,
    orderTotal?: number,
  ): Promise<ShippingFeeResult> => {
    const params = new URLSearchParams({ province });
    if (orderTotal !== undefined) {
      params.append("orderTotal", String(orderTotal));
    }
    const response = await api.get(`/shipping/fee?${params.toString()}`);
    return response.data;
  },

  getProvinces: async (): Promise<
    {
      id: string;
      province: string;
      zone: { id: string; name: string; fee: number };
    }[]
  > => {
    const response = await api.get("/shipping/provinces");
    return response.data;
  },

  getAllZones: async (): Promise<ShippingZone[]> => {
    const response = await api.get("/shipping/admin/zones");
    return response.data;
  },

  getZone: async (id: string): Promise<ShippingZone> => {
    const response = await api.get(`/shipping/admin/zones/${id}`);
    return response.data;
  },

  createZone: async (data: {
    name: string;
    fee: number;
    minOrderFree?: number;
    estimatedDays?: string;
    isActive?: boolean;
  }): Promise<ShippingZone> => {
    const response = await api.post("/shipping/admin/zones", data);
    return response.data;
  },

  updateZone: async (
    id: string,
    data: Partial<{
      name: string;
      fee: number;
      minOrderFree: number;
      estimatedDays: string;
      isActive: boolean;
    }>,
  ): Promise<ShippingZone> => {
    const response = await api.patch(`/shipping/admin/zones/${id}`, data);
    return response.data;
  },

  deleteZone: async (id: string): Promise<void> => {
    await api.delete(`/shipping/admin/zones/${id}`);
  },

  assignProvinces: async (
    zoneId: string,
    provinces: string[],
  ): Promise<ShippingZone> => {
    const response = await api.post(
      `/shipping/admin/zones/${zoneId}/provinces`,
      { provinces },
    );
    return response.data;
  },
};
