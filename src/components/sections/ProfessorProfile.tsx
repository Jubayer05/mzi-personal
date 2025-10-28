"use client";

import { Col, Row, Space, Tag, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

const { Title, Paragraph } = Typography;

interface ProfileData {
  teacherName: string;
  title: string;
  department: string;
  university: string;
  universityFull: string;
  bio: string;
  detailedBio: string;
  education: Array<{ degree: string; institution: string }>;
  specializations: string[];
}

export default function ProfessorProfile({
  showActions = true,
}: {
  showActions?: boolean;
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="py-16 text-center">No profile data available</div>;
  }

  return (
    <div className="py-16 bg-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-100 rounded-full translate-y-40 -translate-x-40 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div className="text-center">
              <div className="relative inline-block">
                <Image
                  src="/personal/mzi_personal-1.jpg"
                  alt="Profile"
                  width={350}
                  height={350}
                  className="w-[350px] h-[350px] rounded-xl object-cover shadow-xl border-4 border-white"
                />
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div className="space-y-4">
              <div>
                <Title
                  level={1}
                  className="!text-4xl !text-gray-900 !mb-2 professor-name !font-bold"
                >
                  {profile.teacherName}
                </Title>
                <div className="h-1 w-16 bg-blue-600 mb-3"></div>
                <Title
                  level={3}
                  className="!text-lg !font-semibold !mt-1 !text-gray-700 subtitle"
                >
                  {profile.title}
                </Title>
                <Title
                  level={4}
                  className="!text-base !font-medium !-mt-1 !text-gray-600 subtitle"
                >
                  {profile.department}
                </Title>
                <Title
                  level={5}
                  className="!text-sm !font-medium !text-gray-500 !mt-2 subtitle"
                >
                  {profile.universityFull}
                </Title>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Education
                </h3>
                <div className="space-y-1 text-gray-700">
                  {profile.education.map((edu, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Paragraph
                className="!text-sm !font-medium !text-gray-600 !mb-4 academic-content leading-relaxed"
                style={{ whiteSpace: "pre-line" }}
              >
                {profile.bio}
              </Paragraph>

              {!showActions && profile.detailedBio && (
                <Paragraph
                  className="!text-base !text-gray-700 !mb-4 academic-content leading-relaxed"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {profile.detailedBio}
                </Paragraph>
              )}

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Research Specializations
                </h3>
                <Space wrap size="small">
                  {profile.specializations.map((spec, index) => {
                    const colors = ["blue", "green", "purple", "orange"];
                    const color = colors[index % colors.length];
                    return (
                      <Tag
                        key={index}
                        color={color}
                        className="text-xs px-3 py-1 tag-text rounded-full"
                      >
                        {spec}
                      </Tag>
                    );
                  })}
                </Space>
              </div>

              {showActions && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/profile">
                    <button className="flex items-center gap-1 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-professional">
                      View Full Profile
                      <IoIosArrowForward className="text-sm" />
                    </button>
                  </Link>
                  <Link href="/research">
                    <button className="flex items-center gap-1 cursor-pointer bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-professional">
                      Research Work
                      <IoIosArrowForward className="text-sm" />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="flex items-center gap-1 cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold px-4 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-professional">
                      Contact Me
                      <IoIosArrowForward className="text-sm" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
