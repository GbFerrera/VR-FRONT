import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  quantity: string;
  price: string;
  pricePerKg: string;
  image?: string;
}

export function ProductsList({ products }: { products: Product[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Produtos Mais Vendidos</CardTitle>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Ver Todos →
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🥕</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">João Silva</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-gray-800">{product.quantity}</p>
                <p className="text-xs text-gray-500">Caixa/Unidade</p>
              </div>
              <div className="text-right ml-4">
                <p className="font-bold text-sm text-gray-800">{product.price}</p>
                <p className="text-xs text-gray-500">{product.pricePerKg}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
