"use client";

import { Col, Row, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaResearchgate } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const { Title, Paragraph, Text } = Typography;

interface Publication {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  citations: number;
  doi: string;
  image: string;
  order: number;
}

export default function Publications({
  showAll = false,
}: {
  showAll?: boolean;
}) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch("/api/publication");
      const result = await response.json();
      if (result.success) {
        setPublications(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch publications:", error);
    } finally {
      setLoading(false);
    }
  };

  const visiblePublications = showAll ? publications : publications.slice(0, 3);

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-48 -translate-x-48 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-slate-100 to-gray-100 rounded-full translate-y-40 translate-x-40 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
              Academic Publications
            </span>
          </div>
          <Title
            level={2}
            className="!text-4xl !font-bold !text-slate-800 !mt-4 !mb-6"
          >
            {showAll ? "All Publications" : "Recent Publications"}
          </Title>
          <Paragraph className="!text-lg !text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Latest research contributions to the field of mathematical biology
            and computational life sciences published in top-tier academic
            journals.
          </Paragraph>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : visiblePublications.length > 0 ? (
          <Row gutter={[24, 24]}>
            {visiblePublications.map((pub) => (
              <Col xs={24} md={8} key={pub._id}>
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 h-full">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pub.image}
                      alt={pub.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Journal Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {pub.journal}
                      </span>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {pub.year}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {pub.title}
                    </h3>

                    <div className="mb-4">
                      <Text
                        type="secondary"
                        className="text-sm leading-relaxed"
                      >
                        {pub.authors}
                      </Text>
                    </div>

                    <div className="mb-4">
                      <Text strong className="text-blue-600 text-sm">
                        {pub.journal}
                      </Text>
                      <br />
                      <Text type="secondary" className="text-xs">
                        DOI: {pub.doi}
                      </Text>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <FaResearchgate className="text-blue-500 mr-2" />
                        <span className="text-sm font-medium">
                          {pub.citations} citations
                        </span>
                      </div>
                      <a
                        href={pub.doi ? `https://doi.org/${pub.doi}` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 cursor-pointer font-semibold hover:text-blue-800 transition-colors duration-300 flex items-center group text-sm"
                      >
                        View Paper
                        <svg
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
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
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-12">
            <Text type="secondary">No publications available.</Text>
          </div>
        )}

        {!showAll && (
          <div className="text-center mt-12">
            <Link href="/publications">
              <button
                className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
            border-0 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 font-semibold px-10 py-4 
            h-auto rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 
            hover:-translate-y-1 group overflow-hidden text-white cursor-pointer"
              >
                <span className="relative z-10 flex items-center">
                  View All Publications
                  <IoIosArrowForward />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
