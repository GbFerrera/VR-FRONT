import { api } from './axios';

export interface Harvest {
  id: string;
  producerProductId: string;
  farmId: string;
  expectedDate: string;
  actualDate?: string;
  notes?: string;
  createdAt: string;
  producerProduct?: {
    id: string;
    product: {
      id: string;
      name: string;
      unit: string;
    };
  };
  farm?: {
    id: string;
    name: string;
  };
}

export interface CreateHarvestData {
  producerProductId: string;
  farmId: string;
  expectedDate: string;
  actualDate?: string;
  notes?: string;
}

export interface UpdateHarvestData {
  expectedDate?: string;
  actualDate?: string;
  notes?: string;
}

export const harvestsService = {
  async getAll(producerId?: string): Promise<Harvest[]> {
    const params = producerId ? { producerId } : {};
    const response = await api.get<Harvest[]>('/harvests', { params });
    return response.data;
  },

  async getById(id: string): Promise<Harvest> {
    const response = await api.get<Harvest>(`/harvests/${id}`);
    return response.data;
  },

  async create(data: CreateHarvestData): Promise<Harvest> {
    const response = await api.post<Harvest>('/harvests', data);
    return response.data;
  },

  async update(id: string, data: UpdateHarvestData): Promise<Harvest> {
    const response = await api.put<Harvest>(`/harvests/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/harvests/${id}`);
  },
};
