import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Home } from "lucide-react";
import Link from "next/link";
import {
  getPropertiesByNeighborhood,
  getUniqueNeighborhoods,
} from "@/lib/properties";
import PropertyGrid from "@/components/PropertyGrid";

interface PageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache por 1 hora

// Removendo generateStaticParams para evitar build infinito com dados sujos
// export async function generateStaticParams() {
//   const neighborhoods = await getUniqueNeighborhoods();
//   return neighborhoods.map((n) => ({
//     slug: n.toLowerCase().replace(/\s+/g, "-"),
//   }));
// }

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const neighborhoodName = decodeURIComponent(params.slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `Imóveis em ${neighborhoodName} | Litoral Norte Imóveis`,
    description: `Encontre casas, apartamentos e terrenos à venda em ${neighborhoodName}. Veja os melhores imóveis disponíveis no bairro.`,
    openGraph: {
      title: `Imóveis em ${neighborhoodName}`,
      description: `Listagem completa de imóveis à venda em ${neighborhoodName}.`,
    },
  };
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const neighborhoodName = decodeURIComponent(params.slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const properties = await getPropertiesByNeighborhood(neighborhoodName);

  if (properties.length === 0) {
    notFound();
  }

  const city = properties[0]?.city || "Litoral Norte";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">
          Início
        </Link>
        <span>/</span>
        <Link href="/imoveis" className="hover:text-primary-600">
          Imóveis
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">
          {neighborhoodName}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary-600 mb-2">
          <MapPin size={20} />
          <span className="text-sm font-medium">{city}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Imóveis à Venda em {neighborhoodName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Encontre o imóvel ideal no bairro {neighborhoodName}. São{" "}
          <strong>{properties.length} imóveis</strong> disponíveis para você.
        </p>
      </div>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Imóveis em ${neighborhoodName}`,
            description: `Lista de imóveis à venda no bairro ${neighborhoodName}, ${city}`,
            numberOfItems: properties.length,
            itemListElement: properties.slice(0, 10).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "RealEstateListing",
                name: p.title || `Imóvel em ${neighborhoodName}`,
                url: `https://imoveis-caragua.vercel.app/imoveis/${p.id}`,
              },
            })),
          }),
        }}
      />

      {/* Property Grid */}
      <PropertyGrid properties={properties} />

      {/* SEO Text Block */}
      <section className="mt-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Sobre o bairro {neighborhoodName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          O bairro {neighborhoodName} está localizado em {city}, no Litoral
          Norte de São Paulo. A região oferece infraestrutura completa, com
          acesso a praias, comércios e serviços. Se você está buscando um imóvel
          para morar ou investir, confira as opções disponíveis acima.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          <Home size={18} />
          Ver todos os imóveis
        </Link>
      </div>
    </div>
  );
}
