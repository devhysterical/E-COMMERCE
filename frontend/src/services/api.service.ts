export { CategoryService } from "./category.service";
export { ProductService } from "./product.service";
export { ReviewService } from "./review.service";
export { UserService } from "./user.service";
export { OrderService } from "./order.service";
export { AdminService } from "./admin.service";
export { UploadService } from "./upload.service";
export { BannerService } from "./banner.service";
export { WishlistService } from "./wishlist.service";
export { CouponService } from "./coupon.service";
export { ReportsService } from "./reports.service";
export { AddressService } from "./address.service";
export { ShippingService } from "./shipping.service";
export { AnalyticsService } from "./analytics.service";
export { FlashSaleService } from "./flash-sale.service";
export { LoyaltyService } from "./loyalty.service";

// Re-export all types/interfaces
export type { Product, ProductImage, PaginatedResponse } from "./product.service";
export type { Review, ReviewStats } from "./review.service";
export type { UserProfile } from "./user.service";
export type { Order, AdminStats } from "./order.service";
export type { Banner } from "./banner.service";
export type { WishlistItem } from "./wishlist.service";
export type {
  DiscountType,
  Coupon,
  ValidateCouponResult,
  CreateCouponDto,
  UpdateCouponDto,
} from "./coupon.service";
export type {
  Address,
  CreateAddressData,
  UpdateAddressData,
} from "./address.service";
export type {
  ShippingProvince,
  ShippingZone,
  ShippingFeeResult,
} from "./shipping.service";
export type {
  RevenueDataPoint,
  OrderDataPoint,
  TopProduct,
  TopCustomer,
  CategoryBreakdown,
  ConversionStats,
} from "./analytics.service";
export type {
  FlashSaleItem,
  FlashSale,
  CreateFlashSaleData,
} from "./flash-sale.service";
export type {
  LoyaltyTier,
  PointTransaction,
  PointReward,
  LoyaltyBalance,
  LoyaltyUser,
} from "./loyalty.service";
