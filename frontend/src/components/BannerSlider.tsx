import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { BannerService } from "../services/api.service";
import type { Banner } from "../services/api.service";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: BannerService.getActive,
    staleTime: 60000,
  });

  // Auto slide
  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.linkUrl) {
      window.open(banner.linkUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[200px] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 cursor-pointer"
            onClick={() => handleBannerClick(banner)}>
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
