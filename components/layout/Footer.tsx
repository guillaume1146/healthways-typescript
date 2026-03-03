// components/layout/Footer.tsx
// Updated: 
// - Updated the short disclaimer section at the bottom to use the provided short version text.
// - Kept the existing links to /privacy, /terms, /medical-disclaimer (full disclaimer will be on /medical-disclaimer page).
// - Made the short disclaimer more prominent and linked to full pages.
import Link from 'next/link'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

interface FooterLink {
  href: string
  label: string
}

interface SocialLink {
  href: string
  icon: React.ReactNode
  label: string
}

const Footer: React.FC = () => {
  const quickLinks: FooterLink[] = [
    { href: '/search/doctors', label: 'Find Doctors' },
    { href: '/search/medicines', label: 'Buy Medicines' },
    { href: '/signup', label: 'Get Started' },
    { href: '/login', label: 'Sign In' },
  ]

  const ourServices: FooterLink[] = [
    { href: '/search/doctors', label: 'Online Consultation' },
    { href: '/search/medicines', label: 'Medicine Delivery' },
    { href: '/search/doctors', label: 'Find Specialists' },
    { href: '/signup', label: 'Join as Provider' },
  ]

  const aboutLinks: FooterLink[] = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/medical-disclaimer', label: 'Medical Disclaimer' },
    { href: '/login', label: 'Provider Login' },
  ]

  const socialLinks: SocialLink[] = [
    { href: '#', icon: <FaFacebookF />, label: 'Facebook' },
    { href: '#', icon: <FaTwitter />, label: 'Twitter' },
    { href: '#', icon: <FaInstagram />, label: 'Instagram' },
    { href: '#', icon: <FaLinkedinIn />, label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-gradient-footer-dark text-white">
      {/* Footer Content - with much darker overlay */}
      <div className="bg-black/60 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-white p-2 rounded-xl">
                  <span className="text-2xl">❤️</span>
                </div>
                <span className="text-2xl font-bold text-white">Healthwyz</span>
              </div>
              <p className="text-white/90 mb-6 leading-relaxed">
                Your trusted healthcare platform connecting patients with qualified doctors and providing 
                AI-powered health insights for better wellness in Mauritius.
              </p>
              <div className="flex items-center space-x-2 text-white/80 mb-2">
                <FaMapMarkerAlt />
                <span>Port Louis, Mauritius</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80 mb-2">
                <FaPhone />
                <span>+230 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <FaEnvelope />
                <span>info@Healthwyz.mu</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-semibold mb-4 text-white">Quick Links</h5>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h5 className="text-lg font-semibold mb-4 text-white">Our Services</h5>
              <ul className="space-y-2">
                {ourServices.map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="text-white/80 hover:text-white transition">
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h5 className="text-lg font-semibold mb-4 text-white">About</h5>
              <ul className="space-y-2">
                {aboutLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/80 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links and Follow */}
          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-white/80 mb-2">Follow us:</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-white/80 mb-2">Stay updated:</p>
                <div className="flex max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-l-xl text-gray-700 outline-none border-2 border-green-500 focus:border-green-400"
                  />
                  <button className="btn-gradient px-6 py-2 rounded-r-xl rounded-l-none font-semibold text-white">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright - All in one line */}
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <div className="flex flex-wrap justify-center items-center gap-1 text-white/80 text-sm">
              <span>© 2025 Healthwyz. All rights reserved.</span>
              <span className="hidden md:inline mx-2">|</span>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <span className="hidden md:inline mx-2">|</span>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
              <span className="hidden md:inline mx-2">|</span>
              <Link href="/medical-disclaimer" className="hover:text-white transition">
                Medical Disclaimer
              </Link>
            </div>
          </div>

          {/* Updated Medical Disclaimer (Short Version) */}
          <div className="mt-8 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <p className="text-sm text-white/90">
              <strong>Disclaimer:</strong> HealthWyz is a platform that connects users with licensed healthcare providers. HealthWyz does not provide medical care. Consultations, prescriptions, and tests are the sole responsibility of your chosen provider. By using this platform, you acknowledge and agree to our <Link href="/terms" className="underline hover:text-white">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>. For full details, see our <Link href="/medical-disclaimer" className="underline hover:text-white">Medical Disclaimer</Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer