'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Calendar, ImageIcon } from 'lucide-react';
import { ceasaService } from '@/lib/api/ceasa';
import type { CeasaProduct } from '@/lib/api/ceasa';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PrecosCeasaPage() {
  const [products, setProducts] = useState<CeasaProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CeasaProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ceasaService.getLatestProducts();
      setProducts(data);
      
      // Extrair categorias únicas
      const uniqueCategories = Array.from(new Set(data.map(p => p.category))).sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando preços...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6 pt-16 lg:pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Preços CEASA-GO</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Consulte os preços atualizados do mercado</p>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Atualizado: {products[0]?.date ? new Date(products[0].date).toLocaleDateString('pt-BR') : 'N/A'}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-700" />
            Cotação de Produtos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por produto ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Todas as Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </div>

          <div className="grid gap-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Nenhum produto encontrado
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
                >
                  <div className="flex gap-4 flex-1">
                    {/* Imagem do Produto */}
                    <div className="flex-shrink-0">
                      {product.imageUrl ? (
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-white border border-gray-200">
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
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Informações do Produto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {product.code}
                        </Badge>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600">
                        <span className="truncate max-w-[200px]">{product.category}</span>
                        <span className="hidden md:inline">•</span>
                        <Badge variant="secondary" className="text-xs">{product.unit}</Badge>
                        <span className="hidden md:inline">•</span>
                        <span>Qtd: {product.quantityPerPackage}</span>
                        <span className="hidden md:inline">•</span>
                        <span>Class: {product.classification}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start md:text-right md:ml-4 border-t md:border-t-0 pt-3 md:pt-0">
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-green-700">
                        {formatPrice(product.commonPrice)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Min: {formatPrice(product.minPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Max: {formatPrice(product.maxPrice)}
                      </div>
                    </div>
                    <div className="text-right md:mt-2">
                      <div className="text-xs text-gray-500 mb-1">R$/KG</div>
                      <div className="text-lg md:text-xl text-blue-600 font-bold">
                        {formatPrice(product.pricePerKg)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
