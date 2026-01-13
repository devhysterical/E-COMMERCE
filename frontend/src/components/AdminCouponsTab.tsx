import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CouponService,
  type Coupon,
  type CreateCouponDto,
  type DiscountType,
} from "../services/api.service";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Ticket,
  Calendar,
  Percent,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminCouponsTab = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState<CreateCouponDto>({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscount: undefined,
    maxUses: undefined,
    expiresAt: "",
    isActive: true,
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: CouponService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: CouponService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Đã tạo mã giảm giá");
      resetForm();
    },
    onError: () => toast.error("Không thể tạo mã giảm giá"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateCouponDto> }) =>
      CouponService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Đã cập nhật mã giảm giá");
      resetForm();
    },
    onError: () => toast.error("Không thể cập nhật mã giảm giá"),
  });

  const deleteMutation = useMutation({
    mutationFn: CouponService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Đã xóa mã giảm giá");
    },
    onError: () => toast.error("Không thể xóa mã giảm giá"),
  });

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscount: undefined,
      maxUses: undefined,
      expiresAt: "",
      isActive: true,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount || undefined,
      maxUses: coupon.maxUses || undefined,
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split("T")[0]
        : "",
      isActive: coupon.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, dto: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Không giới hạn";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    }
    return `${coupon.discountValue.toLocaleString("vi-VN")}đ`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-slate-900">Mã giảm giá</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          <Plus size={20} />
          Thêm mã
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingCoupon ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mã giảm giá
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                  placeholder="VD: SALE20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Giảm 20% cho đơn hàng đầu tiên"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as DiscountType,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền (đ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giá trị
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Đơn tối thiểu (đ)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderAmount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giảm tối đa (đ)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscount: parseInt(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    min={0}
                    placeholder="Không giới hạn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số lần sử dụng tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxUses: parseInt(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    min={1}
                    placeholder="Không giới hạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Kích hoạt mã giảm giá
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400">
                  {createMutation.isPending || updateMutation.isPending
                    ? "Đang lưu..."
                    : editingCoupon
                    ? "Cập nhật"
                    : "Tạo mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Ticket size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500">Chưa có mã giảm giá nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-mono font-bold text-lg">
                      {coupon.code}
                    </span>
                    {coupon.isActive ? (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <ToggleRight size={16} /> Đang hoạt động
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-slate-400">
                        <ToggleLeft size={16} /> Đã tắt
                      </span>
                    )}
                  </div>

                  {coupon.description && (
                    <p className="text-slate-500 text-sm">
                      {coupon.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      {coupon.discountType === "PERCENTAGE" ? (
                        <Percent size={16} className="text-indigo-600" />
                      ) : (
                        <DollarSign size={16} className="text-indigo-600" />
                      )}
                      <span className="font-semibold">
                        {formatDiscount(coupon)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="text-slate-400" />
                      Hết hạn: {formatDate(coupon.expiresAt)}
                    </div>

                    <div>
                      Đã dùng:{" "}
                      <span className="font-semibold">
                        {coupon.usedCount}
                        {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                      </span>
                    </div>

                    {coupon.minOrderAmount > 0 && (
                      <div>
                        Đơn tối thiểu:{" "}
                        <span className="font-semibold">
                          {coupon.minOrderAmount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Xóa mã giảm giá này?")) {
                        deleteMutation.mutate(coupon.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCouponsTab;
