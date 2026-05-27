'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ceasaService, CeasaPriceHistory } from '@/lib/api/ceasa';

interface CeasaChartProps {
  productCode?: string;
}

export function CeasaChart({ productCode }: CeasaChartProps) {
  const [data, setData] = useState<CeasaPriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    current: 0,
    change: 0,
    trend: 'up' as 'up' | 'down',
  });

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 7);

        let history: CeasaPriceHistory[] = [];
        
        if (productCode) {
          history = await ceasaService.getPriceHistory(
            productCode,
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
          );
        } else {
          const products = await ceasaService.getLatestProducts();
          if (products.length > 0) {
            const topProduct = products[0];
            history = await ceasaService.getPriceHistory(
              topProduct.code,
              startDate.toISOString().split('T')[0],
              endDate.toISOString().split('T')[0]
            );
          }
        }

        if (history.length > 0) {
          const monthlyData = aggregateByMonth(history);
          setData(monthlyData);

          const current = monthlyData[monthlyData.length - 1]?.avgPrice || 0;
          const previous = monthlyData[monthlyData.length - 2]?.avgPrice || 0;
          const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

          setStats({
            current,
            change: Math.abs(change),
            trend: change >= 0 ? 'up' : 'down',
          });
        } else {
          setData(getDefaultData());
        }
      } catch (error) {
        console.error('Erro ao carregar histórico de preços:', error);
        setData(getDefaultData());
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [productCode]);

  const aggregateByMonth = (history: CeasaPriceHistory[]): CeasaPriceHistory[] => {
    const monthlyMap = new Map<string, { sum: number; count: number; minPrice: number; maxPrice: number }>();

    history.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { sum: 0, count: 0, minPrice: item.minPrice, maxPrice: item.maxPrice });
      }
      
      const current = monthlyMap.get(monthKey)!;
      current.sum += item.avgPrice;
      current.count += 1;
      current.minPrice = Math.min(current.minPrice, item.minPrice);
      current.maxPrice = Math.max(current.maxPrice, item.maxPrice);
    });

    return Array.from(monthlyMap.entries())
      .map(([monthKey, data]) => ({
        date: monthKey,
        avgPrice: data.sum / data.count,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-8);
  };

  const getDefaultData = (): CeasaPriceHistory[] => {
    const months = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'];
    return months.map((month, index) => ({
      date: month,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
    }));
  };

  const formatMonth = (dateStr: string): string => {
    if (dateStr.length === 3) return dateStr;
    
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return monthNames[parseInt(month) - 1] || dateStr;
  };

  const maxValue = Math.max(...data.map((d) => d.avgPrice), 1);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Gráfico de Cotações CEASA</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Preço Médio</span>
              </div>
              <span className="text-xs text-gray-500">Últimos 8 meses</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              R$ {stats.current.toFixed(2)}
            </p>
            <p className={`text-xs ${stats.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stats.trend === 'up' ? '↑' : '↓'} {stats.change.toFixed(1)}% - Último mês
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end justify-between gap-2 px-4">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.avgPrice / maxValue) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '160px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg transition-all hover:from-green-500 hover:to-green-400 cursor-pointer group"
                    style={{ height: `${height}%` }}
                    title={`R$ ${item.avgPrice.toFixed(2)}`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      R$ {item.avgPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{formatMonth(item.date)}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
