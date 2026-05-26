import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Package, MapPin, AlertTriangle } from 'lucide-react';

interface QuickSummaryProps {
  lastProducer: {
    name: string;
    time: string;
  };
  topProduct: {
    name: string;
    quantity: string;
  };
  topRegion: {
    name: string;
    count: number;
  };
  alerts: {
    count: number;
    message: string;
  };
}

export function QuickSummary({
  lastProducer,
  topProduct,
  topRegion,
  alerts,
}: QuickSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Resumo Rápido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <User className="w-4 h-4 text-green-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Último cadastro</p>
            <p className="text-sm text-gray-600">{lastProducer.name}</p>
            <p className="text-xs text-gray-500">{lastProducer.time}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Package className="w-4 h-4 text-green-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Produto mais produzido</p>
            <p className="text-sm text-gray-600">{topProduct.name}</p>
            <p className="text-xs text-gray-500">{topProduct.quantity}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <MapPin className="w-4 h-4 text-green-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Região com maior produção</p>
            <p className="text-sm text-gray-600">{topRegion.name}</p>
            <p className="text-xs text-gray-500">{topRegion.count} produtores</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Alertas do sistema</p>
            <p className="text-sm text-red-600">{alerts.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
