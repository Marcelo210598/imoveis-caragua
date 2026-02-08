import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null): string {
  if (!price) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceSqm(price: number | null): string {
  if (!price) return "N/A";
  return (
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + "/m\u00B2"
  );
}

export function formatArea(area: number | null): string {
  return area ? `${area} m\u00B2` : "N/A";
}

export function getDealColor(score: number): string {
  if (score >= 80) return "text-deal-high";
  if (score >= 60) return "text-deal-medium";
  return "text-deal-low";
}

export function getDealBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (score >= 60) return "bg-amber-100 text-amber-800 border-amber-300";
  return "";
}

export function getDealLabel(score: number): string {
  if (score >= 80) return "Otima Oportunidade";
  if (score >= 60) return "Bom Negocio";
  return "";
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartamento: "Apartamento",
    casa: "Casa",
    terreno: "Terreno",
    comercial: "Comercial",
    rural: "Rural",
    outro: "Outro",
  };
  return labels[type] || type;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
