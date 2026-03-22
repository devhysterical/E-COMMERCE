import { Link } from "react-router-dom";
import { Clock, X, Trash2 } from "lucide-react";
import {
  useRecentlyViewed,
  type RecentProduct,
} from "../hooks/useRecentlyViewed";

interface RecentlyViewedProps {
  excludeProductId?: string;
}

const RecentlyViewed = ({ excludeProductId }: RecentlyViewedProps) => {
  const { products, removeProduct, clearAll } = useRecentlyViewed();

  // Lọc bỏ sản phẩm hiện tại nếu có
  const filteredProducts = excludeProductId
    ? products.filter((p) => p.id !== excludeProductId)
    : products;

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-indigo-600" size={24} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Sản phẩm đã xem gần đây
          </h3>
        </div>
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <Trash2 size={14} />
          Xóa tất cả
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
        {filteredProducts.map((product: RecentProduct) => (
          <div key={product.id} className="relative flex-shrink-0 w-36 group">
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                removeProduct(product.id);
              }}
              className="absolute top-1 right-1 z-10 p-1 bg-white/80 dark:bg-slate-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30">
              <X
                size={14}
                className="text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400"
              />
            </button>

            <Link
              to={`/product/${product.id}`}
              className="block bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-950/40 transition-all">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-2">
                <h4 className="font-medium text-slate-900 dark:text-white text-xs line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {product.name}
                </h4>
                <p className="text-indigo-600 font-bold mt-1 text-xs">
                  {product.price.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
