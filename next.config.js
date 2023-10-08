/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "pbs.twimg.com",
      "whkqhlphynegzuexnlyn.supabase.co",
      "zjgobltabsqjifgmzopa.supabase.co",
      "media.discordapp.net",
      "cdn.discordapp.com"
    ],
  }
}

module.exports = nextConfig