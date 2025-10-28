import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "155.254.35.168",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
    // or simpler:
    // domains: ["155.254.35.168"],
  },
};

export default nextConfig;
