/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["api.producthunt.com"],
  }
}

module.exports = nextConfig