import api from "../api/axios";

export interface FlashSaleItem {
  id: string;
  flashSaleId: string;
  productId: string;
  salePrice: number;
  saleQty: number;
  soldQty: number;
  limitPerUser: number;
  product: {
    id?: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock?: number;
  };
}

export interface FlashSale {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items: FlashSaleItem[];
}

export interface CreateFlashSaleData {
  name: string;
  startTime: string;
  endTime: string;
  items: {
    productId: string;
    salePrice: number;
    saleQty: number;
    limitPerUser?: number;
  }[];
}

export const FlashSaleService = {
  getActive: async (): Promise<FlashSale[]> => {
    const response = await api.get("/flash-sales/active");
    return response.data;
  },

  getAll: async (): Promise<FlashSale[]> => {
    const response = await api.get("/flash-sales");
    return response.data;
  },

  getOne: async (id: string): Promise<FlashSale> => {
    const response = await api.get(`/flash-sales/${id}`);
    return response.data;
  },

  create: async (data: CreateFlashSaleData): Promise<FlashSale> => {
    const response = await api.post("/flash-sales", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<{
      name: string;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }>,
  ): Promise<FlashSale> => {
    const response = await api.patch(`/flash-sales/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/flash-sales/${id}`);
  },

  addItem: async (
    flashSaleId: string,
    data: {
      productId: string;
      salePrice: number;
      saleQty: number;
      limitPerUser?: number;
    },
  ): Promise<FlashSaleItem> => {
    const response = await api.post(`/flash-sales/${flashSaleId}/items`, data);
    return response.data;
  },

  removeItem: async (flashSaleId: string, itemId: string): Promise<void> => {
    await api.delete(`/flash-sales/${flashSaleId}/items/${itemId}`);
  },
};
