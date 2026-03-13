import api from "../api/axios";

export const CategoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (data: { name: string; description?: string }) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },
};
