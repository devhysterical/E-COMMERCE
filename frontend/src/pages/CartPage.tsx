import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CartService } from "../services/cart.service";
import {
  CouponService,
  type Coupon,
  type ValidateCouponResult,
} from "../services/api.service";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Ticket,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Percent,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatCurrency } from "../utils/language";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<ValidateCouponResult | null>(
    null,
  );
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.get,
  });

  const { data: availableCoupons = [] } = useQuery({
    queryKey: ["available-coupons"],
    queryFn: CouponService.getAvailable,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      CartService.update(id, quantity),
    onMutate: async ({ id, quantity }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistic update — phản hồi ngay lập tức
      queryClient.setQueryData(
        ["cart"],
        (old: { cartItems: CartItem[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            cartItems: old.cartItems.map((item: CartItem) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          };
        },
      );

      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error(t("cart.quantityUpdateError"));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Re-validate coupon with new total
      if (couponResult && cart) {
        handleValidateCoupon(couponResult.code);
      }
    },
  });

  // Debounce timer cho keyboard input
  const quantityTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const handleQuantityChange = (itemId: string, rawValue: string) => {
    const parsed = parseInt(rawValue, 10);
    if (isNaN(parsed) || parsed < 0) return;
    const newQuantity = Math.max(1, parsed);

    // Optimistic update ngay lập tức
    queryClient.setQueryData(
      ["cart"],
      (old: { cartItems: CartItem[] } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          cartItems: old.cartItems.map((item: CartItem) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item,
          ),
        };
      },
    );

    // Debounce API call 500ms
    if (quantityTimers.current[itemId]) {
      clearTimeout(quantityTimers.current[itemId]);
    }
    quantityTimers.current[itemId] = setTimeout(() => {
      updateMutation.mutate({ id: itemId, quantity: newQuantity });
    }, 500);
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => CartService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(
        ["cart"],
        (old: { cartItems: CartItem[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            cartItems: old.cartItems.filter((item: CartItem) => item.id !== id),
          };
        },
      );

      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error(t("cart.removeError"));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (couponResult && cart) {
        const newTotal =
          cart.cartItems.reduce(
            (sum: number, item: CartItem) =>
              sum + item.product.price * item.quantity,
            0,
          ) - (couponResult?.discountAmount || 0);
        if (newTotal < 0) {
          handleRemoveCoupon();
        }
      }
    },
  });

  const totalAmount = cart?.cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0,
  );

  const finalAmount = (totalAmount || 0) - (couponResult?.discountAmount || 0);

  // Validate coupon
  const handleValidateCoupon = async (code?: string) => {
    const codeToValidate = code || couponCode;
    if (!codeToValidate.trim()) {
      setCouponError(t("cart.couponRequired"));
      return;
    }
    if (!totalAmount) return;

    setCouponError("");
    setValidatingCoupon(true);
    try {
      const result = await CouponService.validate(codeToValidate, totalAmount);
      setCouponResult(result);
      setCouponCode(result.code);
      toast.success(
        t("cart.couponApplied", {
          code: result.code,
          amount: formatCurrency(result.discountAmount, i18n.resolvedLanguage),
        }),
      );
      setShowAvailableCoupons(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setCouponError(error.response?.data?.message || t("cart.invalidCoupon"));
      setCouponResult(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
    setCouponError("");
  };

  const handleSelectCoupon = (coupon: Coupon) => {
    setCouponCode(coupon.code);
    handleValidateCoupon(coupon.code);
  };

  const handleProceedToCheckout = () => {
    // Store coupon in sessionStorage for checkout page
    if (couponResult) {
      sessionStorage.setItem("appliedCoupon", JSON.stringify(couponResult));
    } else {
      sessionStorage.removeItem("appliedCoupon");
    }
    navigate("/checkout");
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    }
    return formatCurrency(coupon.discountValue, i18n.resolvedLanguage);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-600 dark:text-slate-400">
        {t("common.loading")}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase">
          {t("cart.title")}
        </h1>
      </div>

      {!cart?.cartItems.length ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">
            {t("cart.empty")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase">
            {t("cart.continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* List Items */}
          <div className="flex-1 space-y-4">
            {cart.cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl flex items-center gap-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase italic">
                    {item.product.name}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                    {formatCurrency(item.product.price, i18n.resolvedLanguage)}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-xl">
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    disabled={item.quantity <= 1}
                    className="p-1.5 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <Minus size={18} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) {
                        handleQuantityChange(item.id, "1");
                      }
                    }}
                    className="w-10 text-center font-bold text-sm bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg py-1 outline-none focus:ring-2 focus:ring-indigo-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="p-1.5 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all">
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={22} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 uppercase italic">
                {t("cart.orderSummary")}
              </h2>

              {/* Coupon Section */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Ticket size={16} className="text-indigo-600" />{" "}
                  {t("cart.coupon")}
                </label>

                {couponResult ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Check size={18} className="text-green-600" />
                      <div>
                        <p className="font-bold text-green-700 text-sm">
                          {couponResult.code}
                        </p>
                        <p className="text-xs text-green-600">
                          {t("cart.appliedDiscount", {
                            amount: formatCurrency(
                              couponResult.discountAmount,
                              i18n.resolvedLanguage,
                            ),
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 text-green-600 hover:text-red-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm uppercase"
                        placeholder={t("cart.couponPlaceholder")}
                      />
                      <button
                        onClick={() => handleValidateCoupon()}
                        disabled={validatingCoupon}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 text-sm">
                        {validatingCoupon ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          t("cart.applyCouponAction")
                        )}
                      </button>
                    </div>

                    {/* Available Coupons Button */}
                    <button
                      onClick={() =>
                        setShowAvailableCoupons(!showAvailableCoupons)
                      }
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                      <span className="flex items-center gap-2">
                        <Tag size={14} />
                        {t("cart.availableCoupons", {
                          count: availableCoupons.length,
                        })}
                      </span>
                      {showAvailableCoupons ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {/* Available Coupons List */}
                    {showAvailableCoupons && (
                      <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-2">
                        {availableCoupons.length === 0 ? (
                          <p className="text-sm text-slate-500 text-center py-4">
                            {t("cart.noAvailableCoupons")}
                          </p>
                        ) : (
                          availableCoupons.map((coupon) => (
                            <button
                              key={coupon.id}
                              onClick={() => handleSelectCoupon(coupon)}
                              disabled={totalAmount < coupon.minOrderAmount}
                              className={`w-full p-3 text-left rounded-lg border transition-all ${
                                totalAmount >= coupon.minOrderAmount
                                  ? "border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50"
                                  : "border-slate-100 opacity-50 cursor-not-allowed"
                              }`}>
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-indigo-600">
                                  {coupon.code}
                                </span>
                                <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                                  {coupon.discountType === "PERCENTAGE" && (
                                    <Percent size={12} />
                                  )}
                                  {formatDiscount(coupon)}
                                </span>
                              </div>
                              {coupon.description && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {coupon.description}
                                </p>
                              )}
                              {coupon.minOrderAmount > 0 && (
                                <p
                                  className={`text-xs mt-1 ${
                                    totalAmount >= coupon.minOrderAmount
                                      ? "text-slate-400"
                                      : "text-red-500"
                                  }`}>
                                  {t("cart.minimumOrder", {
                                    amount: formatCurrency(
                                      coupon.minOrderAmount,
                                      i18n.resolvedLanguage,
                                    ),
                                  })}
                                </p>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}

                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>{t("cart.subtotal")}</span>
                  <span>
                    {formatCurrency(totalAmount || 0, i18n.resolvedLanguage)}
                  </span>
                </div>

                {couponResult && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("cart.discount")}</span>
                    <span>
                      -
                      {formatCurrency(
                        couponResult.discountAmount,
                        i18n.resolvedLanguage,
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>{t("checkout.shippingFee")}</span>
                  <span className="text-green-600 font-bold uppercase">
                    {t("checkout.freeShipping")}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    {t("cart.total")}
                  </span>
                  <span className="text-2xl font-black text-indigo-600">
                    {formatCurrency(finalAmount, i18n.resolvedLanguage)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase">
                {t("cart.proceedToCheckout")} <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
