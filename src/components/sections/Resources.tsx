"use client";

import { Col, Empty, Row, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaChartLine,
  FaFilePdf,
  FaFolderOpen,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const { Title, Paragraph, Text } = Typography;

interface Course {
  _id: string;
  courseName: string;
  courseCode: string;
  semester: string;
}

interface PdfFile {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  uploadedAt: string;
}

interface Chapter {
  _id: string;
  chapterName: string;
  courseCode: string;
  semester: string;
  pdfFiles: PdfFile[];
  order: number;
}

const Resources = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, chaptersRes] = await Promise.all([
        fetch("/api/course"),
        fetch("/api/chapter"),
      ]);

      const coursesResult = await coursesRes.json();
      const chaptersResult = await chaptersRes.json();

      if (coursesResult.success) {
        setCourses(coursesResult.data);
      }

      if (chaptersResult.success) {
        setChapters(chaptersResult.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMaterials = (semester: string) => {
    router.push(`/resources/${encodeURIComponent(semester)}`);
  };

  const coursesBySemester = courses.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const semesterOrder = Object.keys(coursesBySemester).sort();

  // Calculate total PDFs
  const totalPdfs = chapters.reduce((total, chapter) => {
    return total + chapter.pdfFiles.length;
  }, 0);

  // Calculate total chapters
  const totalChapters = chapters.length;

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100 to-gray-100 rounded-full translate-y-40 -translate-x-40 opacity-30"></div>

      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-indigo-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm">
              Academic Resources
            </span>
          </div>
          <Title
            level={2}
            className="!text-4xl !font-bold !text-slate-800 !mt-4 !mb-6"
          >
            Resources for Students
          </Title>
          <Paragraph className="!text-lg !text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive course materials and resources organized by academic
            year and semester to support your learning journey in mathematics
            and computational sciences.
          </Paragraph>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : courses.length === 0 ? (
          <Empty description="No courses available" />
        ) : (
          <Row gutter={[24, 24]}>
            {semesterOrder.map((semester, index) => {
              const coursesInSemester = coursesBySemester[semester];
              const icon =
                index % 4 === 0
                  ? FaBookOpen
                  : index % 4 === 1
                  ? FaChartLine
                  : index % 4 === 2
                  ? FaUsers
                  : FaGraduationCap;
              const colors = [
                "from-blue-500 to-cyan-500",
                "from-cyan-500 to-teal-500",
                "from-teal-500 to-green-500",
                "from-green-500 to-emerald-500",
              ];
              const color = colors[index % 4];
              const IconComponent = icon;

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={semester}>
                  <div
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 h-full transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => handleViewMaterials(semester)}
                  >
                    <div
                      className={`bg-gradient-to-r ${color} p-6 text-white relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

                      <div className="relative z-10 text-center">
                        <IconComponent className="text-4xl mx-auto mb-3 drop-shadow-lg" />
                        <Title
                          level={4}
                          className="!text-xl !text-white !mb-1 !font-bold"
                        >
                          {semester}
                        </Title>
                        <Text className="!text-white/90 !text-sm !font-medium">
                          {coursesInSemester.length} Course
                          {coursesInSemester.length !== 1 ? "s" : ""}
                        </Text>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                        Course Materials
                      </h3>
                      <div className="space-y-3 mb-4">
                        {coursesInSemester.slice(0, 3).map((course, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-sm text-slate-600"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                            <span className="font-medium truncate">
                              {course.courseName}
                            </span>
                          </div>
                        ))}
                        {coursesInSemester.length > 3 && (
                          <div className="text-sm text-slate-500 text-center">
                            +{coursesInSemester.length - 3} more courses
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="w-full text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300 flex items-center justify-center group text-sm bg-blue-50 hover:bg-blue-100 py-3 rounded-lg">
                          View Materials
                          <IoIosArrowForward className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBookOpen className="text-2xl text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {courses.length}
            </div>
            <div className="text-slate-600 font-medium">Course Modules</div>
          </div>
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFolderOpen className="text-2xl text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {totalChapters}
            </div>
            <div className="text-slate-600 font-medium">Total Chapters</div>
          </div>
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFilePdf className="text-2xl text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {totalPdfs}
            </div>
            <div className="text-slate-600 font-medium">PDF Resources</div>
          </div>
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGraduationCap className="text-2xl text-white" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {semesterOrder.length}
            </div>
            <div className="text-slate-600 font-medium">Semesters</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
