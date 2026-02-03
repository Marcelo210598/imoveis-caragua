'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface PriceChartProps {
  propertyPrice: number;
  avgPrice: number;
}

export default function PriceChart({
  propertyPrice,
  avgPrice,
}: PriceChartProps) {
  const data = [
    { name: 'Este Imovel', value: Math.round(propertyPrice) },
    { name: 'Media do Bairro', value: Math.round(avgPrice) },
  ];

  const colors = ['#0088cc', '#94a3b8'];

  const formatValue = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR')}`;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={60}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 13, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatValue(value), 'R$/m\u00B2']}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
