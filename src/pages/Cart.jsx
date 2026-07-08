import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiTrash, HiMinus, HiPlus, HiArrowRight, HiShoppingCart } from 'react-icons/hi'
import { useCartStore, useAuthStore } from '../hooks/useStore'
import toast, { Toaster } from 'react-hot-toast'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const user = useAuthStore(s => s.user)
  const uid = user?.uid

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Toaster position="top-center" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <HiShoppingCart className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-white/50 mb-6">Discover amazing products and add them to your cart.</p>
          <Link to="/products">
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary">
              Browse Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Shopping Cart ({items.length})
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex gap-4"
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold text-white/90 hover:text-purple-400 transition-colors truncate">{item.name}</h3>
                  </Link>
                  <p className="text-purple-400 font-bold mt-1">₹{item.price.toFixed(2)}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center glass rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, uid)}
                        className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <HiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, uid)}
                        className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <HiPlus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        removeItem(item.id, uid)
                        toast.success('Removed from cart')
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="text-right shrink-0">
                  <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Tax (est.)</span>
                <span>₹{(getTotal() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-purple-400 text-lg">
                  ₹{(getTotal() * 1.08).toFixed(2)}
                </span>
              </div>
            </div>

            <Link to={user ? '/checkout' : '/login'}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'} <HiArrowRight />
              </motion.button>
            </Link>

            <Link to="/products" className="block text-center text-sm text-purple-400 hover:text-purple-300 mt-4 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
