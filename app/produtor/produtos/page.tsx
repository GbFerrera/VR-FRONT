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
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { productsService, producerProductsService, farmsService, Product, ProducerProduct, Farm } from '@/lib/api';

export default function ProdutosProdutorPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [producerProducts, setProducerProducts] = useState<ProducerProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateProductDialogOpen, setIsCreateProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProducerProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    farmId: '',
    averageProduction: '',
  });

  const [newProductData, setNewProductData] = useState({
    name: '',
    unit: 'kg',
  });

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [producerProds, products, userFarms] = await Promise.all([
        producerProductsService.getAll(user?.id),
        productsService.getAll(),
        farmsService.getAll(user?.id),
      ]);
      setProducerProducts(producerProds);
      setAllProducts(products);
      setFarms(userFarms);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: ProducerProduct) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productId: product.productId,
        farmId: product.farmId,
        averageProduction: product.averageProduction.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        productId: '',
        farmId: '',
        averageProduction: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      productId: '',
      farmId: '',
      averageProduction: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('Erro: Usuário não identificado');
      return;
    }
    
    try {
      if (editingProduct) {
        await producerProductsService.update(editingProduct.id, {
          averageProduction: parseFloat(formData.averageProduction),
        });
      } else {
        await producerProductsService.create({
          producerId: user.id,
          productId: formData.productId,
          farmId: formData.farmId,
          averageProduction: parseFloat(formData.averageProduction),
        });
      }
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      try {
        await producerProductsService.delete(id);
        await fetchData();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto. Tente novamente.');
      }
    }
  };

  const handleCreateNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = await productsService.create(newProductData);
      await fetchData();
      setIsCreateProductDialogOpen(false);
      setNewProductData({ name: '', unit: 'kg' });
      
      setFormData({
        productId: newProduct.id,
        farmId: '',
        averageProduction: '',
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto. Tente novamente.');
    }
  };

  const availableProducts = allProducts.filter(
    (product) => !producerProducts.some((pp) => pp.productId === product.id)
  );

  const filteredProducts = producerProducts.filter((pp) =>
    pp.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <>
      <MobileHeader
        title="Meus Produtos"
        subtitle="Gerencie os produtos que você cultiva ou comercializa"
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
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setIsCreateProductDialogOpen(true)}
              variant="outline"
              className="border-green-700 text-green-700 hover:bg-green-50 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo
            </Button>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-green-700 hover:bg-green-800 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Comece adicionando os produtos que você cultiva ou comercializa para gerenciar sua produção
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-green-700 hover:bg-green-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((pp) => (
              <Card key={pp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pp.product.name}</CardTitle>
                        <p className="text-sm text-gray-500">Unidade: {pp.product.unit}</p>
                        <p className="text-xs text-green-600 font-medium">{pp.farm.name}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Produção Média</span>
                      <span className="font-semibold text-gray-900">
                        {pp.averageProduction} {pp.product.unit}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleOpenDialog(pp)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(pp.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Atualize as informações do produto'
                : 'Selecione um produto e defina a produção média'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                {editingProduct ? (
                  <Input
                    value={editingProduct.product.name}
                    disabled
                    className="bg-gray-50"
                  />
                ) : (
                  <Select
                    value={formData.productId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, productId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="farm">Fazenda</Label>
                {editingProduct ? (
                  <Input
                    value={editingProduct.farm.name}
                    disabled
                    className="bg-gray-50"
                  />
                ) : (
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
                      {farms.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhuma fazenda cadastrada
                        </SelectItem>
                      ) : (
                        farms.map((farm) => (
                          <SelectItem key={farm.id} value={farm.id}>
                            {farm.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-gray-500">
                  Selecione a fazenda onde este produto é cultivado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageProduction">Produção Média</Label>
                <Input
                  id="averageProduction"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100"
                  value={formData.averageProduction}
                  onChange={(e) =>
                    setFormData({ ...formData, averageProduction: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Quantidade média que você produz por período
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                {editingProduct ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateProductDialogOpen} onOpenChange={setIsCreateProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Produto</DialogTitle>
            <DialogDescription>
              Crie um novo produto que não existe no sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateNewProduct}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  placeholder="Ex: Tomate"
                  value={newProductData.name}
                  onChange={(e) =>
                    setNewProductData({ ...newProductData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade de Medida</Label>
                <Select
                  value={newProductData.unit}
                  onValueChange={(value) =>
                    setNewProductData({ ...newProductData, unit: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilograma (kg)</SelectItem>
                    <SelectItem value="g">Grama (g)</SelectItem>
                    <SelectItem value="t">Tonelada (t)</SelectItem>
                    <SelectItem value="saco">Saco</SelectItem>
                    <SelectItem value="caixa">Caixa</SelectItem>
                    <SelectItem value="unidade">Unidade</SelectItem>
                    <SelectItem value="dúzia">Dúzia</SelectItem>
                    <SelectItem value="litro">Litro (L)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateProductDialogOpen(false);
                  setNewProductData({ name: '', unit: 'kg' });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                Criar Produto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
