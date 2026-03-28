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
import { useTranslation } from "react-i18next";
import { formatCurrency, formatNumber } from "../utils/language";

const AdminLoyaltyTab = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const language = i18n.resolvedLanguage ?? i18n.language;
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
      toast.success(t("admin.loyalty.createTierSuccess"));
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
      toast.success(t("admin.loyalty.updateTierSuccess"));
      resetTierForm();
    },
  });

  const deleteTier = useMutation({
    mutationFn: LoyaltyService.adminDeleteTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-tiers-admin"] });
      toast.success(t("admin.loyalty.deleteTierSuccess"));
    },
  });

  const createReward = useMutation({
    mutationFn: LoyaltyService.adminCreateReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards-admin"] });
      toast.success(t("admin.loyalty.createRewardSuccess"));
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
      toast.success(t("admin.loyalty.updateRewardSuccess"));
      resetRewardForm();
    },
  });

  const deleteReward = useMutation({
    mutationFn: LoyaltyService.adminDeleteReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards-admin"] });
      toast.success(t("admin.loyalty.deleteRewardSuccess"));
    },
  });

  const adjustPointsMut = useMutation({
    mutationFn: LoyaltyService.adminAdjustPoints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-users"] });
      toast.success(t("admin.loyalty.adjustPointsSuccess"));
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

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2">
        {[
          {
            key: "tiers" as const,
            label: t("admin.loyalty.memberTiers"),
            icon: <Crown size={16} />,
          },
          {
            key: "rewards" as const,
            label: t("admin.loyalty.rewards"),
            icon: <Gift size={16} />,
          },
          {
            key: "users" as const,
            label: t("admin.loyalty.users"),
            icon: <Users size={16} />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeSection === tab.key
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
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
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t("admin.loyalty.memberTiers")}
            </h3>
            <button
              onClick={() => setShowTierForm(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors text-sm">
              <Plus size={16} /> {t("admin.loyalty.addTier")}
            </button>
          </div>

          {/* Tier Form */}
          {showTierForm && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700 dark:text-slate-200">
                  {editTierId
                    ? t("admin.loyalty.editTier")
                    : t("admin.loyalty.createTier")}
                </h4>
                <button onClick={resetTierForm} className="dark:text-slate-400">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.tierName")}
                  </label>
                  <input
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder={t("admin.loyalty.tierNamePlaceholder")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.minPoints")}
                  </label>
                  <input
                    type="number"
                    value={tierMinPoints}
                    onChange={(e) => setTierMinPoints(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.pointMultiplier")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={tierMultiplier}
                    onChange={(e) => setTierMultiplier(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.benefits")}
                  </label>
                  <input
                    value={tierBenefits}
                    onChange={(e) => setTierBenefits(e.target.value)}
                    placeholder={t("admin.loyalty.benefitsPlaceholder")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
              <button
                onClick={submitTier}
                disabled={
                  !tierName || createTier.isPending || updateTier.isPending
                }
                className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm text-white hover:bg-orange-600 disabled:opacity-50">
                {editTierId ? t("admin.common.update") : t("admin.common.create")}
              </button>
            </div>
          )}

          {/* Tiers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier: LoyaltyTier) => (
              <div
                key={tier.id}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div
                  className={`h-2 bg-gradient-to-r ${tierColors[tier.name] ?? "from-slate-400 to-slate-600"}`}
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {tier.name}
                    </h4>
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-200">
                      x{tier.pointMultiplier}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.fromPoints", {
                      points: formatNumber(tier.minPoints, language),
                    })}
                  </p>
                  {tier.benefits && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {tier.benefits}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEditTier(tier)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                      <Edit2 size={14} /> {t("admin.common.edit")}
                    </button>
                    <button
                      onClick={() => deleteTier.mutate(tier.id)}
                      className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10">
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
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t("admin.loyalty.rewards")}
            </h3>
            <button
              onClick={() => setShowRewardForm(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors text-sm">
              <Plus size={16} /> {t("admin.loyalty.addReward")}
            </button>
          </div>

          {/* Reward Form */}
          {showRewardForm && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700 dark:text-slate-200">
                  {editRewardId
                    ? t("admin.loyalty.editReward")
                    : t("admin.loyalty.createReward")}
                </h4>
                <button
                  onClick={resetRewardForm}
                  className="dark:text-slate-400">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.rewardName")}
                  </label>
                  <input
                    value={rewardName}
                    onChange={(e) => setRewardName(e.target.value)}
                    placeholder={t("admin.loyalty.rewardNamePlaceholder")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.pointsCost")}
                  </label>
                  <input
                    type="number"
                    value={rewardPointsCost}
                    onChange={(e) =>
                      setRewardPointsCost(Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    {t("admin.loyalty.rewardType")}
                  </label>
                  <select
                    value={rewardType}
                    onChange={(e) => setRewardType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <option value="COUPON">{t("admin.loyalty.couponDiscount")}</option>
                    <option value="FREE_SHIPPING">{t("admin.loyalty.freeShipping")}</option>
                  </select>
                </div>
                {rewardType === "COUPON" && (
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      {t("admin.loyalty.couponValue")}
                    </label>
                    <input
                      type="number"
                      value={rewardCouponValue}
                      onChange={(e) =>
                        setRewardCouponValue(Number(e.target.value))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
                className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm text-white hover:bg-orange-600 disabled:opacity-50">
                {editRewardId ? t("admin.common.update") : t("admin.common.create")}
              </button>
            </div>
          )}

          {/* Rewards List */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.rewards")}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.rewardType")}
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.pointsCost")}
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.rewardValue")}
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.rewardStatus")}
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.rewardActions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rewards.map((reward: PointReward) => (
                  <tr
                    key={reward.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/60">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <Gift size={16} className="text-orange-500" />
                        {reward.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {reward.rewardType === "COUPON"
                        ? t("admin.loyalty.couponDiscount")
                        : t("admin.loyalty.freeShipping")}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-orange-600">
                      {formatNumber(reward.pointsCost, language)}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300">
                      {reward.couponValue
                        ? formatCurrency(reward.couponValue, language)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          reward.isActive
                            ? "bg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                            : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200"
                        }`}>
                        {reward.isActive
                          ? t("admin.loyalty.activeReward")
                          : t("admin.loyalty.inactiveReward")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-300">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteReward.mutate(reward.id)}
                          className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-300">
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
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t("admin.loyalty.usersWithPoints")}
          </h3>

          {/* Adjust Points Form */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">
              {t("admin.loyalty.adjustPoints")}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={adjustUserId}
                onChange={(e) => setAdjustUserId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                <option value="">{t("admin.loyalty.selectUser")}</option>
                {users.map((u: LoyaltyUser) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName ?? u.email} ({formatNumber(u.totalPoints, language)} {t("admin.loyalty.points")})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={adjustPoints}
                onChange={(e) => setAdjustPoints(Number(e.target.value))}
                placeholder={t("admin.loyalty.pointsAmount")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <input
                value={adjustDesc}
                onChange={(e) => setAdjustDesc(e.target.value)}
                placeholder={t("admin.loyalty.reasonPlaceholder")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
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
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm text-white hover:bg-orange-600 disabled:opacity-50">
              {t("admin.loyalty.adjust")}
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.users")}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.totalPoints")}
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-slate-600 dark:text-slate-300">
                    {t("admin.loyalty.tier")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/60">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-yellow-500" />
                          {user.fullName ?? t("admin.loyalty.notUpdated")}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-orange-600">
                        {formatNumber(user.totalPoints, language)}
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
