import { useQuery } from "@tanstack/react-query";
import { ProductService } from "../services/api.service";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";

interface LowStockAlertProps {
  threshold?: number;
  onViewProducts?: () => void;
}

const LowStockAlert = ({
  threshold = 10,
  onViewProducts,
}: LowStockAlertProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["low-stock", threshold],
    queryFn: () => ProductService.getLowStock(threshold),
  });

  if (isLoading) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 animate-pulse">
        <div className="h-6 bg-amber-200 rounded w-48 mb-3"></div>
        <div className="h-4 bg-amber-100 rounded w-32"></div>
      </div>
    );
  }

  if (!data || data.total === 0) {
    return null;
  }

  const criticalProducts = data.products.filter((p) => p.stock <= 5);
  const lowProducts = data.products.filter((p) => p.stock > 5);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl">
            <AlertTriangle className="text-amber-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Cảnh báo tồn kho</h3>
            <p className="text-sm text-slate-500">
              {data.total} sản phẩm cần bổ sung
            </p>
          </div>
        </div>
        {onViewProducts && (
          <button
            onClick={onViewProducts}
            className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 font-medium">
            Xem tất cả <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Critical (stock <= 5) */}
      {criticalProducts.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              Sắp hết hàng ({criticalProducts.length})
            </span>
          </div>
          <div className="space-y-2">
            {criticalProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 bg-white/70 rounded-xl p-2.5 border border-red-100">
                <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={16} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {product.category.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-600">
                    {product.stock}
                  </span>
                  <p className="text-xs text-slate-500">còn lại</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low (5 < stock <= threshold) */}
      {lowProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              Tồn kho thấp ({lowProducts.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-white/70 rounded-lg px-2.5 py-1.5 border border-amber-100 text-sm">
                <span className="text-slate-700 truncate max-w-32">
                  {product.name}
                </span>
                <span className="font-semibold text-amber-600">
                  ({product.stock})
                </span>
              </div>
            ))}
            {lowProducts.length > 5 && (
              <span className="text-sm text-slate-500 flex items-center">
                +{lowProducts.length - 5} sản phẩm khác
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;
