/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sharehouses',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
