import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      /**
       * user: { email, fullName, role, id? }
       * AuthResponse từ backend không trả về ID, nên ID được bổ sung sau
       * khi load cart lần đầu (cart.user.id).
       */
      user: null,

      /** Được gọi sau khi login/register thành công */
      setAuth: (token, userData) => set({ token, user: userData }),

      /** Bổ sung userId vào user object (gọi sau khi load cart) */
      setUserId: (id) =>
        set((s) => ({ user: s.user ? { ...s.user, id } : s.user })),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'cellphone-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

// Selectors
export const selectIsAuthenticated = (state) => !!state.token
export const selectIsAdmin = (state) => state.user?.role === 'ADMIN'
export const selectIsCustomer = (state) => state.user?.role === 'CUSTOMER'
export const selectUser = (state) => state.user
export const selectToken = (state) => state.token
