import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../api/axios";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Lấy session từ Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error("Không tìm thấy session");
        }

        // Gửi access token lên backend để tạo JWT
        const response = await api.post("/auth/google", {
          accessToken: session.access_token,
        });

        const { user, access_token, refresh_token } = response.data;
        setAuth(user, access_token, refresh_token);
        navigate("/");
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || "Đăng nhập thất bại");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [navigate, setAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">{error}</div>
          <p className="text-slate-500">
            Đang chuyển hướng về trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
