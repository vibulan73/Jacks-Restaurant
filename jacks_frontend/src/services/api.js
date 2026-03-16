import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jn_token');
      localStorage.removeItem('jn_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

// Menu
export const menuAPI = {
  getCategories: () => api.get('/menu/categories'),
  getAll: () => api.get('/menu'),
  getPopular: () => api.get('/menu/popular'),
  getByCategory: (id) => api.get(`/menu/category/${id}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
  createCategory: (data) => api.post('/menu/categories', data),
  updateCategory: (id, data) => api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/menu/categories/${id}`),
};

// Promotions
export const promotionAPI = {
  getActive: () => api.get('/promotions'),
  getAll: () => api.get('/promotions/all'),
  create: (data) => api.post('/promotions', data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  delete: (id) => api.delete(`/promotions/${id}`),
};

// Events
export const eventAPI = {
  getUpcoming: () => api.get('/events'),
  getAll: () => api.get('/events/all'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Gallery
export const galleryAPI = {
  getAll: (category) => api.get('/gallery', { params: category ? { category } : {} }),
  create: (data) => api.post('/gallery', data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Reservations
export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getAll: () => api.get('/reservations'),
  updateStatus: (id, status) => api.put(`/reservations/${id}/status`, { status }),
};

// Contact
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.put(`/contact/${id}/read`),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard'),
};

// Site Settings
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  updateAll: (data) => api.put('/settings', data),
};

export default api;
