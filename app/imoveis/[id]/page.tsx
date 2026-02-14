import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bed,
  Bath,
  Car,
  Maximize,
  MapPin,
  Sparkles,
} from "lucide-react";
import { getPropertyById } from "@/lib/properties";
import {
  formatPrice,
  formatPriceSqm,
  formatArea,
  getPropertyTypeLabel,
} from "@/lib/utils";
import { cleanPropertyTitle } from "@/lib/titleCleaner";
import DealBadge from "@/components/DealBadge";
import PriceChart from "@/components/PriceChart";
import ContactButton from "@/components/contact/ContactButton";
import OwnerInfo from "@/components/contact/OwnerInfo";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyReviews from "@/components/PropertyReviews";
import ViewTracker from "@/components/ViewTracker";
import MortgageCalculator from "@/components/MortgageCalculator";
import ShareButtons from "@/components/ShareButtons";

interface PageProps {
  params: { id: string };
}

// ISR: regenerar pagina a cada 1 hora
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const property = await getPropertyById(decodeURIComponent(params.id));

  if (!property) {
    return { title: "Imovel nao encontrado" };
  }

  const title = cleanPropertyTitle(
    property.title,
    property.propertyType,
    property.city,
  );
  const price = formatPrice(property.price);
  const description = property.description
    ? property.description.slice(0, 160)
    : `${title} - ${price}. ${property.bedrooms ? property.bedrooms + " quartos, " : ""}${property.neighborhood ? property.neighborhood + ", " : ""}${property.city}.`;

  const baseUrl =
    process.env.NEXTAUTH_URL || "https://imoveis-caragua.vercel.app";
  const ogImageUrl = `${baseUrl}/api/og/property/${encodeURIComponent(params.id)}`;
  const photoUrl = property.photos?.[0]?.url;

  return {
    title: `${title} - ${price} | Litoral Norte Imoveis`,
    description,
    openGraph: {
      title: `${title} - ${price}`,
      description,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
        ...(photoUrl ? [{ url: photoUrl, alt: title }] : []),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${price}`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = await getPropertyById(decodeURIComponent(params.id));

  if (!property) {
    notFound();
  }

  const photoUrls = property.photos?.map((p) => p.url).filter(Boolean) || [];
  const mainPhoto = photoUrls[0] || null;
  const thumbPhotos = photoUrls.slice(1, 5);

  const features = [
    {
      icon: <Bed size={22} />,
      value: property.bedrooms,
      label: "Quartos",
    },
    {
      icon: <Bath size={22} />,
      value: property.bathrooms,
      label: "Banheiros",
    },
    {
      icon: <Car size={22} />,
      value: property.parkingSpaces,
      label: "Vagas",
    },
    {
      icon: <Maximize size={22} />,
      value: property.area ? formatArea(property.area) : null,
      label: "Area",
    },
  ].filter((f) => f.value != null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ViewTracker propertyId={property.id} />
      {/* Back button */}
      <Link
        href="/imoveis"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Voltar para listagem
      </Link>

      {/* Image gallery */}
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: property.title || `Imóvel em ${property.city}`,
            description: property.description
              ? property.description.slice(0, 160)
              : `Imóvel disponível em ${property.city}`,
            image: photoUrls,
            url: `${process.env.NEXTAUTH_URL || "https://imoveis-caragua.vercel.app"}/imoveis/${property.id}`,
            datePosted: property.createdAt,
            price: property.price,
            priceCurrency: "BRL",
            mainEntity: {
              "@type": "SingleFamilyResidence", // Could be dynamic: Apartment, House, etc.
              name: property.title,
              address: {
                "@type": "PostalAddress",
                streetAddress: property.address || "Endereço sob consulta",
                addressLocality: property.city,
                addressRegion: "SP",
                addressCountry: "BR",
              },
              numberOfRooms: property.bedrooms,
              numberOfBathroomsTotal: property.bathrooms,
              floorSize: {
                "@type": "QuantitativeValue",
                value: property.area,
                unitCode: "MTK",
              },
            },
            offers: {
              "@type": "Offer",
              price: property.price,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              url: `${process.env.NEXTAUTH_URL || "https://imoveis-caragua.vercel.app"}/imoveis/${property.id}`,
            },
          }),
        }}
      />

      <div className="mb-8">
        <PropertyGallery
          mainPhoto={mainPhoto}
          thumbPhotos={thumbPhotos}
          title={property.title || "Imovel"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and badge */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {property.dealScore >= 60 && (
                <DealBadge score={property.dealScore} />
              )}
              {(property as any).highlighted && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <Sparkles size={12} />
                  Destaque
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {cleanPropertyTitle(
                property.title,
                property.propertyType,
                property.city,
              )}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} />
                <span>
                  {property.neighborhood
                    ? `${property.neighborhood}, ${property.city}`
                    : property.city}
                </span>
              </div>
              <ShareButtons
                title={cleanPropertyTitle(
                  property.title,
                  property.propertyType,
                  property.city,
                )}
                url={`/imoveis/${property.id}`}
                price={formatPrice(property.price)}
              />
            </div>
          </div>

          {/* Price */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(property.price)}
            </p>
            {property.pricePerSqm && (
              <p className="text-gray-500 mt-1">
                {formatPriceSqm(property.pricePerSqm)}
              </p>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Descricao
              </h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Features grid */}
          {features.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Detalhes
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <span className="text-primary-500">{f.icon}</span>
                    <span className="font-semibold text-gray-900">
                      {f.value}
                    </span>
                    <span className="text-xs text-gray-500">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price comparison chart */}
          {property.pricePerSqm && property.avgNeighborhoodPriceSqm && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Comparativo de Preco (R$/m²)
              </h2>
              <PriceChart
                propertyPrice={property.pricePerSqm}
                avgPrice={property.avgNeighborhoodPriceSqm}
              />
            </div>
          )}

          {/* Reviews */}
          <PropertyReviews propertyId={property.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact button */}
          <ContactButton
            source={property.source}
            url={property.url}
            ownerPhone={property.owner?.phone}
            ownerName={property.owner?.name}
            propertyTitle={property.title}
          />

          {/* Owner info for user-created properties */}
          {property.source === "USER" && property.owner && (
            <OwnerInfo owner={property.owner} />
          )}

          {/* Info card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo</span>
              <span className="font-medium">
                {getPropertyTypeLabel(property.propertyType)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fonte</span>
              <span className="font-medium">{property.source}</span>
            </div>
            {property.dealScore > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Deal Score</span>
                <span className="font-medium">{property.dealScore}/100</span>
              </div>
            )}
            {property.address && (
              <div className="flex justify-between">
                <span className="text-gray-500">Endereco</span>
                <span className="font-medium text-right max-w-[60%]">
                  {property.address}
                </span>
              </div>
            )}
          </div>

          {/* Mortgage Calculator */}
          <MortgageCalculator price={property.price} />
        </div>
      </div>
    </div>
  );
}
