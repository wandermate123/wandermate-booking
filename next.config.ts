import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from WanderMate's Wix CDN if you embed them
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
};

export default nextConfig;
