"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import Modal from "react-modal";

Modal.setAppElement("body");

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxWidth: "90vw",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

interface Course {
  _id: string;
  courseName: string;
  courseCode: string;
  semester: string;
}

export default function SemesterResourcesPage({
  params,
}: {
  params: Promise<{ semester: string }>;
}) {
  const [semesterParam, setSemesterParam] = useState<string>("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      setSemesterParam(resolvedParams.semester);
      fetchCourses(resolvedParams.semester);
    }
    init();
  }, [params]);

  const fetchCourses = async (semester: string) => {
    setDataLoading(true);
    try {
      const response = await fetch(`/api/course?semester=${semester}`);
      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      } else {
        message.error("Failed to fetch courses");
      }
    } catch (error) {
      message.error("Failed to fetch courses");
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (values: Omit<Course, "_id">) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        semester: semesterParam,
      };

      const url = editingId ? `/api/course/${editingId}` : "/api/course";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        message.success(
          `Course ${editingId ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        form.resetFields();
        setEditingId(null);
        fetchCourses(semesterParam);
      } else {
        message.error(result.error || "Operation failed");
      }
    } catch (error) {
      message.error("Operation failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Course) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/course/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        message.success("Course deleted successfully");
        fetchCourses(semesterParam);
      } else {
        message.error(result.error || "Delete failed");
      }
    } catch (error) {
      message.error("Delete failed");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleCourseClick = (courseCode: string) => {
    window.location.href = `/dashboard/resources/${semesterParam}/${courseCode}`;
  };

  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Course Code",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Course) => (
        <Space>
          <Button
            type="link"
            icon={<BookOutlined />}
            onClick={() => handleCourseClick(record.courseCode)}
          >
            Manage Chapters
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={`Courses - Semester ${semesterParam}`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Course
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="_id"
          loading={dataLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        style={customModalStyles}
        contentLabel={editingId ? "Edit Course" : "Add Course"}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
            {editingId ? "Edit Course" : "Add Course"}
          </h2>
          <Button onClick={handleCancel} icon={<CgClose />} />
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Course Name"
            name="courseName"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item
            label="Course Code"
            name="courseCode"
            rules={[{ required: true, message: "Please enter course code" }]}
          >
            <Input placeholder="Enter course code" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? "Update" : "Create"}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
