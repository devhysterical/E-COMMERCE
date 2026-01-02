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
};

export const ProductService = {
  getAll: async (params?: { categoryId?: string; search?: string }) => {
    const response = await api.get("/products", { params });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};
