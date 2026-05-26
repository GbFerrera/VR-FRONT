'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: 'Jun', value: 45000 },
  { month: 'Jul', value: 52000 },
  { month: 'Ago', value: 49000 },
  { month: 'Set', value: 61000 },
  { month: 'Out', value: 58000 },
  { month: 'Nov', value: 67000 },
  { month: 'Dez', value: 72000 },
  { month: 'Jan', value: 57210 },
];

export function SalesChart() {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Gráfico de Vendas</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Valor Vendido</span>
              </div>
              <span className="text-xs text-gray-500">Semana Passada - Hoje</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">R$ 57.210,00</p>
            <p className="text-xs text-gray-500">↑ 5.4% - Hoje</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end justify-between gap-2 px-4">
          {data.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '160px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg transition-all hover:from-green-500 hover:to-green-400"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{item.month}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
