/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.sankavollerei.com" },
      { protocol: "https", hostname: "sankavollerei.com" },
      { protocol: "https", hostname: "**.komiku.org" },
      { protocol: "https", hostname: "komiku.org" },
      { protocol: "https", hostname: "**.komiku.id" },
      { protocol: "https", hostname: "komiku.id" },
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
        ],
      },
    ];
  },
};

export default nextConfig;
