/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repo/ui'],
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, net: false, tls: false, dns: false };
    return config;
  },
};
