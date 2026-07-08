import { motion } from 'framer-motion'
import { HiTrendingUp, HiCurrencyRupee, HiShoppingCart, HiUsers } from 'react-icons/hi'
import { useProductStore, useOrderStore } from '../hooks/useStore'
import { useState, useEffect } from 'react'
import { dbListen } from '../firebase/config'

export default function AdminAnalytics() {
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
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0

  // Category breakdown
  const categoryRevenue = {}
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      const product = products.find(p => p.id === item.id)
      const cat = product?.category || 'other'
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.price * item.quantity)
    })
  })

  const categoryData = Object.entries(categoryRevenue)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue)

  const maxCatRevenue = Math.max(...categoryData.map(c => c.revenue), 1)

  // Monthly orders (simplified)
  const monthlyOrders = {}
  orders.forEach(order => {
    if (order.createdAt) {
      const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      monthlyOrders[month] = (monthlyOrders[month] || 0) + 1
    }
  })

  const monthlyData = Object.entries(monthlyOrders).slice(-6)
  const maxMonthly = Math.max(...monthlyData.map(([, c]) => c), 1)

  // Product stock overview
  const lowStock = products.filter(p => p.stock < 20)
  const outOfStock = products.filter(p => p.stock === 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Store performance overview</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: HiCurrencyRupee, color: 'from-green-500 to-emerald-600' },
          { label: 'Avg Order Value', value: `₹${avgOrderValue.toFixed(2)}`, icon: HiTrendingUp, color: 'from-purple-500 to-violet-600' },
          { label: 'Total Orders', value: orders.length, icon: HiShoppingCart, color: 'from-blue-500 to-cyan-600' },
          { label: 'Active Users', value: users.length, icon: HiUsers, color: 'from-pink-500 to-rose-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${stat.color} mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Revenue by category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <h3 className="font-semibold text-sm mb-4">Revenue by Category</h3>
          <div className="space-y-4">
            {categoryData.map(item => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-white/60 capitalize">{item.category}</span>
                  <span className="font-medium">₹{item.revenue.toFixed(2)}</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.revenue / maxCatRevenue) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            ))}
            {categoryData.length === 0 && <p className="text-center text-white/30 text-sm py-4">No sales data yet</p>}
          </div>
        </motion.div>

        {/* Monthly orders chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <h3 className="font-semibold text-sm mb-4">Orders Over Time</h3>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map(([month, count]) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(count / maxMonthly) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg min-h-[4px]"
                />
                <span className="text-[10px] text-white/30">{month}</span>
              </div>
            ))}
            {monthlyData.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-white/30 text-sm">No order data yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stock alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5"
      >
        <h3 className="font-semibold text-sm mb-4">Stock Alerts</h3>
        {lowStock.length > 0 ? (
          <div className="space-y-2">
            {lowStock.map(product => (
              <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <img src={product.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{product.name}</p>
                  <p className="text-xs text-white/30 capitalize">{product.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  product.stock === 0 ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/30 text-sm py-4">All products are well stocked</p>
        )}
      </motion.div>
    </div>
  )
}
