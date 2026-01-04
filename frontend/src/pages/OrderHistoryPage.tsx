import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={16} />,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-700",
    icon: <Loader size={16} />,
  },
  SHIPPED: {
    label: "Đang giao",
    color: "bg-indigo-100 text-indigo-700",
    icon: <Truck size={16} />,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={16} />,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: <XCircle size={16} />,
  },
};

const OrderHistoryPage = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: OrderService.getMyOrders,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 mb-4 h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <Package className="text-indigo-600" />
        Lịch sử đơn hàng
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-12 text-center">
          <Package className="mx-auto text-slate-300 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-slate-500">
            Bạn chưa có đơn hàng nào
          </h2>
          <p className="text-slate-400 mt-2">
            Hãy khám phá các sản phẩm của chúng tôi!
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-100 p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">
                        Mã đơn hàng:
                      </span>
                      <span className="font-mono text-sm text-slate-600">
                        #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">
                      {order.totalAmount.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-sm text-slate-500">
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
                    <ChevronRight className="text-slate-300" />
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {order.orderItems.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex-shrink-0 flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden">
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
                          <p className="text-sm font-medium text-slate-700 line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            x{item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 4 && (
                      <span className="text-sm text-slate-400">
                        +{order.orderItems.length - 4} sản phẩm khác
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
