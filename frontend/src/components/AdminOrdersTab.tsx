import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { AdminService } from "../services/api.service";
import type { Order } from "../services/api.service";
import { formatCurrency, formatDate } from "../utils/language";
import {
  Eye,
  X,
  Users,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const statusIcons: Record<string, { color: string; icon: React.ReactNode }> = {
  PENDING: {
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    icon: <Clock size={14} />,
  },
  PROCESSING: {
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    icon: <Loader size={14} />,
  },
  SHIPPED: {
    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    icon: <Truck size={14} />,
  },
  DELIVERED: {
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    icon: <CheckCircle size={14} />,
  },
  CANCELLED: {
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    icon: <XCircle size={14} />,
  },
};

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const AdminOrdersTab = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: paginatedData } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => AdminService.getAllOrders(page, limit),
    placeholderData: keepPreviousData,
  });

  const orders = paginatedData?.data ?? [];
  const meta = paginatedData?.meta;

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      AdminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.orders.orderId")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.orders.customer")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.orders.totalAmount")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.orders.status")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.orders.orderDate")}
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
              {t("admin.common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {orders.map((order: Order) => (
            <tr
              key={order.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70 transition-colors"
            >
              <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-300">
                #{order.id.slice(0, 8)}
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {order.user?.fullName || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {order.user?.email}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                {formatCurrency(order.totalAmount, i18n.language)}
              </td>
              <td className="px-6 py-4">
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatusMutation.mutate({
                      id: order.id,
                      status: e.target.value,
                    })
                  }
                  className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${
                    statusIcons[order.status]?.color || "bg-slate-100"
                  } dark:bg-slate-800`}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t(`admin.orders.statusLabels.${s}`)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {formatDate(order.createdAt, i18n.language)}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {t("admin.common.total", { count: meta.total, label: t("admin.orders.orderId") })}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              {t("admin.common.previous")}
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t("admin.common.page", { current: page, total: meta.totalPages })}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {t("admin.common.next")}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("admin.orders.detail", { id: selectedOrder.id.slice(0, 8) })}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  {t("admin.orders.customerInfo")}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">{t("admin.orders.fullName")}:</span>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {selectedOrder.user?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Email:</span>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {selectedOrder.user?.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Phone size={14} /> {t("admin.orders.phone")}:
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {selectedOrder.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <MapPin size={14} /> {t("admin.orders.address")}:
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {selectedOrder.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                <div>
                  <span className="text-sm text-slate-400 dark:text-slate-500">{t("admin.orders.status")}</span>
                  <p
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                      statusIcons[selectedOrder.status]?.color
                    }`}
                  >
                    {statusIcons[selectedOrder.status]?.icon}
                    {t(`admin.orders.statusLabels.${selectedOrder.status}`)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-400 dark:text-slate-500">{t("admin.orders.orderDate")}</span>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {formatDate(selectedOrder.createdAt, i18n.language)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-indigo-600" />
                  {t("admin.orders.products", { count: selectedOrder.orderItems?.length || 0 })}
                </h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map(
                    (item: {
                      id: string;
                      quantity: number;
                      price: number;
                      product: { name: string; imageUrl: string | null };
                    }) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
                      >
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t("admin.orders.quantity")}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity, i18n.language)}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {t("admin.orders.unitPrice", { price: formatCurrency(item.price, i18n.language) })}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-900 dark:text-indigo-200">
                  {t("admin.orders.grandTotal")}
                </span>
                <span className="text-2xl font-black text-indigo-600">
                  {formatCurrency(selectedOrder.totalAmount, i18n.language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrdersTab;
