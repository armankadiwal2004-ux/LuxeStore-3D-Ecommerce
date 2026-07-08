import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HiCurrencyRupee, HiCube, HiShoppingCart,
  HiUsers, HiArrowUp, HiArrowDown
} from 'react-icons/hi'
import { useProductStore, useOrderStore } from '../hooks/useStore'
import { useState, useEffect } from 'react'
import { dbListen } from '../firebase/config'

export default function Dashboard() {
  const products = useProductStore(s => s.products)
  const orders = useOrderStore(s => s.orders)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const unsub = dbListen('users', (data) => {
      if (data) setUsers(Object.entries(data).map(([id, v]) => ({ ...v, uid: id })))
    })
    return unsub
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: HiCurrencyRupee, color: 'from-green-500 to-emerald-600', change: '+12.5%', up: true },
    { label: 'Total Products', value: products.length, icon: HiCube, color: 'from-purple-500 to-violet-600', change: '+3', up: true },
    { label: 'Total Orders', value: orders.length, icon: HiShoppingCart, color: 'from-blue-500 to-cyan-600', change: `${pendingOrders} pending`, up: null },
    { label: 'Total Users', value: users.length, icon: HiUsers, color: 'from-pink-500 to-rose-600', change: '+2 new', up: true },
  ]

  const recentOrders = [...orders]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 8)

  const topProducts = [...products]
    .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
          Welcome back 👋
        </motion.h1>
        <p className="text-white/40 text-sm mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.up !== null && (
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.up ? <HiArrowUp className="w-3 h-3" /> : <HiArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              )}
              {stat.up === null && <span className="text-xs text-white/40">{stat.change}</span>}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts / Info row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Order status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <h3 className="font-semibold text-sm mb-4">Order Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Pending', count: pendingOrders, color: 'bg-yellow-500', pct: orders.length ? (pendingOrders / orders.length * 100) : 0 },
              { label: 'Shipped', count: shippedOrders, color: 'bg-blue-500', pct: orders.length ? (shippedOrders / orders.length * 100) : 0 },
              { label: 'Delivered', count: deliveredOrders, color: 'bg-green-500', pct: orders.length ? (deliveredOrders / orders.length * 100) : 0 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-white/60">{item.label}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          {orders.length === 0 && <p className="text-center text-white/30 text-sm py-4">No orders yet</p>}
        </motion.div>

        {/* Top products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Top Products</h3>
            <Link to="/admin/products" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View All →</Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-xs text-white/30 w-5">{i + 1}</span>
                <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-white/40 capitalize">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{product.price?.toFixed(2)}</p>
                  <p className="text-xs text-white/40">⭐ {product.rating}</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-center text-white/30 text-sm py-4">No products yet</p>}
          </div>
        </motion.div>
      </div>

      {/* Recent orders table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="font-semibold text-sm">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 font-medium text-white/40 text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left p-4 font-medium text-white/40 text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left p-4 font-medium text-white/40 text-xs uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-left p-4 font-medium text-white/40 text-xs uppercase tracking-wider">Total</th>
                <th className="text-left p-4 font-medium text-white/40 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left p-4 font-medium text-white/40 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-xs text-purple-400">#{order.id?.slice(-6).toUpperCase()}</td>
                  <td className="p-4">
                    <p className="font-medium text-sm">{order.userName || 'N/A'}</p>
                    <p className="text-xs text-white/30 hidden lg:block">{order.userEmail || ''}</p>
                  </td>
                  <td className="p-4 text-white/50 hidden sm:table-cell">{order.items?.length || 0} items</td>
                  <td className="p-4 font-semibold">₹{order.total?.toFixed(2) || '0.00'}</td>
                  <td className="p-4 text-xs text-white/30 hidden md:table-cell">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-white/30">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
