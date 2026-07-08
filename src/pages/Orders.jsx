import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiClock, HiTruck, HiCheckCircle, HiShoppingBag } from 'react-icons/hi'
import { useOrderStore, useAuthStore } from '../hooks/useStore'

const statusConfig = {
  pending: { icon: HiClock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Pending' },
  shipped: { icon: HiTruck, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Shipped' },
  delivered: { icon: HiCheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Delivered' },
}

export default function Orders() {
  const user = useAuthStore(s => s.user)
  const getUserOrders = useOrderStore(s => s.getUserOrders)
  const orders = user ? getUserOrders(user.uid) : []

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please login</h2>
          <p className="text-white/50 mb-6">You need to be logged in to view your orders.</p>
          <Link to="/login"><motion.button whileHover={{ scale: 1.05 }} className="btn-primary">Sign In</motion.button></Link>
        </motion.div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <HiShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-white/50 mb-6">Your order history will appear here.</p>
          <Link to="/products"><motion.button whileHover={{ scale: 1.05 }} className="btn-primary">Start Shopping</motion.button></Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8">
        Order History
      </motion.h1>

      <div className="space-y-4">
        {orders
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          .map((order, i) => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-white/40">Order #{order.id?.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-white/30 mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-white/40">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-sm text-white/50">{order.items?.length || 0} items</span>
                  <span className="font-bold text-purple-400">₹{order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}
