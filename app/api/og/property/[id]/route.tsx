import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getPropertyById } from '@/lib/properties';
import { formatPrice, getPropertyTypeLabel } from '@/lib/utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const property = await getPropertyById(decodeURIComponent(params.id));

  if (!property) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#1e293b',
            color: '#fff',
            fontSize: 48,
            fontWeight: 'bold',
          }}
        >
          Imovel nao encontrado
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const title = property.title
    || `${getPropertyTypeLabel(property.propertyType)} em ${property.city}`;
  const price = formatPrice(property.price);
  const photoUrl = property.photos?.[0]?.url;
  const location = property.neighborhood
    ? `${property.neighborhood}, ${property.city}`
    : property.city;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
          position: 'relative',
        }}
      >
        {/* Background image */}
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
            padding: '48px 56px',
            background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.3) 100%)',
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: 40,
              left: 56,
              fontSize: 24,
              color: '#60a5fa',
              fontWeight: 'bold',
            }}
          >
            Litoral Norte Imoveis
          </div>

          {/* Price */}
          <div
            style={{
              display: 'flex',
              fontSize: 56,
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: 12,
            }}
          >
            {price}
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              color: '#e2e8f0',
              marginBottom: 16,
              maxWidth: '80%',
            }}
          >
            {title.length > 60 ? title.slice(0, 60) + '...' : title}
          </div>

          {/* Location + features */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              fontSize: 22,
              color: '#94a3b8',
            }}
          >
            <span>{location}</span>
            {property.bedrooms != null && (
              <span>{property.bedrooms} quartos</span>
            )}
            {property.bathrooms != null && (
              <span>{property.bathrooms} banheiros</span>
            )}
            {property.area != null && (
              <span>{property.area} m²</span>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
