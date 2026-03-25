import { apiClient } from './client';

/** @typedef {{email:string,password:string}} LoginDto */
/** @typedef {{email:string,username:string,password:string,firstName?:string,lastName?:string}} RegisterDto */

export const authApi = {
  /** @param {RegisterDto} payload */
  register: (payload) => apiClient.post('/api/v1/auth/register', payload),
  /** @param {LoginDto} payload */
  login: (payload) => apiClient.post('/api/v1/auth/login', payload),
};

export const ordersApi = {
  getByUser: (userId) => apiClient.get(`/api/v1/orders/user/${userId}`),
};

export const sftpApi = {
  getByUser: (userId) => apiClient.get(`/api/v1/sftp/accounts/user/${userId}`),
  create: (payload) => apiClient.post('/api/v1/sftp/accounts', payload),
  remove: (id) => apiClient.delete(`/api/v1/sftp/accounts/${id}`),
  changePassword: (payload) => apiClient.post('/api/v1/sftp/accounts/password', payload),
};

export const emailApi = {
  getDomainsByUser: (userId) => apiClient.get(`/api/v1/email/domains/user/${userId}`),
  createDomain: (payload) => apiClient.post('/api/v1/email/domains', payload),
  removeDomain: (id) => apiClient.delete(`/api/v1/email/domains/${id}`),
  createAccount: (payload) => apiClient.post('/api/v1/email/accounts', payload),
  removeAccount: (id) => apiClient.delete(`/api/v1/email/accounts/${id}`),
  changePassword: (payload) => apiClient.post('/api/v1/email/accounts/password', payload),
};
