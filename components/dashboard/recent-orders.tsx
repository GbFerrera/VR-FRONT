import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  customer: string;
  product: string;
  value: string;
  status: 'pending' | 'completed';
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Pedidos Recentes</CardTitle>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Ver Todos →
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">
                    {order.customer.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.product}</p>
                </div>
              </div>
              <div className="text-right mr-3">
                <p className="font-bold text-sm text-gray-800">{order.value}</p>
              </div>
              <Badge
                variant={order.status === 'completed' ? 'default' : 'secondary'}
                className={
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }
              >
                {order.status === 'completed' ? 'Detalhes' : 'Detalhes'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
