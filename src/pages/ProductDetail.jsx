import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiShoppingCart, HiHeart, HiStar, HiArrowLeft, HiMinus, HiPlus } from 'react-icons/hi'
import ProductViewer from '../components/ProductViewer'
import { useProductStore, useCartStore, useWishlistStore, useAuthStore } from '../hooks/useStore'
import toast, { Toaster } from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const products = useProductStore(s => s.products)
  const product = products.find(p => p.id === id)
  const addItem = useCartStore(s => s.addItem)
  const toggleWishlist = useWishlistStore(s => s.toggleItem)
  const isWished = useWishlistStore(s => s.isWished(id))
  const user = useAuthStore(s => s.user)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [activeColor, setActiveColor] = useState(0)
  const [showViewer, setShowViewer] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <Link to="/products" className="text-purple-400 hover:underline">Back to products</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, user?.uid)
    }
    toast.success(`${quantity}x ${product.name} added to cart!`, {
      style: { background: '#1f2937', color: '#fff', border: '1px solid rgba(139,92,246,0.3)' }
    })
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      {/* Back link */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8">
          <HiArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images & 3D Viewer */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Toggle between image and 3D */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowViewer(false)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${!showViewer ? 'bg-purple-600 text-white' : 'bg-white/5 border border-white/10'}`}
            >
              📷 Photos
            </button>
            <button
              onClick={() => setShowViewer(true)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${showViewer ? 'bg-purple-600 text-white' : 'bg-white/5 border border-white/10'}`}
            >
              🎮 3D View
            </button>
          </div>

          {showViewer ? (
            <ProductViewer color={product.colors?.[activeColor] || '#8b5cf6'} category={product.category} />
          ) : (
            <>
              {/* Main image */}
              <div className="glass-card overflow-hidden mb-4 aspect-square">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={product.images?.[activeImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                        activeImage === i ? 'border-purple-500' : 'border-white/10'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Right: Product info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-xs text-purple-400 uppercase tracking-wider font-semibold">{product.category}</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <HiStar key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-white/20'}`} />
              ))}
            </div>
            <span className="text-sm text-white/50">{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-purple-400">₹{product.price.toFixed(2)}</span>
            <span className="text-sm text-white/40 ml-2">Free shipping</span>
          </div>

          {/* Description */}
          <p className="text-white/60 mb-8 leading-relaxed">{product.description}</p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white/70 mb-3">Color</h4>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColor(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      activeColor === i ? 'border-purple-400 scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-white/70 mb-3">Quantity</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-white/40">{product.stock} in stock</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <HiShoppingCart className="w-5 h-5" /> Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toggleWishlist(product, user?.uid)
                toast.success(isWished ? 'Removed from wishlist' : 'Added to wishlist!')
              }}
              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                isWished ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/20 hover:border-pink-400'
              }`}
            >
              <HiHeart className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="glass-card p-6">
              <h4 className="font-semibold mb-4">Specifications</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-xs text-white/40 uppercase">{key}</p>
                    <p className="text-sm font-medium">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
