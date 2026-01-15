import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "../services/api.service";
import { Link } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";

interface SearchAutocompleteProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

const SearchAutocomplete = ({
  onSearch,
  placeholder = "Tìm kiếm sản phẩm...",
}: SearchAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["search-suggest", debouncedQuery],
    queryFn: () => ProductService.searchSuggest(debouncedQuery, 6),
    enabled: debouncedQuery.length >= 2,
  });

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(query);
      setIsOpen(false);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    onSearch("");
    inputRef.current?.focus();
  };

  const handleSelectItem = (productName: string) => {
    setQuery(productName);
    onSearch(productName);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full sm:w-72">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-slate-500">
              <Loader2 size={20} className="animate-spin mr-2" />
              Đang tìm kiếm...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => handleSelectItem(product.name)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-indigo-600 font-semibold">
                        {product.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-slate-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    onSearch(query);
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium">
                  Xem tất cả kết quả cho "{query}"
                </button>
              </li>
            </ul>
          ) : (
            <div className="py-8 text-center text-slate-500">
              Không tìm thấy sản phẩm phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
