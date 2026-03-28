import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LoyaltyService } from "../services/api.service";
import type {
  PointTransaction,
  PointReward,
  LoyaltyTier,
} from "../services/api.service";
import { toast } from "react-toastify";
import {
  Star,
  Gift,
  ArrowUp,
  ArrowDown,
  Crown,
  Clock,
  CheckCircle,
} from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "../utils/language";

const tierColors: Record<string, { bg: string; text: string; border: string }> =
  {
    Bronze: {
      bg: "bg-gradient-to-r from-amber-100 to-amber-200",
      text: "text-amber-800",
      border: "border-amber-300",
    },
    Silver: {
      bg: "bg-gradient-to-r from-slate-100 to-slate-200",
      text: "text-slate-700",
      border: "border-slate-300",
    },
    Gold: {
      bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    Platinum: {
      bg: "bg-gradient-to-r from-indigo-100 to-indigo-200",
      text: "text-indigo-800",
      border: "border-indigo-300",
    },
  };

const LoyaltyPage = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const { data: balance } = useQuery({
    queryKey: ["loyalty-balance"],
    queryFn: LoyaltyService.getBalance,
  });

  const { data: history = [] } = useQuery({
    queryKey: ["loyalty-history"],
    queryFn: LoyaltyService.getHistory,
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ["loyalty-rewards"],
    queryFn: LoyaltyService.getRewards,
  });

  const { data: tiers = [] } = useQuery({
    queryKey: ["loyalty-tiers"],
    queryFn: LoyaltyService.getTiers,
  });

  const redeemMut = useMutation({
    mutationFn: LoyaltyService.redeem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-balance"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty-history"] });
      toast.success(t("loyalty.redeemSuccess", { code: data.couponCode }));
      setRedeemingId(null);
    },
    onError: () => {
      toast.error(t("loyalty.redeemError"));
      setRedeemingId(null);
    },
  });

  const currentTier = balance?.tier;
  const sortedTiers = [...tiers].sort(
    (a: LoyaltyTier, b: LoyaltyTier) => a.minPoints - b.minPoints,
  );
  const nextTier = sortedTiers.find(
    (t: LoyaltyTier) => t.minPoints > (balance?.totalPoints ?? 0),
  );
  const progress = nextTier
    ? Math.min(((balance?.totalPoints ?? 0) / nextTier.minPoints) * 100, 100)
    : 100;

  const typeIcons: Record<string, React.ReactNode> = {
    EARN: <ArrowUp size={14} className="text-green-500" />,
    REDEEM: <ArrowDown size={14} className="text-red-500" />,
    EXPIRE: <Clock size={14} className="text-slate-400" />,
    ADJUST: <CheckCircle size={14} className="text-blue-500" />,
  };

  const typeLabels: Record<string, string> = {
    EARN: t("loyalty.transactionTypes.earn"),
    REDEEM: t("loyalty.transactionTypes.redeem"),
    EXPIRE: t("loyalty.transactionTypes.expire"),
    ADJUST: t("loyalty.transactionTypes.adjust"),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-slate-900 dark:text-slate-100">
      {/* Balance Card */}
      <div
        className={`rounded-3xl p-8 ${
          currentTier
            ? (tierColors[currentTier.name]?.bg ?? "bg-slate-100")
            : "bg-slate-100"
        } border ${
          currentTier
            ? (tierColors[currentTier.name]?.border ?? "border-slate-200")
            : "border-slate-200"
        }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
              {t("loyalty.totalPoints")}
            </p>
            <p className="text-4xl font-bold text-slate-800 dark:text-white">
              {formatNumber(balance?.totalPoints ?? 0, i18n.resolvedLanguage)}
            </p>
            {currentTier && (
              <div className="flex items-center gap-2 mt-3">
                <Crown size={18} className="text-orange-500" />
                <span
                  className={`font-semibold ${
                    tierColors[currentTier.name]?.text ?? "text-slate-700"
                  }`}>
                  {t("loyalty.currentTier", {
                    tier: t(
                      `loyalty.tiers.${currentTier.name}`,
                      currentTier.name,
                    ),
                  })}
                </span>
                <span className="text-xs bg-white/60 dark:bg-slate-950/40 px-2 py-0.5 rounded-full">
                  {t("loyalty.multiplier", { multiplier: currentTier.multiplier })}
                </span>
              </div>
            )}
          </div>
          <Star size={64} className="text-yellow-400/50" />
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300 mb-1">
              <span>
                {currentTier
                  ? t(`loyalty.tiers.${currentTier.name}`, currentTier.name)
                  : t("loyalty.noTier")}
              </span>
              <span>
                {t(`loyalty.tiers.${nextTier.name}`, nextTier.name)} (
                {formatNumber(nextTier.minPoints, i18n.resolvedLanguage)}{" "}
                {t("loyalty.points")})
              </span>
            </div>
            <div className="h-2.5 bg-white/50 dark:bg-slate-950/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
              {t("loyalty.pointsToNextTier", {
                points: formatNumber(
                  nextTier.minPoints - (balance?.totalPoints ?? 0),
                  i18n.resolvedLanguage,
                ),
                tier: t(`loyalty.tiers.${nextTier.name}`, nextTier.name),
              })}
            </p>
          </div>
        )}
      </div>

      {/* Rewards */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Gift size={22} className="text-orange-500" />{" "}
          {t("loyalty.rewardsTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward: PointReward) => {
            const canRedeem = (balance?.totalPoints ?? 0) >= reward.pointsCost;
            return (
              <div
                key={reward.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3 hover:shadow-lg dark:hover:shadow-slate-950/40 transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {reward.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {reward.rewardType === "COUPON"
                        ? t("loyalty.couponReward", {
                            amount: formatCurrency(
                              reward.couponValue ?? 0,
                              i18n.resolvedLanguage,
                            ),
                          })
                        : t("loyalty.freeShippingReward")}
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-600 text-sm font-bold px-3 py-1 rounded-full">
                    {formatNumber(reward.pointsCost, i18n.resolvedLanguage)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setRedeemingId(reward.id);
                    redeemMut.mutate(reward.id);
                  }}
                  disabled={!canRedeem || redeemMut.isPending}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    canRedeem
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                   }`}>
                  {redeemingId === reward.id && redeemMut.isPending
                    ? t("common.processing")
                    : canRedeem
                      ? t("loyalty.redeemNow")
                      : t("loyalty.missingPoints", {
                          points: formatNumber(
                            reward.pointsCost - (balance?.totalPoints ?? 0),
                            i18n.resolvedLanguage,
                          ),
                        })}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tiers Info */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Crown size={22} className="text-orange-500" />{" "}
          {t("loyalty.tiersTitle")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sortedTiers.map((tier: LoyaltyTier) => {
            const isActive = currentTier?.name === tier.name;
            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  isActive
                    ? `${tierColors[tier.name]?.border ?? "border-orange-500"} ${tierColors[tier.name]?.bg ?? "bg-orange-50"} shadow-lg`
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                 }`}>
                <div className="text-center space-y-2">
                  <Crown
                    size={28}
                    className={
                      isActive
                        ? "text-orange-500 mx-auto"
                        : "text-slate-300 dark:text-slate-600 mx-auto"
                     }
                   />
                  <h3
                    className={`font-bold text-lg ${
                      isActive
                        ? (tierColors[tier.name]?.text ?? "text-orange-700")
                        : "text-slate-600 dark:text-slate-300"
                     }`}>
                    {t(`loyalty.tiers.${tier.name}`, tier.name)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("loyalty.fromPoints", {
                      points: formatNumber(
                        tier.minPoints,
                        i18n.resolvedLanguage,
                      ),
                    })}
                  </p>
                  <p className="text-sm font-medium text-orange-500">
                    {t("loyalty.multiplier", {
                      multiplier: tier.pointMultiplier,
                    })}
                  </p>
                  {tier.benefits && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {tier.benefits}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
          {t("loyalty.historyTitle")}
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {history.length === 0 ? (
            <p className="text-center text-slate-400 dark:text-slate-500 py-12">
              {t("loyalty.emptyHistory")}
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((tx: PointTransaction) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/70">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {typeIcons[tx.type]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {tx.description}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {typeLabels[tx.type]} -{" "}
                        {formatDate(tx.createdAt, i18n.resolvedLanguage)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-sm ${
                      tx.points > 0 ? "text-green-600" : "text-red-500"
                    }`}>
                    {tx.points > 0 ? "+" : ""}
                    {formatNumber(tx.points, i18n.resolvedLanguage)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
