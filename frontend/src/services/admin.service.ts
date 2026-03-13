import api from "../api/axios";
import type { PaginatedResponse } from "./product.service";
import type { Order, AdminStats } from "./order.service";
import type { UserProfile } from "./user.service";

// Re-export for consumers that import AdminStats from admin.service
export type { AdminStats };

export const AdminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get("/orders/admin/stats");
    return response.data;
  },
  getAllOrders: async (page = 1, limit = 20): Promise<PaginatedResponse<Order>> => {
    const response = await api.get("/orders/admin/all", { params: { page, limit } });
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
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};
