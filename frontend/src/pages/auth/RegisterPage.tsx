import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { Eye, EyeOff, Check, X } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

          <button
            type="submit"
            disabled={loading || !isPasswordValid || !passwordsMatch}
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
