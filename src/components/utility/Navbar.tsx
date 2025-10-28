"use client";

import { PROFILE_IMAGE, TEACHER_NAME } from "@/data/customData";
import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "profile", label: "Profile", href: "/profile" },
    { key: "research", label: "Research", href: "/research" },
    { key: "publications", label: "Publications", href: "/publications" },
    { key: "resources", label: "Resources", href: "/resources" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Profile Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src={PROFILE_IMAGE}
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full mr-3 border-2 border-blue-100"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {TEACHER_NAME}
                </h1>
                <p className="text-xs text-gray-600">
                  Professor of Mathematics
                </p>
                <p className="text-xs text-gray-600">
                  Jashore University of Science and Technology
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Desktop Navigation and Login/Dashboard */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {menuItems.map((item) => {
                const isActive = isActiveLink(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`font-medium transition-colors duration-300 relative group ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Login/Dashboard Button */}
            {!isLoading && (
              <Link
                href={user ? "/dashboard" : "/login"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                {user ? "Dashboard" : "Login"}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              {menuItems.map((item) => {
                const isActive = isActiveLink(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-300 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Login/Dashboard Button */}
              {!isLoading && (
                <div className="pt-3 border-t border-gray-200">
                  <Link
                    href={user ? "/dashboard" : "/login"}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300 mx-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user ? "Dashboard" : "Login"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
