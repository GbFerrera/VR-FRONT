import { Purchase, Sale, Expense, FinancialSummary, DateRangeFilter } from '../types';

export const calculateFinancialSummary = (
  purchases: Purchase[],
  sales: Sale[],
  expenses: Expense[],
  dateRange?: DateRangeFilter
): FinancialSummary => {
  const filterByDate = <T extends { date: Date }>(items: T[]): T[] => {
    if (!dateRange) return items;
    return items.filter(
      (item) => item.date >= dateRange.from && item.date <= dateRange.to
    );
  };

  const filteredPurchases = filterByDate(purchases);
  const filteredSales = filterByDate(sales);
  const filteredExpenses = filterByDate(expenses);

  const totalPurchases = filteredPurchases.reduce((sum, p) => sum + p.totalCost, 0);
  const totalSales = filteredSales.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const profit = totalSales - totalPurchases - totalExpenses;
  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

  return {
    totalPurchases,
    totalSales,
    totalExpenses,
    profit,
    profitMargin,
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};
