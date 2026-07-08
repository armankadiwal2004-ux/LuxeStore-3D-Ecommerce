// Global state management with Zustand
import { create } from 'zustand'
import { dbListen, dbSet, dbRemove, dbGet, dbPush, dbUpdate } from '../firebase/config'

// ── Theme Store ──
export const useThemeStore = create((set) => ({
  darkMode: true,
  toggleTheme: () => set((state) => {
    const next = !state.darkMode
    document.body.classList.toggle('light-mode', !next)
    return { darkMode: next }
  })
}))

// ── Categories Store ──
export const useCategoryStore = create((set) => ({
  categories: [],
  loading: true,
  setLoading: (loading) => set({ loading }),

  initCategories: () => {
    set({ loading: true })
    const unsub = dbListen('categories', (data) => {
      if (data) {
        const arr = Object.entries(data).map(([id, v]) => ({ ...v, id }))
        // Always prepend "All Products"
        set({ categories: [{ id: 'all', name: 'All Products', icon: '🛍️' }, ...arr], loading: false })
      } else {
        set({ categories: [{ id: 'all', name: 'All Products', icon: '🛍️' }], loading: false })
      }
    })
    return unsub
  }
}))

// ── Auth Store ──
export const useAuthStore = create((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (loading) => set({ loading })
}))

// ── Products Store ──
export const useProductStore = create((set, get) => ({
  products: [],
  loading: true,
  filters: { category: 'all', minPrice: 0, maxPrice: 10000000, sortBy: 'featured' },
  searchQuery: '',

  setProducts: (products) => set({ products, loading: false }),
  setLoading: (loading) => set({ loading }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  setSearchQuery: (q) => set({ searchQuery: q }),

  // Initialize products listener from Firebase
  initProducts: () => {
    set({ loading: true })
    const unsub = dbListen('products', (data) => {
      if (data) {
        const arr = Object.entries(data).map(([id, v]) => ({ ...v, id }))
        set({ products: arr, loading: false })
      } else {
        set({ products: [], loading: false })
      }
    })
    return unsub
  },

  getFiltered: () => {
    const { products, filters, searchQuery } = get()
    let result = [...products]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category)
    }
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice)

    switch (filters.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return result
  }
}))

// ── Cart Store ──
export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  // Sync cart with Firebase for authenticated users
  initCart: (uid) => {
    if (!uid) return () => {}
    return dbListen(`carts/${uid}`, (data) => {
      set({ items: data ? Object.values(data) : [] })
    })
  },

  addItem: async (product, uid) => {
    const { items } = get()
    const existing = items.find(i => i.id === product.id)
    if (existing) {
      const updated = items.map(i =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      )
      set({ items: updated })
      if (uid) await dbSet(`carts/${uid}`, Object.fromEntries(updated.map(i => [i.id, i])))
    } else {
      const newItem = { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }
      const updated = [...items, newItem]
      set({ items: updated })
      if (uid) await dbSet(`carts/${uid}`, Object.fromEntries(updated.map(i => [i.id, i])))
    }
  },

  removeItem: async (productId, uid) => {
    const updated = get().items.filter(i => i.id !== productId)
    set({ items: updated })
    if (uid) {
      if (updated.length === 0) await dbRemove(`carts/${uid}`)
      else await dbSet(`carts/${uid}`, Object.fromEntries(updated.map(i => [i.id, i])))
    }
  },

  updateQuantity: async (productId, quantity, uid) => {
    if (quantity <= 0) return get().removeItem(productId, uid)
    const updated = get().items.map(i => i.id === productId ? { ...i, quantity } : i)
    set({ items: updated })
    if (uid) await dbSet(`carts/${uid}`, Object.fromEntries(updated.map(i => [i.id, i])))
  },

  clearCart: async (uid) => {
    set({ items: [] })
    if (uid) await dbRemove(`carts/${uid}`)
  },

  getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0)
}))

// ── Wishlist Store ──
export const useWishlistStore = create((set, get) => ({
  items: [],

  initWishlist: (uid) => {
    if (!uid) return () => {}
    return dbListen(`wishlists/${uid}`, (data) => {
      set({ items: data ? Object.values(data) : [] })
    })
  },

  toggleItem: async (product, uid) => {
    const { items } = get()
    const exists = items.find(i => i.id === product.id)
    let updated
    if (exists) {
      updated = items.filter(i => i.id !== product.id)
    } else {
      updated = [...items, { id: product.id, name: product.name, price: product.price, image: product.image }]
    }
    set({ items: updated })
    if (uid) {
      if (updated.length === 0) await dbRemove(`wishlists/${uid}`)
      else await dbSet(`wishlists/${uid}`, Object.fromEntries(updated.map(i => [i.id, i])))
    }
  },

  isWished: (productId) => get().items.some(i => i.id === productId)
}))

// ── Orders Store ──
export const useOrderStore = create((set, get) => ({
  orders: [],

  initOrders: (uid) => {
    if (!uid) return () => {}
    return dbListen(`orders`, (data) => {
      if (data) {
        const all = Object.entries(data).map(([id, v]) => ({ ...v, id }))
        // Filter by user unless admin
        set({ orders: all })
      } else {
        set({ orders: [] })
      }
    })
  },

  getUserOrders: (uid) => get().orders.filter(o => o.userId === uid),

  placeOrder: async (orderData) => {
    const id = await dbPush('orders', { ...orderData, createdAt: Date.now(), status: 'pending' })
    return id
  },

  updateOrderStatus: async (orderId, status) => {
    await dbUpdate(`orders/${orderId}`, { status })
  }
}))
