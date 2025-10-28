"use client";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

interface SocialData {
  github: string;
  linkedin: string;
  researchgate: string;
  email: string;
  phone: string;
}

const { Title, Text } = Typography;
const { TextArea } = Input;

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

export default function SettingsAdmin() {
  const [form] = Form.useForm();
  const [socialForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [educationList, setEducationList] = useState<
    Array<{ degree: string; institution: string }>
  >([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState("");
  const [newDegree, setNewDegree] = useState("");
  const [newInstitution, setNewInstitution] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchSocial();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const result = await response.json();
      if (result.success) {
        setProfileData(result.data);
        form.setFieldsValue(result.data);
        setEducationList(result.data.education || []);
        setSpecializations(result.data.specializations || []);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchSocial = async () => {
    try {
      const response = await fetch("/api/social");
      const result = await response.json();
      if (result.success) {
        socialForm.setFieldsValue(result.data as SocialData);
      }
    } catch (error) {
      console.error("Failed to fetch social:", error);
    }
  };

  const handleSubmit = async (values: ProfileData) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        education: educationList,
        specializations,
      };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Profile updated successfully");
      } else {
        message.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSubmit = async (values: SocialData) => {
    setSavingSocial(true);
    try {
      const response = await fetch("/api/social", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (result.success) {
        message.success("Social links updated successfully");
      } else {
        message.error(result.error || "Failed to update social links");
      }
    } catch (error) {
      message.error("Failed to update social links");
    } finally {
      setSavingSocial(false);
    }
  };

  const addEducation = () => {
    if (newDegree && newInstitution) {
      setEducationList([
        ...educationList,
        { degree: newDegree, institution: newInstitution },
      ]);
      setNewDegree("");
      setNewInstitution("");
    }
  };

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const addSpecialization = () => {
    if (newSpec.trim()) {
      setSpecializations([...specializations, newSpec.trim()]);
      setNewSpec("");
    }
  };

  const removeSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Title level={2}>Profile Settings</Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card title="Basic Information" className="mb-6">
          <Form.Item
            label="Full Name"
            name="teacherName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="University (Short)"
            name="university"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="University (Full)"
            name="universityFull"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Biography (Short for Homepage)"
            name="bio"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Detailed Biography (Full Profile Page)"
            name="detailedBio"
          >
            <TextArea rows={8} />
          </Form.Item>
        </Card>

        <Space direction="vertical" size="middle">
          {" "}
        </Space>

        <Card title="Education" className="mb-6">
          <div className="space-y-4">
            {educationList.map((edu, index) => (
              <Card key={index} size="small" className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Text strong>{edu.degree}</Text>
                    <br />
                    <Text type="secondary">{edu.institution}</Text>
                  </div>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeEducation(index)}
                  />
                </div>
              </Card>
            ))}

            <div className="flex flex-wrap gap-2">
              <Input
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                placeholder="Degree"
                style={{ flex: 1, minWidth: 200 }}
              />
              <Input
                value={newInstitution}
                onChange={(e) => setNewInstitution(e.target.value)}
                placeholder="Institution"
                style={{ flex: 1, minWidth: 200 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addEducation}
              >
                Add Education
              </Button>
            </div>
          </div>
        </Card>

        <Space direction="vertical" size="middle">
          {" "}
        </Space>

        <Card title="Research Specializations" className="my-6">
          <div className="mb-4">
            <Space wrap>
              {specializations.map((spec, index) => (
                <Tag
                  key={index}
                  color="blue"
                  closable
                  onClose={() => removeSpecialization(index)}
                >
                  {spec}
                </Tag>
              ))}
            </Space>
          </div>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              placeholder="Add specialization"
            />
            <Button type="primary" onClick={addSpecialization}>
              Add
            </Button>
          </Space.Compact>
        </Card>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          className="mt-5"
        >
          Update Profile
        </Button>
      </Form>

      <Space direction="vertical" size="middle">
        {" "}
      </Space>

      <Card title="Social & Contact" className="mt-8">
        <Form form={socialForm} layout="vertical" onFinish={handleSocialSubmit}>
          <Form.Item label="GitHub URL" name="github">
            <Input placeholder="https://github.com/username" />
          </Form.Item>
          <Form.Item label="LinkedIn URL" name="linkedin">
            <Input placeholder="https://www.linkedin.com/in/username" />
          </Form.Item>
          <Form.Item label="ResearchGate URL" name="researchgate">
            <Input placeholder="https://www.researchgate.net/profile/username" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
            <Input placeholder="name@university.edu" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="+880 1XXXXXXXXX" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={savingSocial}>
            Update Social & Contact
          </Button>
        </Form>
      </Card>
    </div>
  );
}
