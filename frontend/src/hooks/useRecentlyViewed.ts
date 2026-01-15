import { useState, useCallback } from "react";

export interface RecentProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  viewedAt: number;
}

const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [products, setProducts] = useState<RecentProduct[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return [];
  });

  // Thêm sản phẩm vào danh sách
  const addProduct = useCallback((product: Omit<RecentProduct, "viewedAt">) => {
    setProducts((prev) => {
      // Xóa nếu đã tồn tại
      const filtered = prev.filter((p) => p.id !== product.id);

      // Thêm vào đầu danh sách
      const newProducts = [
        { ...product, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      // Lưu vào localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));

      return newProducts;
    });
  }, []);

  // Xóa sản phẩm
  const removeProduct = useCallback((productId: string) => {
    setProducts((prev) => {
      const newProducts = prev.filter((p) => p.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      return newProducts;
    });
  }, []);

  // Xóa tất cả
  const clearAll = useCallback(() => {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    products,
    addProduct,
    removeProduct,
    clearAll,
  };
};
