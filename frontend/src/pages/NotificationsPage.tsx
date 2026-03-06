import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Package, Star, Megaphone, Info, Check } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NotificationService,
  type Notification,
} from "../services/notification.service";

const typeConfig: Record<
  string,
  { icon: typeof Bell; label: string; color: string; bg: string }
> = {
  ORDER_STATUS: {
    icon: Package,
    label: "Đơn hàng",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  NEW_REVIEW: {
    icon: Star,
    label: "Đánh giá",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  PROMOTION: {
    icon: Megaphone,
    label: "Khuyến mãi",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/30",
  },
  SYSTEM: {
    icon: Info,
    label: "Hệ thống",
    color: "text-slate-600",
    bg: "bg-slate-50 dark:bg-slate-900/30",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function getNotificationLink(notification: Notification): string | null {
  if (!notification.metadata) return null;
  if (notification.type === "ORDER_STATUS" && notification.metadata.orderId) {
    return `/orders/${notification.metadata.orderId}`;
  }
  return null;
}

type FilterType = "all" | "unread";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications-page", page],
    queryFn: () => NotificationService.getAll(page, 15),
  });

  const markReadMutation = useMutation({
    mutationFn: NotificationService.markAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications-page"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: NotificationService.markAllAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications-page"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  const notifications = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Thông báo
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {unreadCount > 0
                ? `${unreadCount} thông báo chưa đọc`
                : "Tất cả đã đọc"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <Check size={16} />
              Đọc tất cả
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}>
            Tất cả
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              filter === "unread"
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}>
            Chưa đọc
          </button>
        </div>

        {/* Notification list */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
              <Bell size={40} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">Không có thông báo nào</p>
              <p className="text-sm mt-1">
                {filter === "unread"
                  ? "Tất cả thông báo đã được đọc"
                  : "Thông báo sẽ xuất hiện ở đây"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif, index) => {
              const config = typeConfig[notif.type] ?? typeConfig.SYSTEM;
              const Icon = config.icon;
              const link = getNotificationLink(notif);

              const item = (
                <div
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${
                    notif.isRead
                      ? "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      : "bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  } ${index > 0 ? "border-t border-slate-100 dark:border-slate-700" : ""}`}
                  onClick={() => {
                    if (!notif.isRead) markReadMutation.mutate(notif.id);
                  }}>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                    <Icon size={20} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        notif.isRead
                          ? "text-slate-600 dark:text-slate-400"
                          : "text-slate-900 dark:text-white font-semibold"
                      }`}>
                      {notif.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="flex-shrink-0 w-2.5 h-2.5 bg-indigo-600 rounded-full mt-2" />
                  )}
                </div>
              );

              return link ? (
                <Link key={notif.id} to={link}>
                  {item}
                </Link>
              ) : (
                <div key={notif.id}>{item}</div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
              Trang trước
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
