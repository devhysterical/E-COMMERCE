import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<ValidateCouponResult | null>(
    null
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Re-validate coupon with new total
      if (couponResult && cart) {
        handleValidateCoupon(couponResult.code);
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => CartService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Re-validate coupon with new total
      if (couponResult && cart) {
        const newTotal =
          cart.cartItems.reduce(
            (sum: number, item: CartItem) =>
              sum + item.product.price * item.quantity,
            0
          ) - (couponResult?.discountAmount || 0);
        if (newTotal < 0) {
          handleRemoveCoupon();
        }
      }
    },
  });

  const totalAmount = cart?.cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );

  const finalAmount = (totalAmount || 0) - (couponResult?.discountAmount || 0);

  // Validate coupon
  const handleValidateCoupon = async (code?: string) => {
    const codeToValidate = code || couponCode;
    if (!codeToValidate.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá");
      return;
    }
    if (!totalAmount) return;

    setCouponError("");
    setValidatingCoupon(true);
    try {
      const result = await CouponService.validate(codeToValidate, totalAmount);
      setCouponResult(result);
      setCouponCode(result.code);
      toast.success(result.message);
      setShowAvailableCoupons(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setCouponError(
        error.response?.data?.message || "Mã giảm giá không hợp lệ"
      );
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
    return `${coupon.discountValue.toLocaleString("vi-VN")}đ`;
  };

  if (isLoading)
    return <div className="p-8 text-center">Đang tải giỏ hàng...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-black text-slate-900 italic uppercase">
          Giỏ hàng của bạn
        </h1>
      </div>

      {!cart?.cartItems.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500 mb-6 text-lg">
            Giỏ hàng của bạn đang trống.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* List Items */}
          <div className="flex-1 space-y-4">
            {cart.cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl flex items-center gap-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 uppercase italic">
                    {item.product.name}
                  </h3>
                  <p className="text-indigo-600 font-bold mt-1">
                    {item.product.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    className="p-1 hover:text-indigo-600 transition-colors">
                    <Minus size={20} />
                  </button>
                  <span className="font-bold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="p-1 hover:text-indigo-600 transition-colors">
                    <Plus size={20} />
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
                Tóm tắt đơn hàng
              </h2>

              {/* Coupon Section */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Ticket size={16} className="text-indigo-600" /> Mã giảm giá
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
                          Giảm{" "}
                          {couponResult.discountAmount.toLocaleString("vi-VN")}đ
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
                        placeholder="Nhập mã giảm giá"
                      />
                      <button
                        onClick={() => handleValidateCoupon()}
                        disabled={validatingCoupon}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 text-sm">
                        {validatingCoupon ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          "Áp dụng"
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
                        Xem mã giảm giá khả dụng ({availableCoupons.length})
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
                            Không có mã giảm giá nào
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
                                  Đơn tối thiểu{" "}
                                  {coupon.minOrderAmount.toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ
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
                  <span>Tạm tính</span>
                  <span>{totalAmount?.toLocaleString("vi-VN")} đ</span>
                </div>

                {couponResult && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>
                      -{couponResult.discountAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-bold uppercase">
                    Miễn phí
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-black text-indigo-600">
                    {finalAmount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase">
                Tiến hành thanh toán <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
