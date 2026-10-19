import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Brand APIs
export const getBrands = () => api.get('/brands');
export const addBrand = (data) => api.post('/brands', data);
export const updateBrand = (id, data) => api.put(`/brands/${id}`, data);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);

// Product APIs
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const uploadProductImage = (formData) => api.post('/products/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Inventory APIs
export const getInventory = (params) => api.get('/inventory', { params });
export const adjustStock = (data) => api.post('/inventory/adjust', data);
export const getTransactions = (params) => api.get('/inventory/transactions', { params });

// Sales APIs
export const getSales = (params) => api.get('/sales', { params });
export const recordSale = (data) => api.post('/sales', data);
export const importSalesCSV = (formData) => api.post('/sales/import-csv', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// ML Forecast APIs
export const getMLHealth = () => api.get('/forecast/health');
export const trainMLModel = () => api.post('/forecast/train');
export const predictDemand = (data) => api.post('/forecast/predict', data);
export const getMLMetrics = () => api.get('/forecast/metrics');
export const getRecommendations = () => api.get('/forecast/recommendations');

// Dashboard & Reports APIs
export const getDashboardStats = () => api.get('/reports/dashboard-stats');
export const getReportSummaries = () => api.get('/reports/summaries');

export default api;
