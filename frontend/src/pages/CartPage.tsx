import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "../services/cart.service";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

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

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.get,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      CartService.update(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => CartService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const totalAmount = cart?.cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );

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
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase italic">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span>{totalAmount?.toLocaleString("vi-VN")} đ</span>
                </div>
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
                    {totalAmount?.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
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
