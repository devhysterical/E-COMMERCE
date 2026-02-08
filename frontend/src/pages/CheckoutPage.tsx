import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { OrderService, PaymentService } from "../services/cart.service";
import {
  UserService,
  AddressService,
  type ValidateCouponResult,
  type Address,
  type CreateAddressData,
} from "../services/api.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MapPin,
  Phone,
  CreditCard,
  ChevronLeft,
  Wallet,
  Banknote,
  Ticket,
} from "lucide-react";
import AddressSelector from "../components/AddressSelector";
import AddressForm from "../components/AddressForm";

type PaymentMethod = "COD" | "MOMO";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch profile để pre-fill SĐT nếu không có địa chỉ
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: UserService.getProfile,
    staleTime: 60000,
  });

  // Fetch saved addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: AddressService.getAll,
  });

  // Form states
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [manualAddress, setManualAddress] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressInitialized, setAddressInitialized] = useState(false);

  // Set default address once when addresses load
  if (addresses.length > 0 && !addressInitialized) {
    const defaultAddr = addresses.find((a) => a.isDefault);
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    }
    setAddressInitialized(true);
  }

  // Get applied coupon from sessionStorage (set from CartPage)
  const [appliedCoupon] = useState<ValidateCouponResult | null>(() => {
    const storedCoupon = sessionStorage.getItem("appliedCoupon");
    if (storedCoupon) {
      try {
        return JSON.parse(storedCoupon);
      } catch {
        sessionStorage.removeItem("appliedCoupon");
        return null;
      }
    }
    return null;
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: AddressService.create,
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setSelectedAddressId(newAddress.id);
      setShowAddressForm(false);
      toast.success(t("address.saved"));
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      address: string;
      phone: string;
      paymentMethod: string;
      couponId?: string;
    }) => OrderService.create(data),
    onSuccess: async (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Clear applied coupon
      sessionStorage.removeItem("appliedCoupon");

      if (paymentMethod === "MOMO") {
        // Nếu chọn MoMo, tạo payment và redirect
        try {
          setIsProcessing(true);
          const paymentResult = await PaymentService.createMoMoPayment(
            order.id,
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
        toast.success("Đặt hàng thành công!");
        navigate("/orders");
      }
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng.");
    },
  });

  const getSelectedAddress = (): Address | undefined => {
    return addresses.find((a) => a.id === selectedAddressId);
  };

  const formatFullAddress = (addr: Address): string => {
    return [addr.street, addr.ward, addr.district, addr.province]
      .filter(Boolean)
      .join(", ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAddr = getSelectedAddress();
    let finalAddress: string;
    let finalPhone: string;

    if (selectedAddr) {
      finalAddress = formatFullAddress(selectedAddr);
      finalPhone = selectedAddr.phone;
    } else if (manualAddress && manualPhone) {
      finalAddress = manualAddress;
      finalPhone = manualPhone;
    } else {
      setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng");
      return;
    }

    setError("");
    mutation.mutate({
      address: finalAddress,
      phone: finalPhone,
      paymentMethod,
      couponId: appliedCoupon?.couponId,
    });
  };

  const handleAddressSelect = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setManualAddress("");
    setManualPhone("");
  };

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  const handleAddressFormSubmit = (data: CreateAddressData) => {
    createAddressMutation.mutate(data);
  };

  const isLoading = mutation.isPending || isProcessing;
  const selectedAddress = getSelectedAddress();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-8 font-medium">
        <ChevronLeft size={20} /> {t("common.back")}
      </button>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 italic uppercase">
        {t("checkout.title")}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-slate-900/50">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800 font-medium">
            {error}
          </div>
        )}

        {/* Applied Coupon Display */}
        {appliedCoupon && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <Ticket className="text-green-600" size={20} />
            <div className="flex-1">
              <p className="font-bold text-green-700">{appliedCoupon.code}</p>
              <p className="text-sm text-green-600">
                Giảm {appliedCoupon.discountAmount.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Address Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <MapPin size={18} className="text-indigo-600" />{" "}
              {t("address.title")}
            </label>

            {/* Address Selector - for saved addresses */}
            <AddressSelector
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={handleAddressSelect}
              onAddNew={handleAddNewAddress}
              isLoading={addressesLoading}
            />

            {/* Show selected address details or manual input fallback */}
            {selectedAddress && (
              <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>{selectedAddress.fullName}</strong> -{" "}
                  {selectedAddress.phone}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {formatFullAddress(selectedAddress)}
                </p>
              </div>
            )}

            {/* Manual address input - only show if no saved addresses */}
            {addresses.length === 0 && !addressesLoading && (
              <>
                <textarea
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 mt-4"
                  placeholder={
                    t("checkout.addressPlaceholder") ||
                    "VD: 123 Đường ABC, Quận X, TP. Y"
                  }
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                />

                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <Phone size={18} className="text-indigo-600" />{" "}
                    {t("address.phone")}
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="09xx xxx xxx"
                    value={manualPhone || profile?.phone || ""}
                    onChange={(e) => setManualPhone(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
              <CreditCard size={18} className="text-indigo-600" />{" "}
              {t("checkout.paymentMethod")}
            </label>

            <div className="space-y-3">
              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2 ${
                  paymentMethod === "COD"
                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-200"
                }`}>
                <div
                  className={`w-5 h-5 rounded-full border-4 ${
                    paymentMethod === "COD"
                      ? "border-indigo-600"
                      : "border-slate-300 dark:border-slate-500"
                  }`}></div>
                <Banknote size={24} />
                <div className="text-left">
                  <span className="font-bold uppercase tracking-tight block">
                    {t("checkout.cod")}
                  </span>
                  <span className="text-sm opacity-70">
                    {t("checkout.codDescription")}
                  </span>
                </div>
              </button>

              {/* MoMo Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("MOMO")}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2 ${
                  paymentMethod === "MOMO"
                    ? "bg-pink-50 dark:bg-pink-900/30 border-pink-500 text-pink-700 dark:text-pink-300"
                    : "bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-200"
                }`}>
                <div
                  className={`w-5 h-5 rounded-full border-4 ${
                    paymentMethod === "MOMO"
                      ? "border-pink-600"
                      : "border-slate-300 dark:border-slate-500"
                  }`}></div>
                <Wallet size={24} className="text-pink-500" />
                <div className="text-left">
                  <span className="font-bold uppercase tracking-tight block">
                    {t("checkout.momo")}
                  </span>
                  <span className="text-sm opacity-70">
                    {t("checkout.momoDescription")}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-2xl shadow-slate-200 dark:shadow-none uppercase tracking-widest disabled:bg-slate-300 disabled:shadow-none">
          {isLoading
            ? paymentMethod === "MOMO"
              ? t("checkout.processingMomo")
              : t("checkout.processing")
            : paymentMethod === "MOMO"
              ? t("checkout.payWithMomo")
              : t("checkout.confirmOrder")}
        </button>
      </form>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          onSubmit={handleAddressFormSubmit}
          onCancel={() => setShowAddressForm(false)}
          isLoading={createAddressMutation.isPending}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
