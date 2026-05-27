import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable StrictMode — prevents useEffect double-firing which caused
  // duplicate assignment creation in GeneratingManager
  reactStrictMode: false,
};

export default nextConfig;
