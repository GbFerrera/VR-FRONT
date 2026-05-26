import { api } from './axios';
import { User } from './auth';

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'ADMIN' | 'PRODUCER';
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  email?: string;
}

export const usersService = {
  async getAll(role?: 'ADMIN' | 'PRODUCER'): Promise<User[]> {
    const params = role ? { role } : {};
    const response = await api.get<User[]>('/users', { params });
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserData): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
