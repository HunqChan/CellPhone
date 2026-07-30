import axiosInstance from './axiosInstance'

export const addressApi = {
  add: (data) => axiosInstance.post('/addresses', data),
  getByUser: (userId) => axiosInstance.get(`/addresses/user/${userId}`),
  update: (addressId, data) => axiosInstance.put(`/addresses/${addressId}`, data),
  delete: (addressId) => axiosInstance.delete(`/addresses/${addressId}`),
  setDefault: (addressId, userId) =>
    axiosInstance.put(`/addresses/${addressId}/default?userId=${userId}`),
}
