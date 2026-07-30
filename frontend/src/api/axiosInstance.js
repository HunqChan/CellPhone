import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor – attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Backend trả về: { success: bool, code: int, message: string, data: T, timestamp: long }
 * Interceptor này trả về nguyên object ApiResponse để các page gọi res.data lấy payload.
 * Ví dụ: const res = await authApi.login(form) → res.data là AuthResponse
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // response.data là ApiResponse<T> từ backend
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    // Lấy message từ ApiResponse.message của backend
    const message =
      error.response?.data?.message ||
      error.message ||
      'Có lỗi xảy ra. Vui lòng thử lại.'
    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
