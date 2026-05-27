import { api } from './axios';

export interface Order {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  value: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customer: string;
  product: string;
  quantity: number;
  value: number;
}

export interface UpdateOrderData {
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  quantity?: number;
  value?: number;
}

export const ordersService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  async update(id: string, data: UpdateOrderData): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  },
};
