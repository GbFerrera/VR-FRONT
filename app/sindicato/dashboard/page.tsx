'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { ProductsList } from '@/components/dashboard/products-list';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Search, ChevronDown, DollarSign, ShoppingCart, Users, Building2, Package, TrendingUp, Leaf } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { productsService, usersService, stocksService, pricesService } from '@/lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalProducers: 0,
    totalCompanies: 0,
    dailyRevenue: 0,
    dailyOrders: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [recentPrices, setRecentPrices] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [allProducts, allUsers, allStocks, allPrices] = await Promise.all([
          productsService.getAll(),
          usersService.getAll(),
          stocksService.getAll(),
          pricesService.getAll(),
        ]);

        const producers = allUsers.filter(u => u.role === 'PRODUCER');
        const companies = allUsers.filter(u => u.role === 'ADMIN');

        const productsWithStockAndPrice = allProducts.slice(0, 3).map(product => {
          const stock = allStocks.find(s => s.producerProduct?.productId === product.id);
          const price = allPrices.find(p => p.productId === product.id);
          
          return {
            id: product.id,
            name: product.name,
            quantity: stock ? `${stock.quantity}${product.unit}` : `0${product.unit}`,
            price: price ? `R$ ${price.price.toFixed(2)}` : 'N/A',
            pricePerKg: price ? `R$ ${price.price.toFixed(2)}/${product.unit}` : 'N/A',
          };
        });

        setStats({
          totalProducts: allProducts.length,
          totalProducers: producers.length,
          totalCompanies: companies.length,
          dailyRevenue: 0,
          dailyOrders: 0,
        });

        setProducts(productsWithStockAndPrice);
        setRecentPrices(allPrices.slice(0, 5));
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const summaryItems = [
    {
      icon: Package,
      label: 'Produtos',
      value: stats.totalProducts,
      bgColor: 'bg-green-50',
      iconColor: 'bg-green-500',
      trend: 'up' as const,
    },
    {
      icon: TrendingUp,
      label: 'Preços Atualizados',
      value: recentPrices.length,
      bgColor: 'bg-orange-50',
      iconColor: 'bg-orange-500',
      trend: 'up' as const,
    },
    {
      icon: Leaf,
      label: 'Produtores Ativos',
      value: stats.totalProducers,
      bgColor: 'bg-green-50',
      iconColor: 'bg-green-500',
    },
  ];

  const orders = [
    {
      id: '1',
      customer: 'Aguardando dados',
      product: 'Sistema em desenvolvimento',
      value: 'R$ 0,00',
      status: 'pending' as const,
    },
  ];

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
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l">
                <Avatar>
                  <AvatarFallback className="bg-green-600 text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Produtor'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Faturamento do dia"
              value={`R$ ${stats.dailyRevenue.toFixed(2)}`}
              subtitle="Em desenvolvimento"
              icon={DollarSign}
              bgColor="bg-green-600"
              textColor="text-white"
            />
            <StatCard
              title="Pedidos de Hoje"
              value={stats.dailyOrders.toString()}
              subtitle="Em desenvolvimento"
              icon={ShoppingCart}
              bgColor="bg-orange-500"
              textColor="text-white"
            />
            <StatCard
              title="Produtores Ativos"
              value={stats.totalProducers.toString()}
              subtitle="Total de produtores cadastrados"
              icon={Users}
              bgColor="bg-green-700"
              textColor="text-white"
            />
            <StatCard
              title="Produtos Cadastrados"
              value={stats.totalProducts.toString()}
              subtitle="Total de produtos no sistema"
              icon={Building2}
              bgColor="bg-blue-600"
              textColor="text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <SummaryCard items={summaryItems} />
            <div className="col-span-2">
              <RecentOrders orders={orders} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ProductsList products={products} />
            <SalesChart />
          </div>
        </div>
    </>
  );
}