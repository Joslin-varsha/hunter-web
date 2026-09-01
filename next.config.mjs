/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meetay.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "52.66.7.6",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.trycloudflare.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://52.66.7.6:3000/:path*",
      },
    ];
  },
};

export default nextConfig;
