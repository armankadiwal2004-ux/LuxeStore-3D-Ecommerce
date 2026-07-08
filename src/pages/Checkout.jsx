import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCreditCard, HiCheckCircle } from 'react-icons/hi'
import { useCartStore, useAuthStore, useOrderStore } from '../hooks/useStore'
import toast, { Toaster } from 'react-hot-toast'

const RAZORPAY_KEY_ID = 'rzp_test_SeXgahXI6ejmd2'

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore()
  const user = useAuthStore(s => s.user)
  const placeOrder = useOrderStore(s => s.placeOrder)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  })

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items.length, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const subtotal = getTotal()
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const handleRazorpayPayment = () => {
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }
    if (!form.name || !form.email || !form.address || !form.city || !form.zip) {
      toast.error('Please fill all shipping details')
      return
    }

    setLoading(true)

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(total * 100), // Razorpay expects amount in paise
      currency: 'INR',
      name: 'LuxeStore',
      description: `Order — ${items.length} item(s)`,
      image: '/favicon.svg',
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: {
        color: '#8b5cf6',
      },
      handler: async (response) => {
        // Payment successful — place the order
        try {
          await placeOrder({
            userId: user.uid,
            userName: form.name,
            userEmail: form.email,
            shippingAddress: { address: form.address, city: form.city, zip: form.zip },
            items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
            subtotal,
            tax,
            total,
            paymentId: response.razorpay_payment_id,
            paymentMethod: 'razorpay',
          })
          await clearCart(user.uid)
          setOrderPlaced(true)
          toast.success('Payment successful! Order placed.')
        } catch {
          toast.error('Payment received but order failed to save. Contact support.')
        } finally {
          setLoading(false)
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false)
          toast.error('Payment cancelled')
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      setLoading(false)
      toast.error(response.error?.description || 'Payment failed. Please try again.')
    })
    rzp.open()
  }

  // Success state
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <HiCheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed and will be processed shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/orders')}
              className="btn-primary cursor-pointer"
            >
              View Orders
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/products')}
              className="btn-secondary cursor-pointer"
            >
              Continue Shopping
            </motion.button>
          </div>
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
        Checkout
      </motion.h1>

      <form onSubmit={(e) => { e.preventDefault(); handleRazorpayPayment() }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">ZIP Code</label>
                  <input name="zip" value={form.zip} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
                </div>
              </div>
            </motion.div>

            {/* Payment info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <HiCreditCard className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Payment</h3>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="w-8 h-8" />
                <div>
                  <p className="text-sm font-medium">Razorpay Secure Payment</p>
                  <p className="text-xs text-white/40">UPI, Cards, Net Banking, Wallets — all supported</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2">
                  <span>Total</span>
                  <span className="text-purple-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  )
}
