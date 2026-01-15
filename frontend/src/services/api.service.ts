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
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
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

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
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
  images?: ProductImage[];
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
    sortBy?: "price" | "name" | "createdAt";
    sortOrder?: "asc" | "desc";
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // Search Autocomplete - gợi ý sản phẩm
  searchSuggest: async (
    query: string,
    limit: number = 5
  ): Promise<
    { id: string; name: string; price: number; imageUrl: string | null }[]
  > => {
    const response = await api.get("/products/search/suggest", {
      params: { q: query, limit },
    });
    return response.data;
  },

  // Related Products - sản phẩm liên quan
  getRelated: async (
    productId: string,
    limit: number = 4
  ): Promise<Product[]> => {
    const response = await api.get(`/products/related/${productId}`, {
      params: { limit },
    });
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
  updateProfile: async (data: {
    fullName?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
  }): Promise<UserProfile> => {
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

export const UploadService = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Banner Types
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
  // Public: lấy banners đang active
  getActive: async (): Promise<Banner[]> => {
    const response = await api.get("/banners");
    return response.data;
  },

  // Admin: lấy tất cả banners
  getAll: async (): Promise<Banner[]> => {
    const response = await api.get("/banners/admin/all");
    return response.data;
  },

  // Admin: lấy một banner
  getOne: async (id: string): Promise<Banner> => {
    const response = await api.get(`/banners/admin/${id}`);
    return response.data;
  },

  // Admin: tạo banner mới
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

  // Admin: cập nhật banner
  update: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      imageUrl: string;
      linkUrl: string;
      isActive: boolean;
      sortOrder: number;
    }>
  ): Promise<Banner> => {
    const response = await api.patch(`/banners/admin/${id}`, data);
    return response.data;
  },

  // Admin: xóa banner
  delete: async (id: string): Promise<void> => {
    await api.delete(`/banners/admin/${id}`);
  },
};

// Wishlist interfaces
export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export const WishlistService = {
  // Lấy danh sách wishlist
  getAll: async (): Promise<WishlistItem[]> => {
    const response = await api.get("/wishlist");
    return response.data;
  },

  // Thêm sản phẩm vào wishlist
  add: async (productId: string): Promise<WishlistItem> => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },

  // Xóa sản phẩm khỏi wishlist
  remove: async (productId: string): Promise<void> => {
    await api.delete(`/wishlist/${productId}`);
  },

  // Toggle wishlist (thêm/xóa)
  toggle: async (
    productId: string
  ): Promise<{ inWishlist: boolean; message: string }> => {
    const response = await api.post(`/wishlist/${productId}/toggle`);
    return response.data;
  },

  // Kiểm tra sản phẩm có trong wishlist
  check: async (productId: string): Promise<{ inWishlist: boolean }> => {
    const response = await api.get(`/wishlist/${productId}/check`);
    return response.data;
  },
};

// ===== COUPON SERVICE =====

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
  // User: Get available coupons
  getAvailable: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons/available");
    return response.data;
  },

  // User: Validate coupon
  validate: async (
    code: string,
    orderAmount: number
  ): Promise<ValidateCouponResult> => {
    const response = await api.post("/coupons/validate", { code, orderAmount });
    return response.data;
  },

  // Admin: Get all coupons
  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons/admin");
    return response.data;
  },

  // Admin: Get one coupon
  getOne: async (id: string): Promise<Coupon> => {
    const response = await api.get(`/coupons/admin/${id}`);
    return response.data;
  },

  // Admin: Create coupon
  create: async (dto: CreateCouponDto): Promise<Coupon> => {
    const response = await api.post("/coupons/admin", dto);
    return response.data;
  },

  // Admin: Update coupon
  update: async (id: string, dto: UpdateCouponDto): Promise<Coupon> => {
    const response = await api.patch(`/coupons/admin/${id}`, dto);
    return response.data;
  },

  // Admin: Delete coupon
  delete: async (id: string): Promise<void> => {
    await api.delete(`/coupons/admin/${id}`);
  },
};
