import { Link } from 'react-router-dom'

export default function Footer() {
  const shopLinks = [
    { label: 'Products', to: '/products' },
    { label: 'New Arrivals', to: '/new-arrivals' },
    { label: 'Best Sellers', to: '/best-sellers' },
    { label: 'Deals', to: '/deals' },
  ]

  const supportLinks = [
    { label: 'Help Center', to: '/help-center' },
    { label: 'Returns', to: '/returns' },
    { label: 'Shipping', to: '/shipping' },
    { label: 'Contact Us', to: '/contact-us' },
  ]

  const legalLinks = [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Cookie Policy', to: '/cookie-policy' },
  ]

  const socialLinks = [
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
  ]

  return (
    <footer className="glass mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              LuxeStore
            </Link>
            <p className="mt-3 text-sm text-white/50">
              Premium tech products with an immersive 3D shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/40 hover:text-purple-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/40 hover:text-purple-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/40 hover:text-purple-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2026 LuxeStore. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/30 hover:text-purple-400 transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
