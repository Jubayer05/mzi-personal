"use client";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaMapMarkerAlt,
  FaResearchgate,
  FaUniversity,
} from "react-icons/fa";

const { Title, Paragraph, Text } = Typography;

export default function ContactPage() {
  const [social, setSocial] = useState({
    github: "",
    linkedin: "",
    researchgate: "",
    email: "zohurul.islam@just.edu.bd",
    phone: "+880 1712 345 678",
  });

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const response = await fetch("/api/social");
        const result = await response.json();
        if (result.success) {
          setSocial(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch social:", error);
      }
    };
    fetchSocial();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm">
              Get In Touch
            </span>
          </div>
          <Title
            level={1}
            className="!text-5xl !font-bold !text-slate-800 !mt-4 !mb-6"
          >
            Contact Me
          </Title>
          <Paragraph className="!text-lg !text-slate-600 max-w-2xl mx-auto">
            I&apos;d love to hear from you. Feel free to reach out for
            collaborations, discussions, or any inquiries about my research and
            academic work.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Information */}
          <Col xs={24} lg={12}>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <Title level={3} className="!mb-8 !text-2xl">
                Contact Information
              </Title>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                    <MailOutlined className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <Text strong className="text-gray-900 block mb-1">
                      Email
                    </Text>
                    <a
                      href={`mailto:${social.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {social.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <PhoneOutlined className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <Text strong className="text-gray-900 block mb-1">
                      Phone
                    </Text>
                    <a
                      href={`tel:${social.phone.replace(/\s/g, "")}`}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      {social.phone}
                    </a>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                    <FaUniversity className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <Text strong className="text-gray-900 block mb-1">
                      Department
                    </Text>
                    <Text className="text-gray-600">
                      Mathematics Department
                    </Text>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                    <FaMapMarkerAlt className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <Text strong className="text-gray-900 block mb-1">
                      Location
                    </Text>
                    <Text className="text-gray-600">
                      Jashore University of Science & Technology, Bangladesh
                    </Text>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-200 transition-colors">
                    <FaGlobe className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <Text strong className="text-gray-900 block mb-1">
                      Office Hours
                    </Text>
                    <Text className="text-gray-600">
                      Mon-Fri: 9:00 AM - 5:00 PM
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Social Links */}
          <Col xs={24} lg={12}>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <Title level={3} className="!mb-8 !text-2xl">
                Connect With Me
              </Title>

              <div className="space-y-6">
                {/* GitHub */}
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4 group-hover:bg-gray-300">
                    <FaGithub className="text-2xl" />
                  </div>
                  <div>
                    <Text strong className="block text-gray-900">
                      GitHub
                    </Text>
                    <Text type="secondary" className="text-sm">
                      View my code repositories and projects
                    </Text>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-300">
                    <FaLinkedin className="text-2xl text-blue-700" />
                  </div>
                  <div>
                    <Text strong className="block text-gray-900">
                      LinkedIn
                    </Text>
                    <Text type="secondary" className="text-sm">
                      Connect with me professionally
                    </Text>
                  </div>
                </a>

                {/* ResearchGate */}
                <a
                  href={social.researchgate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-300">
                    <FaResearchgate className="text-2xl text-green-700" />
                  </div>
                  <div>
                    <Text strong className="block text-gray-900">
                      ResearchGate
                    </Text>
                    <Text type="secondary" className="text-sm">
                      Explore my research publications
                    </Text>
                  </div>
                </a>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <Paragraph className="!text-sm !text-gray-700 !mb-0 leading-relaxed">
                  💡 <strong>Tip:</strong> I&apos;m always open to
                  collaborations, research discussions, and academic inquiries.
                  Don&apos;t hesitate to reach out!
                </Paragraph>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
