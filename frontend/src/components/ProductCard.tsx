import type { WishlistItem } from "../services/api.service";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Package } from "lucide-react";
import { WishlistService, type Product } from "../services/api.service";
import { CartService } from "../services/cart.service";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWishlistQueryOptions,
  hasProductInWishlist,
  syncWishlistCache,
  WISHLIST_QUERY_KEY,
} from "../utils/wishlist";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: wishlist } = useQuery({
    ...getWishlistQueryOptions(isAuthenticated),
  });

  const inWishlist = hasProductInWishlist(wishlist, product.id);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    toggleWishlistMutation.mutate();
  };

  const toggleWishlistMutation = useMutation({
    mutationFn: () => WishlistService.toggle(product.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY);
      syncWishlistCache(queryClient, product, !inWishlist);
      return { previousWishlist };
    },
    onSuccess: (result) => {
      syncWishlistCache(queryClient, product, result.inWishlist);
      toast.success(result.message);
    },
    onError: (error, _variables, context) => {
      console.error("Error toggling wishlist:", error);
      queryClient.setQueryData(WISHLIST_QUERY_KEY, context?.previousWishlist);
      toast.error("Không thể cập nhật danh sách yêu thích");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: () => CartService.add(product.id, 1),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đã thêm vào giỏ hàng");
    },
    onError: () => {
      toast.error("Không thể thêm vào giỏ hàng");
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-white dark:bg-slate-700 relative overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Package size={48} />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {product.category.name}
            </span>
          </div>
          {/* Heart icon */}
          <button
            onClick={handleToggleWishlist}
            disabled={toggleWishlistMutation.isPending}
            className={`absolute top-2 left-2 p-2 rounded-full transition-all ${
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-500"
            } ${toggleWishlistMutation.isPending ? "opacity-50" : ""}`}
            title={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}>
            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase italic">
            {product.shortName || product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <span className="text-base font-black text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            {product.price.toLocaleString("vi-VN")} đ
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-slate-900 dark:bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors shrink-0">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
