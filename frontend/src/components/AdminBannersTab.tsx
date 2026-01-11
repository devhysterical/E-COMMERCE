import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerService, UploadService } from "../services/api.service";
import type { Banner } from "../services/api.service";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Image,
} from "lucide-react";

const AdminBannersTab = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: BannerService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: BannerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Tạo banner thành công!");
      setShowModal(false);
    },
    onError: () => toast.error("Tạo banner thất bại!"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        title: string;
        description: string | null;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
      }>;
    }) =>
      BannerService.update(id, {
        ...data,
        description: data.description ?? undefined,
        linkUrl: data.linkUrl ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Cập nhật banner thành công!");
      setShowModal(false);
      setEditingBanner(null);
    },
    onError: () => toast.error("Cập nhật banner thất bại!"),
  });

  const deleteMutation = useMutation({
    mutationFn: BannerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Xóa banner thành công!");
    },
    onError: () => toast.error("Xóa banner thất bại!"),
  });

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleToggleActive = (banner: Banner) => {
    updateMutation.mutate({
      id: banner.id,
      data: { isActive: !banner.isActive },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Quản lý Banner/Slider
        </h2>
        <button
          onClick={() => {
            setEditingBanner(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={20} />
          Thêm Banner
        </button>
      </div>

      {/* Banner List */}
      {banners.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <Image size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Chưa có banner nào</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-indigo-600 hover:underline">
            Thêm banner đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`flex items-center gap-4 p-4 bg-white rounded-xl border ${
                banner.isActive
                  ? "border-slate-200"
                  : "border-slate-100 opacity-60"
              }`}>
              {/* Image Preview */}
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {banner.title}
                  </h3>
                  {!banner.isActive && (
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                      Ẩn
                    </span>
                  )}
                </div>
                {banner.description && (
                  <p className="text-sm text-slate-500 truncate">
                    {banner.description}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Thứ tự: {banner.sortOrder}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(banner)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title={banner.isActive ? "Ẩn banner" : "Hiện banner"}>
                  {banner.isActive ? (
                    <Eye size={18} className="text-green-600" />
                  ) : (
                    <EyeOff size={18} className="text-slate-400" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Chỉnh sửa">
                  <Edit size={18} className="text-indigo-600" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa">
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
          }}
          onSubmit={(data) => {
            if (editingBanner) {
              updateMutation.mutate({ id: editingBanner.id, data });
            } else {
              createMutation.mutate(
                data as { title: string; imageUrl: string }
              );
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

// Banner Modal Component
interface BannerModalProps {
  banner: Banner | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) => void;
  isPending: boolean;
}

const BannerModal = ({
  banner,
  onClose,
  onSubmit,
  isPending,
}: BannerModalProps) => {
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    description: banner?.description || "",
    imageUrl: banner?.imageUrl || "",
    linkUrl: banner?.linkUrl || "",
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder ?? 0,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await UploadService.uploadImage(file);
      setFormData({ ...formData, imageUrl: result.url });
      toast.success("Upload ảnh thành công!");
    } catch {
      toast.error("Upload ảnh thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast.error("Vui lòng nhập tiêu đề và hình ảnh!");
      return;
    }
    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl || undefined,
      isActive: formData.isActive,
      sortOrder: formData.sortOrder,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-900">
            {banner ? "Chỉnh sửa Banner" : "Thêm Banner mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nhập tiêu đề banner"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nhập mô tả (không bắt buộc)"
              rows={2}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hình ảnh *
            </label>
            {formData.imageUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-slate-100">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                <Upload
                  size={32}
                  className={`${
                    isUploading ? "animate-bounce" : ""
                  } text-slate-400`}
                />
                <span className="text-sm text-slate-500 mt-2">
                  {isUploading ? "Đang upload..." : "Click để upload ảnh"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Link khi click
            </label>
            <input
              type="url"
              value={formData.linkUrl}
              onChange={(e) =>
                setFormData({ ...formData, linkUrl: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://example.com (không bắt buộc)"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sortOrder: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min={0}
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-5 h-5 text-indigo-600 rounded border-slate-300"
            />
            <label htmlFor="isActive" className="text-sm text-slate-700">
              Hiển thị banner này
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <Save size={18} />
              {isPending ? "Đang lưu..." : "Lưu banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBannersTab;
