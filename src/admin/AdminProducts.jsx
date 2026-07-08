import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX, HiSearch, HiFilter } from 'react-icons/hi'
import { useProductStore } from '../hooks/useStore'
import { dbSet, dbRemove, dbListen } from '../firebase/config'
import toast from 'react-hot-toast'

const emptyProduct = {
  name: '', description: '', price: '', category: '', rating: 4.5,
  reviews: 0, image: '', stock: '', featured: false, colors: ['#8b5cf6'],
  specs: {}
}

export default function AdminProducts() {
  const products = useProductStore(s => s.products)
  const [dbCategories, setDbCategories] = useState([])

  useEffect(() => {
    const unsub = dbListen('categories', (data) => {
      if (data) {
        setDbCategories(Object.entries(data).map(([id, v]) => ({ ...v, id })))
      } else {
        setDbCategories([])
      }
    })
    return unsub
  }, [])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyProduct)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || p.category === filterCat
    return matchSearch && matchCat
  })

  const handleEdit = (product) => {
    setForm({ ...product, price: String(product.price), stock: String(product.stock) })
    setEditingProduct(product.id)
    setShowForm(true)
  }

  const handleNew = () => {
    setForm(emptyProduct)
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const id = editingProduct || `p${Date.now()}`
    const productData = {
      ...form, id,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      images: form.image ? [form.image] : [],
    }
    try {
      await dbSet(`products/${id}`, productData)
      toast.success(editingProduct ? 'Product updated!' : 'Product added!')
      setShowForm(false)
    } catch {
      toast.error('Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await dbRemove(`products/${id}`)
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filterCategories = ['all', ...dbCategories.map(c => c.id)]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-white/40 text-sm mt-1">{products.length} total products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNew}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <HiPlus className="w-4 h-4" /> Add Product
        </motion.button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex-1">
          <HiSearch className="w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent border-none outline-none text-sm flex-1 placeholder-white/30"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <HiFilter className="w-4 h-4 text-white/30" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-transparent border-none outline-none text-sm cursor-pointer"
          >
            {filterCategories.map(c => (
              <option key={c} value={c} className="bg-gray-900 capitalize">{c === 'all' ? 'All Categories' : (dbCategories.find(cat => cat.id === c)?.name || c)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group"
          >
            <div className="relative h-40 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {product.featured && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-purple-500/90 text-xs font-semibold">Featured</span>
              )}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-blue-500/50 transition-colors cursor-pointer">
                  <HiPencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-red-500/50 transition-colors cursor-pointer">
                  <HiTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-white/40 capitalize mt-0.5">{product.category}</p>
                </div>
                <p className="font-bold text-sm shrink-0">₹{product.price?.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-white/40">Stock: {product.stock}</span>
                <span className="text-xs text-white/40">⭐ {product.rating} ({product.reviews})</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-white/30">
          <HiSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No products found</p>
        </div>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Price ($)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Stock</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm">
                    <option value="" className="bg-gray-900" disabled>Select category</option>
                    {dbCategories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Image URL</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded border-white/20 accent-purple-500" />
                  <span className="text-sm text-white/60">Featured product</span>
                </label>
                <motion.button type="submit" whileHover={{ scale: 1.01 }} className="btn-primary w-full text-sm">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
