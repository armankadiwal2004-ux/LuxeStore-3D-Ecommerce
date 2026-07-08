import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiUser } from 'react-icons/hi'
import { registerUser } from '../firebase/config'
import toast, { Toaster } from 'react-hot-toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const passwordRules = [
    { label: 'At least 8 characters', test: (value) => value.length >= 8 },
    { label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
    { label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
    { label: 'One number', test: (value) => /[0-9]/.test(value) },
    { label: 'One special character', test: (value) => /[!@#$%^&*(),.?"{}|<>]/.test(value) },
  ]

  const passedRulesCount = passwordRules.filter((rule) => rule.test(password)).length
  const isPasswordValid = passwordRules.length === passedRulesCount
  const passwordStatus = password
    ? isPasswordValid
      ? 'Strong password — ready to go!'
      : `Password strength: ${passedRulesCount}/${passwordRules.length}`
    : 'Use a strong password for your account.'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!isPasswordValid) {
      toast.error('Password does not meet the strength requirements')
      return
    }
    setLoading(true)
    try {
      await registerUser(email, password, name)
      toast.success('Account created successfully!')
      navigate('/')
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
              <span className="text-2xl font-bold text-white">L</span>
            </motion.div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-white/50 text-sm mt-1">Join the LuxeStore experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 cursor-pointer"
                >
                  {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-3 space-y-1 text-xs text-white/50">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password)
                  return (
                    <p key={rule.label} className={passed ? 'text-green-300' : 'text-white/40'}>
                      {passed ? '✓' : '•'} {rule.label}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
