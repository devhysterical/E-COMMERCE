import { useState } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import type { ProductImage } from "../services/api.service";

interface ImageGalleryProps {
  images: ProductImage[];
  mainImageUrl?: string | null;
  productName: string;
}

const ImageGallery = ({
  images,
  mainImageUrl,
  productName,
}: ImageGalleryProps) => {
  // Tạo danh sách ảnh: ưu tiên images từ ProductImage, fallback mainImageUrl
  const allImages =
    images.length > 0
      ? images.map((img) => img.imageUrl)
      : mainImageUrl
      ? [mainImageUrl]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm flex items-center justify-center">
        <div className="text-slate-400 text-center">
          <Package size={64} />
          <p className="mt-2">Không có ảnh</p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
        <img
          src={allImages[currentIndex]}
          alt={`${productName} - ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors">
              <ChevronLeft size={24} className="text-slate-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors">
              <ChevronRight size={24} className="text-slate-700" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-indigo-600 ring-2 ring-indigo-200"
                  : "border-slate-200 hover:border-slate-300"
              }`}>
              <img
                src={url}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
