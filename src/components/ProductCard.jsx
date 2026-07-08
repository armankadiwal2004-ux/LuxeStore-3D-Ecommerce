import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiShoppingCart, HiHeart } from 'react-icons/hi'
import { HiStar } from 'react-icons/hi'
import { useCartStore, useWishlistStore, useAuthStore } from '../hooks/useStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const addItem = useCartStore(s => s.addItem)
  const toggleWishlist = useWishlistStore(s => s.toggleItem)
  const isWished = useWishlistStore(s => s.isWished(product.id))
  const user = useAuthStore(s => s.user)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, user?.uid)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#1f2937', color: '#fff', border: '1px solid rgba(139,92,246,0.3)' }
    })
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product, user?.uid)
    toast.success(isWished ? 'Removed from wishlist' : 'Added to wishlist!', {
      style: { background: '#1f2937', color: '#fff', border: '1px solid rgba(139,92,246,0.3)' }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="glass-card overflow-hidden group">
          {/* Image */}
          <div className="relative overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="flex-1 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HiShoppingCart className="w-4 h-4" /> Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-lg backdrop-blur-sm cursor-pointer ${isWished ? 'bg-pink-500 text-white' : 'bg-white/20 text-white'}`}
                >
                  <HiHeart className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            {/* Badge */}
            {product.featured && (
              <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold bg-purple-600 text-white">
                Featured
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-semibold text-white/90 mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-white/50 line-clamp-2 mb-3">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-purple-400">₹{product.price.toFixed(2)}</span>
              <div className="flex items-center gap-1">
                <HiStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white/60">{product.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
