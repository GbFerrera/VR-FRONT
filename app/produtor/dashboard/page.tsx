'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { MobileHeader } from '@/components/dashboard/mobile-header';
import { ProducerSidebar } from '@/components/dashboard/producer-sidebar';
import { Input } from '@/components/ui/input';
import { Search, Package, Warehouse, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { producerProductsService, stocksService, ceasaService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  ceasaProducts: number;
}

interface ProductWithStock {
  id: string;
  name: string;
  unit: string;
  stock: number;
  averageProduction: number;
}

interface CeasaPrice {
  id: string;
  name: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
}

export default function ProdutorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    ceasaProducts: 0,
  });
  const [productsWithStock, setProductsWithStock] = useState<ProductWithStock[]>([]);
  const [ceasaPrices, setCeasaPrices] = useState<CeasaPrice[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [producerProducts, stocks, ceasaProducts] = await Promise.all([
          producerProductsService.getAll(user?.id),
          stocksService.getAll(user?.id),
          ceasaService.getLatestProducts(),
        ]);

        const productsData: ProductWithStock[] = producerProducts.map(pp => {
          const stock = stocks.find(s => s.producerProductId === pp.id);
          return {
            id: pp.id,
            name: pp.product.name,
            unit: pp.product.unit,
            stock: stock?.quantity || 0,
            averageProduction: pp.averageProduction,
          };
        });

        const totalStockValue = productsData.reduce((sum, p) => sum + p.stock, 0);

        setStats({
          totalProducts: producerProducts.length,
          totalStock: totalStockValue,
          ceasaProducts: ceasaProducts.length,
        });

        setProductsWithStock(productsData);
        setCeasaPrices(ceasaProducts.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          minPrice: p.minPrice,
          maxPrice: p.maxPrice,
          avgPrice: p.commonPrice,
          unit: p.unit
        })));
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileHeader
        title="Dashboard"
        subtitle="Visão geral da sua produção"
        actions={
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-white border-white/20 w-full lg:bg-gray-50 lg:border-gray-200"
            />
          </div>
        }
        sidebar={<ProducerSidebar />}
      />

      <div className="p-4 lg:p-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
          <StatCard
            title="Produtos Cadastrados"
            value={(stats?.totalProducts ?? 0).toString()}
            subtitle="Total de produtos que você cultiva"
            icon={Package}
            bgColor="bg-green-600"
            textColor="text-white"
          />
          <StatCard
            title="Estoque Total"
            value={(stats?.totalStock ?? 0).toString()}
            subtitle="Quantidade total em estoque"
            icon={Warehouse}
            bgColor="bg-blue-600"
            textColor="text-white"
          />
          <StatCard
            title="Cotações CEASA"
            value={(stats?.ceasaProducts ?? 0).toString()}
            subtitle="Produtos com cotação hoje"
            icon={TrendingUp}
            bgColor="bg-orange-500"
            textColor="text-white"
          />
          <StatCard
            title="Produção Média"
            value={(productsWithStock?.reduce((sum, p) => sum + p.averageProduction, 0) ?? 0).toFixed(0)}
            subtitle="Produção média total"
            icon={DollarSign}
            bgColor="bg-green-700"
            textColor="text-white"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Meus Produtos e Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              {productsWithStock.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">Nenhum produto cadastrado</p>
                  <p className="text-sm text-gray-400">Cadastre seus produtos para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {productsWithStock.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            Produção média: {product.averageProduction} {product.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {product.stock} {product.unit}
                        </p>
                        <p className="text-xs text-gray-500">em estoque</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cotação CEASA - Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {ceasaPrices.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">Nenhuma cotação disponível</p>
                  <p className="text-sm text-gray-400">As cotações serão atualizadas em breve</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ceasaPrices.map((price) => (
                    <div
                      key={price.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{price.name}</p>
                        <p className="text-xs text-gray-500">{price.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-700">
                          R$ {(price.avgPrice ?? 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Min: R$ {(price.minPrice ?? 0).toFixed(2)} | Max: R$ {(price.maxPrice ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resumo Geral da Produção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Package className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts ?? 0}</p>
                <p className="text-sm text-gray-600">Produtos Cadastrados</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Warehouse className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats?.totalStock ?? 0}</p>
                <p className="text-sm text-gray-600">Unidades em Estoque</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-orange-700 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats?.ceasaProducts ?? 0}</p>
                <p className="text-sm text-gray-600">Cotações Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
