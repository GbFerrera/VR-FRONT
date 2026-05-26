import { api } from './axios';

export interface Stock {
  id: string;
  producerProductId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  producerProduct?: {
    id: string;
    producerId: string;
    productId: string;
    averageProduction: number;
    product: {
      id: string;
      name: string;
      unit: string;
    };
  };
}

export interface CreateStockData {
  producerProductId: string;
  quantity: number;
}

export interface UpdateStockData {
  quantity: number;
}

export const stocksService = {
  async getAll(producerId?: string): Promise<Stock[]> {
    const params = producerId ? { producerId } : {};
    const response = await api.get<Stock[]>('/stocks', { params });
    return response.data;
  },

  async getById(id: string): Promise<Stock> {
    const response = await api.get<Stock>(`/stocks/${id}`);
    return response.data;
  },

  async create(data: CreateStockData): Promise<Stock> {
    const response = await api.post<Stock>('/stocks', data);
    return response.data;
  },

  async update(id: string, data: UpdateStockData): Promise<Stock> {
    const response = await api.put<Stock>(`/stocks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/stocks/${id}`);
  },
};
