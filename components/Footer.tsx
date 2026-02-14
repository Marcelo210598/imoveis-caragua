"use client";

import Link from "next/link";

const cities = [
  { name: "Caraguatatuba", href: "/imoveis?city=Caraguatatuba" },
  { name: "Ubatuba", href: "/imoveis?city=Ubatuba" },
  { name: "Ilhabela", href: "/imoveis?city=Ilhabela" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <p className="text-sm leading-relaxed mb-4">
              Dados coletados automaticamente e atualizados regularmente. Os
              precos e informacoes sao de responsabilidade dos portais de
              origem.
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                href="/blog"
                className="text-white hover:text-primary-400 font-medium transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contato"
                className="text-white hover:text-primary-400 font-medium transition-colors"
              >
                Fale Conosco
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold mb-3"> Newsletter</h4>
            <p className="text-sm leading-relaxed text-gray-400">
              Receba as melhores oportunidades e noticias do mercado imobiliario
              toda semana.
            </p>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-gray-800 border-gray-700 text-white text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} Litoral Norte Imoveis. Todos os
            direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="hover:text-white transition-colors"
            >
              Politica de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
