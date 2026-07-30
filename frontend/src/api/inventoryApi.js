import axiosInstance from './axiosInstance'

export const inventoryApi = {
  importStock: (data) => axiosInstance.post('/inventory/import', data),
  exportStock: (data) => axiosInstance.post('/inventory/export', data),
}
