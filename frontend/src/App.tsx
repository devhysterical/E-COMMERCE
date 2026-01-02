import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuthStore } from "./store/useAuthStore";
import { LogOut, User as UserIcon, ShoppingCart, Layout } from "lucide-react";

const queryClient = new QueryClient();

const Navbar = () => {
  const { user, logout } = useAuthStore();
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-3xl font-black text-indigo-600 tracking-tighter italic hover:opacity-80 transition-opacity">
              L-TECH.
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors">
                <Layout size={16} /> Admin Panel
              </Link>
            )}
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={24} />
            </Link>
            <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <UserIcon size={18} className="text-indigo-600" />
              <span className="text-sm font-bold tracking-tight">
                {user?.fullName}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors text-sm font-bold uppercase tracking-widest">
              <LogOut size={18} />{" "}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
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
    </QueryClientProvider>
  );
}

export default App;
