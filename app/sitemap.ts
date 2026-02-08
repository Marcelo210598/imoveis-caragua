import { getAllProperties } from "@/lib/properties";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://imoveis-caragua.vercel.app";

  // Fetch all properties
  // Note: For very large sites, we might need to paginate sitemaps,
  // but for < 50k URLs this is fine.
  const properties = await getAllProperties();

  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.id}`,
    lastModified: property.updatedAt || property.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...propertyUrls,
  ];
}
