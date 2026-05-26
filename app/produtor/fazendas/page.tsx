'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, MapPin, Edit, Trash2, Home, Map } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { farmsService, Farm } from '@/lib/api';

export default function FazendasPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    area: '',
  });

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const farmsData = await farmsService.getAll(user?.id);
      setFarms(farmsData);
    } catch (error) {
      console.error('Erro ao carregar fazendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (farm?: Farm) => {
    if (farm) {
      setEditingFarm(farm);
      setFormData({
        name: farm.name,
        latitude: farm.latitude?.toString() || '',
        longitude: farm.longitude?.toString() || '',
        address: farm.address || '',
        area: farm.area?.toString() || '',
      });
    } else {
      setEditingFarm(null);
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        address: '',
        area: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFarm(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('Erro: Usuário não identificado');
      return;
    }
    
    try {
      const data = {
        name: formData.name,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        address: formData.address || undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
      };

      if (editingFarm) {
        await farmsService.update(editingFarm.id, data);
      } else {
        await farmsService.create({
          ...data,
          ownerId: user.id,
        });
      }
      
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar fazenda:', error);
      alert('Erro ao salvar fazenda. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta fazenda?')) {
      try {
        await farmsService.delete(id);
        await fetchData();
      } catch (error) {
        console.error('Erro ao deletar fazenda:', error);
        alert('Erro ao deletar fazenda. Tente novamente.');
      }
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  const openInMaps = (latitude: number, longitude: number) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  const filteredFarms = farms.filter((farm) =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando fazendas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileHeader
        title="Minhas Fazendas"
        subtitle="Gerencie suas propriedades rurais"
        sidebar={<ProducerSidebar />}
      />

      <div className="p-4 lg:p-8">
        <div className="mb-4 lg:mb-6">
          <Input
            placeholder="Buscar fazendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-3"
          />
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-green-700 hover:bg-green-800 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Fazenda
          </Button>
        </div>

        {filteredFarms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Home className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhuma fazenda cadastrada
              </h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Cadastre suas propriedades para melhor organização da produção
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-green-700 hover:bg-green-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeira Fazenda
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFarms.map((farm) => (
              <Card key={farm.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Home className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{farm.name}</CardTitle>
                        {farm.area && (
                          <p className="text-sm text-gray-500">{farm.area} hectares</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {farm.address && (
                      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 mb-1">Endereço</p>
                          <p className="text-sm text-gray-900 break-words">{farm.address}</p>
                        </div>
                      </div>
                    )}

                    {farm.latitude && farm.longitude && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Coordenadas GPS</p>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">Latitude:</span> {farm.latitude}
                          </p>
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">Longitude:</span> {farm.longitude}
                          </p>
                        </div>
                        <Button
                          onClick={() => openInMaps(farm.latitude!, farm.longitude!)}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          <Map className="w-3 h-3 mr-1" />
                          Ver no Mapa
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleOpenDialog(farm)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(farm.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
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
              {editingFarm ? 'Editar Fazenda' : 'Nova Fazenda'}
            </DialogTitle>
            <DialogDescription>
              {editingFarm
                ? 'Atualize as informações da fazenda'
                : 'Cadastre uma nova propriedade rural'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Fazenda *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Fazenda São José"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Ex: Zona Rural, Niquelândia - GO"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área (hectares)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 50"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label>Localização GPS</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Usar Localização Atual
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="Ex: -14.4712"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="Ex: -48.4603"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Você pode clicar em "Usar Localização Atual" ou inserir as coordenadas manualmente
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                {editingFarm ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
