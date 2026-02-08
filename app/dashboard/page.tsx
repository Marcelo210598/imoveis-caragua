import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MyPropertiesList from "@/components/dashboard/MyPropertiesList";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/entrar?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Painel do Proprietário
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gerencie seus imóveis e acompanhe estatísticas
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/imoveis/novo"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Anunciar Novo Imóvel
            </a>
          </div>
        </div>

        {/* Stats Cards (Placeholder for future implementation) */}
        {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
           ... stats here
        </div> */}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              Meus Imóveis
            </h3>
            <MyPropertiesList />
          </div>
        </div>
      </div>
    </div>
  );
}
