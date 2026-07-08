import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiSave, HiColorSwatch, HiGlobe, HiMail, HiCurrencyRupee } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'LuxeStore',
    storeEmail: 'admin@luxestore.com',
    currency: 'USD',
    taxRate: '10',
    shippingFee: '9.99',
    freeShippingMin: '100',
    primaryColor: '#8b5cf6',
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false,
  })

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Settings saved (demo only)')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your store configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiGlobe className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-sm">General</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Store Name</label>
              <input
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Contact Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleChange('storeEmail', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Commerce */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiCurrencyRupee className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-sm">Commerce</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
              >
                <option value="USD" className="bg-gray-900">USD ($)</option>
                <option value="EUR" className="bg-gray-900">EUR (€)</option>
                <option value="GBP" className="bg-gray-900">GBP (£)</option>
                <option value="INR" className="bg-gray-900">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => handleChange('taxRate', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Shipping Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={settings.shippingFee}
                onChange={(e) => handleChange('shippingFee', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Free Shipping Min ($)</label>
              <input
                type="number"
                step="1"
                value={settings.freeShippingMin}
                onChange={(e) => handleChange('freeShippingMin', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiColorSwatch className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold text-sm">Appearance</h3>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm font-mono"
              />
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <h3 className="font-semibold text-sm mb-4">Features</h3>
          <div className="space-y-3">
            {[
              { key: 'enableReviews', label: 'Product Reviews', desc: 'Allow customers to leave reviews' },
              { key: 'enableWishlist', label: 'Wishlist', desc: 'Allow customers to save products' },
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to visitors', danger: true },
            ].map(toggle => (
              <label key={toggle.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div>
                  <p className={`text-sm font-medium ${toggle.danger && settings[toggle.key] ? 'text-red-400' : ''}`}>
                    {toggle.label}
                  </p>
                  <p className="text-xs text-white/30">{toggle.desc}</p>
                </div>
                <div className={`relative w-10 h-5 rounded-full transition-colors ${settings[toggle.key] ? (toggle.danger ? 'bg-red-500' : 'bg-purple-500') : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings[toggle.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  <input
                    type="checkbox"
                    checked={settings[toggle.key]}
                    onChange={(e) => handleChange(toggle.key, e.target.checked)}
                    className="sr-only"
                  />
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Save */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <HiSave className="w-4 h-4" /> Save Settings
        </motion.button>
      </form>
    </div>
  )
}
