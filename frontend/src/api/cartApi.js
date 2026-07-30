import axiosInstance from './axiosInstance'

export const cartApi = {
  getCart: (userId) => axiosInstance.get(`/cart/${userId}`),
  addToCart: (userId, data) => axiosInstance.post(`/cart/${userId}/add`, data),
}
