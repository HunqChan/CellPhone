import axiosInstance from './axiosInstance'

export const inventoryApi = {
  /**
   * Nhập kho — cộng số lượng + ghi nhận giá nhập (importPrice)
   * { productVariantId, quantity, importPrice }
   */
  importStock: (data) => axiosInstance.post('/inventory/import', data),

  /**
   * Xuất kho điều chỉnh — trừ số lượng
   * { productVariantId, quantity }
   */
  exportStock: (data) => axiosInstance.post('/inventory/export', data),
}
