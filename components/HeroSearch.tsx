"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/imoveis?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/imoveis");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por bairro, cidade ou tipo..."
        className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white/95 text-gray-800 placeholder:text-gray-400 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
