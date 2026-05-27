'use client';

import { useEffect, useState } from 'react';
import { CeasaPriceTable } from '@/components/ceasa/ceasa-price-table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, TrendingUp, TrendingDown, DollarSign, Package, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ceasaService, CeasaProduct, CeasaStatistics } from '@/lib/api';
import { toast } from 'sonner';

export default function PrecoCaixa() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [products, setProducts] = useState<CeasaProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CeasaProduct[]>([]);
  const [statistics, setStatistics] = useState<CeasaStatistics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, statsData] = await Promise.all([
        ceasaService.getLatestProducts(),
        ceasaService.getStatistics(),
      ]);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setStatistics(statsData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do CEASA');
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    try {
      setScraping(true);
      const result = await ceasaService.scrape();
      toast.success(`Scraping concluído! ${result.totalSaved} produtos salvos.`);
      await loadData();
    } catch (error: any) {
      console.error('Erro ao fazer scraping:', error);
      toast.error('Erro ao fazer scraping do CEASA');
    } finally {
      setScraping(false);
    }
  };
  return (
    <>
      
      <main className="flex-1">
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <h1 className="text-2xl font-bold text-gray-800">Preços CEASA - Niquelândia</h1>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar produto..."
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleScrape}
                disabled={scraping}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${scraping ? 'animate-spin' : ''}`} />
                {scraping ? 'Atualizando...' : 'Atualizar Preços'}
              </Button>

              <div className="flex items-center gap-3">
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando dados...</p>
              </div>
            </div>
          ) : (
          <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-white">{statistics?.totalProducts || 0}</p>
                    <p className="text-sm font-medium mt-1 text-white">Produtos Cadastrados</p>
                    <p className="text-xs mt-2 text-white/90">CEASA Goiás</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-white">R$ {statistics?.avgPrice?.toFixed(2) || '0,00'}</p>
                    <p className="text-sm font-medium mt-1 text-white">Preço Médio/kg</p>
                    <p className="text-xs mt-2 text-white/90">Média geral</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-white">R$ {statistics?.maxPrice?.toFixed(2) || '0,00'}</p>
                    <p className="text-sm font-medium mt-1 text-white">Maior Preço/kg</p>
                    <p className="text-xs mt-2 text-white/90">{statistics?.maxPriceProduct || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <TrendingDown className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-white">R$ {statistics?.minPrice?.toFixed(2) || '0,00'}</p>
                    <p className="text-sm font-medium mt-1 text-white">Menor Preço/kg</p>
                    <p className="text-xs mt-2 text-white/90">{statistics?.minPriceProduct || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <CeasaPriceTable products={filteredProducts} />
          </>
          )}
        </div>
      </main>
    </>
  );
}
