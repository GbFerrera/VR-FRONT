import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  customer: string;
  product: string;
  value: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt?: string;
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || 'Detalhes';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      confirmed: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      delivered: 'bg-green-100 text-green-700 hover:bg-green-200',
      cancelled: 'bg-red-100 text-red-700 hover:bg-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

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
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Nenhum pedido encontrado</p>
          </div>
        ) : (
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
                <p className="font-bold text-sm text-gray-800">
                  R$ {typeof order.value === 'number' ? order.value.toFixed(2) : order.value}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
