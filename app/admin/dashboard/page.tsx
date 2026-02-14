"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Heart,
  TrendingUp,
  Home,
  MapPin,
  Eye,
} from "lucide-react";
import { Pie, Cell } from "recharts";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import { toast } from "sonner";
import { Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

type Stats = {
  totalProperties: number;
  totalUsers: number;
  totalFavorites: number;
  totalViews: number;
};

type ChartData = {
  name: string;
  value: number;
};

type RecentProperty = {
  id: string;
  title: string;
  city: string;
  price: number;
  source: string;
  createdAt: string;
  isFeatured?: boolean;
};

type RecentUser = {
  id: string;
  name: string | null;
  phone: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

type TopProperty = {
  name: string;
  value: number;
};

type DashboardData = {
  stats: Stats;
  charts: {
    byCity: ChartData[];
    byType: ChartData[];
    bySource: ChartData[];
  };
  topViewed: TopProperty[];
  recentProperties: RecentProperty[];
  recentUsers: RecentUser[];
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-1">
            {value.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function toggleFeature(propertyId: string, currentStatus: boolean) {
    // Determine new status
    const newStatus = !currentStatus;

    try {
      // Optimistic update
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          recentProperties: prev.recentProperties.map((p) =>
            p.id === propertyId ? { ...p, isFeatured: newStatus } : p,
          ),
        };
      });

      const res = await fetch(`/api/admin/properties/${propertyId}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newStatus }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar");

      toast.success(
        newStatus ? "Imóvel destacado!" : "Imóvel removido dos destaques",
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar destaque");
      // Revert optimistic update
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          recentProperties: prev.recentProperties.map((p) =>
            p.id === propertyId ? { ...p, isFeatured: currentStatus } : p,
          ),
        };
      });
    }
  }

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Imóveis"
            value={data.stats.totalProperties}
            icon={Building2}
            color="bg-blue-500"
          />
          <StatCard
            title="Usuários"
            value={data.stats.totalUsers}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Favoritos"
            value={data.stats.totalFavorites}
            icon={Heart}
            color="bg-red-500"
          />
          <StatCard
            title="Visualizações"
            value={data.stats.totalViews}
            icon={Eye}
            color="bg-purple-500"
          />
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <AdminAnalytics
            charts={data.charts}
            topViewed={data.topViewed}
            recentUsers={data.recentUsers}
          />
        </div>

        {/* Recent Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Imóveis Recentes</h2>
            <Link
              href="/admin/properties"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b dark:border-gray-700">
                  <th className="pb-3">Título</th>
                  <th className="pb-3">Cidade</th>
                  <th className="pb-3">Preço</th>
                  <th className="pb-3">Fonte</th>
                  <th className="pb-3 text-center">Destaque</th>
                  <th className="pb-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.recentProperties.map((prop) => (
                  <tr
                    key={prop.id}
                    className="border-b dark:border-gray-700 last:border-0"
                  >
                    <td className="py-3 max-w-[200px] truncate">
                      {prop.title}
                    </td>
                    <td className="py-3">{prop.city}</td>
                    <td className="py-3">
                      {prop.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          prop.source === "USER"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {prop.source}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() =>
                          toggleFeature(prop.id, prop.isFeatured || false)
                        }
                        className={`p-1.5 rounded-full transition-colors ${
                          prop.isFeatured
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={
                          prop.isFeatured ? "Remover destaque" : "Destacar"
                        }
                      >
                        <Sparkles
                          size={16}
                          fill={prop.isFeatured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(prop.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
