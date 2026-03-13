import api from "../api/axios";
import type { PaginatedResponse } from "./product.service";

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

export const OrderService = {
  getMyOrders: async (page = 1, limit = 10): Promise<PaginatedResponse<Order>> => {
    const response = await api.get("/orders", { params: { page, limit } });
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
