"use client";

import {
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Upload,
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
    width: "700px",
    maxWidth: "90vw",
    maxHeight: "80vh",
    overflow: "auto",
    padding: "24px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

interface PdfFile {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  uploadedAt: Date;
}

interface Chapter {
  _id: string;
  chapterName: string;
  courseCode: string;
  semester: string;
  pdfFiles: PdfFile[];
  order: number;
}

interface ChapterFormValues {
  chapterName: string;
  order: number;
  pdfFiles?: PdfFile[];
}

export default function CourseResourcesPage({
  params,
}: {
  params: Promise<{ semester: string; courseCode: string }>;
}) {
  const [semesterParam, setSemesterParam] = useState<string>("");
  const [courseCodeParam, setCourseCodeParam] = useState<string>("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<PdfFile[]>([]); // Track PDF files

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      setSemesterParam(resolvedParams.semester);
      setCourseCodeParam(resolvedParams.courseCode);
      fetchChapters(resolvedParams.semester, resolvedParams.courseCode);
    }
    init();
  }, [params]);

  const fetchChapters = async (semester: string, courseCode: string) => {
    setDataLoading(true);
    try {
      const response = await fetch(
        `/api/chapter?semester=${semester}&courseCode=${courseCode}`
      );
      const result = await response.json();
      if (result.success) {
        setChapters(result.data);
      } else {
        message.error("Failed to fetch chapters");
      }
    } catch (error) {
      message.error("Failed to fetch chapters");
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      const formData = new FormData();
      formData.append("file", file as File);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Add the uploaded file to our tracking state
        const newFile: PdfFile = {
          fileName: result.filename || (file as File).name,
          fileUrl: result.url,
          fileSize: (file as File).size,
          uploadedAt: new Date(),
        };

        setUploadedFiles((prev) => [...prev, newFile]);
        message.success("PDF uploaded successfully");
        onSuccess?.(result);
      } else {
        message.error(result.error || "Upload failed");
        onError?.(new Error(result.error));
      }
    } catch (error) {
      message.error("Upload failed");
      onError?.(error as Error);
    }
  };

  const handleSubmit = async (values: ChapterFormValues) => {
    if (uploadedFiles.length === 0 && !editingId) {
      message.error("Please upload at least one PDF file");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        chapterName: values.chapterName,
        pdfFiles: uploadedFiles.length > 0 ? uploadedFiles : values.pdfFiles,
        order: values.order || 0,
        courseCode: courseCodeParam,
        semester: semesterParam,
      };

      const url = editingId ? `/api/chapter/${editingId}` : "/api/chapter";
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
          `Chapter ${editingId ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
        setUploadedFiles([]);
        setEditingId(null);
        fetchChapters(semesterParam, courseCodeParam);
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

  const handleEdit = (record: Chapter) => {
    setEditingId(record._id);
    form.setFieldsValue({
      chapterName: record.chapterName,
      order: record.order,
    });

    // Set uploaded files
    setUploadedFiles(record.pdfFiles || []);

    // Set file list for display
    const pdfFiles = record.pdfFiles || [];
    const uploadFiles = pdfFiles.map((pdf, index) => ({
      uid: `existing-${index}`,
      name: pdf.fileName,
      status: "done" as const,
      url: pdf.fileUrl,
    }));
    setFileList(uploadFiles);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/chapter/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        message.success("Chapter deleted successfully");
        fetchChapters(semesterParam, courseCodeParam);
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
    setFileList([]);
    setUploadedFiles([]);
    setEditingId(null);
  };

  const handleRemoveFile = (file: UploadFile) => {
    // Remove from both states
    setFileList(fileList.filter((f) => f.uid !== file.uid));

    // If it's an existing file (not just uploaded), remove from uploadedFiles
    if (file.url) {
      setUploadedFiles((prev) => prev.filter((f) => f.fileUrl !== file.url));
    }
  };

  const columns = [
    {
      title: "Chapter Name",
      dataIndex: "chapterName",
      key: "chapterName",
    },
    {
      title: "PDF Files",
      dataIndex: "pdfFiles",
      key: "pdfFiles",
      render: (pdfFiles: PdfFile[]) => (
        <Space direction="vertical" size="small">
          {pdfFiles.map((pdf, index) => (
            <Button
              key={index}
              type="link"
              icon={<FilePdfOutlined />}
              onClick={() => window.open(pdf.fileUrl, "_blank")}
              style={{ padding: 0, height: "auto" }}
            >
              {pdf.fileName}
            </Button>
          ))}
        </Space>
      ),
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 80,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Chapter) => (
        <Space>
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
        title={`Chapters - ${courseCodeParam} (${semesterParam})`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Chapter
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={chapters}
          rowKey="_id"
          loading={dataLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        style={customModalStyles}
        contentLabel={editingId ? "Edit Chapter" : "Add Chapter"}
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
            {editingId ? "Edit Chapter" : "Add Chapter"}
          </h2>
          <Button onClick={handleCancel} icon={<CgClose />} />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ order: 0 }}
        >
          <Form.Item
            label="Chapter Name"
            name="chapterName"
            rules={[{ required: true, message: "Please enter chapter name" }]}
          >
            <Input placeholder="Enter chapter name" />
          </Form.Item>

          <Form.Item
            label="Upload PDF Files"
            rules={[
              { required: true, message: "Please upload at least one PDF" },
            ]}
          >
            <Upload
              customRequest={handleUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={handleRemoveFile}
              maxCount={10}
              accept="application/pdf"
            >
              <Button icon={<UploadOutlined />}>Upload PDF</Button>
            </Upload>
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                {uploadedFiles.length} PDF(s) ready to upload
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="Display Order"
            name="order"
            rules={[{ required: true, message: "Please enter order" }]}
          >
            <Input type="number" placeholder="0" />
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
