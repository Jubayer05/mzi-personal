"use client";

import { Typography } from "antd";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const { Title, Paragraph } = Typography;

// Dummy data for biological mathematics research
interface ResearchWorkData {
  _id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
  status: "Ongoing" | "Published";
  order: number;
}

const ResearchWork = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [researchData, setResearchData] = useState<ResearchWorkData[]>([]);

  useEffect(() => {
    fetchResearchWorks();
  }, []);

  const fetchResearchWorks = async () => {
    try {
      const response = await fetch("/api/research-work");
      const result = await response.json();
      if (result.success) {
        setResearchData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch research works:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100 to-gray-100 rounded-full translate-y-40 -translate-x-40 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
              Research Excellence
            </span>
          </div>
          <Title
            level={2}
            className="!text-4xl !font-bold !text-slate-800 !mt-4 !mb-6"
          >
            Mathematical Biology & Computational Life Sciences
          </Title>
          <Paragraph className="!text-lg !text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Pioneering mathematical models and computational methods to
            understand complex biological systems and advance the field of
            mathematical biology.
          </Paragraph>
        </div>

        {/* Research Slider */}
        <div className="relative">
          <Slider {...settings} className="research-slider">
            {researchData.map((research) => (
              <div key={research._id} className="px-3">
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      width={200}
                      height={200}
                      src={research.image}
                      alt={research.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          research.status === "Ongoing"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {research.status}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {research.category}
                      </span>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {research.year}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {research.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3 text-sm">
                      {research.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300 flex items-center group text-sm">
                        Read More
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <div className="flex space-x-1">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors duration-300 rounded-lg hover:bg-blue-50">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M15 8a3 3 0 10-6 0 3 3 0 006 0zM6.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM16.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          </svg>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors duration-300 rounded-lg hover:bg-blue-50">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Custom Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {researchData
              .slice(0, Math.ceil(researchData.length / 3))
              .map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentSlide / 3) === index
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  onClick={() => setCurrentSlide(index * 3)}
                />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">50+</span>
            </div>
            <div className="text-slate-600 font-medium">Research Projects</div>
          </div>
          <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">120+</span>
            </div>
            <div className="text-slate-600 font-medium">Publications</div>
          </div>
          <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">15+</span>
            </div>
            <div className="text-slate-600 font-medium">Years Experience</div>
          </div>
          <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">25+</span>
            </div>
            <div className="text-slate-600 font-medium">PhD Students</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .research-slider .slick-dots {
          bottom: -50px;
        }

        .research-slider .slick-dots li button:before {
          font-size: 12px;
          color: #cbd5e1;
        }

        .research-slider .slick-dots li.slick-active button:before {
          color: #2563eb;
        }

        .research-slider .slick-prev,
        .research-slider .slick-next {
          z-index: 10;
        }

        .research-slider .slick-prev {
          left: -50px;
        }

        .research-slider .slick-next {
          right: -50px;
        }

        .research-slider .slick-prev:before,
        .research-slider .slick-next:before {
          font-size: 30px;
          color: #2563eb;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ResearchWork;
