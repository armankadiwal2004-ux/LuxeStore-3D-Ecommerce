import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiStar, HiLightningBolt, HiShieldCheck } from 'react-icons/hi'
import HeroScene from '../components/HeroScene'
import ProductCard from '../components/ProductCard'
import { useProductStore } from '../hooks/useStore'
import { useInView } from '../hooks/useCustomHooks'
import { Toaster } from 'react-hot-toast'

// Stagger animation container
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Home() {
  const products = useProductStore(s => s.products)
  const featured = products.filter(p => p.featured).slice(0, 4)
  const [featuredRef, featuredInView] = useInView()
  const [benefitsRef, benefitsInView] = useInView()

  const benefits = [
    { icon: HiLightningBolt, title: 'Lightning Fast', desc: 'Same-day delivery on all orders placed before 2 PM.' },
    { icon: HiShieldCheck, title: 'Secure Shopping', desc: 'Enterprise-grade encryption protects every transaction.' },
    { icon: HiStar, title: 'Premium Quality', desc: 'Hand-picked products from world-renowned brands.' },
  ]

  return (
    <div className="relative">
      <Toaster position="top-center" />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/30 to-gray-950 z-10" />

        {/* Hero content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6"
            >
              ✨ The Future of Shopping
            </motion.span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Experience
              </span>
              <br />
              <span className="glow-text">Premium Tech</span>
              <br />
              <span className="text-white/80">in 3D</span>
            </h1>

            <p className="text-lg text-white/50 mb-8 max-w-lg">
              Explore our curated collection with immersive 3D previews. Touch, rotate, and feel every product before you buy.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2"
                >
                  Shop Now <HiArrowRight />
                </motion.button>
              </Link>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary"
                >
                  View Collection
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 sm:gap-8 mt-12"
            >
              {[
                { num: '10K+', label: 'Happy Customers' },
                { num: '500+', label: 'Products' },
                { num: '4.9', label: 'Avg Rating' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-purple-400">{stat.num}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={featuredRef}>
        <motion.div
          initial="hidden"
          animate={featuredInView ? 'show' : 'hidden'}
          variants={container}
        >
          <motion.div variants={item} className="text-center mb-12">
            <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Curated for you</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Featured Products</h2>
            <p className="text-white/50 mt-3 max-w-md mx-auto">Handpicked premium tech that defines the future.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <motion.div variants={item} className="text-center mt-10">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center gap-2"
              >
                View All Products <HiArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={benefitsRef}>
        <motion.div
          initial="hidden"
          animate={benefitsInView ? 'show' : 'hidden'}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {benefits.map((b, i) => (
            <motion.div key={i} variants={item} className="glass-card p-8 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-purple-500/20">
                <b.icon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-white/50">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-6 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Ready to Experience the Future?</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Join thousands of satisfied customers. Your next favorite gadget is waiting.</p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
