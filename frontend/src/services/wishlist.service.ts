import api from "../api/axios";
import type { Product } from "./product.service";

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export const WishlistService = {
  getAll: async (): Promise<WishlistItem[]> => {
    const response = await api.get("/wishlist");
    return response.data;
  },

  add: async (productId: string): Promise<WishlistItem> => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },

  remove: async (productId: string): Promise<void> => {
    await api.delete(`/wishlist/${productId}`);
  },

  toggle: async (
    productId: string,
  ): Promise<{ inWishlist: boolean; message: string }> => {
    const response = await api.post(`/wishlist/${productId}/toggle`);
    return response.data;
  },

  check: async (productId: string): Promise<{ inWishlist: boolean }> => {
    const response = await api.get(`/wishlist/${productId}/check`);
    return response.data;
  },
};
