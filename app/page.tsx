import Link from 'next/link';
import { MapPin, TrendingDown, Home, ArrowRight } from 'lucide-react';
import { getAllProperties, getTopDeals, getCityStats } from '@/lib/properties';
import { formatPrice, formatPriceSqm } from '@/lib/utils';
import PropertyGrid from '@/components/PropertyGrid';

const cityColors: Record<string, string> = {
  Caraguatatuba: 'from-blue-500 to-blue-600',
  Ubatuba: 'from-emerald-500 to-emerald-600',
  Ilhabela: 'from-cyan-500 to-cyan-600',
};

const defaultColor = 'from-primary-500 to-primary-700';

export default async function HomePage() {
  const [allProperties, topDeals, cityStats] = await Promise.all([
    getAllProperties(),
    getTopDeals(6),
    getCityStats(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Encontre Seu Imovel de Praia
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10">
              Os melhores imoveis do Litoral Norte de Sao Paulo em um so lugar.
              Dados atualizados de ZAP Imoveis e VivaReal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/imoveis"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <Home size={20} />
                Ver todos os imoveis
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                🔥 Oportunidades
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-auto block">
            <path
              fill="#f9fafb"
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            />
          </svg>
        </div>
      </section>

      {/* City Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Explore por cidade
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cityStats.map((city) => (
            <Link key={city.name} href={`/imoveis?city=${city.name}`}>
              <div
                className={`bg-gradient-to-br ${cityColors[city.name] || defaultColor} rounded-2xl p-6 text-white card-hover cursor-pointer h-full`}
              >
                <MapPin size={28} className="mb-3 opacity-80" />
                <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                <p className="text-white/80 text-sm mb-4">
                  {city.count} imoveis
                </p>
                <div className="text-sm text-white/70">
                  <p>Media: {formatPrice(city.avgPrice)}</p>
                  <p>{formatPriceSqm(city.avgPriceSqm)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Deals */}
      {topDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingDown className="text-deal-high" size={28} />
                Oportunidades da Semana
              </h2>
              <p className="text-gray-500 mt-1">
                Imoveis abaixo do preco medio do bairro
              </p>
            </div>
            <Link
              href="/deals"
              className="hidden sm:flex items-center gap-1 text-primary-600 font-medium hover:underline"
            >
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>

          <PropertyGrid properties={topDeals} />

          <div className="sm:hidden text-center mt-6">
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 text-primary-600 font-medium"
            >
              Ver todas as oportunidades <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">
                {allProperties.length}
              </p>
              <p className="text-gray-500 mt-1">Imoveis cadastrados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">
                {cityStats.length}
              </p>
              <p className="text-gray-500 mt-1">Cidades</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-deal-high">
                {topDeals.length}
              </p>
              <p className="text-gray-500 mt-1">Oportunidades</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">2</p>
              <p className="text-gray-500 mt-1">Portais monitorados</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
