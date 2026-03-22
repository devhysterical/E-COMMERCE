import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-100 dark:shadow-slate-950/60 p-10 space-y-6 border border-slate-100 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Kiểm tra email của bạn
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Nếu email <strong>{email}</strong> tồn tại trong hệ thống, bạn sẽ
            nhận được link đặt lại mật khẩu trong vài phút.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            <ArrowLeft size={18} />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-100 dark:shadow-slate-950/60 p-10 space-y-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Quên mật khẩu?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
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
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none disabled:bg-slate-400 dark:disabled:bg-slate-700 uppercase tracking-widest">
              {loading ? "Đang gửi..." : "Gửi link đặt lại"}
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

export default ForgotPasswordPage;
