/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for kuroshiro/kuromoji in production
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Ensure .wasm files are handled correctly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: [
      "kuroshiro",
      "kuroshiro-analyzer-kuromoji",
    ],
  },
};

export default nextConfig;
