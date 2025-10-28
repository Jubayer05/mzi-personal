"use client";

import {
  DeleteOutlined,
  EditOutlined,
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
  Select,
  Space,
  Table,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import Modal from "react-modal";

// Remove the initial Modal.setAppElement call
// We'll set it in useEffect instead

const { TextArea } = Input;
const { Option } = Select;

interface ResearchWork {
  _id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
  status: "Ongoing" | "Published";
  order: number;
}

// Custom modal styles
const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -43%)",
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

const ResearchWorkAdmin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [researchWorks, setResearchWorks] = useState<ResearchWork[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    fetchResearchWorks();
    // Set app element after component mounts
    Modal.setAppElement("body");
  }, []);

  const fetchResearchWorks = async () => {
    setDataLoading(true);
    try {
      const response = await fetch("/api/research-work");
      const result = await response.json();
      if (result.success) {
        setResearchWorks(result.data);
      } else {
        message.error("Failed to fetch research works");
      }
    } catch (error) {
      message.error("Failed to fetch research works");
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
        setImageUrl(result.url);
        message.success("Image uploaded successfully");
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

  const handleSubmit = async (values: Omit<ResearchWork, "_id">) => {
    if (!imageUrl && !editingId) {
      message.error("Please upload an image");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...values,
        image: imageUrl || values.image,
      };

      const url = editingId
        ? `/api/research-work/${editingId}`
        : "/api/research-work";
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
          `Research work ${editingId ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        form.resetFields();
        setImageUrl("");
        setFileList([]);
        setEditingId(null);
        fetchResearchWorks();
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

  const handleEdit = (record: ResearchWork) => {
    setEditingId(record._id);
    setImageUrl(record.image);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/research-work/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        message.success("Research work deleted successfully");
        fetchResearchWorks();
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
    setImageUrl("");
    setFileList([]);
    setEditingId(null);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (url: string) => (
        <img
          src={url}
          alt="Research"
          width={60}
          height={60}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 100,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: status === "Ongoing" ? "#52c41a" : "#1890ff",
            color: "white",
          }}
        >
          {status}
        </span>
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
      width: 150,
      render: (_: unknown, record: ResearchWork) => (
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
        title="Research Work Management"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Research Work
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={researchWorks}
          rowKey="_id"
          loading={dataLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        style={customModalStyles}
        contentLabel={editingId ? "Edit Research Work" : "Add Research Work"}
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
            {editingId ? "Edit Research Work" : "Add Research Work"}
          </h2>
          <Button onClick={handleCancel} icon={<CgClose />} />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "Published", order: 0 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Enter research title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter research description"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item label="Image" required>
            <Upload
              customRequest={handleUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
              listType="picture-card"
              accept="image/jpeg,image/jpg,image/png,image/webp"
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={imageUrl} alt="Preview" width={100} />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: "Please enter year" }]}
          >
            <Input placeholder="e.g., 2024" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter category" }]}
          >
            <Input placeholder="e.g., Mathematical Biology" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Option value="Published">Published</Option>
              <Option value="Ongoing">Ongoing</Option>
            </Select>
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
};

export default ResearchWorkAdmin;
