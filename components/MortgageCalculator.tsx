"use client";

import { useState, useMemo } from "react";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";

interface MortgageCalculatorProps {
  price: number | null;
}

export default function MortgageCalculator({ price }: MortgageCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(10.5);
  const [termYears, setTermYears] = useState(30);

  const propertyPrice = price || 0;

  const result = useMemo(() => {
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = termYears * 12;

    if (loanAmount <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return { monthly: 0, total: 0, interest: 0, downPayment };
    }

    // Fórmula Price (SAC simplificado)
    const monthly =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const total = monthly * totalMonths;
    const interest = total - loanAmount;

    return { monthly, total, interest, downPayment };
  }, [propertyPrice, downPaymentPercent, interestRate, termYears]);

  if (!price || price <= 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
          <Calculator size={20} className="text-primary-500" />
          Simulação de Financiamento
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-4">
          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Entrada ({downPaymentPercent}%)
              </label>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>5%</span>
                <span className="font-semibold text-primary-600">
                  {result.downPayment.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span>80%</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Taxa de juros ({interestRate}% a.a.)
              </label>
              <input
                type="range"
                min={5}
                max={18}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>5%</span>
                <span>18%</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Prazo ({termYears} anos)
              </label>
              <input
                type="range"
                min={5}
                max={35}
                step={5}
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>5 anos</span>
                <span>35 anos</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950 rounded-xl p-4 space-y-2">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Parcela estimada
              </p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {result.monthly.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
                <span className="text-sm font-normal text-gray-500">/mês</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
                <p className="text-gray-500">Total pago</p>
                <p className="font-semibold">
                  {(result.total + result.downPayment).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
                <p className="text-gray-500">Total em juros</p>
                <p className="font-semibold text-red-500">
                  {result.interest.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center">
            * Simulação pelo sistema Price. Valores podem variar conforme a
            instituição financeira.
          </p>
        </div>
      )}
    </div>
  );
}
