import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  User as UserIcon,
  ShoppingCart,
  Layout,
  Package,
  ChevronDown,
  Heart,
  HelpCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { CartService } from "../../services/cart.service";
import ThemeToggle from "../ThemeToggle";
import { LanguageSwitcherCompact } from "../LanguageSwitcher";
import NotificationBell from "../NotificationBell";
import { getWishlistQueryOptions } from "../../utils/wishlist";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  // Lấy số lượng sản phẩm trong giỏ hàng
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.get,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  // Lấy số lượng sản phẩm trong wishlist
  const { data: wishlist } = useQuery({
    ...getWishlistQueryOptions(isAuthenticated),
  });

  const cartItemCount =
    cart?.cartItems?.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity,
      0,
    ) || 0;

  const wishlistCount = wishlist?.length || 0;

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-3xl font-black text-indigo-600 tracking-tighter italic hover:opacity-80 transition-opacity">
              L-TECH SOLUTIONS.
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Link
                to="/faq"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <HelpCircle size={16} />
                {t("header.faq")}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-8">
            {isAuthenticated && <NotificationBell />}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title={t("header.wishlist")}>
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Theme and Language Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcherCompact />
            </div>

            <div className="h-8 w-px bg-slate-100 dark:bg-slate-700 hidden sm:block"></div>

            {/* User Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <UserIcon size={18} className="text-indigo-600" />
                <span className="text-sm font-bold tracking-tight hidden sm:inline">
                  {user?.fullName || user?.email}
                </span>
                <ChevronDown
                  size={16}
                  className="text-slate-400 dark:text-slate-500"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <UserIcon size={18} className="text-indigo-600" />
                    <span className="font-medium">{t("header.profile")}</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Package size={18} className="text-indigo-600" />
                    <span className="font-medium">{t("order.orderHistory")}</span>
                  </Link>
                  {user?.role === "ADMIN" && (
                    <>
                      <hr className="my-2 border-slate-100 dark:border-slate-700" />
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Layout size={18} className="text-purple-600" />
                        <span className="font-medium">{t("header.admin")}</span>
                      </Link>
                    </>
                  )}
                  <hr className="my-2 border-slate-100 dark:border-slate-700" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
                    <LogOut size={18} />
                    <span className="font-medium">{t("common.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
