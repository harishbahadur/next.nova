/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        kuromoji: "kuromoji",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
