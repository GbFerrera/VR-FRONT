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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Warehouse, Edit, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { stocksService, producerProductsService, Stock, ProducerProduct } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EstoquePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [producerProducts, setProducerProducts] = useState<ProducerProduct[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    producerProductId: '',
    quantity: '',
    operation: 'set' as 'set' | 'add' | 'subtract',
  });

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stocksData, productsData] = await Promise.all([
        stocksService.getAll(user?.id),
        producerProductsService.getAll(user?.id),
      ]);
      setStocks(stocksData);
      setProducerProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (stock?: Stock) => {
    if (stock) {
      setEditingStock(stock);
      setFormData({
        producerProductId: stock.producerProductId,
        quantity: stock.quantity.toString(),
        operation: 'set',
      });
    } else {
      setEditingStock(null);
      setFormData({
        producerProductId: '',
        quantity: '',
        operation: 'set',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStock(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const quantity = parseFloat(formData.quantity);
      
      if (editingStock) {
        let newQuantity = quantity;
        if (formData.operation === 'add') {
          newQuantity = editingStock.quantity + quantity;
        } else if (formData.operation === 'subtract') {
          newQuantity = Math.max(0, editingStock.quantity - quantity);
        }
        
        await stocksService.update(editingStock.id, { quantity: newQuantity });
      } else {
        const existingStock = stocks.find(s => s.producerProductId === formData.producerProductId);
        if (existingStock) {
          await stocksService.update(existingStock.id, { quantity });
        } else {
          await stocksService.create({
            producerProductId: formData.producerProductId,
            quantity,
          });
        }
      }
      
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar estoque:', error);
      alert('Erro ao salvar estoque. Tente novamente.');
    }
  };

  const getStockStatus = (quantity: number, averageProduction: number) => {
    const percentage = (quantity / averageProduction) * 100;
    if (percentage >= 80) return { color: 'text-green-600', label: 'Bom', icon: TrendingUp };
    if (percentage >= 40) return { color: 'text-yellow-600', label: 'Médio', icon: TrendingUp };
    return { color: 'text-red-600', label: 'Baixo', icon: TrendingDown };
  };

  const productsWithStock = producerProducts.map(pp => {
    const stock = stocks.find(s => s.producerProductId === pp.id);
    return {
      producerProduct: pp,
      stock: stock || null,
      quantity: stock?.quantity || 0,
    };
  });

  const filteredProducts = productsWithStock.filter(item =>
    item.producerProduct.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockValue = productsWithStock.reduce((sum, item) => sum + item.quantity, 0);
  const productsInStock = productsWithStock.filter(item => item.quantity > 0).length;
  const lowStockProducts = productsWithStock.filter(item => {
    const percentage = (item.quantity / item.producerProduct.averageProduction) * 100;
    return percentage < 40 && percentage > 0;
  }).length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileHeader
        title="Controle de Estoque"
        subtitle="Gerencie o estoque dos seus produtos"
        sidebar={<ProducerSidebar />}
      />

      <div className="p-4 lg:p-8">
        <div className="mb-4 lg:mb-6">
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-3"
          />
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-green-700 hover:bg-green-800 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Estoque
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total em Estoque</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStockValue}</p>
                  <p className="text-xs text-gray-500 mt-1">Unidades totais</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Produtos em Estoque</p>
                  <p className="text-2xl font-bold text-gray-900">{productsInStock}</p>
                  <p className="text-xs text-gray-500 mt-1">de {producerProducts.length} produtos</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
                  <p className="text-xs text-gray-500 mt-1">Produtos com alerta</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Warehouse className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Cadastre produtos primeiro para gerenciar o estoque
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((item) => {
              const status = getStockStatus(item.quantity, item.producerProduct.averageProduction);
              const StatusIcon = status.icon;
              const percentage = item.producerProduct.averageProduction > 0
                ? ((item.quantity / item.producerProduct.averageProduction) * 100).toFixed(0)
                : 0;

              return (
                <Card key={item.producerProduct.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-green-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.producerProduct.product.name}</CardTitle>
                          <p className="text-sm text-gray-500">
                            Unidade: {item.producerProduct.product.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Estoque Atual</span>
                        <span className="font-bold text-xl text-gray-900">
                          {item.quantity} {item.producerProduct.product.unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Produção Média</span>
                        <span className="font-semibold text-gray-700">
                          {item.producerProduct.averageProduction} {item.producerProduct.product.unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`flex items-center gap-1 font-semibold ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label} ({percentage}%)
                        </span>
                      </div>

                      {item.stock && (
                        <div className="text-xs text-gray-500 text-center">
                          Última atualização: {format(new Date(item.stock.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      )}

                      <Button
                        onClick={() => handleOpenDialog(item.stock || undefined)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Atualizar Estoque
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStock ? 'Atualizar Estoque' : 'Adicionar Estoque'}
            </DialogTitle>
            <DialogDescription>
              {editingStock
                ? 'Atualize a quantidade em estoque do produto'
                : 'Adicione estoque para um produto'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                {editingStock ? (
                  <Input
                    value={editingStock.producerProduct?.product.name || ''}
                    disabled
                    className="bg-gray-50"
                  />
                ) : (
                  <Select
                    value={formData.producerProductId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, producerProductId: value })
                    }
                    required
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
                )}
              </div>

              {editingStock && (
                <div className="space-y-2">
                  <Label>Operação</Label>
                  <Select
                    value={formData.operation}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, operation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="set">Definir quantidade</SelectItem>
                      <SelectItem value="add">Adicionar (+)</SelectItem>
                      <SelectItem value="subtract">Remover (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  {formData.operation === 'set' ? 'Quantidade' : 
                   formData.operation === 'add' ? 'Quantidade a Adicionar' : 
                   'Quantidade a Remover'}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
                {editingStock && (
                  <p className="text-xs text-gray-500">
                    Estoque atual: {editingStock.quantity} {editingStock.producerProduct?.product.unit}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                {editingStock ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
