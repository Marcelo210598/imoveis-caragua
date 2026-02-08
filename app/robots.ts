import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://imoveis-caragua.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/admin/",
        "/api/",
        "/meus-imoveis/",
        "/favoritos/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
