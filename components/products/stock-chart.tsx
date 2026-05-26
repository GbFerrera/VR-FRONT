'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StockChart() {
  const data = [
    { label: 'kg', value: 8450, percentage: 68, color: 'bg-blue-500' },
    { label: 'unidades', value: 2350, percentage: 19, color: 'bg-orange-500' },
    { label: 'molhos', value: 920, percentage: 7, color: 'bg-yellow-500' },
    { label: 'outros', value: 730, percentage: 6, color: 'bg-green-500' },
  ];

  const total = 12450;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Estoque por Unidade</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            Ver gráfico →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="20"
                strokeDasharray={`${68 * 2.51} ${100 * 2.51}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f97316"
                strokeWidth="20"
                strokeDasharray={`${19 * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`${-68 * 2.51}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#eab308"
                strokeWidth="20"
                strokeDasharray={`${7 * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`${-(68 + 19) * 2.51}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="20"
                strokeDasharray={`${6 * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`${-(68 + 19 + 7) * 2.51}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{total.toLocaleString('pt-BR')} kg</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.value.toLocaleString('pt-BR')} {item.label} ({item.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
