"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para serviço de analytics se necessário
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Ops! Algo deu errado
        </h2>

        <p className="text-gray-500 dark:text-gray-400">
          Não conseguimos carregar esta página. Tente recarregar ou volte mais
          tarde.
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors gap-2 w-full sm:w-auto"
        >
          <RefreshCcw size={20} />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
