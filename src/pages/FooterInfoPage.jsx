import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiClock, HiMail, HiOutlineChatAlt2, HiPhone } from 'react-icons/hi'
import ProductCard from '../components/ProductCard'
import { useProductStore } from '../hooks/useStore'

const pageContent = {
  'new-arrivals': {
    title: 'New Arrivals',
    category: 'Shop',
    intro: 'Explore the latest products added to LuxeStore.',
    description: 'Freshly added items are shown here first so the page reflects what is actually new in the store.',
    cta: { to: '/products', label: 'Browse All Products' }
  },
  'best-sellers': {
    title: 'Best Sellers',
    category: 'Shop',
    intro: 'See the top-rated and most trusted products in the store.',
    description: 'Best sellers are sorted from highly rated featured items so this page stays different from new arrivals.',
    cta: { to: '/products', label: 'Shop Best Sellers' }
  },
  deals: {
    title: 'Deals',
    category: 'Shop',
    intro: 'Browse products that feel like the best value right now.',
    description: 'Deals are selected using lower-priced items and product descriptions that suggest offers or discounts.',
    cta: { to: '/products', label: 'View Active Deals' }
  },
  'help-center': {
    title: 'Help Center',
    category: 'Support',
    intro: 'Find quick answers, guides, and troubleshooting help for your orders and products.',
    highlights: [
      'Account, payment, and order support topics.',
      'Product setup tips and troubleshooting.',
      'Step-by-step guidance for common issues.'
    ],
    cta: { to: '/contact-us', label: 'Contact Support' }
  },
  returns: {
    title: 'Returns',
    category: 'Support',
    intro: 'We provide a smooth return process designed for confidence and convenience.',
    highlights: [
      'Request returns from your order dashboard.',
      'Transparent eligibility and timeline details.',
      'Fast review and refund processing.'
    ],
    cta: { to: '/orders', label: 'Open Your Orders' }
  },
  shipping: {
    title: 'Shipping',
    category: 'Support',
    intro: 'Track delivery timelines, methods, and updates for every order in one place.',
    highlights: [
      'Standard and priority delivery options.',
      'Order tracking and status notifications.',
      'Regional availability and dispatch windows.'
    ],
    cta: { to: '/orders', label: 'Track Orders' }
  },
  'contact-us': {
    title: 'Contact Us',
    category: 'Support',
    intro: 'Our team is ready to help with your product, delivery, and account questions.',
    contactDetails: {
      phone: ' 8418086908\n7862074937',
      email: 'Anuj@luxestore.com',
      hours: 'Mon - Sat, 9:00 AM - 8:00 PM'
    },
    highlights: [
      'Email support available every day.',
      'Priority response for order-related requests.',
      'Guided assistance for checkout and account issues.'
    ],
    cta: { to: '/help-center', label: 'Visit Help Center' }
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    category: 'Legal',
    intro: 'This Privacy Policy explains how LuxeStore collects, uses, stores, and protects your information when you browse, shop, or interact with our services.',
    effectiveDate: 'April 18, 2026',
    sections: [
      {
        heading: 'Information We Collect',
        points: [
          'Account details such as name, email, phone number, and login credentials.',
          'Order and delivery information including billing address, shipping address, and purchase history.',
          'Usage data such as pages viewed, device type, browser type, and interaction patterns.'
        ]
      },
      {
        heading: 'How We Use Information',
        points: [
          'To process orders, payments, refunds, and delivery updates.',
          'To personalize your experience, improve product recommendations, and support customer service.',
          'To send account notifications, order updates, and service-related messages.'
        ]
      },
      {
        heading: 'Sharing and Protection',
        points: [
          'We do not sell your personal information.',
          'We may share necessary data with payment processors, shipping partners, and service providers only to complete your request.',
          'We use reasonable technical and organizational measures to protect your data from unauthorized access or misuse.'
        ]
      },
      {
        heading: 'Your Rights',
        points: [
          'You can access, correct, or update your account information.',
          'You can request account deletion or unsubscribe from marketing emails at any time.',
          'You may contact us for privacy concerns, data access requests, or clarification about how your data is used.'
        ]
      }
    ],
    cta: { to: '/register', label: 'Create Account' }
  },
  'terms-of-service': {
    title: 'Terms of Service',
    category: 'Legal',
    intro: 'These Terms of Service govern your use of the LuxeStore website, products, and checkout experience.',
    sections: [
      {
        heading: 'User Responsibilities',
        points: [
          'Provide accurate account and order information.',
          'Keep your login credentials secure and notify us of unauthorized account access.',
          'Do not misuse the website, attempt to disrupt services, or perform unauthorized activity.'
        ]
      },
      {
        heading: 'Orders and Payments',
        points: [
          'Orders are subject to product availability and payment confirmation.',
          'Prices, discounts, and offers may change without prior notice.',
          'We may cancel orders in case of payment issues, stock unavailability, or suspected fraud.'
        ]
      },
      {
        heading: 'Returns and Cancellations',
        points: [
          'Return eligibility depends on product condition, category, and return window.',
          'Cancellation may be possible before dispatch depending on order status.',
          'Refunds are processed according to the original payment method and applicable timelines.'
        ]
      },
      {
        heading: 'Liability',
        points: [
          'We provide the platform and services on an as-available basis.',
          'LuxeStore is not responsible for delays caused by external delivery, payment, or network providers.',
          'To the extent permitted by law, our liability is limited to the value of the affected order.'
        ]
      }
    ],
    cta: { to: '/products', label: 'Continue Shopping' }
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    category: 'Legal',
    intro: 'LuxeStore uses cookies and similar technologies to run the site, improve performance, and remember your preferences.',
    sections: [
      {
        heading: 'Types of Cookies We Use',
        points: [
          'Essential cookies for login, cart, checkout, and basic navigation.',
          'Preference cookies to remember language, theme, and shopping settings.',
          'Analytics cookies to understand traffic, performance, and product interest.'
        ]
      },
      {
        heading: 'Why We Use Them',
        points: [
          'To keep your session secure and your cart persistent.',
          'To improve page speed, feature quality, and shopping experience.',
          'To analyze how visitors use the website so we can make better product and content decisions.'
        ]
      },
      {
        heading: 'Managing Cookies',
        points: [
          'You can control or delete cookies through your browser settings.',
          'Disabling some cookies may affect login, cart, or checkout functionality.',
          'You can clear stored cookies anytime from your browser or device settings.'
        ]
      }
    ],
    cta: { to: '/privacy-policy', label: 'Read Privacy Policy' }
  }
}

const pageStyles = {
  'new-arrivals': {
    accent: 'from-cyan-500/20 via-transparent to-purple-500/20',
    badge: 'New',
    emptyTitle: 'No new products yet',
    emptyText: 'As soon as new items are added in Firebase, they will appear here automatically.'
  },
  'best-sellers': {
    accent: 'from-amber-500/20 via-transparent to-pink-500/20',
    badge: 'Popular',
    emptyTitle: 'No best sellers found',
    emptyText: 'Once products have ratings and featured tags, this page will fill up automatically.'
  },
  deals: {
    accent: 'from-emerald-500/20 via-transparent to-cyan-500/20',
    badge: 'Deal',
    emptyTitle: 'No deals available',
    emptyText: 'When discounted or value-friendly products exist, they will be listed here.'
  }
}

function getProductGroups(products) {
  const safeProducts = [...products].filter(Boolean)
  const now = Date.now()

  const newArrivals = [...safeProducts]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 8)

  const bestSellers = [...safeProducts]
    .sort((a, b) => {
      const featuredScore = (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      if (featuredScore !== 0) return featuredScore
      const ratingScore = (Number(b.rating) || 0) - (Number(a.rating) || 0)
      if (ratingScore !== 0) return ratingScore
      return (b.reviews || 0) - (a.reviews || 0)
    })
    .slice(0, 8)

  const deals = [...safeProducts]
    .filter(product => {
      const name = `${product.name || ''} ${product.description || ''}`.toLowerCase()
      return Boolean(product.discount || product.salePrice || product.offerPrice || name.includes('deal') || name.includes('offer') || name.includes('discount'))
    })
    .sort((a, b) => {
      const discountA = Number(a.discount) || 0
      const discountB = Number(b.discount) || 0
      if (discountA !== discountB) return discountB - discountA
      return (Number(a.price) || Number.MAX_SAFE_INTEGER) - (Number(b.price) || Number.MAX_SAFE_INTEGER)
    })
    .slice(0, 8)

  const dealFallback = [...safeProducts]
    .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    .slice(0, 8)

  return {
    newArrivals: newArrivals.length ? newArrivals : safeProducts.slice(0, 8),
    bestSellers: bestSellers.length ? bestSellers : safeProducts.slice(0, 8),
    deals: deals.length ? deals : dealFallback
  }
}

export default function FooterInfoPage({ slug }) {
  const content = pageContent[slug]
  const products = useProductStore(s => s.products)
  const loading = useProductStore(s => s.loading)

  if (!content) {
    return <Navigate to="/" replace />
  }

  const productGroups = getProductGroups(products)
  const pageStyle = pageStyles[slug]

  if (pageStyle) {
    const currentProducts = productGroups[
      slug === 'new-arrivals' ? 'newArrivals' : slug === 'best-sellers' ? 'bestSellers' : 'deals'
    ]

    return (
      <div className="min-h-screen pt-24 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden glass-card p-6 sm:p-8 lg:p-10"
        >
          <div className={`absolute inset-0 bg-linear-to-br ${pageStyle.accent} pointer-events-none`} />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="max-w-3xl">
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {content.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold mt-4">{content.title}</h1>
              <p className="text-white/60 mt-4 text-base sm:text-lg leading-relaxed max-w-2xl">{content.intro}</p>
              <p className="text-white/40 mt-3 text-sm sm:text-base max-w-2xl">{content.description}</p>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white/90">{pageStyle.badge} Picks</h2>
                  <p className="text-sm text-white/45">Showing products based on live store data.</p>
                </div>
                <Link to="/products" className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                  View All Products
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
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
              ) : currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                  <h3 className="text-xl font-semibold text-white">{pageStyle.emptyTitle}</h3>
                  <p className="text-white/50 mt-2 max-w-xl mx-auto">{pageStyle.emptyText}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={content.cta.to} className="btn-primary">
                {content.cta.label}
              </Link>
              <Link to="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (slug === 'contact-us' && content.contactDetails) {
    return (
      <div className="min-h-screen pt-24 pb-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden glass-card p-6 sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 via-transparent to-pink-500/10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start">
            <div>
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {content.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold mt-4">{content.title}</h1>
              <p className="text-white/60 mt-4 text-base sm:text-lg leading-relaxed max-w-2xl">{content.intro}</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <HiPhone className="w-5 h-5 text-purple-300 mb-3" />
                  <p className="text-xs uppercase tracking-wider text-white/35">Call Us</p>
                  <a href={`tel:${content.contactDetails.phone.replace(/\s+/g, '')}`} className="mt-1 block text-lg font-semibold text-white hover:text-purple-300 transition-colors">
                    {content.contactDetails.phone}
                  </a>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <HiMail className="w-5 h-5 text-purple-300 mb-3" />
                  <p className="text-xs uppercase tracking-wider text-white/35">Email</p>
                  <a href={`mailto:${content.contactDetails.email}`} className="mt-1 block text-lg font-semibold text-white hover:text-purple-300 transition-colors break-all">
                    {content.contactDetails.email}
                  </a>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <HiClock className="w-5 h-5 text-purple-300 mb-3" />
                  <p className="text-xs uppercase tracking-wider text-white/35">Hours</p>
                  <p className="mt-1 text-lg font-semibold text-white">{content.contactDetails.hours}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white/90 mb-3">Quick Overview</h2>
                <ul className="space-y-2 text-white/65 list-disc pl-6">
                  {content.highlights.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${content.contactDetails.phone.replace(/\s+/g, '')}`} className="btn-primary inline-flex items-center gap-2">
                  Call Now <HiArrowRight />
                </a>
                <Link to={content.cta.to} className="btn-secondary inline-flex items-center gap-2">
                  {content.cta.label} <HiOutlineChatAlt2 />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white">Send a Message</h2>
              <p className="text-sm text-white/50 mt-2">Use this box as a quick support starter. You can connect this to email or Firebase later.</p>

              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                />
                <textarea
                  rows="5"
                  placeholder="How can we help you?"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
                <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                  Submit Request <HiArrowRight />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 sm:p-10"
      >
        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          {content.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-4">{content.title}</h1>
        <p className="text-white/55 mt-4 leading-relaxed">{content.intro}</p>

        {content.effectiveDate && (
          <p className="mt-4 text-sm text-white/35">
            Effective Date: {content.effectiveDate}
          </p>
        )}

        {content.sections ? (
          <div className="mt-8 space-y-5">
            {content.sections.map(section => (
              <section key={section.heading} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-white/90 mb-3">{section.heading}</h2>
                <ul className="space-y-2 text-white/60 list-disc pl-6">
                  {section.points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white/90 mb-3">Quick Overview</h2>
            <ul className="space-y-2 text-white/60 list-disc pl-6">
              {content.highlights.map(point => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={content.cta.to} className="btn-primary">
            {content.cta.label}
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}