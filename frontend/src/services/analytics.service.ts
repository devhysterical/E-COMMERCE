import api from "../api/axios";

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
