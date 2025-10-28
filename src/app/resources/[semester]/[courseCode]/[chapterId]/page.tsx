"use client";
import { FilePdfOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Row, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const { Title, Text } = Typography;

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

interface Course {
  _id: string;
  courseName: string;
  courseCode: string;
  semester: string;
}

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

export default function ChapterPage({
  params,
}: {
  params: Promise<{ semester: string; courseCode: string; chapterId: string }>;
}) {
  const [semesterParam, setSemesterParam] = useState("");
  const [courseCodeParam, setCourseCodeParam] = useState("");
  const [chapterId, setChapterId] = useState("");
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const resolved = await params;
      const semester = decodeURIComponent(resolved.semester);
      const courseCode = decodeURIComponent(resolved.courseCode);
      setSemesterParam(semester);
      setCourseCodeParam(courseCode);
      setChapterId(resolved.chapterId);
      fetchData(semester, courseCode, resolved.chapterId);
    }
    init();
  }, [params]);

  const fetchData = async (
    semester: string,
    courseCode: string,
    chapterId: string
  ) => {
    setLoading(true);
    try {
      const [chapterRes, coursesRes] = await Promise.all([
        fetch(`/api/chapter/${chapterId}`),
        fetch(`/api/course?semester=${encodeURIComponent(semester)}`),
      ]);

      const chapterResult = await chapterRes.json();
      const coursesResult = await coursesRes.json();

      if (chapterResult.success) {
        setChapter(chapterResult.data);
      }

      if (coursesResult.success) {
        const foundCourse = coursesResult.data.find(
          (c: Course) => c.courseCode === courseCode
        );
        setCourse(foundCourse);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Resources", href: "/resources" },
    {
      label: semesterParam,
      href: `/resources/${encodeURIComponent(semesterParam)}`,
    },
    {
      label: course?.courseName || courseCodeParam,
      href: `/resources/${encodeURIComponent(
        semesterParam
      )}/${encodeURIComponent(courseCodeParam)}`,
    },
    { label: chapter?.chapterName || "" },
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CustomBreadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() =>
                router.push(
                  `/resources/${encodeURIComponent(
                    semesterParam
                  )}/${encodeURIComponent(courseCodeParam)}`
                )
              }
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="text-xl text-gray-600" />
            </button>
            <div>
              <Title level={2} className="!mb-2">
                {chapter?.chapterName}
              </Title>
              <Text type="secondary">
                {chapter?.pdfFiles.length || 0} file
                {chapter && chapter.pdfFiles.length !== 1 ? "s" : ""} available
              </Text>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : !chapter || chapter.pdfFiles.length === 0 ? (
            <Empty description="No files available" />
          ) : (
            <Row gutter={[24, 24]}>
              {chapter.pdfFiles.map((file, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card className="h-full shadow-md hover:shadow-xl transition-all">
                    <div className="text-center">
                      <FilePdfOutlined className="text-5xl text-red-600 mb-4" />
                      <div className="mb-4">
                        <Text strong className="text-base">
                          {file.fileName}
                        </Text>
                      </div>
                      {file.fileSize && (
                        <Text type="secondary" className="text-sm mb-4 block">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </Text>
                      )}
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FilePdfOutlined className="mr-2" />
                        View PDF
                      </a>
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
