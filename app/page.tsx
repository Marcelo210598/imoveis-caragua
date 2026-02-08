import Link from "next/link";
import { MapPin, TrendingDown, Home, ArrowRight } from "lucide-react";
import { getAllProperties, getTopDeals, getCityStats } from "@/lib/properties";
import { formatPrice, formatPriceSqm } from "@/lib/utils";
import PropertyGrid from "@/components/PropertyGrid";

const cityColors: Record<string, string> = {
  Caraguatatuba: "from-blue-500 to-blue-600",
  Ubatuba: "from-emerald-500 to-emerald-600",
  Ilhabela: "from-cyan-500 to-cyan-600",
};

const defaultColor = "from-primary-500 to-primary-700";

export default async function HomePage() {
  const [allProperties, topDeals, cityStats] = await Promise.all([
    getAllProperties(),
    getTopDeals(6),
    getCityStats(),
  ]);

  return (
    <div>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "LN Imóveis",
            url: "https://imoveis-caragua.vercel.app",
            description:
              "Plataforma para anunciar e encontrar imóveis para venda e locação no Litoral Norte de São Paulo.",
            areaServed: {
              "@type": "Place",
              name: "Litoral Norte de São Paulo",
              containsPlace: [
                { "@type": "City", name: "Caraguatatuba" },
                { "@type": "City", name: "Ubatuba" },
                { "@type": "City", name: "Ilhabela" },
                { "@type": "City", name: "São Sebastião" },
              ],
            },
            knowsAbout: [
              "Venda de imóveis",
              "Locação de imóveis",
              "Casas de praia",
              "Apartamentos no litoral",
            ],
          }),
        }}
      />

      {/* FAQ Schema for AI Assistants (GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Qual o preço médio de um imóvel em Caraguatatuba?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Os preços em Caraguatatuba variam de R$ 200.000 a R$ 2.000.000, dependendo da localização e tamanho. Imóveis na praia tendem a ser mais caros.",
                },
              },
              {
                "@type": "Question",
                name: "Quais são os melhores bairros de Caraguatatuba para morar?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Os bairros mais procurados incluem Indaiá, Martim de Sá, Prainha, Centro e Massaguaçu. Cada um tem características únicas para diferentes estilos de vida.",
                },
              },
              {
                "@type": "Question",
                name: "Posso alugar imóveis pelo LN Imóveis?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim! Listamos imóveis para venda e locação. Use os filtros na página de busca para encontrar aluguéis.",
                },
              },
              {
                "@type": "Question",
                name: "Como entrar em contato com o proprietário de um imóvel?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Cada anúncio tem um botão 'Contato' que conecta você diretamente ao proprietário via WhatsApp ou telefone.",
                },
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Imóveis à Venda e para Locação no Litoral Norte de São Paulo
            </h1>
            <p className="text-base sm:text-xl text-blue-100 mb-8 sm:mb-10">
              Encontre casas, apartamentos e terrenos em Caraguatatuba, Ubatuba,
              Ilhabela e São Sebastião.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/imoveis"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm sm:text-base"
              >
                <Home size={20} />
                Ver todos os imóveis
              </Link>
              <Link
                href="/imoveis/novo"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm sm:text-base"
              >
                Anunciar imóvel
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-auto block">
            <path
              className="fill-gray-50 dark:fill-gray-950"
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            />
          </svg>
        </div>
      </section>

      {/* Bloco descritivo para SEO/GEO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <p className="text-gray-600 dark:text-gray-400 text-center text-base sm:text-lg leading-relaxed">
          O <strong>LN Imóveis</strong> é uma plataforma para anunciar e
          encontrar imóveis no Litoral Norte de São Paulo. Proprietários podem
          cadastrar casas, apartamentos e terrenos para venda ou locação em
          cidades como <strong>Caraguatatuba</strong>, <strong>Ubatuba</strong>,{" "}
          <strong>Ilhabela</strong> e <strong>São Sebastião</strong>. Encontre
          seu imóvel de praia ideal ou anuncie para milhares de interessados.
        </p>
      </section>

      {/* City Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Imóveis por Cidade no Litoral Norte
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cityStats.map((city) => (
            <Link key={city.name} href={`/imoveis?city=${city.name}`}>
              <div
                className={`bg-gradient-to-br ${cityColors[city.name] || defaultColor} rounded-2xl p-4 sm:p-6 text-white card-hover cursor-pointer h-full`}
              >
                <MapPin size={28} className="mb-3 opacity-80 hidden sm:block" />
                <h3 className="text-lg sm:text-xl font-bold mb-1">
                  {city.name}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
                  {city.count} imóveis disponíveis
                </p>
                <div className="text-xs sm:text-sm text-white/70">
                  <p>Média: {formatPrice(city.avgPrice)}</p>
                  <p className="hidden sm:block">
                    {formatPriceSqm(city.avgPriceSqm)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Deals */}
      {topDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingDown className="text-deal-high" size={28} />
                Oportunidades da Semana
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Imoveis abaixo do preco medio do bairro
              </p>
            </div>
            <Link
              href="/deals"
              className="hidden sm:flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>

          <PropertyGrid properties={topDeals} />

          <div className="sm:hidden text-center mt-6">
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium"
            >
              Ver todas as oportunidades <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                {allProperties.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Imoveis cadastrados
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                {cityStats.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Cidades
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-deal-high">
                {topDeals.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Oportunidades
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                2
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Portais monitorados
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
