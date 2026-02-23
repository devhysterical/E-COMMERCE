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
  discountAmount: number;
  shippingFee: number;
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
    limit: number = 5,
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
    limit: number = 4,
  ): Promise<Product[]> => {
    const response = await api.get(`/products/related/${productId}`, {
      params: { limit },
    });
    return response.data;
  },

  // Low Stock Products - sản phẩm tồn kho thấp (Admin)
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
    }>,
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
  downloadInvoice: async (orderId: string): Promise<void> => {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${orderId.slice(0, 8)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
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
    }>,
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
    productId: string,
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
    orderAmount: number,
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

// Reports Service - Export Excel
export const ReportsService = {
  exportOrders: async (startDate?: string, endDate?: string): Promise<void> => {
    const response = await api.get("/reports/export/orders", {
      params: { startDate, endDate },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportProducts: async (): Promise<void> => {
    const response = await api.get("/reports/export/products", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_inventory_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// ===== ADDRESS BOOK =====

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string | null;
  street: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward?: string;
  street: string;
  isDefault?: boolean;
}

export type UpdateAddressData = Partial<CreateAddressData>;

export const AddressService = {
  getAll: async (): Promise<Address[]> => {
    const response = await api.get("/addresses");
    return response.data;
  },

  getOne: async (id: string): Promise<Address> => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  create: async (data: CreateAddressData): Promise<Address> => {
    const response = await api.post("/addresses", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAddressData): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data;
  },
};

// ===== SHIPPING ZONES =====

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
  // Public
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

  // Admin
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

// ===== ANALYTICS =====

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface OrderDataPoint {
  date: string;
  total: number;
  delivered: number;
  cancelled: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  imageUrl: string | null;
  currentPrice: number;
  totalQuantity: number;
  totalRevenue: number;
}

export interface TopCustomer {
  userId: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  orderCount: number;
  totalSpent: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  name: string;
  revenue: number;
  quantity: number;
}

export interface ConversionStats {
  activeCarts: number;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  conversionRate: number;
  deliveryRate: number;
  cancellationRate: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export const AnalyticsService = {
  getRevenueChart: async (
    period: string = "30d",
  ): Promise<RevenueDataPoint[]> => {
    const response = await api.get(
      `/reports/analytics/revenue?period=${period}`,
    );
    return response.data;
  },

  getOrderChart: async (period: string = "30d"): Promise<OrderDataPoint[]> => {
    const response = await api.get(
      `/reports/analytics/orders?period=${period}`,
    );
    return response.data;
  },

  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    const response = await api.get(
      `/reports/analytics/top-products?limit=${limit}`,
    );
    return response.data;
  },

  getTopCustomers: async (limit: number = 10): Promise<TopCustomer[]> => {
    const response = await api.get(
      `/reports/analytics/top-customers?limit=${limit}`,
    );
    return response.data;
  },

  getCategoryBreakdown: async (): Promise<CategoryBreakdown[]> => {
    const response = await api.get("/reports/analytics/categories");
    return response.data;
  },

  getConversionStats: async (): Promise<ConversionStats> => {
    const response = await api.get("/reports/analytics/conversion");
    return response.data;
  },
};
