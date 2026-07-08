import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiShoppingCart, HiHeart, HiUser, HiMenu, HiX, HiSun, HiMoon, HiSearch } from 'react-icons/hi'
import { useAuthStore, useCartStore, useThemeStore } from '../hooks/useStore'
import { logoutUser } from '../firebase/config'
import toast from 'react-hot-toast'
import { useDebounceSearch } from '../hooks/useCustomHooks'
import { useProductStore } from '../hooks/useStore'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const user = useAuthStore(s => s.user)
  const userProfile = useAuthStore(s => s.userProfile)
  const cartCount = useCartStore(s => s.getCount())
  const { darkMode, toggleTheme } = useThemeStore()
  const setSearchQuery = useProductStore(s => s.setSearchQuery)
  const { query, setQuery } = useDebounceSearch(300)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(query)
    navigate('/products')
    setSearchOpen(false)
  }

  const handleLogout = async () => {
    await logoutUser()
    setProfileOpen(false)
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-white font-bold text-sm">L</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              LuxeStore
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            {user && userProfile?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle search"
            >
              <HiSearch className="w-5 h-5" />
            </motion.button>

            {/* Theme toggle - hidden on mobile */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="hidden sm:block p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </motion.button>

            {/* Wishlist - hidden on mobile */}
            <Link to="/wishlist" className="hidden sm:block">
              <motion.div whileHover={{ scale: 1.1 }} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <HiHeart className="w-5 h-5" />
              </motion.div>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <motion.div whileHover={{ scale: 1.1 }} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <HiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-xs flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* User menu */}
            <div className="relative">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </motion.button>
              ) : (
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.1 }} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <HiUser className="w-5 h-5" />
                  </motion.div>
                </Link>
              )}

              {/* Profile dropdown */}
              <AnimatePresence>
                {profileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 glass rounded-xl p-2 shadow-2xl"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-semibold text-sm">{user.displayName || 'User'}</p>
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                    <Link to="/orders" onClick={() => setProfileOpen(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors">
                      My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors">
                      Wishlist
                    </Link>
                    {userProfile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors text-purple-400">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  autoFocus
                />
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                <HiHeart className="w-4 h-4" /> Wishlist
              </Link>
              {user && (
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  My Orders
                </Link>
              )}
              {user && userProfile?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-purple-400 hover:bg-white/10 transition-colors">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { toggleTheme(); setMobileOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors text-left cursor-pointer"
              >
                {darkMode ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              {!user && (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
