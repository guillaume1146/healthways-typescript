import { 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaTwitter, 
  FaYoutube, 
  FaWhatsapp,
  FaLinkedin,
  FaEnvelope,
  FaGlobe
} from 'react-icons/fa'
import { 
  ReferralPartnerData, 
  UTMSource, 
  ReferralPartnerSettings,
  BillingSettings,
  NotificationSettings
} from './types'

export const emptyReferralPartnerData: ReferralPartnerData = {
  name: '', email: '', avatar: '', memberSince: '',
  partnerLevel: 'Bronze', promoCode: '',
  stats: {
    totalEarnings: 0, totalReferrals: 0, conversionRate: 0,
    thisMonthEarnings: 0, thisMonthReferrals: 0, pendingPayouts: 0
  },
  earnings: {
    totalRevenue: 0, paidOut: 0, pending: 0, nextPayoutDate: ''
  },
  leadsBySource: [],
  recentConversions: []
}

export const utmSources: UTMSource[] = [
  {
    name: "Facebook",
    platform: "facebook",
    icon: FaFacebook,
    color: "bg-blue-600"
  },
  {
    name: "Instagram", 
    platform: "instagram",
    icon: FaInstagram,
    color: "bg-pink-500"
  },
  {
    name: "TikTok",
    platform: "tiktok", 
    icon: FaTiktok,
    color: "bg-black"
  },
  {
    name: "Twitter",
    platform: "twitter",
    icon: FaTwitter,
    color: "bg-blue-400"
  },
  {
    name: "YouTube",
    platform: "youtube",
    icon: FaYoutube, 
    color: "bg-red-600"
  },
  {
    name: "WhatsApp",
    platform: "whatsapp",
    icon: FaWhatsapp,
    color: "bg-green-500"
  },
  {
    name: "LinkedIn",
    platform: "linkedin",
    icon: FaLinkedin,
    color: "bg-blue-700"
  },
  {
    name: "Email",
    platform: "email",
    icon: FaEnvelope,
    color: "bg-gray-600"
  },
  {
    name: "Website",
    platform: "website",
    icon: FaGlobe,
    color: "bg-purple-600"
  }
]

export const emptyReferralPartnerSettings: ReferralPartnerSettings = {
  name: '', email: '', phone: '', address: '',
  dateOfBirth: '', businessType: '', taxId: ''
}

export const emptyBillingSettings: BillingSettings = {
  accountType: 'MCB Juice',
  accountDetails: { accountNumber: '', accountName: '', bankName: '' },
  mcbJuiceNumber: '', payoutFrequency: 'monthly'
}

export const emptyNotificationSettings: NotificationSettings = {
  emailNotifications: true, smsNotifications: true,
  conversionAlerts: true, payoutNotifications: true,
  weeklyReports: true, marketingTips: true
}