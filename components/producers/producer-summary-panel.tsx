'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, Package, Warehouse, Sprout, TrendingUp } from 'lucide-react';
import { User, farmsService, producerProductsService, stocksService, harvestsService, Farm, ProducerProduct, Stock, Harvest } from '@/lib/api';

interface ProducerSummaryPanelProps {
  producer: User;
  onClose: () => void;
}

export function ProducerSummaryPanel({ producer, onClose }: ProducerSummaryPanelProps) {
  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [producerProducts, setProducerProducts] = useState<ProducerProduct[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);

  useEffect(() => {
    const fetchProducerData = async () => {
      try {
        setLoading(true);
        const [farmsData, productsData, stocksData, harvestsData] = await Promise.all([
          farmsService.getAll(producer.id),
          producerProductsService.getAll(producer.id),
          stocksService.getAll(producer.id),
          harvestsService.getAll(producer.id),
        ]);
        setFarms(farmsData);
        setProducerProducts(productsData);
        setStocks(stocksData);
        setHarvests(harvestsData);
      } catch (error) {
        console.error('Erro ao carregar dados do produtor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducerData();
  }, [producer.id]);

  const totalStock = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const stockUnit = stocks[0]?.producerProduct?.product?.unit || 'kg';
  const mainProducts = producerProducts.slice(0, 5).map(pp => pp.product.name);
  const upcomingHarvests = harvests
    .filter(h => !h.actualDate && new Date(h.expectedDate) > new Date())
    .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime())
    .slice(0, 3);

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

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Warehouse className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Fazendas ({farms.length})</h3>
            </div>
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
              ) : farms.length > 0 ? (
                farms.map((farm) => (
                  <div
                    key={farm.id}
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{farm.name}</p>
                        {farm.area && (
                          <p className="text-sm text-gray-600">{farm.area} hectares</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhuma fazenda cadastrada</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-900">{loading ? '...' : producerProducts.length}</p>
                    <p className="text-sm text-green-700">Produtos</p>
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
                    <p className="text-2xl font-bold text-orange-900">{loading ? '...' : `${totalStock.toLocaleString('pt-BR')} ${stockUnit}`}</p>
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
              {loading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
              ) : mainProducts.length > 0 ? (
                mainProducts.map((product, index) => (
                  <Badge
                    key={index}
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1"
                  >
                    {product}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum produto cadastrado</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Próximas Colheitas</h3>
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
              ) : upcomingHarvests.length > 0 ? (
                upcomingHarvests.map((harvest) => (
                  <div
                    key={harvest.id}
                    className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{harvest.producerProduct?.product?.name || 'Produto'}</p>
                        <p className="text-sm text-gray-600">{new Date(harvest.expectedDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-purple-700">Previsto</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhuma colheita programada</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
