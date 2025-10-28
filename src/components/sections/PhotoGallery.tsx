"use client";

import { galleryData } from "@/data/galleryData";
import Image from "next/image";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface PhotoModalProps {
  image: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoModal = ({ image, title, isOpen, onClose }: PhotoModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-95 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-6xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
          aria-label="Close modal"
        >
          <IoClose className="text-3xl" />
        </button>
        <div className="relative w-full h-[80vh]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <p className="text-white text-center mt-6 text-xl font-medium">
          {title}
        </p>
      </div>
    </div>
  );
};

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
  } | null>(null);

  const handleImageClick = (image: string, title: string) => {
    setSelectedImage({ image, title });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Different aspect ratios for varied sizes, but ensure last few items have similar heights
  const getAspectClass = (index: number, totalItems: number) => {
    const patterns = [
      "aspect-[4/5]", // tall
      "aspect-[16/9]", // wide
      "aspect-square", // square
      "aspect-[3/4]", // portrait
      "aspect-[5/4]", // landscape
      "aspect-[4/5]", // tall
      "aspect-[16/9]", // wide
      "aspect-[3/4]", // portrait
      "aspect-square", // square
      "aspect-[5/4]", // landscape
      "aspect-[4/5]", // tall
      "aspect-[16/9]", // wide
      "aspect-[3/4]", // portrait
    ];

    // For the last 3-4 items, use consistent aspect ratios to align bottom
    const itemsFromEnd = totalItems - index;
    if (itemsFromEnd <= 4) {
      // Use consistent aspect ratios for bottom row alignment
      const bottomPatterns = [
        "aspect-[4/3]",
        "aspect-[4/3]",
        "aspect-[4/3]",
        "aspect-[4/3]",
      ];
      return bottomPatterns[(index - (totalItems - 4)) % bottomPatterns.length];
    }

    return patterns[index % patterns.length];
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-100 rounded-full translate-y-40 -translate-x-40 opacity-30"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="section-title text-4xl md:text-5xl text-gray-900 mb-3 font-bold">
              Photo Gallery
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-4"></div>
          </div>
          <p className="subtitle text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Explore moments and memories from conferences, research, and
            academic journey
          </p>
        </div>

        {/* Professional Masonry Grid with Different Sizes */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {galleryData.map((item, index) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-4 md:mb-6 cursor-pointer group"
              onClick={() => handleImageClick(item.image, item.title)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                {/* Image Container with Variable Aspect Ratio */}
                <div
                  className={`relative ${getAspectClass(
                    index,
                    galleryData.length
                  )} overflow-hidden`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-blue-300 text-sm mt-1 font-medium">
                    Click to view
                  </p>
                </div>

                {/* Subtle border on hover */}
                <div className="absolute inset-0 border-4 border-blue-500 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Section */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-base font-medium">
            Click on any image to view in full size
          </p>
        </div>
      </div>

      <PhotoModal
        image={selectedImage?.image || ""}
        title={selectedImage?.title || ""}
        isOpen={!!selectedImage}
        onClose={closeModal}
      />
    </section>
  );
};

export default PhotoGallery;
