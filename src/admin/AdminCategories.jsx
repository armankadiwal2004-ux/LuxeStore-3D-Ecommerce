import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX, HiSearch, HiCollection } from 'react-icons/hi'
import { dbSet, dbRemove, dbListen, dbGet } from '../firebase/config'
import { useProductStore } from '../hooks/useStore'
import { categories as seedCategories } from '../firebase/seedData'
import toast from 'react-hot-toast'

const emptyCategory = { name: '', icon: '📦', description: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyCategory)
  const [search, setSearch] = useState('')
  const products = useProductStore(s => s.products)
  const seeded = useRef(false)

  useEffect(() => {
    // Seed defaults only once on first mount if no categories exist
    const seedOnce = async () => {
      const existing = await dbGet('categories')
      if (!existing && !seeded.current) {
        seeded.current = true
        const defaults = seedCategories.filter(c => c.id !== 'all')
        for (const cat of defaults) {
          await dbSet(`categories/${cat.id}`, { name: cat.name, icon: cat.icon, description: '' })
        }
      }
    }
    seedOnce()

    const unsub = dbListen('categories', (data) => {
      if (data) {
        const arr = Object.entries(data).map(([id, v]) => ({ ...v, id }))
        setCategories(arr)
      } else {
        setCategories([])
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const getProductCount = (categoryId) =>
    products.filter(p => p.category === categoryId).length

  const handleNew = () => {
    setForm(emptyCategory)
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (cat) => {
    setForm({ name: cat.name, icon: cat.icon || '📦', description: cat.description || '' })
    setEditingId(cat.id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const id = editingId || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (!id) {
      toast.error('Invalid category name')
      return
    }
    try {
      await dbSet(`categories/${id}`, { name: form.name, icon: form.icon, description: form.description })
      toast.success(editingId ? 'Category updated!' : 'Category added!')
      setShowForm(false)
    } catch {
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (cat) => {
    const count = getProductCount(cat.id)
    if (count > 0) {
      toast.error(`Cannot delete "${cat.name}" — ${count} product${count > 1 ? 's' : ''} still assigned`)
      return
    }
    if (!window.confirm(`Delete category "${cat.name}"?`)) return
    try {
      await dbRemove(`categories/${cat.id}`)
      toast.success('Category deleted')
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const emojiOptions = ['📦', '🎧', '⌚', '💻', '🖱️', '📱', '🎮', '📷', '🖥️', '⌨️', '🔌', '🛍️', '👟', '👕', '🏠', '🔧']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-white/40 text-sm mt-1">{categories.length} total categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNew}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <HiPlus className="w-4 h-4" /> Add Category
        </motion.button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 max-w-md">
        <HiSearch className="w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="bg-transparent border-none outline-none text-sm flex-1 placeholder-white/30"
        />
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((cat, i) => {
          const count = getProductCount(cat.id)
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {cat.icon || '📦'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{cat.id}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1.5 rounded-lg hover:bg-blue-500/20 text-white/40 hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {cat.description && (
                <p className="text-xs text-white/30 mt-3 line-clamp-2">{cat.description}</p>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <HiCollection className="w-3.5 h-3.5" />
                  <span>{count} product{count !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-white/30">
          <HiCollection className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{search ? 'No categories match your search' : 'No categories yet — add one!'}</p>
        </div>
      )}

      {/* Category Form Modal */}
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
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{editingId ? 'Edit Category' : 'New Category'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Audio"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setForm({ ...form, icon: emoji })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                          form.icon === emoji
                            ? 'bg-purple-500/30 border-2 border-purple-500 scale-110'
                            : 'bg-white/5 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="Optional short description"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm resize-none"
                  />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.01 }} className="btn-primary w-full text-sm">
                  {editingId ? 'Update Category' : 'Add Category'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
