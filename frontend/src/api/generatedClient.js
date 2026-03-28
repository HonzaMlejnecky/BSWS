import { apiClient } from './client';

export const authApi = {
  register: (payload) => apiClient.post('/api/v1/auth/register', payload),
  login: (payload) => apiClient.post('/api/v1/auth/login', payload),
};

export const usersApi = {
  getMe: () => apiClient.get('/api/v1/users/me'),
};

export const plansApi = {
  getAll: () => apiClient.get('/api/v1/plans'),
};

export const subscriptionsApi = {
  getMine: () => apiClient.get('/api/v1/orders/me'),
  selectPlan: (planId) => apiClient.post(`/api/v1/orders?plan=${planId}`),
};

export const projectsApi = {
  getMine: () => apiClient.get('/api/v1/projects/me'),
  getById: (id) => apiClient.get(`/api/v1/projects/${id}`),
  create: (payload) => apiClient.post('/api/v1/projects', payload),
  remove: (projectId) => apiClient.delete(`/api/v1/projects/${projectId}`),
};
