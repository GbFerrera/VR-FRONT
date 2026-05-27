'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, MapPin, User, Package, Maximize } from 'lucide-react';
import { farmsService, Farm } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Fazendas() {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const data = await farmsService.getAll();
      setFarms(data);
    } catch (error) {
      console.error('Erro ao carregar fazendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUniqueProducts = (farm: Farm) => {
    if (!farm.producerProducts || farm.producerProducts.length === 0) return [];
    
    return farm.producerProducts.map(pp => pp.product);
  };

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
      <header className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800">Fazendas</h1>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar fazenda ou produtor..."
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-green-600 text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user?.name || 'Admin'}</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Fazendas Cadastradas
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Total de {filteredFarms.length} fazenda{filteredFarms.length !== 1 ? 's' : ''} encontrada{filteredFarms.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {filteredFarms.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Nenhuma fazenda encontrada
                </h3>
                <p className="text-gray-500 max-w-md">
                  {searchTerm 
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Quando os produtores cadastrarem fazendas, elas aparecerão aqui.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFarms.map((farm) => {
              const products = getUniqueProducts(farm);
              
              return (
                <Card key={farm.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {farm.name}
                        </CardTitle>
                        {farm.owner && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{farm.owner.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-green-700" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Localização */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Localização</h4>
                      {farm.latitude && farm.longitude ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>
                              Lat: {farm.latitude.toFixed(6)}, Long: {farm.longitude.toFixed(6)}
                            </span>
                          </div>
                          {farm.address && (
                            <p className="text-sm text-gray-500 pl-6">{farm.address}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Localização não informada</p>
                      )}
                    </div>

                    {/* Área */}
                    {farm.area && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Área</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Maximize className="w-4 h-4" />
                          <span>{farm.area} hectares</span>
                        </div>
                      </div>
                    )}

                    {/* Produtor Responsável */}
                    {farm.owner && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Produtor Responsável</h4>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                          <p className="font-medium text-gray-900">{farm.owner.name}</p>
                          <p className="text-sm text-gray-600">{farm.owner.email}</p>
                          <p className="text-sm text-gray-600">{farm.owner.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Produtos Vinculados */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Produtos Vinculados ({farm.producerProducts?.length || 0})
                      </h4>
                      {farm.producerProducts && farm.producerProducts.length > 0 ? (
                        <div className="space-y-2">
                          {farm.producerProducts.map((pp) => (
                            <div
                              key={pp.id}
                              className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-100"
                            >
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-700" />
                                <span className="text-sm font-medium text-gray-900">
                                  {pp.product.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Produção Média</p>
                                <p className="text-sm font-semibold text-green-700">
                                  {pp.averageProduction} {pp.product.unit}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Nenhum produto vinculado</p>
                      )}
                    </div>

                    {/* Data de Cadastro */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Cadastrada em {new Date(farm.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
