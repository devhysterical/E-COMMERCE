import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { Lock, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Supabase sẽ tự động set session từ URL hash khi user click link reset
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setValidToken(!!session);
    };
    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidToken(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (validToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-red-100 dark:shadow-slate-950/60 p-10 space-y-6 border border-red-100 dark:border-red-800 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Link không hợp lệ hoặc đã hết hạn
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Vui lòng yêu cầu link đặt lại mật khẩu mới.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Yêu cầu link mới
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-green-100 dark:shadow-slate-950/60 p-10 space-y-6 border border-green-100 dark:border-green-800 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Đặt lại mật khẩu thành công!
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Đang chuyển hướng đến trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-100 dark:shadow-slate-950/60 p-10 space-y-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Đặt mật khẩu mới
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-800 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none disabled:bg-slate-400 dark:disabled:bg-slate-700 uppercase tracking-widest">
              {loading ? "Đang xử lý..." : "Đặt mật khẩu mới"}
            </button>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft size={18} />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
