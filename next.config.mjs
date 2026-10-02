/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // The FastAPI backend serving locally-uploaded product photos in
      // dev. Update/remove this once the API has a real production
      // domain — see NEXT_PUBLIC_API_URL in .env.
      { protocol: "http", hostname: "localhost", port: "8000" },
    ],
  },
};

export default nextConfig;
