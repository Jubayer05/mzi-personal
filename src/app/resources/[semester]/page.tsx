"use client";

import { Card, Col, Empty, Row, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaBookOpen, FaHome } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const { Title, Text } = Typography;

interface Course {
  _id: string;
  courseName: string;
  courseCode: string;
  semester: string;
}

// Add this component before the main component
const CustomBreadcrumb = ({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) => {
  const router = useRouter();

  return (
    <nav className="flex items-center space-x-2 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <IoIosArrowForward className="mx-2 text-gray-400" />}
            {item.href ? (
              <button
                onClick={() => router.push(item.href!)}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >
                {index === 0 && <FaHome className="mr-1.5" />}
                {item.label}
              </button>
            ) : (
              <span className="inline-flex items-center text-sm font-medium text-gray-700 truncate">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default function SemesterPage({
  params,
}: {
  params: Promise<{ semester: string }>;
}) {
  const [semesterParam, setSemesterParam] = useState("");
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const resolved = await params;
      setSemesterParam(decodeURIComponent(resolved.semester));
      fetchCourses(decodeURIComponent(resolved.semester));
    }
    init();
  }, [params]);

  const fetchCourses = async (semester: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/course?semester=${encodeURIComponent(semester)}`
      );
      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    router.push(
      `/resources/${encodeURIComponent(course.semester)}/${encodeURIComponent(
        course.courseCode
      )}`
    );
  };

  const breadcrumbItems = [
    { label: "Resources", href: "/resources" },
    { label: semesterParam },
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CustomBreadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.push("/resources")}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="text-xl text-gray-600" />
            </button>
            <div>
              <Title level={2} className="!mb-2">
                {semesterParam} Courses
              </Title>
              <Text type="secondary">{courses.length} courses available</Text>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : courses.length === 0 ? (
            <Empty description="No courses available" />
          ) : (
            <Row gutter={[24, 24]}>
              {courses.map((course) => (
                <Col xs={24} sm={12} md={8} key={course._id}>
                  <Card
                    hoverable
                    onClick={() => handleCourseClick(course)}
                    className="h-full shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBookOpen className="text-2xl text-white" />
                      </div>
                      <Title level={4} className="!mb-2">
                        {course.courseName}
                      </Title>
                      <Text type="secondary" className="text-sm">
                        {course.courseCode}
                      </Text>
                      <div className="mt-4">
                        <IoIosArrowForward className="text-2xl text-blue-600 mx-auto" />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}
