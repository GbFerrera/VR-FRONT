import { api } from './axios';

export interface CeasaProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  packaging: string;
  quantityPerPackage: number;
  classification: number;
  commonPrice: number;
  maxPrice: number;
  minPrice: number;
  pricePerKg: number;
  date: string;
  createdAt: string;
  imageUrl?: string | null;
  pdfUrl?: string | null;
}

export interface CeasaStatistics {
  totalProducts: number;
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  maxPriceProduct: string;
  minPriceProduct: string;
}

export interface CeasaPriceHistory {
  date: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

export interface CeasaCategory {
  category: string;
  count: number;
}

export interface ScrapeResponse {
  success: boolean;
  message: string;
  date: string;
  url: string;
  totalScraped: number;
  totalSaved: number;
}

export const ceasaService = {
  async scrape(date?: string): Promise<ScrapeResponse> {
    const params = date ? { date } : {};
    const response = await api.post<ScrapeResponse>('/ceasa/scrape', null, { params });
    return response.data;
  },

  async getProducts(params?: {
    date?: string;
    category?: string;
    name?: string;
    limit?: number;
    offset?: number;
  }): Promise<CeasaProduct[]> {
    const response = await api.get<{ success: boolean; data: CeasaProduct[] }>('/ceasa/products', { params });
    return response.data.data || [];
  },

  async getLatestProducts(): Promise<CeasaProduct[]> {
    const response = await api.get<{ success: boolean; data: CeasaProduct[]; total: number }>('/ceasa/products/latest');
    return response.data.data || [];
  },

  async getCategories(): Promise<CeasaCategory[]> {
    const response = await api.get<{ success: boolean; data: string[] }>('/ceasa/categories');
    const categories = response.data.data || [];
    return categories.map(cat => ({ category: cat, count: 0 }));
  },

  async getPriceHistory(code: string, startDate?: string, endDate?: string): Promise<CeasaPriceHistory[]> {
    const params: any = { code };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get<{ success: boolean; data: any[] }>('/ceasa/price-history', { params });
    const history = response.data.data || [];
    return history.map(item => ({
      date: item.date,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      avgPrice: item.commonPrice || item.pricePerKg
    }));
  },

  async getStatistics(date?: string): Promise<CeasaStatistics> {
    const params = date ? { date } : {};
    const response = await api.get<{ success: boolean; data: any }>('/ceasa/statistics', { params });
    const stats = response.data.data;
    
    if (!stats) {
      return {
        totalProducts: 0,
        avgPrice: 0,
        maxPrice: 0,
        minPrice: 0,
        maxPriceProduct: 'N/A',
        minPriceProduct: 'N/A'
      };
    }
    
    return {
      totalProducts: stats.totalProducts || 0,
      avgPrice: stats.averagePricePerKg || 0,
      maxPrice: stats.highestPricePerKg || 0,
      minPrice: stats.lowestPricePerKg || 0,
      maxPriceProduct: stats.mostExpensiveProduct?.name || 'N/A',
      minPriceProduct: stats.cheapestProduct?.name || 'N/A'
    };
  },
};
