import { useQuery } from "@tanstack/react-query";
import { ProductService } from "../services/api.service";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

interface RelatedProductsProps {
  productId: string;
  limit?: number;
}

const RelatedProducts = ({ productId, limit = 4 }: RelatedProductsProps) => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["related-products", productId],
    queryFn: () => ProductService.getRelated(productId, limit),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Sản phẩm liên quan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-xl h-48 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PackageSearch className="text-indigo-600" size={24} />
        <h3 className="text-xl font-bold text-slate-900">Sản phẩm liên quan</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-square bg-slate-100 overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h4>
              <p className="text-indigo-600 font-bold mt-1 text-sm">
                {product.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
