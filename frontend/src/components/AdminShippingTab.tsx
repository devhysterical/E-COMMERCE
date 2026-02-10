import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShippingService, type ShippingZone } from "../services/api.service";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Truck,
  MapPin,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "react-toastify";

interface ZoneFormData {
  name: string;
  fee: string;
  minOrderFree: string;
  estimatedDays: string;
  isActive: boolean;
}

const VIETNAM_PROVINCES = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Cạn",
  "Bắc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghe An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const defaultFormData: ZoneFormData = {
  name: "",
  fee: "",
  minOrderFree: "",
  estimatedDays: "",
  isActive: true,
};

export default function AdminShippingTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [formData, setFormData] = useState<ZoneFormData>(defaultFormData);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [selectedZoneForProvinces, setSelectedZoneForProvinces] =
    useState<ShippingZone | null>(null);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);

  const { data: zones = [], isLoading } = useQuery({
    queryKey: ["admin-shipping-zones"],
    queryFn: ShippingService.getAllZones,
  });

  const createMutation = useMutation({
    mutationFn: ShippingService.createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipping-zones"] });
      toast.success("Tao vung van chuyen thanh cong!");
      resetForm();
    },
    onError: () => toast.error("Khong the tao vung van chuyen"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof ShippingService.updateZone>[1];
    }) => ShippingService.updateZone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipping-zones"] });
      toast.success("Cap nhat thanh cong!");
      resetForm();
    },
    onError: () => toast.error("Khong the cap nhat"),
  });

  const deleteMutation = useMutation({
    mutationFn: ShippingService.deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipping-zones"] });
      toast.success("Xoa thanh cong!");
    },
    onError: () => toast.error("Khong the xoa vung van chuyen"),
  });

  const assignProvincesMutation = useMutation({
    mutationFn: ({
      zoneId,
      provinces,
    }: {
      zoneId: string;
      provinces: string[];
    }) => ShippingService.assignProvinces(zoneId, provinces),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipping-zones"] });
      toast.success("Gan tinh/thanh thanh cong!");
      setShowProvinceModal(false);
    },
    onError: () => toast.error("Khong the gan tinh/thanh"),
  });

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingZone(null);
    setShowForm(false);
  };

  const handleEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      fee: String(zone.fee),
      minOrderFree: zone.minOrderFree ? String(zone.minOrderFree) : "",
      estimatedDays: zone.estimatedDays || "",
      isActive: zone.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      fee: parseInt(formData.fee, 10),
      minOrderFree: formData.minOrderFree
        ? parseInt(formData.minOrderFree, 10)
        : undefined,
      estimatedDays: formData.estimatedDays || undefined,
      isActive: formData.isActive,
    };

    if (editingZone) {
      updateMutation.mutate({ id: editingZone.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleOpenProvinces = (zone: ShippingZone) => {
    setSelectedZoneForProvinces(zone);
    setSelectedProvinces(zone.provinces.map((p) => p.province));
    setShowProvinceModal(true);
  };

  const toggleProvince = (province: string) => {
    setSelectedProvinces((prev) =>
      prev.includes(province)
        ? prev.filter((p) => p !== province)
        : [...prev, province],
    );
  };

  // Collect assigned provinces from all zones
  const assignedProvinces = zones.reduce<Record<string, string>>(
    (acc, zone) => {
      zone.provinces.forEach((p) => {
        if (
          !selectedZoneForProvinces ||
          zone.id !== selectedZoneForProvinces.id
        ) {
          acc[p.province] = zone.name;
        }
      });
      return acc;
    },
    {},
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck size={22} className="text-indigo-600" />
            Quản lý vùng vận chuyển
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Thiết lập phí ship theo khu vực
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          <Plus size={18} /> Thêm vùng
        </button>
      </div>

      {/* Zone Form */}
      {showForm && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">
              {editingZone ? "Cập nhật vùng" : "Thêm vùng mới"}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-slate-200 rounded-lg">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Tên vùng
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Nội thành HCM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Phí ship (VND)
              </label>
              <input
                type="number"
                value={formData.fee}
                onChange={(e) =>
                  setFormData({ ...formData, fee: e.target.value })
                }
                placeholder="30000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Miễn phí ship từ (VND)
              </label>
              <input
                type="number"
                value={formData.minOrderFree}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderFree: e.target.value })
                }
                placeholder="500000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Thời gian giao hàng
              </label>
              <input
                type="text"
                value={formData.estimatedDays}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedDays: e.target.value })
                }
                placeholder="1-2 ngày"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="col-span-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className="text-slate-600">
                  {formData.isActive ? (
                    <ToggleRight size={28} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={28} className="text-slate-400" />
                  )}
                </button>
                <span className="text-sm font-medium text-slate-700">
                  {formData.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                </span>
              </label>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
                <Save size={18} />
                {editingZone ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Zones Table */}
      {zones.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Truck size={48} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">Chưa có vùng vận chuyển nào</p>
          <p className="text-sm">Nhấn "Thêm vùng" để bắt đầu thiết lập</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Tên vùng
                </th>
                <th className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Phí ship
                </th>
                <th className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Miễn phí từ
                </th>
                <th className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Tỉnh/thành
                </th>
                <th className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zones.map((zone) => (
                <tr
                  key={zone.id}
                  className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {zone.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {zone.fee.toLocaleString("vi-VN")}d
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {zone.minOrderFree
                      ? `${zone.minOrderFree.toLocaleString("vi-VN")}d`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {zone.estimatedDays || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenProvinces(zone)}
                      className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      <MapPin size={14} />
                      {zone.provinces.length} tỉnh/thành phố
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        zone.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                      {zone.isActive ? "Hoat dong" : "Tam ngung"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleEdit(zone)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Ban co chac muon xoa vung nay?")) {
                            deleteMutation.mutate(zone.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Province Assignment Modal */}
      {showProvinceModal && selectedZoneForProvinces && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Gán tỉnh/thành phố cho: {selectedZoneForProvinces.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Đã chọn {selectedProvinces.length} tỉnh/thành phố
                </p>
              </div>
              <button
                onClick={() => setShowProvinceModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VIETNAM_PROVINCES.map((province) => {
                  const isSelected = selectedProvinces.includes(province);
                  const assignedTo = assignedProvinces[province];
                  const isDisabled = !!assignedTo;

                  return (
                    <button
                      key={province}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => toggleProvince(province)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                        isDisabled
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : isSelected
                            ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-300"
                      }`}
                      title={
                        isDisabled ? `Đã gán cho: ${assignedTo}` : undefined
                      }>
                      {province}
                      {isDisabled && (
                        <span className="block text-xs text-slate-400 truncate">
                          ({assignedTo})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowProvinceModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">
                Hủy
              </button>
              <button
                onClick={() =>
                  assignProvincesMutation.mutate({
                    zoneId: selectedZoneForProvinces.id,
                    provinces: selectedProvinces,
                  })
                }
                disabled={assignProvincesMutation.isPending}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
                <Save size={18} />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
