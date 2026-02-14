"use client";

import { useEffect, useRef } from "react";
import { Property } from "@/types/property";
import { formatPrice } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface PropertyMapProps {
  properties: Property[];
  className?: string;
}

// Default center: Caraguatatuba region
const DEFAULT_CENTER: [number, number] = [-23.62, -45.41];
const DEFAULT_ZOOM = 10;

export default function PropertyMap({
  properties,
  className = "",
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Filter only properties with valid coordinates
  const mappable = properties.filter(
    (p) => p.latitude && p.longitude && p.latitude !== 0 && p.longitude !== 0,
  );

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamic import of Leaflet (avoid SSR)
    import("leaflet").then((L) => {
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Cleanup existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Center on first mappable property or default to region
      const center: [number, number] =
        mappable.length > 0
          ? [mappable[0].latitude!, mappable[0].longitude!]
          : DEFAULT_CENTER;

      const zoom = mappable.length > 0 ? 12 : DEFAULT_ZOOM;

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      }).setView(center, zoom);

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      if (mappable.length > 0) {
        // Custom icon
        const icon = L.divIcon({
          className: "property-marker",
          html: `<div style="
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">🏠</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        // Add markers
        const bounds = L.latLngBounds([]);
        mappable.forEach((p) => {
          const marker = L.marker([p.latitude!, p.longitude!], { icon }).addTo(
            map,
          );

          const popupContent = `
            <div style="min-width:180px;font-family:system-ui">
              <p style="font-weight:700;font-size:16px;margin:0 0 4px 0;color:#1d4ed8">
                ${formatPrice(p.price)}
              </p>
              <p style="font-size:12px;color:#666;margin:0 0 8px 0">
                ${p.propertyType} · ${p.neighborhood || p.city}
              </p>
              <a href="/imoveis/${encodeURIComponent(p.externalId || p.id)}"
                 style="color:#3b82f6;font-size:12px;text-decoration:none;font-weight:600">
                Ver detalhes →
              </a>
            </div>
          `;
          marker.bindPopup(popupContent);

          bounds.extend([p.latitude!, p.longitude!]);
        });

        if (mappable.length > 1) {
          map.fitBounds(bounds, { padding: [30, 30] });
        }
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappable.length]);

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div ref={mapRef} className="w-full h-[400px] z-0" />
      <div className="bg-white dark:bg-gray-900 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        {mappable.length > 0 ? (
          <span>📍 {mappable.length} imóveis com localização no mapa</span>
        ) : (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            Região do Litoral Norte de São Paulo — em breve mais imóveis no mapa
          </span>
        )}
      </div>
    </div>
  );
}
