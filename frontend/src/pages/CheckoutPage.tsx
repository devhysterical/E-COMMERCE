import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService, PaymentService } from "../services/cart.service";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  CreditCard,
  ChevronLeft,
  Wallet,
  Banknote,
} from "lucide-react";

type PaymentMethod = "COD" | "MOMO";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({ address: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: {
      address: string;
      phone: string;
      paymentMethod: string;
    }) => OrderService.create(data),
    onSuccess: async (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      if (paymentMethod === "MOMO") {
        // Nếu chọn MoMo, tạo payment và redirect
        try {
          setIsProcessing(true);
          const paymentResult = await PaymentService.createMoMoPayment(
            order.id
          );
          if (paymentResult.success && paymentResult.payUrl) {
            window.location.href = paymentResult.payUrl;
          } else {
            setError(paymentResult.message || "Không thể tạo thanh toán MoMo");
            setIsProcessing(false);
          }
        } catch {
          setError("Có lỗi xảy ra khi tạo thanh toán MoMo");
          setIsProcessing(false);
        }
      } else {
        // COD - thông báo thành công
        alert("Đặt hàng thành công!");
        navigate("/orders");
      }
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.phone) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setError("");
    mutation.mutate({ ...formData, paymentMethod });
  };

  const isLoading = mutation.isPending || isProcessing;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium">
        <ChevronLeft size={20} /> Quay lại giỏ hàng
      </button>

      <h1 className="text-3xl font-black text-slate-900 mb-8 italic uppercase">
        Thông tin đặt hàng
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <MapPin size={18} className="text-indigo-600" /> Địa chỉ giao hàng
            </label>
            <textarea
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
              placeholder="VD: 123 Đường ABC, Quận X, TP. Y"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <Phone size={18} className="text-indigo-600" /> Số điện thoại
            </label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="09xx xxx xxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
              <CreditCard size={18} className="text-indigo-600" /> Phương thức
              thanh toán
            </label>

            <div className="space-y-3">
              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2 ${
                  paymentMethod === "COD"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200"
                }`}>
                <div
                  className={`w-5 h-5 rounded-full border-4 ${
                    paymentMethod === "COD"
                      ? "border-indigo-600"
                      : "border-slate-300"
                  }`}></div>
                <Banknote size={24} />
                <div className="text-left">
                  <span className="font-bold uppercase tracking-tight block">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="text-sm opacity-70">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </span>
                </div>
              </button>

              {/* MoMo Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("MOMO")}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2 ${
                  paymentMethod === "MOMO"
                    ? "bg-pink-50 border-pink-500 text-pink-700"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200"
                }`}>
                <div
                  className={`w-5 h-5 rounded-full border-4 ${
                    paymentMethod === "MOMO"
                      ? "border-pink-600"
                      : "border-slate-300"
                  }`}></div>
                <Wallet size={24} className="text-pink-500" />
                <div className="text-left">
                  <span className="font-bold uppercase tracking-tight block">
                    Ví MoMo
                  </span>
                  <span className="text-sm opacity-70">
                    Thanh toán qua ví điện tử MoMo
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest disabled:bg-slate-300 disabled:shadow-none">
          {isLoading
            ? paymentMethod === "MOMO"
              ? "Đang chuyển đến MoMo..."
              : "Đang xử lý..."
            : paymentMethod === "MOMO"
            ? "Thanh toán với MoMo"
            : "Xác nhận đặt hàng"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
