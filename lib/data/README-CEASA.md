# 📊 Sistema de Preços CEASA - Goiás

## Visão Geral

Sistema integrado para gerenciar e visualizar os preços tabelados do CEASA de Goiás - Niquelândia. Os dados são baseados nas cotações diárias oficiais publicadas em PDF.

## Fonte dos Dados

**URL Oficial:** https://goias.gov.br/ceasa/cotacoes-diarias-maio-2026/

**Formato:** PDF - "Centrais de Abastecimento de Goiás - Cotação de Preço"
**Modelo:** Modelo 1 - Classificação
**Atualização:** Diária (última: 12/05/2026 às 11:13:46)

## Estrutura de Dados

### Interface CeasaProduct

```typescript
interface CeasaProduct {
  id: string;              // Código único do produto
  code: string;            // Código CEASA
  name: string;            // Nome do produto
  category: string;        // Categoria (ex: "Hortaliças, Folhas, Flor, Hastes")
  unit: string;            // Unidade (CX, MOL, PLT, etc.)
  packaging: string;       // Tipo de embalagem (Padrão)
  quantityPerPackage: number; // Quantidade por embalagem
  classification: number;  // Classificação (1 ou 2)
  commonPrice: number;     // Preço comum (R$)
  maxPrice: number;        // Preço máximo (R$)
  minPrice: number;        // Preço mínimo (R$)
  pricePerKg: number;      // Preço por KG (R$)
  lastUpdate: string;      // Data da última atualização
  emoji?: string;          // Emoji representativo
}
```

## Produtos Cadastrados

### 01 - Hortaliças, Folhas, Flor, Hastes (35 produtos)

- Acelga, Acelga em Unidade, Agrião
- Alcachofra, Alface (Americana, Crespa, Lisa)
- Almeirão, Aspargo, Brócolis
- Cebolinha, Chicória, Coentro
- Cogumelo, Couve (Chinesa, Molho, Maço, Flor)
- Erva Doce, Espinafre, Hortelã
- Manjericão, Mostarda, Moyashi
- Repolho, Repolho Roxo, Rúcula
- Salsa, Salsão

### 02 - Hortaliças Frutos (4 produtos)

- Abóbora Goianinha
- Abóbora Japonesa (Kabutia)
- Abóbora (Moranga)
- Abóbora Verde Comum-1

## Unidades de Medida

| Código | Descrição | Exemplo |
|--------|-----------|---------|
| CX | Caixa | 15-25 kg |
| MOL | Molho | 0.2-0.6 kg |
| PLT | Pallet | 1.2 kg |
| MC | Maço | 1-2.2 kg |
| UNI | Unidade | 0.6 kg |
| PE | Pé | 0.8 kg |
| BD | Bandeja | 1 kg |
| ENG | Engradado | 12.5-25 kg |
| DZ | Dúzia | 18 kg |
| PCT | Pacote | 0.5 kg |
| SC | Saco | 20 kg |

## Funcionalidades Implementadas

### 1. Visualização de Preços
- ✅ Tabela completa com todos os produtos
- ✅ Preços: Comum, Máximo, Mínimo, R$/KG
- ✅ Informações de embalagem e quantidade
- ✅ Classificação do produto

### 2. Filtros e Busca
- ✅ Busca por nome ou código
- ✅ Filtro por categoria
- ✅ Resultados em tempo real

### 3. Estatísticas
- ✅ Total de produtos cadastrados
- ✅ Preço médio por kg
- ✅ Maior preço/kg (Manjericão - R$ 41,67)
- ✅ Menor preço/kg (Couve Chinesa - R$ 0,40)

### 4. Exportação
- ✅ Botão para exportar PDF
- ✅ Dados formatados para impressão

## Hooks Disponíveis

### useCeasaProducts()

```typescript
const {
  products,        // Produtos filtrados
  allProducts,     // Todos os produtos
  categories,      // Lista de categorias
  searchTerm,      // Termo de busca atual
  setSearchTerm,   // Atualizar busca
  selectedCategory, // Categoria selecionada
  setSelectedCategory, // Atualizar categoria
} = useCeasaProducts();
```

## Funções Utilitárias

```typescript
// Buscar produto por nome
getCeasaProductByName(name: string): CeasaProduct | undefined

// Buscar produtos por categoria
getCeasaProductsByCategory(category: string): CeasaProduct[]

// Obter todas as categorias
getAllCategories(): string[]
```

## Componentes

### CeasaPriceTable
Tabela completa com:
- Header com data de atualização
- Busca e filtros
- Listagem de produtos
- Formatação de preços em R$
- Badges para unidades e códigos
- Exportação para PDF

## Próximos Passos

### Automação de Importação
1. **Scraper de PDF**
   - Criar script para baixar PDF diário
   - Parser para extrair dados automaticamente
   - Atualização automática do banco de dados

2. **API de Integração**
   - Endpoint para receber dados do CEASA
   - Webhook para notificações de atualização
   - Histórico de preços

3. **Análises Avançadas**
   - Gráficos de variação de preços
   - Comparativo mensal
   - Alertas de mudanças significativas
   - Previsão de tendências

4. **Sincronização com Produtores**
   - Sugestão de preços baseada no CEASA
   - Margem de lucro automática
   - Competitividade de preços

## Uso na Aplicação

```tsx
import { CeasaPriceTable } from '@/components/ceasa/ceasa-price-table';
import { useCeasaProducts } from '@/lib/hooks/use-ceasa-products';
import { ceasaProducts } from '@/lib/data/ceasa-products';

// Em uma página
<CeasaPriceTable />

// Ou customizado
const { products } = useCeasaProducts();
products.map(product => (
  <div key={product.id}>
    {product.name} - {product.commonPrice}
  </div>
))
```

## Manutenção

Para adicionar novos produtos:
1. Baixar PDF mais recente do CEASA
2. Adicionar produtos em `lib/data/ceasa-products.ts`
3. Seguir a interface `CeasaProduct`
4. Atualizar data em `lastUpdate`

## Observações

- Todos os preços estão em Reais (R$)
- Classificação 1 = Primeira qualidade
- Classificação 2 = Segunda qualidade
- Preços podem variar diariamente
- Sempre verificar a data de atualização
