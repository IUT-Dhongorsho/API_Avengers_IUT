import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Public
export const getCampaigns = async () => (await api.get('/v1/campaigns')).data;
export const getCampaign = async (id) => (await api.get(`/v1/campaigns/${id}`)).data;

// Pledge
export const createPledge = async (payload) => (await api.post('/v1/pledges', payload)).data;

// Auth
export const login = async (email, password) => (await api.post('/v1/auth/login', { email, password })).data;

// Admin
export const adminGetCampaigns = async () => (await api.get('/v1/campaigns')).data;
export const adminGetPledges = async () => (await api.get('/v1/admin/pledges')).data;

export default api;
