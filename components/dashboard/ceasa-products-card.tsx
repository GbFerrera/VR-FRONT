'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ceasaService, CeasaProduct } from '@/lib/api/ceasa';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const getImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

export function CeasaProductsCard() {
  const [products, setProducts] = useState<CeasaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const latestProducts = await ceasaService.getLatestProducts();
        setProducts(latestProducts);
      } catch (error) {
        console.error('Erro ao carregar produtos CEASA:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Produtos CEASA</CardTitle>
            <p className="text-xs text-gray-500 mt-1">Todas as cotações disponíveis</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
            <Package className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-700">{products.length}</span>
            <span className="text-xs text-green-600">produtos</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100">
            {products.map((product) => {
              const priceVariation = product.maxPrice - product.minPrice;
              const hasVariation = priceVariation > 0;

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {getImageUrl(product.imageUrl) ? (
                        <>
                          <img
                            src={getImageUrl(product.imageUrl)!}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg items-center justify-center hidden">
                            <Package className="w-6 h-6 text-green-700" />
                          </div>
                        </>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-green-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {product.packaging}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-3">
                    <div className="flex items-center gap-2 justify-end">
                      <p className="font-bold text-sm text-gray-800">
                        R$ {product.commonPrice.toFixed(2)}
                      </p>
                      {hasVariation && (
                        <div className="flex items-center gap-1">
                          {product.commonPrice > (product.minPrice + product.maxPrice) / 2 ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <span>Min: R$ {product.minPrice.toFixed(2)}</span>
                      <span>•</span>
                      <span>Max: R$ {product.maxPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
