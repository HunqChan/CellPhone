import axiosInstance from './axiosInstance'

export const productApi = {
  getAll: () => axiosInstance.get('/products'),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  getByCategory: (categoryId) => axiosInstance.get(`/products/category/${categoryId}`),
  search: (query) => axiosInstance.get(`/products?search=${encodeURIComponent(query)}`),
  filter: (request) => axiosInstance.post('/products/search', request),

  // Admin – Product CRUD
  create: (data) => axiosInstance.post('/products', data),
  update: (id, data) => axiosInstance.put(`/products/${id}`, data),
  delete: (id) => axiosInstance.delete(`/products/${id}`),

  // Admin – Variant CRUD
  addVariant: (productId, data) => axiosInstance.post(`/products/${productId}/variants`, data),
  updateVariant: (variantId, data) => axiosInstance.put(`/products/variants/${variantId}`, data),
  deleteVariant: (variantId) => axiosInstance.delete(`/products/variants/${variantId}`),
}
