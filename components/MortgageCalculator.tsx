"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Wallet,
  Calendar,
  Percent,
  Info,
} from "lucide-react";

interface MortgageCalculatorProps {
  price: number | null;
}

function formatBRL(value: number, decimals = 2): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function MortgageCalculator({ price }: MortgageCalculatorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(10.5);
  const [termYears, setTermYears] = useState(30);
  const [mode, setMode] = useState<"price" | "sac">("price");

  const propertyPrice = price || 0;

  const result = useMemo(() => {
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = termYears * 12;

    if (loanAmount <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return {
        monthlyPrice: 0,
        monthlySacFirst: 0,
        monthlySacLast: 0,
        totalPrice: 0,
        totalSac: 0,
        interestPrice: 0,
        interestSac: 0,
        downPayment,
        loanAmount,
      };
    }

    // Price (fixed payments)
    const monthlyPrice =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPrice = monthlyPrice * totalMonths;
    const interestPrice = totalPrice - loanAmount;

    // SAC (decreasing payments)
    const amortization = loanAmount / totalMonths;
    const monthlySacFirst = amortization + loanAmount * monthlyRate;
    const monthlySacLast = amortization + amortization * monthlyRate;
    // SAC total interest = sum of (remaining_balance * monthlyRate) for each month
    const totalInterestSac = (monthlyRate * loanAmount * (totalMonths + 1)) / 2;
    const totalSac = loanAmount + totalInterestSac;
    const interestSac = totalInterestSac;

    return {
      monthlyPrice,
      monthlySacFirst,
      monthlySacLast,
      totalPrice,
      totalSac,
      interestPrice,
      interestSac,
      downPayment,
      loanAmount,
    };
  }, [propertyPrice, downPaymentPercent, interestRate, termYears]);

  // Calculate bar widths for visual comparison
  const principalPercent = useMemo(() => {
    const total = mode === "price" ? result.totalPrice : result.totalSac;
    if (total <= 0) return 50;
    return Math.round(
      (result.loanAmount /
        (result.loanAmount +
          (mode === "price" ? result.interestPrice : result.interestSac))) *
        100,
    );
  }, [mode, result]);

  if (!price || price <= 0) return null;

  const monthly =
    mode === "price" ? result.monthlyPrice : result.monthlySacFirst;
  const totalInterest =
    mode === "price" ? result.interestPrice : result.interestSac;
  const totalPaid =
    mode === "price"
      ? result.totalPrice + result.downPayment
      : result.totalSac + result.downPayment;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Calculator size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
              Simulação de Financiamento
            </p>
            <p className="text-xs text-gray-400">
              Calcule sua parcela em segundos
            </p>
          </div>
        </div>
        <div
          className={`p-1.5 rounded-lg transition-colors ${isOpen ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200"}`}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 space-y-5">
          {/* Mode Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setMode("price")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                mode === "price"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingDown size={14} />
              Tabela Price
            </button>
            <button
              onClick={() => setMode("sac")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                mode === "sac"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingUp size={14} />
              Tabela SAC
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {/* Down Payment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <PiggyBank size={14} className="text-emerald-500" />
                  Entrada
                </label>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg">
                  {downPaymentPercent}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5%</span>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {formatBRL(result.downPayment, 0)}
                </span>
                <span>80%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <Percent size={14} className="text-blue-500" />
                  Taxa de Juros (a.a.)
                </label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-lg">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={18}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5%</span>
                <span>18%</span>
              </div>
            </div>

            {/* Term */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <Calendar size={14} className="text-violet-500" />
                  Prazo
                </label>
                <span className="text-sm font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 px-2.5 py-0.5 rounded-lg">
                  {termYears} anos
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={35}
                step={5}
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-violet-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5 anos</span>
                <span>{termYears * 12} parcelas</span>
                <span>35 anos</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-6 -translate-x-6" />

            <div className="relative z-10">
              <p className="text-emerald-100 text-xs uppercase tracking-widest font-semibold mb-1">
                {mode === "price" ? "Parcela Fixa" : "Primeira Parcela"}
              </p>
              <p className="text-4xl font-extrabold tracking-tight">
                {formatBRL(monthly, 0)}
                <span className="text-base font-normal text-emerald-200 ml-1">
                  /mês
                </span>
              </p>

              {mode === "sac" && (
                <p className="text-emerald-200 text-xs mt-1">
                  Última parcela: {formatBRL(result.monthlySacLast, 0)}/mês
                </p>
              )}
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            {/* Principal vs Interest bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Capital vs Juros
                </span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div
                  className="bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${principalPercent}%` }}
                />
                <div
                  className="bg-red-400 transition-all duration-500 ease-out"
                  style={{ width: `${100 - principalPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-gray-500">
                    Capital: {formatBRL(result.loanAmount, 0)}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  <span className="text-gray-500">
                    Juros: {formatBRL(totalInterest, 0)}
                  </span>
                </span>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <Wallet size={16} className="text-emerald-500 mx-auto mb-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Entrada
                </p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {formatBRL(result.downPayment, 0)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <PiggyBank size={16} className="text-blue-500 mx-auto mb-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Financiado
                </p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {formatBRL(result.loanAmount, 0)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <Calculator
                  size={16}
                  className="text-violet-500 mx-auto mb-1"
                />
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Total Pago
                </p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {formatBRL(totalPaid, 0)}
                </p>
              </div>
            </div>

            {/* SAC vs Price tip */}
            {mode === "sac" && (
              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl p-3">
                <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                  <strong>SAC:</strong> Parcelas decrescentes. A primeira é
                  maior, mas você paga{" "}
                  <strong>
                    {formatBRL(result.interestPrice - result.interestSac, 0)}
                  </strong>{" "}
                  a menos em juros comparado à Price.
                </p>
              </div>
            )}

            {mode === "price" && (
              <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-3">
                <Info size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  <strong>Price:</strong> Parcelas fixas durante todo o
                  financiamento. Ideal para quem busca previsibilidade no
                  orçamento mensal.
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-gray-400 text-center pt-1">
            * Simulação estimada. Valores podem variar conforme a instituição
            financeira e análise de crédito.
          </p>
        </div>
      )}
    </div>
  );
}
