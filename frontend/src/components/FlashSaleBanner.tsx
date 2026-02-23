import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlashSaleService } from "../services/api.service";
import type { FlashSale } from "../services/api.service";
import { Zap } from "lucide-react";

function useCountdown(endTime: string) {
  const calc = useCallback(() => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(() => calc());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [calc]);

  return timeLeft;
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg w-14 h-14 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-white/80 mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function FlashSaleBanner() {
  const { data: flashSales = [] } = useQuery({
    queryKey: ["flash-sales-active"],
    queryFn: FlashSaleService.getActive,
    refetchInterval: 60000,
  });

  const activeSale = flashSales[0] as FlashSale | undefined;
  const countdown = useCountdown(activeSale?.endTime ?? "");

  if (!activeSale) return null;

  const totalSold = activeSale.items.reduce((s, i) => s + i.soldQty, 0);
  const totalQty = activeSale.items.reduce((s, i) => s + i.saleQty, 0);

  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-white rounded-full translate-y-1/2" />
      </div>

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
            <Zap className="text-yellow-300" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl">
              {activeSale.name}
            </h3>
            <p className="text-white/80 text-sm">
              {totalSold}/{totalQty} san pham da ban
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm font-medium">
            Ket thuc sau:
          </span>
          <div className="flex gap-2">
            <TimeBox value={countdown.hours} label="Gio" />
            <span className="text-white text-xl font-bold self-center mb-4">
              :
            </span>
            <TimeBox value={countdown.minutes} label="Phut" />
            <span className="text-white text-xl font-bold self-center mb-4">
              :
            </span>
            <TimeBox value={countdown.seconds} label="Giay" />
          </div>
        </div>
      </div>
    </div>
  );
}
