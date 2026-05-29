
import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL ?? "http://161.118.186.2:4900").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["veda.snxit.me"],
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backendUrl}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;


































