import api from "../api/axios";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  shortName: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  specifications: SpecificationItem[] | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  images?: ProductImage[];
}

export const ProductService = {
  getAll: async (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: "price" | "name" | "createdAt";
    sortOrder?: "asc" | "desc";
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  searchSuggest: async (
    query: string,
    limit: number = 5,
  ): Promise<
    {
      id: string;
      name: string;
      shortName: string | null;
      price: number;
      imageUrl: string | null;
    }[]
  > => {
    const response = await api.get("/products/search/suggest", {
      params: { q: query, limit },
    });
    return response.data;
  },

  getRelated: async (
    productId: string,
    limit: number = 4,
  ): Promise<Product[]> => {
    const response = await api.get(`/products/related/${productId}`, {
      params: { limit },
    });
    return response.data;
  },

  getLowStock: async (
    threshold: number = 10,
  ): Promise<{
    products: {
      id: string;
      name: string;
      price: number;
      stock: number;
      imageUrl: string | null;
      category: { id: string; name: string };
    }[];
    total: number;
    threshold: number;
  }> => {
    const response = await api.get("/products/low-stock", {
      params: { threshold },
    });
    return response.data;
  },

  getOne: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (data: {
    name: string;
    shortName?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: string;
    specifications?: SpecificationItem[];
  }) => {
    const response = await api.post("/products", data);
    return response.data;
  },
  update: async (
    id: string,
    data: Partial<{
      name: string;
      shortName: string;
      price: number;
      stock: number;
      imageUrl: string;
      categoryId: string;
      specifications: SpecificationItem[];
    }>,
  ) => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
