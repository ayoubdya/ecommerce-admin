/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     host: 'res.cloudinary.com',
    //     path: '/dofqucuyy/image/upload/',
    //     port: 443,
    //   }
    // ]
  },
};

module.exports = nextConfig;
