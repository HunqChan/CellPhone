import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  isOpen: false,
  cart: null, // CartResponse from backend
  loading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ loading }),
  clearCart: () => set({ cart: null, isOpen: false }),

  // Computed
  getItemCount: () => {
    const { cart } = get()
    if (!cart?.cartItems) return 0
    return cart.cartItems.reduce((sum, item) => sum + item.quantity, 0)
  },

  getTotalPrice: () => {
    const { cart } = get()
    if (!cart?.cartItems) return 0
    return cart.cartItems.reduce(
      (sum, item) => sum + (item.productVariant?.price || 0) * item.quantity,
      0
    )
  },
}))
