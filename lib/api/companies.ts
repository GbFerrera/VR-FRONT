import { api } from './axios';

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: string;
}

export interface UpdateCompanyData {
  name?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const companiesService = {
  async getAll(): Promise<Company[]> {
    const response = await api.get<Company[]>('/companies');
    return response.data;
  },

  async getById(id: string): Promise<Company> {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  async create(data: CreateCompanyData): Promise<Company> {
    const response = await api.post<Company>('/companies', data);
    return response.data;
  },

  async update(id: string, data: UpdateCompanyData): Promise<Company> {
    const response = await api.put<Company>(`/companies/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  },
};
