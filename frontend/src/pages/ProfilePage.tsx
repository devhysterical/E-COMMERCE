import { useState, useRef } from "react";
import { Link } from "react-router-dom";
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
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user: authUser, setAuth } = useAuthStore();
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
    staleTime: 10_000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (authUser) {
        setAuth(
          { ...authUser, fullName: data.fullName || authUser.fullName },
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

  const fieldLabelClass =
    "flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";
  const readOnlyInputClass =
    "w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400";
  const detailRowClass =
    "flex items-center justify-between border-b border-slate-100 py-3 dark:border-slate-800";

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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
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

      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/70">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-600 p-8 text-center">
          {/* Avatar with upload */}
          <div className="relative inline-block">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white text-4xl font-bold text-indigo-600">
                  {profile?.fullName?.charAt(0) ||
                    profile?.email.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Upload button */}
            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-indigo-500 bg-white shadow-lg transition-colors hover:bg-slate-50">
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
          <p className="text-sm text-indigo-100/90">{profile?.email}</p>
          <span className="mt-3 inline-flex rounded-full border border-white/15 bg-slate-950/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {profile?.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
          </span>
        </div>

        {/* Profile Content */}
        <div className="space-y-6 bg-gradient-to-b from-white via-slate-50/50 to-white p-8 dark:from-slate-900 dark:via-slate-950/80 dark:to-slate-900">
          {isEditing ? (
            /* Edit Mode - Form */
            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className={fieldLabelClass}>
                  <User size={16} /> Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <label className={fieldLabelClass}>
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className={readOnlyInputClass}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className={fieldLabelClass}>
                  <Phone size={16} /> Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className={fieldLabelClass}>
                  <Calendar size={16} /> Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className={fieldLabelClass}>
                  <MapPin size={16} /> Địa chỉ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className={`${inputClass} min-h-[88px] resize-y`}
                  placeholder="Nhập địa chỉ nhận hàng mặc định"
                  rows={2}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  Hủy
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700">
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
              <div className={detailRowClass}>
                <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Họ và tên
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {profile?.fullName || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className={detailRowClass}>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Email
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className={detailRowClass}>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Số điện thoại
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {profile?.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className={detailRowClass}>
                <div className="flex items-center gap-3">
                  <Calendar
                    size={18}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ngày sinh
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
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
              <div className={detailRowClass}>
                <div className="flex items-center gap-3">
                  <MapPin
                    size={18}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Địa chỉ
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {profile?.address || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditProfile}
                className="mt-4 w-full rounded-xl border border-indigo-200 bg-indigo-50/70 px-6 py-3 font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/15">
                Chỉnh sửa thông tin
              </button>
            </div>
          )}

          {/* Divider */}
          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Link to Addresses */}
          <Link
            to="/addresses"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-800/80">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-indigo-600" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Địa chỉ giao hàng
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Quản lý địa chỉ nhận hàng
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className="-rotate-90 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500"
            />
          </Link>

          {/* Divider */}
          <hr className="border-slate-100 dark:border-slate-800" />
          <div className="space-y-4">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center gap-2 font-semibold text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-300">
              <Lock size={18} />
              Đổi mật khẩu
            </button>

            {showPasswordForm && (
              <form
                onSubmit={handleChangePassword}
                className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-950/70">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mật khẩu hiện tại"
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
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
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-red-300 dark:border-red-500/60"
                        : confirmPassword && confirmPassword === newPassword
                          ? "border-green-300 dark:border-emerald-500/60"
                          : "border-slate-200 dark:border-slate-700"
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
                  className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:disabled:bg-slate-700 dark:disabled:text-slate-400">
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
