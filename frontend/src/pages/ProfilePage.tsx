import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/api.service";
import { useAuthStore } from "../store/useAuthStore";
import { User, Save, Lock, Eye, EyeOff, Check } from "lucide-react";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { user: authUser, setAuth, token } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: UserService.getProfile,
    staleTime: 0,
  });

  const updateProfileMutation = useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (authUser && token) {
        setAuth(
          { ...authUser, fullName: data.fullName || authUser.fullName },
          token
        );
      }
      setIsEditing(false);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: UserService.changePassword,
    onSuccess: () => {
      setPasswordMessage("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setPasswordMessage(""), 3000);
    },
    onError: () => {
      setPasswordMessage(
        "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại."
      );
    },
  });

  const handleEditProfile = () => {
    setFullName(profile?.fullName || "");
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ fullName });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Mật khẩu mới không khớp!");
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded mb-8"></div>
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <div className="h-24 w-24 bg-slate-200 rounded-full mx-auto"></div>
          <div className="h-6 w-1/2 bg-slate-200 rounded mx-auto"></div>
          <div className="h-4 w-1/3 bg-slate-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Hồ sơ cá nhân</h1>

      {passwordMessage && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            passwordMessage.includes("thành công")
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}>
          {passwordMessage}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center">
          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-indigo-600 text-4xl font-bold shadow-xl">
            {profile?.fullName?.charAt(0) ||
              profile?.email.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">
            {profile?.fullName || "Chưa cập nhật tên"}
          </h2>
          <p className="text-indigo-100">{profile?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
            {profile?.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
          </span>
        </div>

        {/* Profile Content */}
        <div className="p-8 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User size={16} /> Họ và tên
            </label>
            {isEditing ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Nhập họ và tên"
                />
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Save size={18} />
                  {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-lg text-slate-900">
                  {profile?.fullName || "Chưa cập nhật"}
                </p>
                <button
                  onClick={handleEditProfile}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  Chỉnh sửa
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Change Password */}
          <div className="space-y-4">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center gap-2 text-slate-700 font-semibold hover:text-indigo-600 transition-colors">
              <Lock size={18} />
              Đổi mật khẩu
            </button>

            {showPasswordForm && (
              <form
                onSubmit={handleChangePassword}
                className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mật khẩu hiện tại"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-red-300"
                        : confirmPassword && confirmPassword === newPassword
                        ? "border-green-300"
                        : "border-slate-200"
                    }`}
                    required
                  />
                  {confirmPassword && confirmPassword === newPassword && (
                    <Check
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                      size={20}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    changePasswordMutation.isPending ||
                    newPassword !== confirmPassword
                  }
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-300">
                  {changePasswordMutation.isPending
                    ? "Đang xử lý..."
                    : "Đổi mật khẩu"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
