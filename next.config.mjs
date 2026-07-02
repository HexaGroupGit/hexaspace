/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Membership was rebranded as Community
      { source: '/membership', destination: '/community', permanent: true },
      { source: '/membership/:path*', destination: '/community', permanent: true },
      // Sections renamed: Workspaces -> Memberships, Spaces -> Space Hire
      { source: '/workspaces', destination: '/memberships', permanent: true },
      { source: '/workspaces/:path*', destination: '/memberships/:path*', permanent: true },
      { source: '/spaces', destination: '/space-hire', permanent: true },
      { source: '/spaces/:path*', destination: '/space-hire/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
