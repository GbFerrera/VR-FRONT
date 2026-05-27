'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, Package, Warehouse, Sprout, TrendingUp } from 'lucide-react';
import { User } from '@/lib/api';

interface ProducerSummaryPanelProps {
  producer: User;
  onClose: () => void;
}

export function ProducerSummaryPanel({ producer, onClose }: ProducerSummaryPanelProps) {
  const mockData = {
    farms: 3,
    mainProducts: ['Abóbora', 'Tomate', 'Alface'],
    currentStock: '1.245 kg',
    nextHarvests: [
      { product: 'Tomate', date: '15/06/2026', quantity: '500 kg' },
      { product: 'Alface', date: '20/06/2026', quantity: '300 kg' },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
                {producer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">{producer.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                  <span className="text-sm text-gray-600">Cadastrado em {new Date(producer.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span>📧</span> Email
              </p>
              <p className="text-gray-800 font-medium">{producer.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span>📞</span> Telefone
              </p>
              <p className="text-gray-800 font-medium">{producer.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <Warehouse className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{mockData.farms}</p>
                    <p className="text-sm text-blue-700">Fazendas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-600 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-900">{mockData.currentStock}</p>
                    <p className="text-sm text-orange-700">Estoque Atual</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Produtos Principais</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockData.mainProducts.map((product, index) => (
                <Badge
                  key={index}
                  className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1"
                >
                  {product}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Próximas Colheitas</h3>
            </div>
            <div className="space-y-3">
              {mockData.nextHarvests.map((harvest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{harvest.product}</p>
                      <p className="text-sm text-gray-600">{harvest.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-900">{harvest.quantity}</p>
                    <p className="text-xs text-purple-700">Estimado</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
