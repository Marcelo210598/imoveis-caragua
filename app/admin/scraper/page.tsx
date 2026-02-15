"use client";

import { useState } from "react";
import {
  Loader2,
  Play,
  CheckCircle,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

export default function ScraperAdminPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "running" | "completed" | "error"
  >("idle");

  const [selectedSource, setSelectedSource] = useState("OLX");
  const [selectedCity, setSelectedCity] = useState("Caraguatatuba");

  const sources = ["ZAP", "VIVAREAL", "OLX"];
  const cities = ["Caraguatatuba", "Ubatuba", "Sao Sebastiao", "Ilhabela"];

  async function runScraper() {
    setLoading(true);
    setStatus("running");
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Iniciando scraping de ${selectedSource} em ${selectedCity}...`,
    ]);

    try {
      const res = await fetch("/api/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: [selectedSource],
          filters: {
            cities: [selectedCity],
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro na requisição");

      setStatus("completed");
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Sucesso: ${data.message}`,
      ]);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ERRO: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      ]);
      toast.error("Falha ao rodar scraper. Verifique o tempo limite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Scraper Control
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fonte
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-transparent"
              disabled={loading}
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s} Imóveis
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cidade
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-transparent"
              disabled={loading}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Execução Manual
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inicie o scraping manualmente para a fonte e cidade selecionada.
            </p>
          </div>
          <button
            onClick={runScraper}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Play size={20} />
            )}
            {loading ? "Executando..." : "Iniciar Scraping"}
          </button>
        </div>

        {/* Status Indicator */}
        {status !== "idle" && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 mb-6 ${
              status === "completed"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : status === "error"
                  ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            }`}
          >
            {status === "completed" && <CheckCircle size={20} />}
            {status === "error" && <AlertTriangle size={20} />}
            {status === "running" && (
              <Loader2 className="animate-spin" size={20} />
            )}
            <span className="font-medium">
              {status === "running" && "Scraping em andamento..."}
              {status === "completed" && "Scraping finalizado com sucesso"}
              {status === "error" && "Erro durante a execução"}
            </span>
          </div>
        )}

        {/* Logs Terminal */}
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
          <div className="flex items-center gap-2 text-gray-400 mb-2 border-b border-gray-700 pb-2">
            <Terminal size={14} />
            <span>Console Output</span>
          </div>
          <div className="space-y-1">
            {logs.length === 0 && (
              <span className="text-gray-600 italic">
                Pronto para iniciar...
              </span>
            )}
            {logs.map((log, i) => (
              <div
                key={i}
                className={`${log.includes("ERRO") ? "text-red-400" : "text-green-400"}`}
              >
                {log}
              </div>
            ))}
            {loading && (
              <div className="text-blue-400 animate-pulse">Processing...</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 dark:text-white">Fontes Ativas</h3>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">✅ ZapImóveis</li>
            <li className="flex items-center gap-2">✅ VivaReal</li>
            <li className="flex items-center gap-2">✅ OLX</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 dark:text-white">Como Usar</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selecione uma fonte e uma cidade por vez para evitar Timeou (limite
            de 5 min da Vercel).
          </p>
        </div>
      </div>
    </div>
  );
}
