'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileHeader } from '@/components/dashboard/mobile-header';
import { ProducerSidebar } from '@/components/dashboard/producer-sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Calendar, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { harvestsService, producerProductsService, farmsService, Harvest, ProducerProduct, Farm } from '@/lib/api';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ColheitasPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [producerProducts, setProducerProducts] = useState<ProducerProduct[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<Harvest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'planned' | 'completed'>('all');

  const [formData, setFormData] = useState({
    producerProductId: '',
    farmId: '',
    expectedDate: '',
    actualDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [harvestsData, productsData, farmsData] = await Promise.all([
        harvestsService.getAll(user?.id),
        producerProductsService.getAll(user?.id),
        farmsService.getAll(user?.id),
      ]);
      setHarvests(harvestsData);
      setProducerProducts(productsData);
      setFarms(farmsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (harvest?: Harvest) => {
    if (harvest) {
      setEditingHarvest(harvest);
      setFormData({
        producerProductId: harvest.producerProductId,
        farmId: harvest.farmId,
        expectedDate: format(parseISO(harvest.expectedDate), 'yyyy-MM-dd'),
        actualDate: harvest.actualDate ? format(parseISO(harvest.actualDate), 'yyyy-MM-dd') : '',
        notes: harvest.notes || '',
      });
    } else {
      setEditingHarvest(null);
      setFormData({
        producerProductId: '',
        farmId: '',
        expectedDate: '',
        actualDate: '',
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingHarvest(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        producerProductId: formData.producerProductId,
        farmId: formData.farmId,
        expectedDate: new Date(formData.expectedDate).toISOString(),
        actualDate: formData.actualDate ? new Date(formData.actualDate).toISOString() : undefined,
        notes: formData.notes || undefined,
      };

      if (editingHarvest) {
        await harvestsService.update(editingHarvest.id, data);
      } else {
        await harvestsService.create(data);
      }
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar colheita:', error);
      alert('Erro ao salvar colheita. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta colheita?')) {
      try {
        await harvestsService.delete(id);
        await fetchData();
      } catch (error) {
        console.error('Erro ao deletar colheita:', error);
        alert('Erro ao deletar colheita. Tente novamente.');
      }
    }
  };

  const getHarvestStatus = (harvest: Harvest): 'planned' | 'completed' => {
    return harvest.actualDate ? 'completed' : 'planned';
  };

  const getStatusBadge = (harvest: Harvest) => {
    const status = getHarvestStatus(harvest);
    const badges = {
      planned: { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Planejada' },
      completed: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Concluída' },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const filteredHarvests = harvests
    .filter((h) => filterStatus === 'all' || getHarvestStatus(h) === filterStatus)
    .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime());

  const futureHarvests = filteredHarvests.filter((h) => 
    getHarvestStatus(h) === 'planned' && isFuture(parseISO(h.expectedDate))
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando colheitas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileHeader
        title="Colheitas e Anotações"
        subtitle="Planeje e registre suas colheitas"
        sidebar={<ProducerSidebar />}
      />

      <div className="p-4 lg:p-8">
        <div className="mb-4 lg:mb-6">
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-green-700 hover:bg-green-800 w-full mb-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Colheita
          </Button>
        </div>

        <div className="flex gap-2 mb-4 lg:mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className={filterStatus === 'all' ? 'bg-green-700 hover:bg-green-800' : ''}
          >
            Todas
          </Button>
          <Button
            variant={filterStatus === 'planned' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('planned')}
            className={filterStatus === 'planned' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Planejadas
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('completed')}
            className={filterStatus === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Concluídas
          </Button>
        </div>

        {futureHarvests.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Próximas Colheitas Planejadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {futureHarvests.slice(0, 3).map((harvest) => (
                  <div key={harvest.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {harvest.producerProduct?.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(parseISO(harvest.expectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredHarvests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhuma colheita registrada
              </h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Comece a planejar suas colheitas para melhor organização da produção
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-green-700 hover:bg-green-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primeira Colheita
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredHarvests.map((harvest) => (
              <Card key={harvest.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-green-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {harvest.producerProduct?.product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(harvest.expectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Status:</span>
                        {getStatusBadge(harvest)}
                      </div>

                      {harvest.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Anotações:</span> {harvest.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleOpenDialog(harvest)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(harvest.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingHarvest ? 'Editar Colheita' : 'Nova Colheita'}
            </DialogTitle>
            <DialogDescription>
              {editingHarvest
                ? 'Atualize as informações da colheita'
                : 'Registre uma nova colheita planejada'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Select
                  value={formData.producerProductId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, producerProductId: value })
                  }
                  required
                  disabled={!!editingHarvest}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {producerProducts.map((pp) => (
                      <SelectItem key={pp.id} value={pp.id}>
                        {pp.product.name} ({pp.product.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farm">Fazenda</Label>
                <Select
                  value={formData.farmId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, farmId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fazenda" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedDate">Data Prevista</Label>
                  <Input
                    id="expectedDate"
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualDate">Data Real da Colheita (opcional)</Label>
                  <Input
                    id="actualDate"
                    type="date"
                    value={formData.actualDate}
                    onChange={(e) =>
                      setFormData({ ...formData, actualDate: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Preencha quando a colheita for realizada
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Anotações</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione observações sobre esta colheita..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                {editingHarvest ? 'Atualizar' : 'Registrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
