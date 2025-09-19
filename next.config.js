/** @type {import("next").NextConfig} */
const nextConfig = {
  images: { 
    unoptimized: true 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable standalone mode for AWS Amplify
  experimental: {
    outputFileTracingRoot: require("path").join(__dirname, "../")
  }
};

module.exports = nextConfig;
