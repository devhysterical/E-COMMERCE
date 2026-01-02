import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService, CategoryService } from "../services/api.service";
import { Link } from "react-router-dom";
import { Search, Filter, ShoppingCart } from "lucide-react";

const ProductListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", selectedCategory, search],
    queryFn: () =>
      ProductService.getAll({ categoryId: selectedCategory, search }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter size={20} /> Danh mục
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === ""
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "hover:bg-slate-100 text-slate-600"
                }`}>
                Tất cả sản phẩm
              </button>
              {categories?.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">
              Sản phẩm của chúng tôi
            </h1>
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: any) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        {product.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase italic">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-black text-slate-900">
                        {product.price.toLocaleString("vi-VN")} đ
                      </span>
                      <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && products?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500">
                Không tìm thấy sản phẩm nào phù hợp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
