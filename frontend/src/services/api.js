import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token and active Workspace ID
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('teamflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeWs = localStorage.getItem('teamflow_active_workspace_id');
  config.headers['x-workspace-id'] = activeWs || '1';

  return config;
});

export default api;
