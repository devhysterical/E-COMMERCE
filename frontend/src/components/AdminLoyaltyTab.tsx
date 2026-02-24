import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoyaltyService } from "../services/api.service";
import type {
  LoyaltyTier,
  PointReward,
  LoyaltyUser,
} from "../services/api.service";
import { toast } from "react-toastify";
import { Plus, Trash2, Star, Gift, Users, Edit2, X, Crown } from "lucide-react";

const AdminLoyaltyTab = () => {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<
    "tiers" | "rewards" | "users"
  >("tiers");

  // --- Tiers ---
  const [showTierForm, setShowTierForm] = useState(false);
  const [editTierId, setEditTierId] = useState<string | null>(null);
  const [tierName, setTierName] = useState("");
  const [tierMinPoints, setTierMinPoints] = useState(0);
  const [tierMultiplier, setTierMultiplier] = useState(1.0);
  const [tierBenefits, setTierBenefits] = useState("");

  // --- Rewards ---
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [editRewardId, setEditRewardId] = useState<string | null>(null);
  const [rewardName, setRewardName] = useState("");
  const [rewardPointsCost, setRewardPointsCost] = useState(0);
  const [rewardType, setRewardType] = useState("COUPON");
  const [rewardCouponValue, setRewardCouponValue] = useState(0);

  // --- Adjust Points ---
  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustPoints, setAdjustPoints] = useState(0);
  const [adjustDesc, setAdjustDesc] = useState("");

  const { data: tiers = [] } = useQuery({
    queryKey: ["loyalty-tiers-admin"],
    queryFn: LoyaltyService.adminGetTiers,
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ["loyalty-rewards-admin"],
    queryFn: LoyaltyService.adminGetRewards,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["loyalty-users"],
    queryFn: LoyaltyService.adminGetUsers,
  });

  // Mutations
  const createTier = useMutation({
    mutationFn: LoyaltyService.adminCreateTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-tiers-admin"] });
      toast.success("Tạo hạng thành công");
      resetTierForm();
    },
  });

  const updateTier = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        name: string;
        minPoints: number;
        pointMultiplier: number;
        benefits: string;
      }>;
    }) => LoyaltyService.adminUpdateTier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-tiers-admin"] });
      toast.success("Cập nhật hạng thành công");
      resetTierForm();
    },
  });

  const deleteTier = useMutation({
    mutationFn: LoyaltyService.adminDeleteTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-tiers-admin"] });
      toast.success("Xóa hạng thành công");
    },
  });

  const createReward = useMutation({
    mutationFn: LoyaltyService.adminCreateReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards-admin"] });
      toast.success("Tạo phần thưởng thành công");
      resetRewardForm();
    },
  });

  const updateReward = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        name: string;
        pointsCost: number;
        rewardType: string;
        couponValue: number;
        isActive: boolean;
      }>;
    }) => LoyaltyService.adminUpdateReward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards-admin"] });
      toast.success("Cập nhật phần thưởng thành công");
      resetRewardForm();
    },
  });

  const deleteReward = useMutation({
    mutationFn: LoyaltyService.adminDeleteReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards-admin"] });
      toast.success("Xóa phần thưởng thành công");
    },
  });

  const adjustPointsMut = useMutation({
    mutationFn: LoyaltyService.adminAdjustPoints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-users"] });
      toast.success("Điều chỉnh điểm thành công");
      setAdjustUserId("");
      setAdjustPoints(0);
      setAdjustDesc("");
    },
  });

  const resetTierForm = () => {
    setShowTierForm(false);
    setEditTierId(null);
    setTierName("");
    setTierMinPoints(0);
    setTierMultiplier(1.0);
    setTierBenefits("");
  };

  const resetRewardForm = () => {
    setShowRewardForm(false);
    setEditRewardId(null);
    setRewardName("");
    setRewardPointsCost(0);
    setRewardType("COUPON");
    setRewardCouponValue(0);
  };

  const handleEditTier = (tier: LoyaltyTier) => {
    setEditTierId(tier.id);
    setTierName(tier.name);
    setTierMinPoints(tier.minPoints);
    setTierMultiplier(tier.pointMultiplier);
    setTierBenefits(tier.benefits ?? "");
    setShowTierForm(true);
  };

  const handleEditReward = (reward: PointReward) => {
    setEditRewardId(reward.id);
    setRewardName(reward.name);
    setRewardPointsCost(reward.pointsCost);
    setRewardType(reward.rewardType);
    setRewardCouponValue(reward.couponValue ?? 0);
    setShowRewardForm(true);
  };

  const submitTier = () => {
    const data = {
      name: tierName,
      minPoints: tierMinPoints,
      pointMultiplier: tierMultiplier,
      benefits: tierBenefits || undefined,
    };
    if (editTierId) {
      updateTier.mutate({ id: editTierId, data });
    } else {
      createTier.mutate(data);
    }
  };

  const submitReward = () => {
    const data = {
      name: rewardName,
      pointsCost: rewardPointsCost,
      rewardType,
      couponValue: rewardType === "COUPON" ? rewardCouponValue : undefined,
    };
    if (editRewardId) {
      updateReward.mutate({ id: editRewardId, data });
    } else {
      createReward.mutate(data);
    }
  };

  const tierColors: Record<string, string> = {
    Bronze: "from-amber-600 to-amber-800",
    Silver: "from-slate-400 to-slate-600",
    Gold: "from-yellow-400 to-yellow-600",
    Platinum: "from-indigo-400 to-indigo-600",
  };

  const formatVND = (value: number) => value.toLocaleString("vi-VN");

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2">
        {[
          {
            key: "tiers" as const,
            label: "Hạng thành viên",
            icon: <Crown size={16} />,
          },
          {
            key: "rewards" as const,
            label: "Phần thưởng",
            icon: <Gift size={16} />,
          },
          {
            key: "users" as const,
            label: "Người dùng",
            icon: <Users size={16} />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeSection === tab.key
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tiers Section */}
      {activeSection === "tiers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Hạng thành viên
            </h3>
            <button
              onClick={() => setShowTierForm(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors text-sm">
              <Plus size={16} /> Thêm hạng
            </button>
          </div>

          {/* Tier Form */}
          {showTierForm && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700">
                  {editTierId ? "Sửa hạng" : "Tạo hạng mới"}
                </h4>
                <button onClick={resetTierForm}>
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500">Tên hạng</label>
                  <input
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder="Bronze, Silver, Gold..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">
                    Điểm tối thiểu
                  </label>
                  <input
                    type="number"
                    value={tierMinPoints}
                    onChange={(e) => setTierMinPoints(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">
                    Hệ số nhân điểm
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={tierMultiplier}
                    onChange={(e) => setTierMultiplier(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Quyền lợi</label>
                  <input
                    value={tierBenefits}
                    onChange={(e) => setTierBenefits(e.target.value)}
                    placeholder="Mô tả quyền lợi..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1"
                  />
                </div>
              </div>
              <button
                onClick={submitTier}
                disabled={
                  !tierName || createTier.isPending || updateTier.isPending
                }
                className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-50">
                {editTierId ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          )}

          {/* Tiers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier: LoyaltyTier) => (
              <div
                key={tier.id}
                className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div
                  className={`h-2 bg-gradient-to-r ${tierColors[tier.name] ?? "from-slate-400 to-slate-600"}`}
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg text-slate-800">
                      {tier.name}
                    </h4>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                      x{tier.pointMultiplier}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Từ {formatVND(tier.minPoints)} điểm
                  </p>
                  {tier.benefits && (
                    <p className="text-xs text-slate-400">{tier.benefits}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEditTier(tier)}
                      className="flex-1 flex items-center justify-center gap-1 text-sm text-slate-600 border border-slate-200 rounded-lg py-1.5 hover:bg-slate-50">
                      <Edit2 size={14} /> Sửa
                    </button>
                    <button
                      onClick={() => deleteTier.mutate(tier.id)}
                      className="flex items-center justify-center text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Section */}
      {activeSection === "rewards" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Phan thuong
            </h3>
            <button
              onClick={() => setShowRewardForm(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors text-sm">
              <Plus size={16} /> Thêm phần thưởng
            </button>
          </div>

          {/* Reward Form */}
          {showRewardForm && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700">
                  {editRewardId ? "Sửa phần thưởng" : "Tạo phần thưởng mới"}
                </h4>
                <button onClick={resetRewardForm}>
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500">Tên</label>
                  <input
                    value={rewardName}
                    onChange={(e) => setRewardName(e.target.value)}
                    placeholder="Giảm 50k, Free Ship..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Điểm cần đổi</label>
                  <input
                    type="number"
                    value={rewardPointsCost}
                    onChange={(e) =>
                      setRewardPointsCost(Number(e.target.value))
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Loại</label>
                  <select
                    value={rewardType}
                    onChange={(e) => setRewardType(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1 bg-white">
                    <option value="COUPON">Coupon giảm giá</option>
                    <option value="FREE_SHIPPING">Miễn phí vận chuyển</option>
                  </select>
                </div>
                {rewardType === "COUPON" && (
                  <div>
                    <label className="text-xs text-slate-500">
                      Giá trị coupon (VND)
                    </label>
                    <input
                      type="number"
                      value={rewardCouponValue}
                      onChange={(e) =>
                        setRewardCouponValue(Number(e.target.value))
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mt-1"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={submitReward}
                disabled={
                  !rewardName ||
                  !rewardPointsCost ||
                  createReward.isPending ||
                  updateReward.isPending
                }
                className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-50">
                {editRewardId ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          )}

          {/* Rewards List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Phần thưởng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Loại
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-slate-600">
                    Điểm cần
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-slate-600">
                    Giá trị
                  </th>
                  <th className="text-center px-6 py-3 font-medium text-slate-600">
                    Trạng thái
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-slate-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rewards.map((reward: PointReward) => (
                  <tr key={reward.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <Gift size={16} className="text-orange-500" />
                        {reward.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {reward.rewardType === "COUPON"
                        ? "Coupon giảm giá"
                        : "Miễn phí ship"}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-orange-600">
                      {formatVND(reward.pointsCost)}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      {reward.couponValue
                        ? `${formatVND(reward.couponValue)}đ`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          reward.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                        {reward.isActive ? "Hoạt động" : "Ngừng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="text-slate-500 hover:text-orange-500">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteReward.mutate(reward.id)}
                          className="text-slate-500 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Section */}
      {activeSection === "users" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Người dùng có điểm
          </h3>

          {/* Adjust Points Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h4 className="font-medium text-slate-700">Điều chỉnh điểm</h4>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={adjustUserId}
                onChange={(e) => setAdjustUserId(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                <option value="">Chọn người dùng</option>
                {users.map((u: LoyaltyUser) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName ?? u.email} ({formatVND(u.totalPoints)} điểm)
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={adjustPoints}
                onChange={(e) => setAdjustPoints(Number(e.target.value))}
                placeholder="Số điểm (+/-)"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              />
              <input
                value={adjustDesc}
                onChange={(e) => setAdjustDesc(e.target.value)}
                placeholder="Lý do..."
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <button
              onClick={() =>
                adjustPointsMut.mutate({
                  userId: adjustUserId,
                  points: adjustPoints,
                  description: adjustDesc,
                })
              }
              disabled={
                !adjustUserId ||
                !adjustPoints ||
                !adjustDesc ||
                adjustPointsMut.isPending
              }
              className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-50">
              Điều chỉnh
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Người dùng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-600">
                    Email
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-slate-600">
                    Tổng điểm
                  </th>
                  <th className="text-center px-6 py-3 font-medium text-slate-600">
                    Hạng
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user: LoyaltyUser) => {
                  const userTier =
                    [...tiers]
                      .sort(
                        (a: LoyaltyTier, b: LoyaltyTier) =>
                          b.minPoints - a.minPoints,
                      )
                      .find(
                        (t: LoyaltyTier) => user.totalPoints >= t.minPoints,
                      ) ?? null;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-yellow-500" />
                          {user.fullName ?? "Chưa cập nhật"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-right font-bold text-orange-600">
                        {formatVND(user.totalPoints)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {userTier && (
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium bg-gradient-to-r text-white ${tierColors[userTier.name] ?? "from-slate-400 to-slate-600"}`}>
                            {userTier.name}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoyaltyTab;
