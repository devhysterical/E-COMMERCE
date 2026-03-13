import api from "../api/axios";

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const BannerService = {
  getActive: async (): Promise<Banner[]> => {
    const response = await api.get("/banners");
    return response.data;
  },

  getAll: async (): Promise<Banner[]> => {
    const response = await api.get("/banners/admin/all");
    return response.data;
  },

  getOne: async (id: string): Promise<Banner> => {
    const response = await api.get(`/banners/admin/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<Banner> => {
    const response = await api.post("/banners/admin", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      imageUrl: string;
      linkUrl: string;
      isActive: boolean;
      sortOrder: number;
    }>,
  ): Promise<Banner> => {
    const response = await api.patch(`/banners/admin/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/banners/admin/${id}`);
  },
};
