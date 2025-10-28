"use client";
import { PROFILE_IMAGE, TEACHER_NAME } from "@/data/customData";
import {
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Col, Divider, Row, Space, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaGithub,
  FaGlobe,
  FaMapMarkerAlt,
  FaResearchgate,
  FaUniversity,
} from "react-icons/fa";

const { Title, Paragraph } = Typography;

const Footer = () => {
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

  const navLeft = [
    { label: "Profile", href: "/profile" },
    { label: "Research", href: "/research" },
    { label: "Publications", href: "/publications" },
    { label: "Teaching", href: "/resources" },
  ];

  const navRight = [
    { label: "Resources", href: "/resources" },
    { label: "Get in Touch", href: "/contact" },
    { label: "Collaboration", href: "/research" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white pt-20 pb-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-48 -translate-x-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-40 translate-x-40"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400/60 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-indigo-400/60 rounded-full animate-ping"></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Row gutter={[48, 48]}>
          {/* Professor Info */}
          <Col xs={24} md={8}>
            <div className="flex items-center mb-6">
              <Image
                src={PROFILE_IMAGE}
                alt="Profile"
                width={60}
                height={60}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 mr-4 shadow-lg"
              />
              <div>
                <h3 className="text-2xl font-bold !text-white">
                  {TEACHER_NAME}
                </h3>
                <p className="text-blue-300 font-medium">Associate Professor</p>
                <p className="text-gray-400 text-sm">
                  Department of Mathematics
                </p>
              </div>
            </div>
            <Paragraph className="!text-gray-300 leading-relaxed text-base">
              Dedicated to advancing mathematical biology and computational life
              sciences education. Passionate about mentoring the next generation
              of researchers and contributing to breakthrough discoveries in
              mathematical modeling.
            </Paragraph>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="!text-white font-semibold mb-5">
                Connect With Me
              </h4>
              <Space size="middle">
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="text-2xl cursor-pointer hover:text-blue-400 transition-colors" />
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinOutlined className="text-2xl cursor-pointer hover:text-blue-400 transition-colors" />
                  </a>
                )}
                {social.researchgate && (
                  <a
                    href={social.researchgate}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaResearchgate className="text-2xl cursor-pointer hover:text-blue-400 transition-colors" />
                  </a>
                )}
              </Space>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} md={8}>
            <Title level={4} className="!text-white !mb-6 !text-xl">
              Quick Navigation
            </Title>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {navLeft.map((link) => (
                  <div key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-400"></div>
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {navRight.map((link) => (
                  <div key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-400"></div>
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Contact Information */}
          <Col xs={24} md={8}>
            <Title level={4} className="!text-white !mb-6 !text-xl">
              Contact Information
            </Title>
            <div className="space-y-4">
              <div className="flex items-start">
                <MailOutlined className="mr-3 text-blue-400 mt-1 text-lg" />
                <div>
                  <span className="text-gray-300 block">Email</span>
                  <a
                    href={`mailto:${social.email}`}
                    className="text-blue-300 hover:text-blue-200 transition-colors duration-300"
                  >
                    {social.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneOutlined className="mr-3 text-blue-400 mt-1 text-lg" />
                <div>
                  <span className="text-gray-300 block">Phone</span>
                  <a
                    href={`tel:${social.phone.replace(/\s/g, "")}`}
                    className="text-blue-300 hover:text-blue-200 transition-colors duration-300"
                  >
                    {social.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <FaUniversity className="mr-3 text-blue-400 mt-1 text-lg" />
                <div>
                  <span className="text-gray-300 block">Department</span>
                  <span className="text-blue-300">Mathematics Department</span>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="mr-3 text-blue-400 mt-1 text-lg" />
                <div>
                  <span className="text-gray-300 block">Location</span>
                  <span className="text-blue-300">
                    Jashore University of Science & Technology
                  </span>
                </div>
              </div>
              <div className="flex items-start">
                <FaGlobe className="mr-3 text-blue-400 mt-1 text-lg" />
                <div>
                  <span className="text-gray-300 block">Office Hours</span>
                  <span className="text-blue-300">
                    Mon-Fri: 9:00 AM - 5:00 PM
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="!border-gray-700 !my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Dr. Md. Zohurul Islam. All
              rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Jashore University of Science and Technology, Bangladesh
            </p>
          </div>

          <div className="flex items-center space-x-6 gap-1">
            Developed by{" "}
            <a
              href="https://polynomicx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-semibold visited:text-blue-400 hover:text-blue-600 transition-colors duration-300 text-sm"
            >
              PolynomicX
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
