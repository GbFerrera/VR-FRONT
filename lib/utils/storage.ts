import { Purchase, Sale, Expense, OilProduct } from '../types';

const STORAGE_KEYS = {
  PURCHASES: 'oil_shop_purchases',
  SALES: 'oil_shop_sales',
  EXPENSES: 'oil_shop_expenses',
  PRODUCTS: 'oil_shop_products',
};

export const storage = {
  getPurchases: (): Purchase[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    if (!data) return [];
    return JSON.parse(data).map((p: any) => ({ ...p, date: new Date(p.date) }));
  },

  savePurchases: (purchases: Purchase[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  },

  getSales: (): Sale[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!data) return [];
    return JSON.parse(data).map((s: any) => ({ ...s, date: new Date(s.date) }));
  },

  saveSales: (sales: Sale[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!data) return [];
    return JSON.parse(data).map((e: any) => ({ ...e, date: new Date(e.date) }));
  },

  saveExpenses: (expenses: Expense[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getProducts: (): OilProduct[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      const defaultProducts: OilProduct[] = [
        { id: '1', name: 'Óleo de Soja', type: 'Vegetal', unit: 'litro' },
        { id: '2', name: 'Óleo de Girassol', type: 'Vegetal', unit: 'litro' },
        { id: '3', name: 'Óleo de Canola', type: 'Vegetal', unit: 'litro' },
        { id: '4', name: 'Óleo de Milho', type: 'Vegetal', unit: 'litro' },
      ];
      return defaultProducts;
    }
    return JSON.parse(data);
  },

  saveProducts: (products: OilProduct[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
};
