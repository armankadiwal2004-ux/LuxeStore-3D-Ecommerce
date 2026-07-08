import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiHeart, HiShoppingCart, HiTrash } from 'react-icons/hi'
import { useWishlistStore, useCartStore, useAuthStore } from '../hooks/useStore'
import toast, { Toaster } from 'react-hot-toast'

export default function Wishlist() {
  const { items, toggleItem } = useWishlistStore()
  const addToCart = useCartStore(s => s.addItem)
  const user = useAuthStore(s => s.user)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Toaster position="top-center" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <HiHeart className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-white/50 mb-6">Save items you love to your wishlist.</p>
          <Link to="/products">
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary">Browse Products</motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-center" />
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8">
        Wishlist ({items.length})
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden group"
            >
              <Link to={`/product/${item.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-white/90 mb-1 truncate">{item.name}</h3>
                <p className="text-purple-400 font-bold mb-4">₹{item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(item, user?.uid)
                      toast.success('Added to cart!')
                    }}
                    className="flex-1 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HiShoppingCart className="w-4 h-4" /> Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      toggleItem(item, user?.uid)
                      toast.success('Removed from wishlist')
                    }}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <HiTrash className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
