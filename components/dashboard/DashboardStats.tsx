import { Heart, Home, MessageSquare } from "lucide-react";

interface StatsProps {
  totalProperties: number;
  activeProperties: number;
  totalFavorites: number;
}

export default function DashboardStats({
  totalProperties,
  activeProperties,
  totalFavorites,
}: StatsProps) {
  const stats = [
    {
      label: "Meus Imóveis",
      value: totalProperties,
      subValue: `${activeProperties} Ativos`,
      icon: Home,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Favoritados",
      value: totalFavorites,
      subValue: "Total",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100 dark:bg-rose-900/30",
    },
    /* 
    // Future implementation: Messages count
    {
      label: "Mensagens",
      value: 0,
      subValue: "Novas",
      icon: MessageSquare,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    */
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            {/* Trend indicator (optional) */}
            {/* <span className="text-xs font-medium text-green-600">+2</span> */}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              {stat.label}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              {stat.subValue}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
