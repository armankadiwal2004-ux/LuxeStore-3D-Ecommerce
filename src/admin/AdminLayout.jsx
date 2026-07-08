import { useState } from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiViewGrid, HiCube, HiClipboardList, HiUsers, HiCog,
  HiChevronLeft, HiChevronRight, HiLogout, HiHome, HiTrendingUp,
  HiBell, HiSearch, HiMenu, HiX, HiCollection
} from 'react-icons/hi'
import { useAuthStore } from '../hooks/useStore'
import { logoutUser } from '../firebase/config'
import toast from 'react-hot-toast'

const sidebarItems = [
  { to: '/admin', icon: HiViewGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: HiCube, label: 'Products' },
  { to: '/admin/categories', icon: HiCollection, label: 'Categories' },
  { to: '/admin/orders', icon: HiClipboardList, label: 'Orders' },
  { to: '/admin/users', icon: HiUsers, label: 'Users' },
  { to: '/admin/analytics', icon: HiTrendingUp, label: 'Analytics' },
  { to: '/admin/settings', icon: HiCog, label: 'Settings' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const user = useAuthStore(s => s.user)
  const userProfile = useAuthStore(s => s.userProfile)

  if (!user || (userProfile && userProfile.role !== 'admin')) {
    return <Navigate to="/" replace />
  }

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Logged out')
  }

  const isActive = (path, end) => {
    if (end) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className={`flex items-center ${collapsed && !mobile ? 'justify-center' : 'justify-between'} p-4 border-b border-white/10`}>
        {(!collapsed || mobile) && (
          <Link to="/admin" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <p className="font-bold text-sm">LuxeStore</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
        )}
        {collapsed && !mobile && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            <span className="text-white font-bold text-sm">L</span>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer hidden lg:block"
          >
            {collapsed ? <HiChevronRight className="w-4 h-4" /> : <HiChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarItems.map(item => {
          const active = isActive(item.to, item.end)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="admin-sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-purple-400' : 'text-white/40 group-hover:text-white/70'}`} />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <HiHome className="w-5 h-5 shrink-0" />
          {(!collapsed || mobile) && <span>Back to Store</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <HiLogout className="w-5 h-5 shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>

        {/* User info */}
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold shrink-0">
              {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.displayName || 'Admin'}</p>
              <p className="text-[11px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-white/10 bg-gray-950/80 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-gray-950 border-r border-white/10 z-50 lg:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 bg-gray-950/60 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
            >
              <HiMenu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold capitalize">
                {location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').pop()}
              </h2>
              <p className="text-xs text-white/40">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-64">
              <HiSearch className="w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm flex-1 placeholder-white/30"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative cursor-pointer">
              <HiBell className="w-5 h-5 text-white/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-2 ml-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.displayName || 'Admin'}</p>
                <p className="text-[11px] text-white/40">{userProfile?.role || 'admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
