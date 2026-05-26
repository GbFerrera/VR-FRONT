import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockItem {
  name: string;
  producer: string;
  quantity: string;
  type: 'high' | 'low' | 'most' | 'least';
}

interface StockSummaryProps {
  highStock: StockItem;
  lowStock: StockItem;
  mostStocked: StockItem;
  leastStocked: StockItem;
}

export function StockSummary({
  highStock,
  lowStock,
  mostStocked,
  leastStocked,
}: StockSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Resumo do Estoque</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            Ver todos →
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Maior Estoque</p>
            <p className="text-sm text-gray-600">{highStock.name}</p>
            <p className="text-xs text-gray-500">{highStock.quantity}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingDown className="w-4 h-4 text-orange-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Menor Estoque</p>
            <p className="text-sm text-gray-600">{lowStock.name}</p>
            <p className="text-xs text-gray-500">{lowStock.quantity}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Produto mais estocado</p>
            <p className="text-sm text-gray-600">{mostStocked.name}</p>
            <p className="text-xs text-gray-500">{mostStocked.quantity}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <TrendingDown className="w-4 h-4 text-red-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Produto menos estocado</p>
            <p className="text-sm text-red-600">{leastStocked.name}</p>
            <p className="text-xs text-gray-500">{leastStocked.quantity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
