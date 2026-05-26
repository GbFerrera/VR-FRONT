import { api } from './axios';

export interface Farm {
  id: string;
  producerId: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  area?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmData {
  ownerId: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  area?: number;
}

export interface UpdateFarmData {
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  area?: number;
}

export const farmsService = {
  async getAll(producerId?: string): Promise<Farm[]> {
    const params = producerId ? { producerId } : {};
    const response = await api.get<Farm[]>('/farms', { params });
    return response.data;
  },

  async getById(id: string): Promise<Farm> {
    const response = await api.get<Farm>(`/farms/${id}`);
    return response.data;
  },

  async create(data: CreateFarmData): Promise<Farm> {
    const response = await api.post<Farm>('/farms', data);
    return response.data;
  },

  async update(id: string, data: UpdateFarmData): Promise<Farm> {
    const response = await api.put<Farm>(`/farms/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/farms/${id}`);
  },
};
