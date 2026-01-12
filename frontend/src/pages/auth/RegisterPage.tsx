import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { signInWithGoogle } from "../../services/supabase";
import { Eye, EyeOff, Check, X, Send } from "lucide-react";

const RegisterPage = () => {
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

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Kiểm tra mật khẩu
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
          "Gửi mã OTP thất bại. Vui lòng thử lại."
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
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
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
      className={`flex items-center gap-2 text-sm ${
        valid ? "text-green-600" : "text-slate-400"
      }`}>
      {valid ? <Check size={16} /> : <X size={16} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100 p-10 space-y-8 border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
            Tạo tài khoản
          </h1>
          <p className="text-slate-500 mt-3">
            Tham gia cùng chúng tôi ngay hôm nay
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Google Register Button */}
        <button
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
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
          {googleLoading ? "Đang xử lý..." : "Đăng ký với Google"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400">hoặc</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg pr-14"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Hiển thị yêu cầu mật khẩu */}
            {formData.password && (
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Yêu cầu mật khẩu:
                </p>
                <ValidationItem
                  valid={passwordValidation.length}
                  text="Từ 8-16 ký tự"
                />
                <ValidationItem
                  valid={passwordValidation.uppercase}
                  text="Có ít nhất 1 chữ hoa (A-Z)"
                />
                <ValidationItem
                  valid={passwordValidation.lowercase}
                  text="Có ít nhất 1 chữ thường (a-z)"
                />
                <ValidationItem
                  valid={passwordValidation.number}
                  text="Có ít nhất 1 số (0-9)"
                />
                <ValidationItem
                  valid={passwordValidation.special}
                  text="Có ít nhất 1 ký tự đặc biệt (!@#$%...)"
                />
              </div>
            )}
          </div>

          {/* Nhập lại mật khẩu */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className={`w-full px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg pr-14 ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-300 bg-red-50"
                    : confirmPassword && passwordsMatch
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200"
                }`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1">
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                <X size={16} /> Mật khẩu không khớp
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                <Check size={16} /> Mật khẩu khớp
              </p>
            )}
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Mã xác thực OTP
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                name="otp"
                maxLength={6}
                className={`flex-1 px-5 py-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg tracking-widest text-center font-mono ${
                  formData.otp.length === 6
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200"
                }`}
                placeholder="ABC123"
                value={formData.otp}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || countdown > 0 || !isEmailValid}
                className="px-5 py-4 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap">
                <Send size={18} />
                {otpSending
                  ? "Đang gửi..."
                  : countdown > 0
                  ? `${countdown}s`
                  : "Nhận mã"}
              </button>
            </div>
            {otpSent && countdown > 0 && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                Mã OTP đã được gửi đến email của bạn
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !isPasswordValid ||
              !passwordsMatch ||
              formData.otp.length !== 6
            }
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 uppercase tracking-widest">
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
