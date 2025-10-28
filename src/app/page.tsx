"use client";

import PhotoGallery from "@/components/sections/PhotoGallery";
import ProfessorProfile from "@/components/sections/ProfessorProfile";
import Publications from "@/components/sections/Publications";
import ResearchWork from "@/components/sections/ResearchWork";
import Resources from "@/components/sections/Resources";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}

      {/* Professor Profile Section */}
      <ProfessorProfile />

      {/* Research Work Slider */}
      <ResearchWork />

      {/* Publications */}
      <Publications />

      {/* Resources for Students */}
      <Resources />

      {/* Gallery */}
      <PhotoGallery />
    </div>
  );
}
