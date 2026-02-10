/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.zapimoveis.com.br",
      },
      {
        protocol: "https",
        hostname: "**.vivareal.com.br",
      },
      {
        protocol: "https",
        hostname: "resizedimgs.zapimoveis.com.br",
      },
      {
        protocol: "https",
        hostname: "resizedimgs.vivareal.com",
      },
      {
        protocol: "https",
        hostname: "img-lx.vivareal.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

module.exports = nextConfig;
