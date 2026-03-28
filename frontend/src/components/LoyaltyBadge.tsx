import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LoyaltyService } from "../services/api.service";
import { Crown } from "lucide-react";

const tierStyles: Record<string, string> = {
  Bronze: "bg-gradient-to-r from-amber-500 to-amber-700 text-white",
  Silver: "bg-gradient-to-r from-slate-400 to-slate-600 text-white",
  Gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
  Platinum: "bg-gradient-to-r from-indigo-400 to-indigo-600 text-white",
};

const LoyaltyBadge = () => {
  const { t } = useTranslation();
  const { data: balance } = useQuery({
    queryKey: ["loyalty-balance"],
    queryFn: LoyaltyService.getBalance,
    retry: false,
  });

  if (!balance?.tier) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-white/20 dark:ring-white/10 ${
        tierStyles[balance.tier.name] ?? "bg-slate-500 text-white"
      }`}>
      <Crown size={12} />
      {t(`loyalty.tiers.${balance.tier.name}`, balance.tier.name)}
    </div>
  );
};

export default LoyaltyBadge;
