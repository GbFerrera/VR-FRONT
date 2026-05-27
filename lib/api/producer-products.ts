import { api } from './axios';

export interface ProducerProduct {
  id: string;
  producerId: string;
  productId: string;
  farmId: string;
  averageProduction: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    unit: string;
  };
  farm: {
    id: string;
    name: string;
  };
  producer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateProducerProductData {
  producerId: string;
  productId: string;
  farmId: string;
  averageProduction: number;
}

export interface UpdateProducerProductData {
  averageProduction?: number;
}

export const producerProductsService = {
  async getAll(producerId?: string): Promise<ProducerProduct[]> {
    const params = producerId ? { producerId } : {};
    const response = await api.get<ProducerProduct[]>('/producer-products', { params });
    return response.data;
  },

  async getById(id: string): Promise<ProducerProduct> {
    const response = await api.get<ProducerProduct>(`/producer-products/${id}`);
    return response.data;
  },

  async create(data: CreateProducerProductData): Promise<ProducerProduct> {
    const response = await api.post<ProducerProduct>('/producer-products', data);
    return response.data;
  },

  async update(id: string, data: UpdateProducerProductData): Promise<ProducerProduct> {
    const response = await api.put<ProducerProduct>(`/producer-products/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/producer-products/${id}`);
  },
};
