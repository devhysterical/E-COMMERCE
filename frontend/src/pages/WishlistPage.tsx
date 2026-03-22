import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Package } from "lucide-react";
import { WishlistService, type WishlistItem } from "../services/api.service";
import { CartService } from "../services/cart.service";
import { toast } from "react-toastify";
import {
  getWishlistQueryOptions,
  removeWishlistItemFromCache,
  WISHLIST_QUERY_KEY,
} from "../utils/wishlist";
import { useAuthStore } from "../store/useAuthStore";

const WishlistPage = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const {
    data: wishlist = [],
    isLoading: loading,
  } = useQuery({
    ...getWishlistQueryOptions(isAuthenticated),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => WishlistService.remove(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY);

      removeWishlistItemFromCache(queryClient, productId);
      return { previousWishlist };
    },
    onSuccess: () => {
      toast.success("Đã xóa khỏi danh sách yêu thích");
    },
    onError: (error, _productId, context) => {
      console.error("Error removing from wishlist:", error);
      queryClient.setQueryData(WISHLIST_QUERY_KEY, context?.previousWishlist);
      toast.error("Không thể xóa khỏi danh sách yêu thích");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const handleRemove = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      await CartService.add(item.product.id, 1);
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors">
        <div className="text-center">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={48} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Danh sách yêu thích trống
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            <Package size={20} />
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={32} className="text-red-500" fill="currentColor" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Danh sách yêu thích ({wishlist.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-100 dark:shadow-slate-950/40 overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <Link to={`/product/${item.product.id}`}>
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <Package size={48} />
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-indigo-600 font-bold text-lg mb-4">
                  {formatPrice(item.product.price)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Xóa khỏi yêu thích">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
