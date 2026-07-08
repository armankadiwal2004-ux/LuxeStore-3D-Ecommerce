import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { onAuthChange, dbGet } from './firebase/config'
import { useAuthStore, useProductStore, useCartStore, useWishlistStore, useOrderStore, useCategoryStore } from './hooks/useStore'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'
import CursorGlow from './components/CursorGlow'

// Lazy loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Orders = lazy(() => import('./pages/Orders'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const FooterInfoPage = lazy(() => import('./pages/FooterInfoPage'))
const AdminDashboard = lazy(() => import('./admin/Dashboard'))
const AdminProducts = lazy(() => import('./admin/AdminProducts'))
const AdminOrders = lazy(() => import('./admin/AdminOrders'))
const AdminUsers = lazy(() => import('./admin/AdminUsers'))
const AdminAnalytics = lazy(() => import('./admin/AdminAnalytics'))
const AdminCategories = lazy(() => import('./admin/AdminCategories'))
const AdminSettings = lazy(() => import('./admin/AdminSettings'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))

export default function App() {
  const setUser = useAuthStore(s => s.setUser)
  const setUserProfile = useAuthStore(s => s.setUserProfile)
  const initProducts = useProductStore(s => s.initProducts)
  const initCategories = useCategoryStore(s => s.initCategories)
  const initCart = useCartStore(s => s.initCart)
  const initWishlist = useWishlistStore(s => s.initWishlist)
  const initOrders = useOrderStore(s => s.initOrders)

  useEffect(() => {
    // Initialize products and categories listeners
    const unsubProducts = initProducts()
    const unsubCategories = initCategories()

    // Auth state listener
    const unsubAuth = onAuthChange(async (user) => {
      setUser(user)
      if (user) {
        const profile = await dbGet(`users/${user.uid}`)
        setUserProfile(profile)
        // Initialize user-specific listeners
        const unsubCart = initCart(user.uid)
        const unsubWishlist = initWishlist(user.uid)
        const unsubOrders = initOrders(user.uid)
        return () => { unsubCart(); unsubWishlist(); unsubOrders() }
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      unsubProducts()
      unsubCategories()
      unsubAuth()
    }
  }, [])

  return (
    <>
      <CursorGlow />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/new-arrivals" element={<FooterInfoPage slug="new-arrivals" />} />
            <Route path="/best-sellers" element={<FooterInfoPage slug="best-sellers" />} />
            <Route path="/deals" element={<FooterInfoPage slug="deals" />} />
            <Route path="/help-center" element={<FooterInfoPage slug="help-center" />} />
            <Route path="/returns" element={<FooterInfoPage slug="returns" />} />
            <Route path="/shipping" element={<FooterInfoPage slug="shipping" />} />
            <Route path="/contact-us" element={<FooterInfoPage slug="contact-us" />} />
            <Route path="/privacy-policy" element={<FooterInfoPage slug="privacy-policy" />} />
            <Route path="/terms-of-service" element={<FooterInfoPage slug="terms-of-service" />} />
            <Route path="/cookie-policy" element={<FooterInfoPage slug="cookie-policy" />} />
          </Route>
          {/* Separate Admin Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
