import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { signInWithGoogle } from "../../services/supabase";
import {
  Eye,
  EyeOff,
  Check,
  X,
  Send,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import AuthLayout from "../../components/AuthLayout";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    otp: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const passwordValidation = useMemo(() => {
    const { password } = formData;
    return {
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [formData]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordValidation).every(Boolean);
  }, [passwordValidation]);

  const passwordsMatch =
    formData.password === confirmPassword && confirmPassword !== "";

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  }, [formData.email]);

  const handleSendOtp = useCallback(async () => {
    if (!isEmailValid) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    setOtpSending(true);
    setError("");

    try {
      await api.post("/auth/send-otp", { email: formData.email });
      setOtpSent(true);
      setCountdown(60);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Gửi mã OTP thất bại. Vui lòng thử lại.",
      );
    } finally {
      setOtpSending(false);
    }
  }, [formData.email, isEmailValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Mật khẩu không đáp ứng đủ các yêu cầu bảo mật.");
      return;
    }

    if (!passwordsMatch) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    if (formData.otp.length !== 6) {
      setError("Vui lòng nhập mã OTP 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Đăng ký Google thất bại");
      setGoogleLoading(false);
    }
  };

  const ValidationItem = ({
    valid,
    text,
  }: {
    valid: boolean;
    text: string;
  }) => (
    <div
      className={`flex items-center gap-2 text-sm transition-colors ${
        valid
          ? "text-green-600 dark:text-green-400"
          : "text-slate-400 dark:text-slate-500"
      }`}>
      {valid ? <Check size={14} /> : <X size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <AuthLayout
      title={t("common.register")}
      subtitle="Tham gia cùng chúng tôi ngay hôm nay">
      <div className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800 font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        {/* Google Register Button */}
        <button
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all disabled:opacity-50 cursor-pointer">
          {googleLoading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>{googleLoading ? "Đang xử lý..." : "Tiếp tục với Google"}</span>
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              hoặc đăng ký với email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Họ và tên
            </label>
            <div className="relative group">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              />
              <input
                type="text"
                name="fullName"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mật khẩu
            </label>
            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5 cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 space-y-1.5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Yêu cầu mật khẩu:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <ValidationItem
                    valid={passwordValidation.length}
                    text="8-16 ký tự"
                  />
                  <ValidationItem
                    valid={passwordValidation.uppercase}
                    text="Chữ hoa (A-Z)"
                  />
                  <ValidationItem
                    valid={passwordValidation.lowercase}
                    text="Chữ thường (a-z)"
                  />
                  <ValidationItem
                    valid={passwordValidation.number}
                    text="Số (0-9)"
                  />
                  <ValidationItem
                    valid={passwordValidation.special}
                    text="Ký tự đặc biệt"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nhập lại mật khẩu
            </label>
            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className={`w-full pl-11 pr-12 py-3.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                    : confirmPassword && passwordsMatch
                      ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                } text-slate-900 dark:text-white`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5 cursor-pointer">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
                <X size={14} /> Mật khẩu không khớp
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <Check size={14} /> Mật khẩu khớp
              </p>
            )}
          </div>

          {/* OTP */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mã xác thực OTP
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="otp"
                maxLength={6}
                className={`flex-1 px-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all tracking-widest text-center font-mono ${
                  formData.otp.length === 6
                    ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                    : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                } text-slate-900 dark:text-white`}
                placeholder="ABC123"
                value={formData.otp}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || countdown > 0 || !isEmailValid}
                className="px-4 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap cursor-pointer">
                <Send size={16} />
                {otpSending
                  ? "..."
                  : countdown > 0
                    ? `${countdown}s`
                    : "Gửi mã"}
              </button>
            </div>
            {otpSent && countdown > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Mã OTP đã được gửi đến email của bạn
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              !isPasswordValid ||
              !passwordsMatch ||
              formData.otp.length !== 6
            }
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group mt-6">
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <>
                <span>Đăng ký</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
