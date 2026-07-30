/**
 * Format number as Vietnamese currency (VND)
 */
export const formatCurrency = (amount) => {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format ISO datetime string to localized Vietnamese date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/**
 * Map order status to display info
 */
export const ORDER_STATUS_MAP = {
  PENDING_CONFIRMATION: { label: 'Chờ xác nhận', color: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'info' },
  SHIPPING: { label: 'Đang giao', color: 'primary' },
  DELIVERED: { label: 'Đã giao', color: 'success' },
  CANCELED: { label: 'Đã hủy', color: 'error' },
}

export const getOrderStatusInfo = (status) =>
  ORDER_STATUS_MAP[status] || { label: status, color: 'info' }

/**
 * Get minimum price from product variants
 */
export const getMinPrice = (variants) => {
  if (!variants || variants.length === 0) return null
  return Math.min(...variants.map((v) => v.price))
}

/**
 * Get placeholder image for products
 */
export const getProductImage = (image) => {
  if (image && image.startsWith('http')) return image
  return `https://placehold.co/400x400/1a1a2e/818cf8?text=📱`
}

/**
 * Truncate text to given length
 */
export const truncate = (text, maxLength = 60) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

/**
 * Decode JWT payload (no verification, just for UI use)
 * Note: JWT sub trong system này là EMAIL không phải userId.
 * userId được lấy từ AuthResponse.userId sau khi login.
 */
export const decodeJwt = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}
