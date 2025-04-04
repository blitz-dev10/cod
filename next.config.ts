import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: false,
  webpack: (config) => {
    // This helps prevent issues with Node.js modules in the browser
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      child_process: false,
      
    };
    return config;
  },
};

export default nextConfig;