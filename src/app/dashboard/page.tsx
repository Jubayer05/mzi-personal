"use client";

import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { useEffect, useState } from "react";

type PdfFile = { fileUrl: string; fileName: string };
type Chapter = { pdfFiles?: PdfFile[] };
type Course = { chapters?: Chapter[] };

type ProfileData = {
  teacherName: string;
  title: string;
  department: string;
  university: string;
  specializations?: string[];
  education?: Array<{ degree: string; institution: string }>;
};
type Publication = { title: string; journal?: string };
type ResearchWork = { title?: string; status?: string };

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [researchWorks, setResearchWorks] = useState<ResearchWork[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        profileRes,
        publicationsRes,
        researchRes,
        coursesRes,
        chaptersRes,
      ] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/publication"),
        fetch("/api/research-work"),
        fetch("/api/course"),
        fetch("/api/chapter"),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.data);
      }

      if (publicationsRes.ok) {
        const pubData = await publicationsRes.json();
        setPublications(pubData.data || []);
      }

      if (chaptersRes.ok) {
        const chData = await chaptersRes.json();
        setChapters(chData.data || []);
      }

      if (researchRes.ok) {
        const researchData = await researchRes.json();
        setResearchWorks(researchData.data || []);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total PDFs across all courses
  const calculateTotalPdfs = () =>
    chapters.reduce((sum, ch) => sum + (ch.pdfFiles?.length ?? 0), 0);

  const stats = [
    {
      label: "Total Publications",
      value: publications.length,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      color: "bg-blue-500",
      href: "/dashboard/publications",
    },
    {
      label: "Research Projects",
      value: researchWorks.length,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      color: "bg-green-500",
      href: "/dashboard/research-work",
    },
    {
      label: "Resources Shared",
      value: calculateTotalPdfs(),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "bg-purple-500",
      href: "/dashboard/resources",
    },
    {
      label: "Course Modules",
      value: courses.length,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "bg-orange-500",
      href: "/dashboard/resources",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section with Profile Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold mb-2 text-white">
              Welcome back,{" "}
              {user?.firstName || profile?.teacherName || "Professor"}!
            </p>
            <p className="text-blue-100">
              Here&apos;s what&apos;s happening with your academic profile
              today.
            </p>
          </div>
          {profile && (
            <div className="text-right">
              <p className="text-sm text-blue-200">{profile.title}</p>
              <p className="text-lg font-semibold">{profile.department}</p>
              <p className="text-sm text-blue-200">{profile.university}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/publications"
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <span className="font-medium text-gray-700">
                Add New Publication
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
            <Link
              href="/dashboard/resources"
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <span className="font-medium text-gray-700">Upload Resource</span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </Link>
            <Link
              href="/dashboard/settings"
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <span className="font-medium text-gray-700">Update Profile</span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent Publications */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Publications
          </h3>
          <div className="space-y-4">
            {publications.slice(0, 3).length === 0 ? (
              <p className="text-sm text-gray-500">No publications yet</p>
            ) : (
              publications.slice(0, 3).map((pub, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      {pub.title}
                    </p>
                    <p className="text-xs text-gray-500">{pub.journal}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Research Specializations
              </p>
              <p className="text-gray-900 font-medium">
                {profile.specializations?.join(", ") || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Education</p>
              <p className="text-gray-900 font-medium">
                {profile.education?.[0]?.degree || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
