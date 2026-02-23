import { useQuery } from "@tanstack/react-query";
import { FlashSaleService } from "../services/api.service";
import type { FlashSaleItem } from "../services/api.service";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const formatVND = (value: number) => value.toLocaleString("vi-VN");

export default function FlashSaleSection() {
  const { data: flashSales = [] } = useQuery({
    queryKey: ["flash-sales-active"],
    queryFn: FlashSaleService.getActive,
    refetchInterval: 60000,
  });

  const activeSale = flashSales[0];
  if (!activeSale || activeSale.items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="text-orange-500" size={22} />
          <h2 className="text-xl font-bold text-slate-900">Flash Sale</h2>
          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
            Hot
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {activeSale.items.map((item: FlashSaleItem) => {
          const progress =
            item.saleQty > 0 ? (item.soldQty / item.saleQty) * 100 : 0;
          const discount =
            item.product.price > 0
              ? Math.round((1 - item.salePrice / item.product.price) * 100)
              : 0;

          return (
            <Link
              to={`/products/${item.productId}`}
              key={item.id}
              className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative aspect-square">
                <img
                  src={item.product.imageUrl || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  -{discount}%
                </span>
              </div>

              <div className="p-3">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {item.product.name}
                </p>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-red-600 font-bold text-sm">
                    {formatVND(item.salePrice)}đ
                  </span>
                  <span className="text-slate-400 text-xs line-through">
                    {formatVND(item.product.price)}đ
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 text-center">
                    Đã bán {item.soldQty}/{item.saleQty}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
