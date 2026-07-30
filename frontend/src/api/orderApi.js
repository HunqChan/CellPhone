import axiosInstance from './axiosInstance'

export const orderApi = {
  checkout: (data) => axiosInstance.post('/orders/checkout', data),
  getByUser: (userId) => axiosInstance.get(`/orders/user/${userId}`),
  getById: (orderId) => axiosInstance.get(`/orders/${orderId}`),
  cancel: (orderId) => axiosInstance.put(`/orders/${orderId}/cancel`),
  // Admin
  getAll: () => axiosInstance.get('/orders'),
  updateStatus: (orderId, status) => axiosInstance.put(`/orders/${orderId}/status`, { status }),
}
