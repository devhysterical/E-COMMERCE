import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { UserService, UploadService } from "../services/api.service";
import { useAuthStore } from "../store/useAuthStore";
import {
  User,
  Save,
  Lock,
  Eye,
  EyeOff,
  Check,
  Phone,
  MapPin,
  Calendar,
  Mail,
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user: authUser, setAuth, token } = useAuthStore();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
          token,
        );
      }
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công!");
    },
    onError: () => {
      toast.error("Cập nhật hồ sơ thất bại!");
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
        "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.",
      );
    },
  });

  const handleEditProfile = () => {
    setFormData({
      fullName: profile?.fullName || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      dateOfBirth: profile?.dateOfBirth
        ? profile.dateOfBirth.split("T")[0]
        : "",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      fullName: formData.fullName || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Mật khẩu mới không khớp!");
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file tối đa là 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const result = await UploadService.uploadImage(file);
      await updateProfileMutation.mutateAsync({ avatarUrl: result.url });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại!");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 space-y-6">
          <div className="h-24 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto"></div>
          <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        {t("common.profile")}
      </h1>

      {passwordMessage && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            passwordMessage.includes("thành công") ||
            passwordMessage.includes("success")
              ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          }`}>
          {passwordMessage}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center">
          {/* Avatar with upload */}
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full mx-auto overflow-hidden shadow-xl border-4 border-white/30">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center text-indigo-600 text-4xl font-bold">
                  {profile?.fullName?.charAt(0) ||
                    profile?.email.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Upload button */}
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors border-2 border-indigo-500">
              {isUploadingAvatar ? (
                <Loader2 size={16} className="text-indigo-600 animate-spin" />
              ) : (
                <Camera size={16} className="text-indigo-600" />
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
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
          {isEditing ? (
            /* Edit Mode - Form */
            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} /> Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={16} /> Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={16} /> Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={16} /> Địa chỉ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y min-h-[80px]"
                  placeholder="Nhập địa chỉ nhận hàng mặc định"
                  rows={2}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <Save size={18} />
                  {updateProfileMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-5">
              {/* Full Name */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Họ và tên</p>
                    <p className="text-slate-900 font-medium">
                      {profile?.fullName || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-slate-900 font-medium">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Số điện thoại</p>
                    <p className="text-slate-900 font-medium">
                      {profile?.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Ngày sinh</p>
                    <p className="text-slate-900 font-medium">
                      {profile?.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Địa chỉ</p>
                    <p className="text-slate-900 font-medium">
                      {profile?.address || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditProfile}
                className="w-full mt-4 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                Chỉnh sửa thông tin
              </button>
            </div>
          )}

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
