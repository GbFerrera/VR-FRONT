export type TransactionType = 'compra' | 'venda' | 'despesa';

export type ExpenseCategory = 
  | 'gasolina'
  | 'pedagio'
  | 'limpeza'
  | 'manutencao'
  | 'alimentacao'
  | 'outros';

export interface OilProduct {
  id: string;
  name: string;
  type: string;
  unit: 'litro' | 'kg' | 'unidade';
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalCost: number;
  supplier: string;
  date: Date;
  notes?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalRevenue: number;
  customer?: string;
  date: Date;
  notes?: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: Date;
  notes?: string;
}

export interface FinancialSummary {
  totalPurchases: number;
  totalSales: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
}

export interface DateRangeFilter {
  from: Date;
  to: Date;
}
