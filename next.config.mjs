/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
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
