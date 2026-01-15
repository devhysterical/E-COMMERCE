import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProductService,
  ReviewService,
  WishlistService,
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

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
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

  // Wishlist logic
  const checkWishlist = useCallback(async () => {
    if (!id) return;
    try {
      const result = await WishlistService.check(id);
      setInWishlist(result.inWishlist);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      checkWishlist();
    }
  }, [isAuthenticated, id, checkWishlist]);

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

  const handleToggleWishlist = async () => {
    if (!id || !isAuthenticated) return;
    setWishlistLoading(true);
    try {
      const result = await WishlistService.toggle(id);
      setInWishlist(result.inWishlist);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
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
                : "text-slate-300"
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
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              {product.category.name}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight italic uppercase">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-black text-indigo-600">
                {product.price.toLocaleString("vi-VN")} đ
              </p>
              {stats && stats.totalReviews > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {renderStars(Math.round(stats.averageRating))}
                  <span>({stats.totalReviews} đánh giá)</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
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

            {/* Cart Message */}
            {cartMessage && (
              <div
                className={`p-3 rounded-xl text-center font-medium ${
                  cartMessage.includes("Đã thêm")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                {cartMessage}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => addToCartMutation.mutate()}
                disabled={product.stock <= 0 || addToCartMutation.isPending}
                className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 disabled:shadow-none">
                <ShoppingCart size={22} />
                {addToCartMutation.isPending
                  ? "Đang thêm..."
                  : "Thêm vào giỏ hàng"}
              </button>
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading || !isAuthenticated}
                className={`p-4 rounded-xl transition-all border-2 ${
                  inWishlist
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200"
                } ${wishlistLoading ? "opacity-50" : ""}`}
                title={
                  inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
                }>
                <Heart size={22} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>
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

      {/* Reviews Section */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-slate-900">Đánh giá sản phẩm</h2>

        {/* Write Review Form */}
        {isAuthenticated ? (
          <form
            onSubmit={handleSubmitReview}
            className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <p className="font-semibold text-slate-700">
              Viết đánh giá của bạn
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Đánh giá:</span>
              {renderStars(rating, true)}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
            />
            <button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400">
              <Send size={18} />
              {createReviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-slate-500">
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
            <p className="text-slate-500 text-center py-8">
              Chưa có đánh giá nào cho sản phẩm này.
            </p>
          ) : (
            reviews.map((review: Review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {review.user.fullName?.charAt(0) ||
                          review.user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {review.user.fullName || review.user.email}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN"
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
                        className="text-slate-400 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={18} />
                      </button>
                    )}
                </div>
                {review.comment && (
                  <p className="mt-4 text-slate-600">{review.comment}</p>
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
