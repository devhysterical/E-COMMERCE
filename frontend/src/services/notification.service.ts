import api from "../api/axios";

export interface Notification {
  id: string;
  userId: string;
  type: "ORDER_STATUS" | "NEW_REVIEW" | "SYSTEM" | "PROMOTION";
  title: string;
  message: string;
  isRead: boolean;
  metadata: Record<string, string> | null;
  createdAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export const NotificationService = {
  getAll(page = 1, limit = 20): Promise<NotificationListResponse> {
    return api
      .get("/notifications", { params: { page, limit } })
      .then((res) => res.data as NotificationListResponse);
  },

  getUnreadCount(): Promise<UnreadCountResponse> {
    return api
      .get("/notifications/unread-count")
      .then((res) => res.data as UnreadCountResponse);
  },

  markAsRead(id: string): Promise<void> {
    return api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead(): Promise<void> {
    return api.patch("/notifications/read-all");
  },
};
