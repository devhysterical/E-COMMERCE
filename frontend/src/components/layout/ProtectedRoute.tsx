import { Navigate, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useIdleTimeout } from "../../hooks/useIdleTimeout";
import SessionTimeoutModal from "../SessionTimeoutModal";
import Navbar from "./Navbar";

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

export default ProtectedRoute;
