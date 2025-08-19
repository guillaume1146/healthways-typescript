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
    { href: '/doctors', label: 'Find Doctors' },
    { href: '/medicines', label: 'Buy Medicines' },
    { href: '/ai-search', label: 'AI Health Search' },
    { href: '/contact', label: 'Contact Us' },
  ]

  const ourServices: FooterLink[] = [
    { href: '/services/consultation', label: 'Online Consultation' },
    { href: '/services/delivery', label: 'Medicine Delivery' },
    { href: '/services/ai', label: 'Health AI Assistant' },
    { href: '/services/secure', label: 'Secure Platform' },
  ]

  const specialties: FooterLink[] = [
    { href: '/specialties/general', label: 'General Medicine' },
    { href: '/specialties/cardiology', label: 'Cardiology' },
    { href: '/specialties/dermatology', label: 'Dermatology' },
    { href: '/specialties/pediatrics', label: 'Pediatrics' },
    { href: '/specialties/gynecology', label: 'Gynecology' },
    { href: '/specialties/orthopedics', label: 'Orthopedics' },
    { href: '/specialties/psychiatry', label: 'Psychiatry' },
    { href: '/specialties/ayurveda', label: 'Ayurveda' },
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

            {/* Specialties */}
            <div>
              <h5 className="text-lg font-semibold mb-4 text-white">Specialties</h5>
              <ul className="space-y-2">
                {specialties.map((specialty) => (
                  <li key={specialty.href}>
                    <Link href={specialty.href} className="text-white/80 hover:text-white transition">
                      {specialty.label}
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

          {/* Medical Disclaimer */}
          <div className="mt-8 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <p className="text-sm text-white/90">
              <strong>Medical Disclaimer:</strong> Medicine purchases must be taken on doctor&apos;s prescription. 
              This platform provides general health information for educational purposes only. 
              Always consult qualified healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer