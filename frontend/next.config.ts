
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable StrictMode — prevents useEffect double-firing which caused
  // duplicate assignment creation in GeneratingManager
  reactStrictMode: false,
  allowedDevOrigins: ['veda.snxit.me'],
  // Enable standalone output for Docker deployments
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://161.118.186.2:4900/api/:path*',
      },
    ]
  },
};

export default nextConfig;


































