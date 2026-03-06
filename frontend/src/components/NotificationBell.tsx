import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Package, Star, Megaphone, Info, Check } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NotificationService,
  type Notification,
} from "../services/notification.service";

const typeConfig: Record<
  string,
  { icon: typeof Bell; color: string; bg: string }
> = {
  ORDER_STATUS: {
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  NEW_REVIEW: {
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  PROMOTION: {
    icon: Megaphone,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/30",
  },
  SYSTEM: {
    icon: Info,
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

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Đóng dropdown khi click ra ngoài
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  // Lấy số thông báo chưa đọc — polling 30s
  const { data: unreadData } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: NotificationService.getUnreadCount,
    refetchInterval: 30000,
  });

  // Lấy 5 thông báo mới nhất
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications-recent"],
    queryFn: () => NotificationService.getAll(1, 5),
    enabled: isOpen,
  });

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notificationsData?.data ?? [];

  // Đánh dấu 1 thông báo đã đọc
  const markReadMutation = useMutation({
    mutationFn: NotificationService.markAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-recent"],
      });
    },
  });

  // Đánh dấu tất cả đã đọc
  const markAllReadMutation = useMutation({
    mutationFn: NotificationService.markAllAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-recent"],
      });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        title="Thông báo"
        id="notification-bell-btn">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                disabled={markAllReadMutation.isPending}>
                <Check size={14} />
                Đọc tất cả
              </button>
            )}
          </div>

          {/* Danh sách thông báo */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = typeConfig[notif.type] ?? typeConfig.SYSTEM;
                const Icon = config.icon;
                const link = getNotificationLink(notif);
                const content = (
                  <div
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      notif.isRead
                        ? "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                        : "bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    }`}
                    onClick={() => handleNotificationClick(notif)}>
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${config.bg}`}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-tight ${
                          notif.isRead
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-slate-900 dark:text-white font-semibold"
                        }`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                    )}
                  </div>
                );

                return link ? (
                  <Link key={notif.id} to={link}>
                    {content}
                  </Link>
                ) : (
                  <div key={notif.id}>{content}</div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 dark:border-slate-700">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
