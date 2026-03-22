import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ProductService,
  ReviewService,
  WishlistService,
  type WishlistItem,
} from "../services/api.service";
import { CartService } from "../services/cart.service";
import type { Review } from "../services/api.service";
import { useAuthStore } from "../store/useAuthStore";
import {
  ChevronLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Star,
  Send,
  Trash2,
  Heart,
} from "lucide-react";
import ImageGallery from "../components/ImageGallery";
import RelatedProducts from "../components/RelatedProducts";
import RecentlyViewed from "../components/RecentlyViewed";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import {
  getWishlistQueryOptions,
  hasProductInWishlist,
  syncWishlistCache,
  WISHLIST_QUERY_KEY,
} from "../utils/wishlist";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { addProduct: addToRecentlyViewed } = useRecentlyViewed();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getOne(id!),
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => ReviewService.getByProduct(id!),
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ["reviewStats", id],
    queryFn: () => ReviewService.getStats(id!),
    enabled: !!id,
  });

  const { data: wishlist } = useQuery({
    ...getWishlistQueryOptions(isAuthenticated),
  });

  const inWishlist = id ? hasProductInWishlist(wishlist, id) : false;

  const createReviewMutation = useMutation({
    mutationFn: ReviewService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats", id] });
      setComment("");
      setRating(5);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: ReviewService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats", id] });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: () => CartService.add(id!, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCartMessage("Đã thêm vào giỏ hàng!");
      setTimeout(() => setCartMessage(null), 3000);
    },
    onError: () => {
      setCartMessage("Không thể thêm vào giỏ hàng!");
      setTimeout(() => setCartMessage(null), 3000);
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    createReviewMutation.mutate({ rating, comment, productId: id });
  };

  // Add to recently viewed when product loads
  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
  }, [product, addToRecentlyViewed]);

  const toggleWishlistMutation = useMutation({
    mutationFn: () => WishlistService.toggle(id!),
    onMutate: async () => {
      if (!product) return { previousWishlist: undefined };

      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY);

      syncWishlistCache(queryClient, product, !inWishlist);
      return { previousWishlist };
    },
    onSuccess: (result) => {
      if (!product) return;

      syncWishlistCache(queryClient, product, result.inWishlist);
    },
    onError: (error, _variables, context) => {
      console.error("Error toggling wishlist:", error);
      queryClient.setQueryData(WISHLIST_QUERY_KEY, context?.previousWishlist);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const handleToggleWishlist = () => {
    if (!id || !isAuthenticated || !product) return;
    toggleWishlistMutation.mutate();
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 28 : 16}
            className={`${
              star <= count
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-300 dark:text-slate-600"
            } ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : ""
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        {t("product.noProductsFound")}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 font-medium">
        <ChevronLeft size={20} /> {t("common.back")}
      </Link>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Product Image Gallery */}
        <div className="flex-1 w-full">
          <ImageGallery
            images={product.images || []}
            mainImageUrl={product.imageUrl}
            productName={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              {product.category.name}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight italic uppercase">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {product.price.toLocaleString("vi-VN")} đ
              </p>
              {stats && stats.totalReviews > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  {renderStars(Math.round(stats.averageRating))}
                  <span>
                    ({stats.totalReviews} {t("product.reviews")})
                  </span>
                </div>
              )}
            </div>
          </div>



          {/* Specifications Table */}
          {product.specifications &&
            Array.isArray(product.specifications) &&
            product.specifications.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                <div className="border-b border-slate-200 bg-slate-100 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/80">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Thông số nổi bật
                  </h3>
                </div>
                <table className="w-full">
                  <tbody>
                    {(
                      product.specifications as {
                        label: string;
                        value: string;
                      }[]
                    ).map(
                      (
                        spec: { label: string; value: string },
                        index: number,
                      ) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0
                              ? "bg-white dark:bg-slate-900"
                              : "bg-slate-50 dark:bg-slate-950/70"
                          }>
                          <td className="px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 w-1/3 align-top border-r border-slate-100 dark:border-slate-700">
                            {spec.label}
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                            {spec.value}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

          <div className="space-y-4 rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:shadow-slate-950/50">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-sm dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                {t("product.status")}:
              </span>
              <span
                className={`font-bold ${
                  product.stock > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}>
                {product.stock > 0
                  ? `${t("product.inStock")} (${product.stock})`
                  : t("product.outOfStock")}
              </span>
            </div>

            {/* Cart Message */}
            {cartMessage && (
              <div
                className={`p-3 rounded-xl text-center font-medium ${
                  cartMessage.includes("Đã thêm") ||
                  cartMessage.includes("Added")
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}>
                {cartMessage}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => addToCartMutation.mutate()}
                disabled={product.stock <= 0 || addToCartMutation.isPending}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:shadow-none cursor-pointer">
                <ShoppingCart size={22} />
                {addToCartMutation.isPending
                  ? t("common.loading")
                  : t("product.addToCart")}
              </button>
              <button
                onClick={handleToggleWishlist}
                disabled={toggleWishlistMutation.isPending || !isAuthenticated}
                className={`p-4 rounded-xl transition-all border-2 cursor-pointer ${
                  inWishlist
                    ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-500"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-red-500 hover:border-red-200 dark:hover:border-red-700"
                } ${toggleWishlistMutation.isPending ? "opacity-50" : ""}`}
                title={
                  inWishlist
                    ? t("product.removeFromWishlist")
                    : t("product.addToWishlist")
                }>
                <Heart size={22} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white/80 px-4 py-5 text-center dark:border-slate-800 dark:bg-slate-900/70">
              <ShieldCheck
                className="text-indigo-600 dark:text-indigo-400"
                size={28}
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                {t("product.authentic")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white/80 px-4 py-5 text-center dark:border-slate-800 dark:bg-slate-900/70">
              <Truck
                className="text-indigo-600 dark:text-indigo-400"
                size={28}
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                {t("product.fastDelivery")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white/80 px-4 py-5 text-center dark:border-slate-800 dark:bg-slate-900/70">
              <RefreshCcw
                className="text-indigo-600 dark:text-indigo-400"
                size={28}
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                Đổi trả 7 ngày
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Đánh giá sản phẩm
        </h2>

        {/* Write Review Form */}
        {isAuthenticated ? (
          <form
            onSubmit={handleSubmitReview}
            className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              Viết đánh giá của bạn
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Đánh giá:
              </span>
              {renderStars(rating, true)}
            </div>
            <textarea
              id="review-comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/60">
              <Send size={18} />
              {createReviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              Vui lòng{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:underline">
                đăng nhập
              </Link>{" "}
              để viết đánh giá.
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="py-8 text-center text-slate-500 dark:text-slate-400">
              Chưa có đánh giá nào cho sản phẩm này.
            </p>
          ) : (
            reviews.map((review: Review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                        {review.user.fullName?.charAt(0) ||
                          review.user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {review.user.fullName || review.user.email}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {user &&
                    (user.id === review.userId || user.role === "ADMIN") && (
                      <button
                        onClick={() => deleteReviewMutation.mutate(review.id)}
                        className="p-2 text-slate-400 transition-colors hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    )}
                </div>
                {review.comment && (
                  <p className="mt-4 text-slate-600 dark:text-slate-300">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products */}
      {id && <RelatedProducts productId={id} limit={4} />}

      {/* Recently Viewed */}
      <RecentlyViewed excludeProductId={id} />
    </div>
  );
};

export default ProductDetailPage;
