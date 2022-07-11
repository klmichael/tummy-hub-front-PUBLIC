/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["res.cloudinary.com"],
  },
}

module.exports = nextConfig
