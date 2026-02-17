import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Database,
  Settings,
  Home,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Verificar se usuário é admin
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Sidebar - Fixed on Desktop */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col z-50">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            <Users size={20} />
            Usuários
          </Link>

          <Link
            href="/admin/properties"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            <Home size={20} />
            Imóveis
          </Link>

          <Link
            href="/admin/blog"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            <FileText size={20} />
            Gerenciar Blog
          </Link>

          <Link
            href="/admin/scraper"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            <Database size={20} />
            Scraper
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              <Home size={20} />
              Voltar ao Site
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-center text-gray-400">
            v1.1.0 • LN Imóveis
          </p>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b p-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-6 h-6 rounded" />
            <span className="font-bold">Admin Panel</span>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transaction-colors"
          >
            Menu
          </Link>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
