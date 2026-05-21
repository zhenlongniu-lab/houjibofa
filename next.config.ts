import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.cctv.com",
      },
      {
        protocol: "https",
        hostname: "**.cntv.cn",
      },
      {
        protocol: "https",
        hostname: "**.cctvpic.com",
      },
    ],
  },
};

export default nextConfig;
