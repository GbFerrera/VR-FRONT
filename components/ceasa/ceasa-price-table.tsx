'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Calendar, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CeasaProduct } from '@/lib/api';
import { ProductHistoryDialog } from './product-history-dialog';

interface CeasaPriceTableProps {
  products: CeasaProduct[];
}

export function CeasaPriceTable({ products: initialProducts }: CeasaPriceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<CeasaProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleProductClick = (product: CeasaProduct) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const categories = useMemo(() => {
    if (!Array.isArray(initialProducts)) return [];
    const cats = new Set(initialProducts.map(p => p.category));
    return Array.from(cats).sort();
  }, [initialProducts]);

  const products = useMemo(() => {
    if (!Array.isArray(initialProducts)) return [];
    return initialProducts.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchTerm, selectedCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              Cotação de Preços CEASA-GO
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Atualizado: {Array.isArray(initialProducts) && initialProducts[0]?.date ? new Date(initialProducts[0].date).toLocaleDateString('pt-BR') : 'N/A'}</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar produto ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead className="w-[80px]">Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Embalagem</TableHead>
                <TableHead className="text-center">Qtd/Emb</TableHead>
                <TableHead className="text-center">Class</TableHead>
                <TableHead className="text-right">Comum</TableHead>
                <TableHead className="text-right">Máximo</TableHead>
                <TableHead className="text-right">Mínimo</TableHead>
                <TableHead className="text-right">R$/KG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow 
                    key={product.id} 
                    className="hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => handleProductClick(product)}
                  >
                    <TableCell>
                      {product.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-white border border-gray-200">
                          <Image
                            src={`http://localhost:3333${product.imageUrl}`}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{product.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{product.unit}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.quantityPerPackage}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.classification}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-700">
                      {formatPrice(product.commonPrice)}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {formatPrice(product.maxPrice)}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {formatPrice(product.minPrice)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-700">
                      {formatPrice(product.pricePerKg)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Mostrando {products.length} de {products.length} produtos
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              CEASA Goiás - Niquelândia
            </Badge>
            <Badge variant="outline">
              Modelo 1 - Classificação
            </Badge>
          </div>
        </div>
      </CardContent>

      <ProductHistoryDialog 
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Card>
  );
}
