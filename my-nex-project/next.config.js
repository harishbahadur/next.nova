/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't externalize kuromoji to include dictionary files
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Increase serverless function size limit
  experimental: {
    serverMinification: false,
  },
};

module.exports = nextConfig;
