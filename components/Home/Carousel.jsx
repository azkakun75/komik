"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ComicCard from "@/components/Comic/ComicCard";
import SkeletonCard from "@/components/Comic/SkeletonCard";

export default function Carousel({ items, loading, emptyMessage }) {
  if (loading || !items) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="panel flex items-center justify-center p-10 text-sm text-subtext">
        {emptyMessage || "Belum ada data untuk section ini."}
      </div>
    );
  }
  return (
    <Swiper
      modules={[Navigation, FreeMode, Mousewheel]}
      slidesPerView={2}
      spaceBetween={16}
      navigation
      freeMode
      mousewheel={{ forceToAxis: true }}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 },
      }}
      className="comic-swiper [&_.swiper-button-next]:!text-accent [&_.swiper-button-prev]:!text-accent [&_.swiper-button-next]:!h-9 [&_.swiper-button-prev]:!h-9 [&_.swiper-button-next:after]:!text-xs [&_.swiper-button-prev:after]:!text-xs"
    >
      {items.map((c, i) => (
        <SwiperSlide key={(c.slug || "x") + i}>
          <ComicCard comic={c} index={i} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
