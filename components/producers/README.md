# Producers Components

Componentes da página de Produtores da Vitrine Rural.

## Componentes

### ProducerStats
Cards de estatísticas coloridos exibidos no topo:
- Produtores Ativos (verde)
- Em Produção (laranja)
- Produtos Cadastrados (azul)
- Produção Baixa (vermelho)

**Props:**
- `icon`: Ícone do Lucide React
- `value`: Número a ser exibido
- `label`: Texto descritivo
- `trend`: Tendência com seta
- `bgColor`: Cor de fundo (Tailwind)
- `textColor`: Cor do texto (Tailwind)

### ProducersTable
Tabela principal com listagem de todos os produtores.

**Features:**
- Avatar do produtor
- Informações de contato (telefone e email)
- Número de produtos
- Status (Ativo, Inativo, Pendente)
- Nível de produção (Alta, Média, Baixa)
- Botão de detalhes
- Paginação
- Filtros por status e produção

**Props:**
- `producers`: Array de objetos Producer

### QuickSummary
Card lateral com resumo rápido mostrando:
- Último cadastro
- Produto mais produzido
- Região com maior produção
- Alertas do sistema

**Props:**
- `lastProducer`: { name, time }
- `topProduct`: { name, quantity }
- `topRegion`: { name, count }
- `alerts`: { count, message }

### QuickFilters
Card lateral com filtros rápidos:
- Filtro por Status
- Filtro por Produção
- Botão aplicar filtros

## Tipos

```typescript
interface Producer {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  products: number;
  status: 'ativo' | 'inativo' | 'pendente';
  production: 'alta' | 'media' | 'baixa';
  avatar?: string;
}
```

## Uso

```tsx
import { ProducerStats, ProducersTable, QuickSummary, QuickFilters } from '@/components/producers';

// Na página
<ProducerStats
  icon={Users}
  value={128}
  label="Produtores Ativos"
  trend="+13 este mês ↑"
  bgColor="bg-green-600"
  textColor="text-white"
/>

<ProducersTable producers={producersData} />
```

## Padrão de Cores

- Verde: `bg-green-600` - Produtores Ativos
- Laranja: `bg-orange-500` - Em Produção
- Azul: `bg-blue-600` - Produtos Cadastrados
- Vermelho: `bg-red-600` - Produção Baixa
