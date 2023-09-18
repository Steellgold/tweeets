/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["pbs.twimg.com"],
  }
}

module.exports = nextConfig