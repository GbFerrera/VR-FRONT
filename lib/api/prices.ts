import { api } from './axios';

export interface Price {
  id: string;
  productId: string;
  price: number;
  source: string;
  date: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    unit: string;
  };
}

export interface CreatePriceData {
  productId: string;
  price: number;
  source: string;
}

export interface PriceQueryParams {
  productId?: string;
  startDate?: string;
  endDate?: string;
}

export const pricesService = {
  async getAll(params?: PriceQueryParams): Promise<Price[]> {
    const response = await api.get<Price[]>('/prices', { params });
    return response.data;
  },

  async getLatest(productId: string): Promise<Price> {
    const response = await api.get<Price>(`/prices/latest/${productId}`);
    return response.data;
  },

  async getById(id: string): Promise<Price> {
    const response = await api.get<Price>(`/prices/${id}`);
    return response.data;
  },

  async create(data: CreatePriceData): Promise<Price> {
    const response = await api.post<Price>('/prices', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/prices/${id}`);
  },
};
