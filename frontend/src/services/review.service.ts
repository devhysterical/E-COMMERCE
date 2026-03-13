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
