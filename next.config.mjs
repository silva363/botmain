/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
