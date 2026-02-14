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
  if (score >= 90)
    return "bg-green-100 text-green-800 dark:bg-green-900 border-green-300 dark:border-green-700";
  if (score >= 80)
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700";
  if (score >= 70)
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 border-blue-300 dark:border-blue-700";
  if (score >= 60)
    return "bg-amber-100 text-amber-800 dark:bg-amber-900 border-amber-300 dark:border-amber-700";
  return "";
}

export function getDealLabel(score: number): string {
  if (score >= 90) return "Super Oportunidade";
  if (score >= 80) return "Ótima Oportunidade";
  if (score >= 70) return "Bom Negócio";
  if (score >= 60) return "Preço Justo";
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
