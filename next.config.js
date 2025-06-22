/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'i.ytimg.com',"startup-template-sage.vercel.app","res.cloudinary.com","www.youtube.com","plus.unsplash.com","i.postimg.cc"],
  },
};

module.exports = nextConfig;
