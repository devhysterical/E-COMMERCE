import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../../services/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../api/axios";

const AuthCallbackPage = () => {
  const { t } = useTranslation();
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
          throw new Error(t("auth.sessionNotFound"));
        }

        // Gửi access token lên backend để tạo JWT
        const response = await api.post("/auth/google", {
          accessToken: session.access_token,
        });

        const { user } = response.data;
        setAuth(user);
        navigate("/");
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || t("auth.loginFailed"));
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [navigate, setAuth, t]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">{error}</div>
          <p className="text-slate-500 dark:text-slate-400">
            {t("auth.redirectingToLogin")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">
          {t("auth.processingCallback")}
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
