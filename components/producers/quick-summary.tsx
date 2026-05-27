import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Package, MapPin, AlertTriangle, Box, Warehouse } from 'lucide-react';

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
  lastStockRegistration?: {
    producerName: string;
    productName: string;
    time: string;
  };
  topStockProduct?: {
    name: string;
    quantity: string;
  };
  largestFarm?: {
    name: string;
    area: number;
    ownerName: string;
  };
}

export function QuickSummary({
  lastProducer,
  topProduct,
  topRegion,
  alerts,
  lastStockRegistration,
  topStockProduct,
  largestFarm,
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

        {lastStockRegistration && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Box className="w-4 h-4 text-blue-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Último cadastro de estoque</p>
              <p className="text-sm text-gray-600">{lastStockRegistration.productName}</p>
              <p className="text-xs text-gray-500">{lastStockRegistration.producerName} • {lastStockRegistration.time}</p>
            </div>
          </div>
        )}

        {topStockProduct && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Warehouse className="w-4 h-4 text-purple-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Produto com mais estoque</p>
              <p className="text-sm text-gray-600">{topStockProduct.name}</p>
              <p className="text-xs text-gray-500">{topStockProduct.quantity}</p>
            </div>
          </div>
        )}

        {largestFarm && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MapPin className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Maior fazenda (hectares)</p>
              <p className="text-sm text-gray-600">{largestFarm.name}</p>
              <p className="text-xs text-gray-500">{largestFarm.ownerName} • {largestFarm.area} ha</p>
            </div>
          </div>
        )}

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
