import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSearch, HiAdjustments, HiX } from 'react-icons/hi'
import ProductCard from '../components/ProductCard'
import { useProductStore, useCategoryStore } from '../hooks/useStore'
import { Toaster } from 'react-hot-toast'

export default function Products() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { filters, setFilters, setSearchQuery, searchQuery } = useProductStore()
  const getFiltered = useProductStore(s => s.getFiltered)
  const loading = useProductStore(s => s.loading)
  const filteredProducts = getFiltered()

  const categories = useCategoryStore(s => s.categories)

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name A-Z' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Products</h1>
        <p className="text-white/50">Discover our premium collection</p>
      </motion.div>

      {/* Search & Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        {/* Search */}
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-sm"
          />
        </div>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ sortBy: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm appearance-none cursor-pointer"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
          ))}
        </select>

        {/* Filter toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 transition-colors cursor-pointer"
        >
          <HiAdjustments className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Filters panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/70 mb-3">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters({ category: cat.id })}
                      className={`px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                        filters.category === cat.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 border border-white/10 hover:border-purple-500'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-3">
                  Price Range: ₹{filters.minPrice} — ₹{filters.maxPrice}
                </h4>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ minPrice: Number(e.target.value) })}
                    className="flex-1 accent-purple-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                    className="flex-1 accent-purple-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-sm text-white/40 mb-6">{filteredProducts.length} products found</p>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card animate-pulse">
              <div className="aspect-square bg-white/5 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-white/5 rounded w-1/3" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-5 bg-white/5 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-white/50">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
