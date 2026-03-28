import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CouponService,
  type Coupon,
  type CreateCouponDto,
  type DiscountType,
} from "../services/api.service";
import {
  Plus, Pencil, Trash2, X, Ticket, Calendar,
  Percent, DollarSign, ToggleLeft, ToggleRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatCurrency, formatDate } from "../utils/language";
import Pagination from "./Pagination";

const AdminCouponsTab = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [formData, setFormData] = useState<CreateCouponDto>({
    code: "", description: "", discountType: "PERCENTAGE",
    discountValue: 10, minOrderAmount: 0,
    maxDiscount: undefined, maxUses: undefined, expiresAt: "", isActive: true,
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"], queryFn: CouponService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: CouponService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }); toast.success(t("admin.coupons.createSuccess")); resetForm(); },
    onError: () => toast.error(t("admin.coupons.createFailed")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateCouponDto> }) => CouponService.update(id, dto),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }); toast.success(t("admin.coupons.updateSuccess")); resetForm(); },
    onError: () => toast.error(t("admin.coupons.updateFailed")),
  });

  const deleteMutation = useMutation({
    mutationFn: CouponService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }); toast.success(t("admin.coupons.deleteSuccess")); },
    onError: () => toast.error(t("admin.coupons.deleteFailed")),
  });

  const resetForm = () => {
    setFormData({ code: "", description: "", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 0, maxDiscount: undefined, maxUses: undefined, expiresAt: "", isActive: true });
    setEditingCoupon(null); setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({ code: coupon.code, description: coupon.description || "", discountType: coupon.discountType, discountValue: coupon.discountValue, minOrderAmount: coupon.minOrderAmount, maxDiscount: coupon.maxDiscount || undefined, maxUses: coupon.maxUses || undefined, expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "", isActive: coupon.isActive });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) { updateMutation.mutate({ id: editingCoupon.id, dto: formData }); }
    else { createMutation.mutate(formData); }
  };

  const formatExpiry = (date: string | null) => {
    if (!date) return t("admin.coupons.unlimited");
    return formatDate(date, i18n.language);
  };

  const fmtDiscount = (coupon: Coupon) => coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue, i18n.language);

  const getCouponStatus = (coupon: Coupon) => {
    const now = new Date();
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return { status: "expired", label: t("admin.coupons.statusExpired"), color: "text-red-500" };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { status: "exhausted", label: t("admin.coupons.statusExhausted"), color: "text-orange-500" };
    if (!coupon.isActive) return { status: "inactive", label: t("admin.coupons.statusInactive"), color: "text-slate-400" };
    return { status: "active", label: t("admin.coupons.statusActive"), color: "text-green-600" };
  };

  if (isLoading) return (<div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />))}
  </div>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("admin.coupons.title")}</h2>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          <Plus size={20} /> {t("admin.coupons.addCoupon")}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingCoupon ? t("admin.coupons.editCoupon") : t("admin.coupons.addCoupon")}</h3>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.code")}</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase" placeholder={t("admin.coupons.codePlaceholder")} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.description")}</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={t("admin.coupons.descriptionPlaceholder")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.discountType")}</label>
                  <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="PERCENTAGE">{t("admin.coupons.percentage")}</option>
                    <option value="FIXED">{t("admin.coupons.fixedAmount")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.value")}</label>
                  <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" min={1} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.minOrder")}</label>
                  <input type="number" value={formData.minOrderAmount} onChange={(e) => setFormData({ ...formData, minOrderAmount: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" min={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.maxDiscount")}</label>
                  <input type="number" value={formData.maxDiscount || ""} onChange={(e) => setFormData({ ...formData, maxDiscount: parseInt(e.target.value) || undefined })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" min={0} placeholder={t("admin.coupons.unlimited")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.maxUses")}</label>
                  <input type="number" value={formData.maxUses || ""} onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || undefined })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" min={1} placeholder={t("admin.coupons.unlimited")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("admin.coupons.expiryDate")}</label>
                  <input type="date" value={formData.expiresAt} onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="isActive" className="text-sm text-slate-700 dark:text-slate-300">{t("admin.coupons.activate")}</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">{t("admin.common.cancel")}</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400">
                  {createMutation.isPending || updateMutation.isPending ? t("admin.common.saving") : editingCoupon ? t("admin.common.update") : t("admin.coupons.createCode")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <Ticket size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">{t("admin.coupons.noCoupons")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {coupons.slice((page - 1) * limit, page * limit).map((coupon) => (
              <div key={coupon.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md dark:hover:shadow-slate-950/40 transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-mono font-bold text-lg">{coupon.code}</span>
                      {(() => { const s = getCouponStatus(coupon); const Icon = s.status === "active" ? ToggleRight : ToggleLeft; return (<span className={`flex items-center gap-1 text-sm ${s.color}`}><Icon size={16} /> {s.label}</span>); })()}
                    </div>
                    {coupon.description && <p className="text-slate-500 dark:text-slate-400 text-sm">{coupon.description}</p>}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">{coupon.discountType === "PERCENTAGE" ? <Percent size={16} className="text-indigo-600" /> : <DollarSign size={16} className="text-indigo-600" />}<span className="font-semibold">{fmtDiscount(coupon)}</span></div>
                      <div className="flex items-center gap-1"><Calendar size={16} className="text-slate-400 dark:text-slate-500" />{t("admin.coupons.expires")}: {formatExpiry(coupon.expiresAt)}</div>
                      <div>{t("admin.coupons.used")}: <span className="font-semibold">{coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ""}</span></div>
                      {coupon.minOrderAmount > 0 && <div>{t("admin.coupons.minOrder")}: <span className="font-semibold">{formatCurrency(coupon.minOrderAmount, i18n.language)}</span></div>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(coupon)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"><Pencil size={18} /></button>
                    <button onClick={() => { if (confirm(t("admin.coupons.confirmDelete"))) deleteMutation.mutate(coupon.id); }} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={Math.ceil(coupons.length / limit)} totalItems={coupons.length} label={t("admin.coupons.coupon")} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default AdminCouponsTab;
