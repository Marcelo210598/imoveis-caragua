import { getAllProperties, getUniqueNeighborhoods } from "@/lib/properties";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://imoveis-caragua.vercel.app";

  // Fetch all properties and neighborhoods
  const [properties, neighborhoods] = await Promise.all([
    getAllProperties(),
    getUniqueNeighborhoods(),
  ]);

  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.id}`,
    lastModified: property.updatedAt || property.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const neighborhoodUrls = neighborhoods.map((n) => ({
    url: `${baseUrl}/imoveis/bairro/${n.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Fetch blog posts
  const { posts } = await import("@/app/actions/blog").then((mod) =>
    mod.getPosts(1, 1000, true),
  );

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
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
    ...neighborhoodUrls,
    ...propertyUrls,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
