import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MyPropertiesList from "@/components/dashboard/MyPropertiesList";
import ProfileCard from "@/components/dashboard/ProfileCard";
import DashboardStats from "@/components/dashboard/DashboardStats";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import NotificationManager from "@/components/push/NotificationManager";

export const metadata = {
  title: "Painel do Proprietário | LN Imóveis",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/entrar?callbackUrl=/dashboard");
  }

  // Fetch full user data including phone/name
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      // email: true, // Removed as it is not in the schema
      phone: true,
      avatarUrl: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/auth/entrar");
  }

  // Fetch stats concurrently
  const [totalProperties, activeProperties, favorites] = await Promise.all([
    prisma.property.count({
      where: { ownerId: user.id },
    }),
    prisma.property.count({
      where: { ownerId: user.id, status: "ACTIVE" },
    }),
    prisma.favorite.count({
      where: { property: { ownerId: user.id } },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Background */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-8 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Olá, {user.name?.split(" ")[0] || "Proprietário"}! 👋
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Aqui está o resumo dos seus anúncios hoje.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <NotificationManager />
              <a
                href="/imoveis/novo"
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                + Novo Anúncio
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Profile & Stats (Mobile First: Profile Top) */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard user={user} />
            <DashboardStats
              totalProperties={totalProperties}
              activeProperties={activeProperties}
              totalFavorites={favorites}
            />
          </div>

          {/* Right Column: Properties List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-5 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Meus Imóveis
                </h3>
              </div>
              <div className="p-0">
                <MyPropertiesList />
              </div>
            </div>
          </div>
        </div>
      </div>

      <InstallPrompt />
    </div>
  );
}
