'use client';

import { useEffect, useState } from 'react';
import { ProducerStats } from '@/components/producers/producer-stats';
import { QuickSummary } from '@/components/producers/quick-summary';
import { QuickFilters } from '@/components/producers/quick-filters';
import { ProducersTable } from '@/components/producers/producers-table';
import { ProducerDialog } from '@/components/producers/producer-dialog';
import { ProducerSummaryPanel } from '@/components/producers/producer-summary-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, ChevronDown, Users, Truck, Package, AlertTriangle, Plus } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { usersService, User, stocksService, Stock, farmsService, Farm } from '@/lib/api';
import { toast } from 'sonner';

export default function Producers() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [producers, setProducers] = useState<User[]>([]);
  const [filteredProducers, setFilteredProducers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<User | null>(null);
  const [summaryProducer, setSummaryProducer] = useState<User | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);

  useEffect(() => {
    loadProducers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = producers.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
      );
      setFilteredProducers(filtered);
    } else {
      setFilteredProducers(producers);
    }
  }, [searchTerm, producers]);

  const loadProducers = async () => {
    try {
      setLoading(true);
      const [producersData, stocksData, farmsData] = await Promise.all([
        usersService.getAll('PRODUCER'),
        stocksService.getAll(),
        farmsService.getAll(),
      ]);
      setProducers(producersData);
      setFilteredProducers(producersData);
      setStocks(stocksData);
      setFarms(farmsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedProducer) {
        await usersService.update(selectedProducer.id, formData);
        toast.success('Produtor atualizado com sucesso!');
      } else {
        await usersService.create({ ...formData, role: 'PRODUCER' });
        toast.success('Produtor criado com sucesso!');
      }
      await loadProducers();
      setSelectedProducer(null);
    } catch (error: any) {
      console.error('Erro ao salvar produtor:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar produtor');
      throw error;
    }
  };

  const handleEdit = (producer: User) => {
    setSelectedProducer(producer);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produtor?')) return;
    
    try {
      await usersService.delete(id);
      toast.success('Produtor excluído com sucesso!');
      await loadProducers();
    } catch (error) {
      console.error('Erro ao excluir produtor:', error);
      toast.error('Erro ao excluir produtor');
    }
  };

  const getLastStockRegistration = () => {
    if (stocks.length === 0) return undefined;
    
    const sortedStocks = [...stocks].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    const lastStock = sortedStocks[0];
    if (!lastStock.producerProduct) return undefined;
    
    const producer = producers.find(p => p.id === lastStock.producerProduct?.producerId);
    const date = new Date(lastStock.updatedAt);
    const timeStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ', ' + 
                    date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    return {
      producerName: producer?.name || 'Desconhecido',
      productName: lastStock.producerProduct.product.name,
      time: timeStr,
    };
  };

  const getTopStockProduct = () => {
    if (stocks.length === 0) return undefined;
    
    const productStocks = stocks.reduce((acc, stock) => {
      if (!stock.producerProduct) return acc;
      
      const productName = stock.producerProduct.product.name;
      const unit = stock.producerProduct.product.unit;
      
      if (!acc[productName]) {
        acc[productName] = { total: 0, unit };
      }
      acc[productName].total += stock.quantity;
      
      return acc;
    }, {} as Record<string, { total: number; unit: string }>);
    
    const topProduct = Object.entries(productStocks).sort((a, b) => b[1].total - a[1].total)[0];
    
    if (!topProduct) return undefined;
    
    return {
      name: topProduct[0],
      quantity: `${topProduct[1].total.toLocaleString('pt-BR')} ${topProduct[1].unit}`,
    };
  };

  const getLargestFarm = () => {
    if (farms.length === 0) return undefined;
    
    const farmsWithArea = farms.filter(f => f.area && f.area > 0);
    if (farmsWithArea.length === 0) return undefined;
    
    const largest = farmsWithArea.sort((a, b) => (b.area || 0) - (a.area || 0))[0];
    const owner = producers.find(p => p.id === largest.ownerId);
    
    return {
      name: largest.name,
      area: largest.area || 0,
      ownerName: owner?.name || 'Desconhecido',
    };
  };

  const mockProducers = [
    {
      id: '1',
      name: 'João Silva',
      location: 'Niquelândia - GO',
      phone: '(19) 99999-9999',
      email: 'joao.silva@email.com',
      products: 12,
      status: 'ativo' as const,
      production: 'alta' as const,
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      location: 'Niquelândia - GO',
      phone: '(19) 98888-8888',
      email: 'maria.oliveira@email.com',
      products: 8,
      status: 'ativo' as const,
      production: 'media' as const,
    },
    {
      id: '3',
      name: 'Pedro Santos',
      location: 'Colinas do Sul - GO',
      phone: '(19) 97777-7777',
      email: 'pedro.santos@email.com',
      products: 15,
      status: 'ativo' as const,
      production: 'alta' as const,
    },
    {
      id: '4',
      name: 'Ana Paula',
      location: 'Uruaçu - GO',
      phone: '(19) 96666-6666',
      email: 'ana.paula@email.com',
      products: 6,
      status: 'pendente' as const,
      production: 'media' as const,
    },
    {
      id: '5',
      name: 'Carlos Alberto',
      location: 'Niquelândia - GO',
      phone: '(19) 95555-5555',
      email: 'carlos.alberto@email.com',
      products: 10,
      status: 'inativo' as const,
      production: 'baixa' as const,
    },
    {
      id: '6',
      name: 'Lucas Pereira',
      location: 'Minaçu - GO',
      phone: '(19) 94444-4444',
      email: 'lucas.pereira@email.com',
      products: 9,
      status: 'ativo' as const,
      production: 'alta' as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtores...</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <h1 className="text-2xl font-bold text-gray-800">Produtores</h1>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtor..."
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
                  setSelectedProducer(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produtor
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
            <ProducerStats
              icon={Users}
              value={producers.length}
              label="Produtores Ativos"
              trend="Total cadastrado"
              bgColor="bg-green-600"
              textColor="text-white"
            />
            <ProducerStats
              icon={Truck}
              value={94}
              label="Em Produção"
              trend="+12 este mês ↑"
              bgColor="bg-orange-500"
              textColor="text-white"
            />
            <ProducerStats
              icon={Package}
              value={560}
              label="Produtos Cadastrados"
              trend="+45 este mês ↑"
              bgColor="bg-blue-600"
              textColor="text-white"
            />
            <ProducerStats
              icon={AlertTriangle}
              value={12}
              label="Produção Baixa"
              trend="-3 este mês ↓"
              bgColor="bg-red-600"
              textColor="text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="col-span-3">
              <ProducersTable 
                producers={filteredProducers} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRowClick={setSummaryProducer}
              />
            </div>
            <div className="space-y-6">
              <QuickSummary
                lastProducer={{
                  name: 'Lucas Pereira',
                  time: 'Hoje, 08:45',
                }}
                topProduct={{
                  name: 'Abóbora',
                  quantity: '12.450 kg',
                }}
                topRegion={{
                  name: 'Niquelândia - GO',
                  count: 45,
                }}
                alerts={{
                  count: 12,
                  message: '12 produtores com produção baixa',
                }}
                lastStockRegistration={getLastStockRegistration()}
                topStockProduct={getTopStockProduct()}
                largestFarm={getLargestFarm()}
              />
              <QuickFilters />
            </div>
          </div>
        </div>

      <ProducerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        producer={selectedProducer}
        onSave={handleSave}
      />

      {summaryProducer && (
        <ProducerSummaryPanel
          producer={summaryProducer}
          onClose={() => setSummaryProducer(null)}
        />
      )}
    </>
  );
}