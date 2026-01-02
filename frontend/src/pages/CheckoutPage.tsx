import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "../services/cart.service";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, CreditCard, ChevronLeft } from "lucide-react";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({ address: "", phone: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { address: string; phone: string }) =>
      OrderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      alert("Đặt hàng thành công!");
      navigate("/");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đặt hàng.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.phone) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    mutation.mutate(formData);
  };

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
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4 text-indigo-700">
              <div className="w-5 h-5 rounded-full border-4 border-indigo-600"></div>
              <span className="font-bold uppercase tracking-tight">
                Thanh toán khi nhận hàng (COD)
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest disabled:bg-slate-300 disabled:shadow-none">
          {mutation.isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
