import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Bed,
  Bath,
  Car,
  Maximize,
  MapPin,
} from 'lucide-react';
import { getPropertyById } from '@/lib/properties';
import { formatPrice, formatPriceSqm, formatArea, getPropertyTypeLabel } from '@/lib/utils';
import DealBadge from '@/components/DealBadge';
import PriceChart from '@/components/PriceChart';

interface PageProps {
  params: { id: string };
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
      label: 'Quartos',
    },
    {
      icon: <Bath size={22} />,
      value: property.bathrooms,
      label: 'Banheiros',
    },
    {
      icon: <Car size={22} />,
      value: property.parkingSpaces,
      label: 'Vagas',
    },
    {
      icon: <Maximize size={22} />,
      value: property.area ? formatArea(property.area) : null,
      label: 'Area',
    },
  ].filter((f) => f.value != null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/imoveis"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Voltar para listagem
      </Link>

      {/* Image gallery */}
      <div className="mb-8">
        {mainPhoto ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainPhoto}
                alt={property.title || 'Imovel'}
                className="w-full h-full object-cover"
              />
            </div>
            {thumbPhotos.length > 0 && (
              <div className="hidden md:flex flex-col gap-3">
                {thumbPhotos.map((photo, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-xl overflow-hidden bg-gray-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`Foto ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/9] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
            <Maximize size={64} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and badge */}
          <div>
            {property.dealScore >= 60 && (
              <DealBadge score={property.dealScore} className="mb-3" />
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {property.title || `${getPropertyTypeLabel(property.propertyType)} em ${property.city}`}
            </h1>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin size={16} />
              <span>
                {property.neighborhood
                  ? `${property.neighborhood}, ${property.city}`
                  : property.city}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </p>
            {property.pricePerSqm && (
              <p className="text-gray-500 mt-1">
                {formatPriceSqm(property.pricePerSqm)}
              </p>
            )}
          </div>

          {/* Features grid */}
          {features.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Detalhes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl"
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">
                Comparativo de Preco (R$/m²)
              </h2>
              <PriceChart
                propertyPrice={property.pricePerSqm}
                avgPrice={property.avgNeighborhoodPriceSqm}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* CTA - Ver no portal */}
          {property.url && (
            <a
              href={property.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-600 transition-colors"
            >
              <ExternalLink size={18} />
              Ver no {property.source === 'ZAP' ? 'ZAP Imoveis' : 'VivaReal'}
            </a>
          )}

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 text-sm">
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
        </div>
      </div>
    </div>
  );
}
