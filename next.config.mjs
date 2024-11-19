/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://localhost:3001",
        "https://cautious-umbrella-97q76rwwr5wvhx9g4-3000.app.github.dev",
      ],
      allowedForwardedHosts: [
        "localhost:3001",
        "cautious-umbrella-97q76rwwr5wvhx9g4-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
