import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OrderService } from "../services/api.service";
import type { Order } from "../services/api.service";
import {
  Package,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";

const OrderHistoryPage = () => {
  const { t } = useTranslation();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: OrderService.getMyOrders,
  });

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    PENDING: {
      label: t("order.status.pending"),
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: <Clock size={16} />,
    },
    PROCESSING: {
      label: t("order.status.processing"),
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      icon: <Loader size={16} />,
    },
    SHIPPED: {
      label: t("order.status.shipped"),
      color:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      icon: <Truck size={16} />,
    },
    DELIVERED: {
      label: t("order.status.delivered"),
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: <CheckCircle size={16} />,
    },
    CANCELLED: {
      label: t("order.status.cancelled"),
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: <XCircle size={16} />,
    },
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-4 h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <Package className="text-indigo-600" />
        {t("order.orderHistory")}
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-12 text-center">
          <Package
            className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
            size={64}
          />
          <h2 className="text-xl font-semibold text-slate-500 dark:text-slate-400">
            {t("order.empty")}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 mt-2">
            {t("cart.continueShopping")}
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            {t("product.ourProducts")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            return (
              <Link
                to={`/orders/${order.id}`}
                key={order.id}
                className="block bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-100 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        {t("order.orderDetails")}:
                      </span>
                      <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
                        #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {order.totalAmount.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                    <ChevronRight className="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {order.orderItems.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex-shrink-0 flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg overflow-hidden">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            x{item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 4 && (
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        +{order.orderItems.length - 4} {t("common.moreItems")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
