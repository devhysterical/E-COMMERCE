import api from "../api/axios";

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string | null;
    email: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  createdAt: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  address: string;
  phone: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string | null;
  };
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  }[];
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const ProductService = {
  getAll: async (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products", { params });
    return response.data;
  },
  getOne: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    categoryId: string;
  }) => {
    const response = await api.post("/products", data);
    return response.data;
  },
  update: async (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      imageUrl: string;
      categoryId: string;
    }>
  ) => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};

export const ReviewService = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },
  getStats: async (productId: string): Promise<ReviewStats> => {
    const response = await api.get(`/reviews/product/${productId}/stats`);
    return response.data;
  },
  create: async (data: {
    rating: number;
    comment?: string;
    productId: string;
  }): Promise<Review> => {
    const response = await api.post("/reviews", data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};

export const UserService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (data: { fullName?: string }): Promise<UserProfile> => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.patch("/users/change-password", data);
    return response.data;
  },
  getAllAdmin: async (): Promise<UserProfile[]> => {
    const response = await api.get("/admin/users");
    return response.data;
  },
};

export const OrderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data;
  },
  getOne: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export const AdminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get("/orders/admin/stats");
    return response.data;
  },
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get("/orders/admin/all");
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/admin/${id}/status`, { status });
    return response.data;
  },
  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await api.get("/admin/users");
    return response.data;
  },
  updateUserRole: async (id: string, role: string): Promise<UserProfile> => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },
};
