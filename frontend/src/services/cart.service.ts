import api from "../api/axios";

export const CartService = {
  get: async () => {
    const response = await api.get("/carts");
    return response.data;
  },
  add: async (productId: string, quantity: number) => {
    const response = await api.post("/carts/add", { productId, quantity });
    return response.data;
  },
  update: async (itemId: string, quantity: number) => {
    const response = await api.patch(`/carts/item/${itemId}`, { quantity });
    return response.data;
  },
  remove: async (itemId: string) => {
    const response = await api.delete(`/carts/item/${itemId}`);
    return response.data;
  },
};

export const OrderService = {
  create: async (data: { address: string; phone: string }) => {
    const response = await api.post("/orders", data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/orders");
    return response.data;
  },
};
