import type { QueryClient } from "@tanstack/react-query";
import {
  WishlistService,
  type Product,
  type WishlistItem,
} from "../services/api.service";

export const WISHLIST_QUERY_KEY = ["wishlist"] as const;

export const getWishlistQueryOptions = (enabled: boolean) => ({
  queryKey: WISHLIST_QUERY_KEY,
  queryFn: WishlistService.getAll,
  enabled,
  staleTime: 30_000,
});

export const hasProductInWishlist = (
  wishlist: WishlistItem[] | undefined,
  productId: string,
) => wishlist?.some((item) => item.productId === productId) ?? false;

const createOptimisticWishlistItem = (product: Product): WishlistItem => ({
  id: `optimistic-${product.id}`,
  productId: product.id,
  createdAt: new Date().toISOString(),
  product,
});

export const syncWishlistCache = (
  queryClient: QueryClient,
  product: Product,
  inWishlist: boolean,
) => {
  queryClient.setQueryData<WishlistItem[] | undefined>(
    WISHLIST_QUERY_KEY,
    (current) => {
      const wishlist = current ?? [];
      const exists = hasProductInWishlist(wishlist, product.id);

      if (inWishlist) {
        if (exists) return wishlist;
        return [createOptimisticWishlistItem(product), ...wishlist];
      }

      return wishlist.filter((item) => item.productId !== product.id);
    },
  );
};

export const removeWishlistItemFromCache = (
  queryClient: QueryClient,
  productId: string,
) => {
  queryClient.setQueryData<WishlistItem[] | undefined>(
    WISHLIST_QUERY_KEY,
    (current) => current?.filter((item) => item.productId !== productId) ?? [],
  );
};
