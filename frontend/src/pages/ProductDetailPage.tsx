import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "../services/api.service";
import {
  ChevronLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCcw,
} from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getOne(id!),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-32 bg-slate-200 rounded mb-8"></div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 aspect-square bg-slate-200 rounded-2xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-10 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-6 w-1/4 bg-slate-200 rounded"></div>
            <div className="h-32 w-full bg-slate-200 rounded"></div>
            <div className="h-12 w-full bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium">
        <ChevronLeft size={20} /> Quay lại danh sách
      </Link>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Product Image */}
        <div className="flex-1 w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              {product.category.name}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight italic uppercase">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-indigo-600">
              {product.price.toLocaleString("vi-VN")} đ
            </p>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed">
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          <div className="p-6 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Tình trạng:</span>
              <span
                className={`font-bold ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}>
                {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
              </span>
            </div>
            <button
              disabled={product.stock <= 0}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 disabled:shadow-none">
              <ShoppingCart size={22} /> Thêm vào giỏ hàng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="text-indigo-600" size={28} />
              <span className="text-xs font-bold text-slate-900 uppercase">
                Chính hãng 100%
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="text-indigo-600" size={28} />
              <span className="text-xs font-bold text-slate-900 uppercase">
                Giao hàng nhanh
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RefreshCcw className="text-indigo-600" size={28} />
              <span className="text-xs font-bold text-slate-900 uppercase">
                Đổi trả 7 ngày
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
