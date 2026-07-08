import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiCheckCircle } from 'react-icons/hi'
import { resetPassword } from '../firebase/config'
import toast, { Toaster } from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      toast.success('Password reset email sent. Check your inbox.')
      setEmail('')
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              <HiCheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-white/50 text-sm mt-1">Enter your email and we&apos;ll send a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
