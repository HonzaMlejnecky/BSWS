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

// Alias used by useSubscriptions hook and SubscriptionGate
export const ordersApi = {
  getMine: () => apiClient.get('/api/v1/orders/me'),
  create: (planId) => apiClient.post(`/api/v1/orders?plan=${planId}`),
};

export const projectsApi = {
  getMine: () => apiClient.get('/api/v1/projects/me'),
  getById: (id) => apiClient.get(`/api/v1/projects/${id}`),
  create: (payload) => apiClient.post('/api/v1/projects', payload),
  remove: (projectId) => apiClient.delete(`/api/v1/projects/${projectId}`),
  listFiles: (projectId) => apiClient.get(`/api/v1/projects/${projectId}/files`),
  uploadFile: (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/projects/${projectId}/files`, formData);
  },
};

export const databaseApi = {
  getMine: () => apiClient.get('/api/v1/databases/me'),
  create: (payload) => apiClient.post('/api/v1/databases', payload),
  remove: (databaseId) => apiClient.delete(`/api/v1/databases/${databaseId}`),
  updatePassword: (databaseId, newPassword) => apiClient.post('/api/v1/databases/password', { databaseId, newPassword }),
};

export const emailApi = {
  getDomainsByUser: () => apiClient.get('/api/v1/email/domains/me'),
  createDomain: (payload) => apiClient.post('/api/v1/email/domains', payload),
  removeDomain: (id) => apiClient.delete(`/api/v1/email/domains/${id}`),
  createAccount: (payload) => apiClient.post('/api/v1/email/accounts', payload),
  getAccountsByDomain: (domainId) => apiClient.get(`/api/v1/email/accounts/domain/${domainId}`),
  removeAccount: (id) => apiClient.delete(`/api/v1/email/accounts/${id}`),
  changePassword: (payload) => apiClient.post('/api/v1/email/accounts/password', payload),
};

export const sftpApi = {
  getMine: () => apiClient.get('/api/v1/sftp/accounts/me'),
  create: (payload) => apiClient.post('/api/v1/sftp/accounts', payload),
  remove: (id) => apiClient.delete(`/api/v1/sftp/accounts/${id}`),
  changePassword: (payload) => apiClient.post('/api/v1/sftp/accounts/password', payload),
};

