import { getAllProperties } from '@/lib/properties';
import PropertyGrid from '@/components/PropertyGrid';

export default function DealsPage() {
  const allProperties = getAllProperties();
  const deals = allProperties
    .filter((p) => p.deal_score >= 60)
    .sort((a, b) => b.deal_score - a.deal_score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          🔥 Melhores Oportunidades
        </h1>
        <p className="text-gray-500 mt-2">
          Imoveis com preco significativamente abaixo da media do bairro.{' '}
          {deals.length} oportunidades encontradas.
        </p>
      </div>

      <PropertyGrid
        properties={deals}
        emptyMessage="Nenhuma oportunidade encontrada no momento."
      />
    </div>
  );
}
