import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService, CategoryService } from "../services/api.service";
import type { Product } from "../services/api.service";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import BannerSlider from "../components/BannerSlider";
import ProductCard from "../components/ProductCard";

type SortOption = {
  value: string;
  label: string;
  sortBy: "price" | "name" | "createdAt";
  sortOrder: "asc" | "desc";
};

const SORT_OPTIONS: SortOption[] = [
  {
    value: "newest",
    label: "Mới nhất",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  { value: "oldest", label: "Cũ nhất", sortBy: "createdAt", sortOrder: "asc" },
  {
    value: "price_asc",
    label: "Giá: Thấp đến cao",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    value: "price_desc",
    label: "Giá: Cao đến thấp",
    sortBy: "price",
    sortOrder: "desc",
  },
  { value: "name_asc", label: "Tên: A-Z", sortBy: "name", sortOrder: "asc" },
  { value: "name_desc", label: "Tên: Z-A", sortBy: "name", sortOrder: "desc" },
];

const PRICE_RANGES = [
  { label: "Tất cả giá", min: undefined, max: undefined },
  { label: "Dưới 1 triệu", min: undefined, max: 1000000 },
  { label: "1 - 5 triệu", min: 1000000, max: 5000000 },
  { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
  { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
  { label: "Trên 20 triệu", min: 20000000, max: undefined },
];

const ProductListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState(0); // index of PRICE_RANGES
  const limit = 12;

  const selectedSort =
    SORT_OPTIONS.find((opt) => opt.value === sortOption) || SORT_OPTIONS[0];
  const selectedPrice = PRICE_RANGES[priceRange];

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: [
      "products",
      selectedCategory,
      search,
      page,
      sortOption,
      priceRange,
    ],
    queryFn: () =>
      ProductService.getAll({
        categoryId: selectedCategory || undefined,
        search: search || undefined,
        page,
        limit,
        sortBy: selectedSort.sortBy,
        sortOrder: selectedSort.sortOrder,
        minPrice: selectedPrice.min,
        maxPrice: selectedPrice.max,
      }),
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  // Reset page khi filter/sort thay đổi
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setPage(1);
  };

  const handlePriceRangeChange = (index: number) => {
    setPriceRange(index);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner Slider */}
      <BannerSlider />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-64 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter size={20} /> Danh mục
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange("")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === ""
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "hover:bg-slate-100 text-slate-600"
                }`}>
                Tất cả sản phẩm
              </button>
              {categories?.map((cat: { id: string; name: string }) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
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

          {/* Price Range Filter */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={20} /> Khoảng giá
            </h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handlePriceRangeChange(index)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    priceRange === index
                      ? "bg-green-600 text-white shadow-md shadow-green-100"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}>
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden w-full space-y-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              <option value="">Tất cả danh mục</option>
              {categories?.map((cat: { id: string; name: string }) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-slate-600" />
            <select
              value={priceRange}
              onChange={(e) => handlePriceRangeChange(Number(e.target.value))}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              {PRICE_RANGES.map((range, index) => (
                <option key={index} value={index}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 space-y-6">
          {/* Header, Search & Sort */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Sản phẩm của chúng tôi
                </h1>
                {meta && (
                  <p className="text-sm text-slate-500 mt-1">
                    Hiển thị {products.length} / {meta.total} sản phẩm
                  </p>
                )}
              </div>

              {/* Search */}
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-slate-500" />
              <span className="text-sm text-slate-600">Sắp xếp:</span>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <p className="text-slate-500">
                Không tìm thấy sản phẩm nào phù hợp.
              </p>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === meta.totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-2 text-slate-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === p
                          ? "bg-indigo-600 text-white"
                          : "hover:bg-slate-100 text-slate-600"
                      }`}>
                      {p}
                    </button>
                  </span>
                ))}

              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
