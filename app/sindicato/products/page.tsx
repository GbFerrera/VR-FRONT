'use client';

import { useEffect, useState } from 'react';
import { StockStats } from '@/components/products/stock-stats';
import { StockTable } from '@/components/products/stock-table';
import { StockSummary } from '@/components/products/stock-summary';
import { LowStockAlert } from '@/components/products/low-stock-alert';
import { StockChart } from '@/components/products/stock-chart';
import { ProductDialog } from '@/components/products/product-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, ChevronDown, Package, Apple, Users, AlertTriangle, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { productsService, stocksService, Product, Stock } from '@/lib/api';
import { toast } from 'sonner';

export default function Products() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, stocksData] = await Promise.all([
        productsService.getAll(),
        stocksService.getAll(),
      ]);
      setProducts(productsData);
      setStocks(stocksData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedProduct) {
        await productsService.update(selectedProduct.id, formData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await productsService.create(formData);
        toast.success('Produto criado com sucesso!');
      }
      await loadData();
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar produto');
      throw error;
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await productsService.delete(id);
      toast.success('Produto excluído com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const productsWithStock = products.map(product => {
    const stock = stocks.find(s => s.producerProduct?.productId === product.id);
    return {
      ...product,
      stock: stock?.quantity || 0,
      stockId: stock?.id,
    };
  });

  const filteredProducts = searchTerm
    ? productsWithStock.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productsWithStock;

  const totalStock = stocks.reduce((sum, s) => sum + s.quantity, 0);
  const lowStockCount = stocks.filter(s => s.quantity < 100).length;

  const mockProducts = [
    {
      id: '1',
      name: 'Abóbora',
      producer: 'João Silva',
      location: 'Niquelândia - GO',
      stock: 2450,
      unit: 'kg',
      updatedAt: 'Hoje, 08:30',
      status: 'normal' as const,
      emoji: '🎃',
    },
    {
      id: '2',
      name: 'Banana Nanica',
      producer: 'Maria Oliveira',
      location: 'Niquelândia - GO',
      stock: 1200,
      unit: 'kg',
      updatedAt: 'Hoje, 07:45',
      status: 'normal' as const,
      emoji: '🍌',
    },
    {
      id: '3',
      name: 'Mandioca',
      producer: 'Pedro Santos',
      location: 'Colinas do Sul - GO',
      stock: 3800,
      unit: 'kg',
      updatedAt: 'Ontem, 17:20',
      status: 'normal' as const,
      emoji: '🥔',
    },
    {
      id: '4',
      name: 'Maracujá',
      producer: 'Ana Paula',
      location: 'Uruaçu - GO',
      stock: 850,
      unit: 'kg',
      updatedAt: 'Ontem, 16:10',
      status: 'baixo' as const,
      emoji: '🥭',
    },
    {
      id: '5',
      name: 'Cebolinha',
      producer: 'Carlos Alberto',
      location: 'Niquelândia - GO',
      stock: 120,
      unit: 'molhos',
      updatedAt: 'Ontem, 15:30',
      status: 'baixo' as const,
      emoji: '🌿',
    },
    {
      id: '6',
      name: 'Alface',
      producer: 'Lucas Pereira',
      location: 'Minaçu - GO',
      stock: 320,
      unit: 'unidades',
      updatedAt: 'Ontem, 14:15',
      status: 'normal' as const,
      emoji: '🥬',
    },
    {
      id: '7',
      name: 'Milho Verde',
      producer: 'João Santana',
      location: 'Ouro Verde - GO',
      stock: 1050,
      unit: 'unidades',
      updatedAt: 'Ontem, 13:40',
      status: 'normal' as const,
      emoji: '🌽',
    },
    {
      id: '8',
      name: 'Batata Doce',
      producer: 'Francisco Lima',
      location: 'Niquelândia - GO',
      stock: 600,
      unit: 'kg',
      updatedAt: 'Ontem, 12:25',
      status: 'medio' as const,
      emoji: '🍠',
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  const lowStockItems = stocks
    .filter(s => s.quantity < 100)
    .slice(0, 3)
    .map(s => {
      const product = products.find(p => p.id === s.producerProduct?.productId);
      return {
        id: s.id,
        name: product?.name || 'Produto',
        producer: 'Produtor',
        quantity: `${s.quantity} ${product?.unit || 'un'}`,
        emoji: '📦',
      };
    });

  const mockLowStockItems = [
    {
      id: '1',
      name: 'Maracujá',
      producer: 'Ana Paula',
      quantity: '850 kg',
      emoji: '🥭',
    },
    {
      id: '2',
      name: 'Cebolinha',
      producer: 'Carlos Alberto',
      quantity: '120 molhos',
      emoji: '🌿',
    },
    {
      id: '3',
      name: 'Laranja Pera',
      producer: 'Francisco Lima',
      quantity: '300 kg',
      emoji: '🍊',
    },
  ];

  return (
    <>
      
      <main className="flex-1">
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <h1 className="text-2xl font-bold text-gray-800">Estoque dos Produtores</h1>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar produto ou produtor..."
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => {
                  setSelectedProduct(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
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
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StockStats
              icon={Package}
              value={`${totalStock.toLocaleString('pt-BR')} un`}
              label="Estoque Total"
              trend="Total em estoque"
              bgColor="bg-green-600"
              textColor="text-white"
            />
            <StockStats
              icon={Apple}
              value={products.length.toString()}
              label="Produtos Cadastrados"
              trend="Total de produtos"
              bgColor="bg-orange-500"
              textColor="text-white"
            />
            <StockStats
              icon={Users}
              value={stocks.length.toString()}
              label="Itens em Estoque"
              trend="Total de registros"
              bgColor="bg-blue-600"
              textColor="text-white"
            />
            <StockStats
              icon={AlertTriangle}
              value={lowStockCount.toString()}
              label="Estoque Baixo"
              trend="Requer atenção"
              bgColor="bg-red-600"
              textColor="text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="col-span-3">
              <StockTable 
                products={filteredProducts} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="space-y-6">
              <StockSummary
                highStock={{
                  name: 'Mandioca',
                  producer: 'Pedro Santos',
                  quantity: '3.800 kg',
                  type: 'high',
                }}
                lowStock={{
                  name: 'Cebolinha',
                  producer: 'Carlos Alberto',
                  quantity: '120 molhos',
                  type: 'low',
                }}
                mostStocked={{
                  name: 'Mandioca',
                  producer: 'Pedro Santos',
                  quantity: '3.800 kg',
                  type: 'most',
                }}
                leastStocked={{
                  name: 'Cebolinha',
                  producer: 'Carlos Alberto',
                  quantity: '120 molhos',
                  type: 'least',
                }}
              />
              <LowStockAlert items={lowStockItems.length > 0 ? lowStockItems : mockLowStockItems} />
              <StockChart />
            </div>
          </div>
        </div>
      </main>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSave={handleSave}
      />
    </>
  );
}