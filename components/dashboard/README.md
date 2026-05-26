# Dashboard Components

Componentes do dashboard da Vitrine Rural seguindo o padrão de design estabelecido.

## Componentes

### Sidebar
Barra lateral de navegação com menu completo e logo da Vitrine Rural.

### StatCard
Cards de estatísticas coloridos exibidos no topo do dashboard:
- Faturamento do dia (verde)
- Pedidos de Hoje (laranja)
- Produtores Ativos (verde escuro)
- Empresas Cadastradas (azul)

### SummaryCard
Card com resumo do dia mostrando métricas principais:
- Produtos
- Oportunidades
- Oportunidades Ativas

### ProductsList
Lista dos produtos mais vendidos com informações de quantidade e preço.

### RecentOrders
Lista de pedidos recentes com status e valores.

### SalesChart
Gráfico de vendas em barras mostrando evolução mensal.

## Uso

```tsx
import { Sidebar, StatCard, SummaryCard, ProductsList, RecentOrders, SalesChart } from '@/components/dashboard';
```

## Padrão de Cores

- Verde primário: `#2d5016` (sidebar)
- Verde claro: `bg-green-600`
- Laranja: `bg-orange-500`
- Azul: `bg-blue-600`
- Fundo: `bg-gray-50`
