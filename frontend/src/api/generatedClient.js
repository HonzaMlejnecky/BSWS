import { apiClient } from './client';

/** @typedef {{email:string,password:string}} LoginDto */
/** @typedef {{email:string,username:string,password:string,firstName?:string,lastName?:string}} RegisterDto */

export const authApi = {
  /** @param {RegisterDto} payload */
  register: (payload) => apiClient.post('/api/v1/auth/register', payload),
  /** @param {LoginDto} payload */
  login: (payload) => apiClient.post('/api/v1/auth/login', payload),
};


export const usersApi = {
  getMe: () => apiClient.get('/api/v1/users/me'),
};

export const plansApi = {
  getAll: () => apiClient.get('/api/v1/plans'),
  getById: (id) => apiClient.get(`/api/v1/plans/${id}`),
};

export const ordersApi = {
  getMine: () => apiClient.get('/api/v1/orders/me'),
  getById: (id) => apiClient.get(`/api/v1/orders/${id}`),
  create: (planId) => apiClient.post(`/api/v1/orders?plan=${planId}`),
  updateStatus: (id, status) => apiClient.put(`/api/v1/orders/${id}/status?status=${status}`),
};

export const projectsApi = {
  getByUser: (userId) => apiClient.get(`/api/v1/projects/user/${userId}`),
  create: (payload) => apiClient.post('/api/v1/projects', payload),
  remove: (projectId) => apiClient.delete(`/api/v1/projects/${projectId}`),
  publish: (projectId) => apiClient.post(`/api/v1/projects/${projectId}/publish`),
  redeploy: (projectId) => apiClient.post(`/api/v1/projects/${projectId}/redeploy`),
};

export const databaseApi = {
  getMine: () => apiClient.get('/api/v1/databases/me'),
  create: (payload) => apiClient.post('/api/v1/databases', payload),
  remove: (id) => apiClient.delete(`/api/v1/databases/${id}`),
  changePassword: (payload) => apiClient.post('/api/v1/databases/password', payload),
};

export const sftpApi = {
  getMine: () => apiClient.get('/api/v1/sftp/accounts/me'),
  create: (payload) => apiClient.post('/api/v1/sftp/accounts', payload),
  remove: (id) => apiClient.delete(`/api/v1/sftp/accounts/${id}`),
  changePassword: (payload) => apiClient.post('/api/v1/sftp/accounts/password', payload),
};

export const emailApi = {
  getDomainsByUser: () => apiClient.get('/api/v1/email/domains/me'),
  getAccountsByDomain: (domainId) => apiClient.get(`/api/v1/email/accounts/domain/${domainId}`),
  createDomain: (payload) => apiClient.post('/api/v1/email/domains', payload),
  removeDomain: (id) => apiClient.delete(`/api/v1/email/domains/${id}`),
  createAccount: (payload) => apiClient.post('/api/v1/email/accounts', payload),
  removeAccount: (id) => apiClient.delete(`/api/v1/email/accounts/${id}`),
  changePassword: (payload) => apiClient.post('/api/v1/email/accounts/password', payload),
};
