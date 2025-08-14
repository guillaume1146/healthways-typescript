import Link from 'next/link'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'

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
    { href: '/about', label: 'About Us' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ]

  const socialLinks: SocialLink[] = [
    { href: '#', icon: <FaFacebookF />, label: 'Facebook' },
    { href: '#', icon: <FaTwitter />, label: 'Twitter' },
    { href: '#', icon: <FaInstagram />, label: 'Instagram' },
    { href: '#', icon: <FaLinkedinIn />, label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h5 className="text-xl font-bold mb-4">Healthways</h5>
            <p className="text-gray-400 mb-4">
              Your trusted healthcare platform in Mauritius. Quality healthcare at your fingertips.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-bold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-xl font-bold mb-4">Contact Info</h5>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center space-x-2">
                <FaPhone />
                <span>+230 123 4567</span>
              </p>
              <p className="flex items-center space-x-2">
                <FaEnvelope />
                <span>support@healthways.mu</span>
              </p>
              <p className="flex items-center space-x-2">
                <FaMapMarkerAlt />
                <span>Port Louis, Mauritius</span>
              </p>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <div className="text-center text-gray-400">
          <p>
            © 2024 Healthways. All rights reserved. Made with{' '}
            <FaHeart className="inline text-red-500" /> in Mauritius
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer