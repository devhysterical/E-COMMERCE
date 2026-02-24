import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AuthCallbackPage from "./pages/auth/AuthCallbackPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import WishlistPage from "./pages/WishlistPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import AddressesPage from "./pages/AddressesPage";
import { useAuthStore } from "./store/useAuthStore";
import { CartService } from "./services/cart.service";
import { WishlistService } from "./services/api.service";
import {
  LogOut,
  User as UserIcon,
  ShoppingCart,
  Layout,
  Package,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useIdleTimeout } from "./hooks/useIdleTimeout";
import SessionTimeoutModal from "./components/SessionTimeoutModal";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { LanguageSwitcherCompact } from "./components/LanguageSwitcher";

const queryClient = new QueryClient();

const Navbar = () => {
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
    staleTime: 0,
  });

  // Lấy số lượng sản phẩm trong wishlist
  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: WishlistService.getAll,
    enabled: isAuthenticated,
    staleTime: 0,
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
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 hover:text-red-500 transition-colors"
              title="Yêu thích">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
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
                className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
                <UserIcon size={18} className="text-indigo-600" />
                <span className="text-sm font-bold tracking-tight hidden sm:inline">
                  {user?.fullName || user?.email}
                </span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                    <UserIcon size={18} className="text-indigo-600" />
                    <span className="font-medium">Hồ sơ cá nhân</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                    <Package size={18} className="text-indigo-600" />
                    <span className="font-medium">Lịch sử đơn hàng</span>
                  </Link>
                  {user?.role === "ADMIN" && (
                    <>
                      <hr className="my-2 border-slate-100" />
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                        <Layout size={18} className="text-purple-600" />
                        <span className="font-medium">Quản trị hệ thống</span>
                      </Link>
                    </>
                  )}
                  <hr className="my-2 border-slate-100" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full">
                    <LogOut size={18} />
                    <span className="font-medium">Đăng xuất</span>
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

// Idle timeout: 15 phút = 15 * 60 * 1000 ms
const IDLE_TIMEOUT = 15 * 60 * 1000;

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  // Callback khi hết thời gian hoạt động
  const handleIdle = useCallback(() => {
    if (isAuthenticated) {
      setShowTimeoutModal(true);
    }
  }, [isAuthenticated]);

  // Xử lý khi user xác nhận modal
  const handleConfirmTimeout = () => {
    setShowTimeoutModal(false);
    logout();
  };

  // Hook theo dõi hoạt động
  useIdleTimeout({
    timeout: IDLE_TIMEOUT,
    onIdle: handleIdle,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />
      {children}
      <SessionTimeoutModal
        isOpen={showTimeoutModal}
        onConfirm={handleConfirmTimeout}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProductListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loyalty"
              element={
                <ProtectedRoute>
                  <LoyaltyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <ProtectedRoute>
                  <AddressesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
