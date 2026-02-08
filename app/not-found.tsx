import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center space-y-6 max-w-lg">
        <div className="relative">
          <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">
            404
          </h1>
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Página não encontrada
          </p>
        </div>

        <p className="text-gray-500 dark:text-gray-400">
          O imóvel ou página que você procura pode ter sido removido ou o link
          está incorreto.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors gap-2"
          >
            <Home size={20} />
            Voltar ao Início
          </Link>
          <Link
            href="/imoveis"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2"
          >
            <Search size={20} />
            Buscar Imóveis
          </Link>
        </div>
      </div>
    </div>
  );
}
