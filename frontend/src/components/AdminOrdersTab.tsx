import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { AdminService } from "../services/api.service";
import type { Order } from "../services/api.service";
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

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={14} />,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-700",
    icon: <Loader size={14} />,
  },
  SHIPPED: {
    label: "Đang giao",
    color: "bg-indigo-100 text-indigo-700",
    icon: <Truck size={14} />,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={14} />,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: <XCircle size={14} />,
  },
};

const AdminOrdersTab = () => {
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
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Mã đơn
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Khách hàng
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Tổng tiền
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Ngày đặt
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((order: Order) => (
            <tr
              key={order.id}
              className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-mono text-sm text-slate-600">
                #{order.id.slice(0, 8)}
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-bold text-slate-900">
                    {order.user?.fullName || "N/A"}
                  </p>
                  <p className="text-sm text-slate-400">{order.user?.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-slate-700">
                {order.totalAmount.toLocaleString("vi-VN")} đ
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
                    statusConfig[order.status]?.color || "bg-slate-100"
                  }`}>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="SHIPPED">Đang giao</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            Tổng {meta.total} đơn hàng
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
              Trước
            </button>
            <span className="text-sm text-slate-500">
              {page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Họ tên:</span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.user?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.user?.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone size={14} /> Điện thoại:
                    </span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin size={14} /> Địa chỉ:
                    </span>
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                <div>
                  <span className="text-sm text-slate-400">Trạng thái</span>
                  <p
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                      statusConfig[selectedOrder.status]?.color
                    }`}>
                    {statusConfig[selectedOrder.status]?.icon}
                    {statusConfig[selectedOrder.status]?.label}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-400">Ngày đặt</span>
                  <p className="font-semibold text-slate-800">
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-indigo-600" />
                  Sản phẩm ({selectedOrder.orderItems?.length || 0})
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
                        className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
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
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            đ
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.price.toLocaleString("vi-VN")} đ/sp
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-indigo-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-black text-indigo-600">
                  {selectedOrder.totalAmount.toLocaleString("vi-VN")} đ
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
