import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiSearch, HiFilter, HiEye } from 'react-icons/hi'
import { useOrderStore } from '../hooks/useStore'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const orders = useOrderStore(s => s.orders)
  const updateStatus = useOrderStore(s => s.updateOrderStatus)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)

  const filtered = orders
    .filter(o => {
      const matchSearch = (o.userName || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.userEmail || '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || o.status === filterStatus
      return matchSearch && matchStatus
    })
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus(orderId, newStatus)
      toast.success(`Order updated to ${newStatus}`)
    } catch {
      toast.error('Failed to update order')
    }
  }

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-white/40 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              filterStatus === status
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-xs opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
        <HiSearch className="w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, email, or order ID..."
          className="bg-transparent border-none outline-none text-sm flex-1 placeholder-white/30"
        />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
          >
            <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Order info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-purple-400">#{order.id?.slice(-6).toUpperCase()}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-medium">{order.userName || 'N/A'}</p>
                <p className="text-xs text-white/30">{order.userEmail || 'N/A'}</p>
              </div>

              {/* Order details */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="font-bold">₹{order.total?.toFixed(2) || '0.00'}</p>
                  <p className="text-xs text-white/30">{order.items?.length || 0} items</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-white/40">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                  </p>
                  <p className="text-xs text-white/20">
                    {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
                  </p>
                </div>

                {/* Status change */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}
                >
                  <option value="pending" className="bg-gray-900 text-white">Pending</option>
                  <option value="shipped" className="bg-gray-900 text-white">Shipped</option>
                  <option value="delivered" className="bg-gray-900 text-white">Delivered</option>
                </select>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <HiEye className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </div>

            {/* Expanded order details */}
            {expandedOrder === order.id && order.items && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-white/5 p-4 bg-white/[0.02]"
              >
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Order Items</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.name}</p>
                        <p className="text-xs text-white/30">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                {order.shippingAddress && (
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Shipping Address</p>
                    <p className="text-sm text-white/60">
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zip}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-white/30">
          <HiSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders found</p>
        </div>
      )}
    </div>
  )
}
