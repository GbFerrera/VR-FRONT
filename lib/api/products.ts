import { api } from './axios';

export interface Product {
  id: string;
  name: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  unit: string;
}

export interface UpdateProductData {
  name?: string;
  unit?: string;
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async create(data: CreateProductData): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
