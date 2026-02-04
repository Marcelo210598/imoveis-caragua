import Link from 'next/link';

const cities = [
  { name: 'Caraguatatuba', href: '/imoveis?city=Caraguatatuba' },
  { name: 'Ubatuba', href: '/imoveis?city=Ubatuba' },
  { name: 'Ilhabela', href: '/imoveis?city=Ilhabela' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Logo" className="w-7 h-7 rounded-md" />
              Litoral Norte Imoveis
            </h3>
            <p className="text-sm leading-relaxed">
              Encontre os melhores imoveis no Litoral Norte de Sao Paulo.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Cidades</h4>
            <ul className="space-y-2 text-sm">
              {cities.map((city) => (
                <li key={city.name}>
                  <Link
                    href={city.href}
                    className="hover:text-white transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Sobre</h4>
            <p className="text-sm leading-relaxed">
              Dados coletados automaticamente e atualizados regularmente.
              Os precos e informacoes sao de responsabilidade dos portais de origem.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Litoral Norte Imoveis. Dados de ZAP e VivaReal.</p>
        </div>
      </div>
    </footer>
  );
}
