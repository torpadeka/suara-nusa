"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperItem {
    judul?: string;
    nama?: string;
    deskripsi?: string;
    url_gambar?: string;
    pic?: string;
}

interface SwiperComponentProps {
    items: SwiperItem[];
    activeTab: string;
}

export const SwiperComponent: React.FC<SwiperComponentProps> = ({
    items,
    activeTab,
}) => {
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            className="h-full transition-all duration-500 ease-in-out"
        >
            {items.map((item, index) => (
                <SwiperSlide
                    key={index}
                    className="flex flex-col items-center text-center px-4"
                >
                    <img
                        src={item.url_gambar || item.pic || ""}
                        alt={item.judul || item.nama || ""}
                        className="w-full h-72 object-cover rounded-xl shadow-md mb-4 transition-transform duration-300 hover:scale-105"
                    />
                    <h3 className="text-lg font-bold text-gray-800">
                        {item.judul || item.nama}
                    </h3>
                    {item.deskripsi && (
                        <p className="text-sm text-gray-600 mt-2">
                            {item.deskripsi}
                        </p>
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
