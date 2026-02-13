import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";
import { Home } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
  emptyMessage?: string;
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
}

export default function PropertyGrid({
  properties,
  emptyMessage = "Nenhum imovel encontrado.",
  compareIds,
  onToggleCompare,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Home size={48} className="mb-4" />
        <p className="text-lg">{emptyMessage}</p>
        <p className="text-sm mt-1">Tente ajustar os filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isComparing={compareIds?.includes(property.id)}
          onToggleCompare={
            onToggleCompare ? () => onToggleCompare(property.id) : undefined
          }
        />
      ))}
    </div>
  );
}
