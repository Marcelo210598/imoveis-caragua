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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
};

type DashboardData = {
  stats: Stats;
  charts: {
    byCity: ChartData[];
    byType: ChartData[];
    bySource: ChartData[];
  };
  topViewed: ChartData[];
  recentProperties: RecentProperty[];
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* By City */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Imóveis por Cidade
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.charts.byCity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* By Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Imóveis por Tipo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.charts.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {data.charts.byType.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution + Top Viewed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Fonte dos Imóveis
            </h2>
            <div className="flex flex-wrap gap-4">
              {data.charts.bySource.map((source, i) => (
                <div
                  key={source.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="font-medium">{source.name}</span>
                  <span className="text-gray-500">({source.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Viewed */}
          {data.topViewed && data.topViewed.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Imóveis Mais Vistos
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topViewed} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Imóveis Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b dark:border-gray-700">
                  <th className="pb-3">Título</th>
                  <th className="pb-3">Cidade</th>
                  <th className="pb-3">Preço</th>
                  <th className="pb-3">Fonte</th>
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
