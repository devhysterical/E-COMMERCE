import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OrderService } from "../services/api.service";
import {
  Package,
  ArrowLeft,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

// Order status timeline steps
const ORDER_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getOne(id!),
    enabled: !!id,
  });

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode; bgColor: string }
  > = {
    PENDING: {
      label: t("order.status.pending"),
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500",
      icon: <Clock size={20} />,
    },
    PROCESSING: {
      label: t("order.status.processing"),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500",
      icon: <Loader size={20} />,
    },
    SHIPPED: {
      label: t("order.status.shipped"),
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500",
      icon: <Truck size={20} />,
    },
    DELIVERED: {
      label: t("order.status.delivered"),
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500",
      icon: <CheckCircle size={20} />,
    },
    CANCELLED: {
      label: t("order.status.cancelled"),
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500",
      icon: <XCircle size={20} />,
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get current step index for timeline
  const getCurrentStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    return ORDER_STEPS.indexOf(status);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 h-96"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Package
          className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
          size={64}
        />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {t("order.notFound")}
        </h2>
        <Link
          to="/orders"
          className="text-indigo-600 hover:underline font-medium">
          {t("order.backToHistory")}
        </Link>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);
  const statusInfo = statusConfig[order.status] || statusConfig.PENDING;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors">
        <ArrowLeft size={20} />
        <span>{t("order.backToHistory")}</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="text-indigo-600" size={28} />
            {t("order.orderDetail")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${statusInfo.color} bg-opacity-10`}
          style={{
            backgroundColor: statusInfo.bgColor.replace("bg-", "") + "20",
          }}>
          {statusInfo.icon}
          {statusInfo.label}
        </div>
      </div>

      {/* Order Timeline */}
      {order.status !== "CANCELLED" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            {t("order.timeline")}
          </h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100)}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {ORDER_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const config = statusConfig[step];

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                        isCompleted
                          ? `${config.bgColor} text-white shadow-lg`
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      } ${isCurrent ? "ring-4 ring-indigo-200 dark:ring-indigo-900" : ""}`}>
                      {config.icon}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                        isCompleted
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400"
                      }`}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Status */}
      {order.status === "CANCELLED" && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <XCircle size={24} />
            <span className="font-semibold text-lg">
              {t("order.cancelled")}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Package size={20} className="text-indigo-600" />
            {t("order.items")} ({order.orderItems.length})
          </h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <img
                  src={item.product.imageUrl || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t("order.quantity")}: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {t("order.deliveryInfo")}
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-slate-400 mt-0.5 flex-shrink-0"
                />
                <span className="text-slate-600 dark:text-slate-300">
                  {order.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">
                  {order.phone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-indigo-600" />
              {t("order.paymentSummary")}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t("order.subtotal")}</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t("order.shipping")}</span>
                <span className="text-green-600">{t("common.free")}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-3 flex justify-between font-bold text-lg">
                <span className="text-slate-900 dark:text-white">
                  {t("order.total")}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              // TODO: Implement invoice download
              alert("Invoice download coming soon!");
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25">
            <Download size={20} />
            {t("order.downloadInvoice")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
