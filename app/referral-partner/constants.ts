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

export const mockReferralPartnerData: ReferralPartnerData = {
  name: "Sarah Marketing Pro",
  email: "sarah.marketing@example.com", 
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SMP&backgroundColor=8b5cf6",
  memberSince: "2024-01-15",
  partnerLevel: "Gold",
  promoCode: "SARAH2025",
  stats: {
    totalEarnings: 125750,
    totalReferrals: 347,
    conversionRate: 12.8,
    thisMonthEarnings: 18500,
    thisMonthReferrals: 52,
    pendingPayouts: 5200
  },
  earnings: {
    totalRevenue: 125750,
    paidOut: 120550,
    pending: 5200,
    nextPayoutDate: "2025-09-01"
  },
  leadsBySource: [
    {
      source: "Facebook",
      visitors: 1250,
      conversions: 178,
      conversionRate: 14.2,
      earnings: 42750,
      utmLink: "https://healthwyz.mu/signup?utm_source=facebook&utm_medium=social&utm_campaign=sarah_referral&promo=SARAH2025"
    },
    {
      source: "Instagram", 
      visitors: 980,
      conversions: 124,
      conversionRate: 12.7,
      earnings: 31200,
      utmLink: "https://healthwyz.mu/signup?utm_source=instagram&utm_medium=social&utm_campaign=sarah_referral&promo=SARAH2025"
    },
    {
      source: "TikTok",
      visitors: 750,
      conversions: 89,
      conversionRate: 11.9,
      earnings: 22250,
      utmLink: "https://healthwyz.mu/signup?utm_source=tiktok&utm_medium=social&utm_campaign=sarah_referral&promo=SARAH2025"
    },
    {
      source: "WhatsApp",
      visitors: 420,
      conversions: 67,
      conversionRate: 16.0,
      earnings: 18750,
      utmLink: "https://healthwyz.mu/signup?utm_source=whatsapp&utm_medium=messaging&utm_campaign=sarah_referral&promo=SARAH2025"
    },
    {
      source: "Direct/Email",
      visitors: 320,
      conversions: 45,
      conversionRate: 14.1,
      earnings: 10800,
      utmLink: "https://healthwyz.mu/signup?utm_source=email&utm_medium=direct&utm_campaign=sarah_referral&promo=SARAH2025"
    }
  ],
  recentConversions: [
    {
      id: "conv1",
      customerName: "John Smith",
      planType: "Premium Care",
      conversionDate: "2025-08-25",
      commission: 500,
      status: "pending"
    },
    {
      id: "conv2", 
      customerName: "Maria Garcia",
      planType: "Basic Health",
      conversionDate: "2025-08-24", 
      commission: 250,
      status: "paid"
    },
    {
      id: "conv3",
      customerName: "David Chen",
      planType: "Corporate Wellness",
      conversionDate: "2025-08-23",
      commission: 750,
      status: "processing"
    },
    {
      id: "conv4",
      customerName: "Emma Wilson",
      planType: "Premium Care", 
      conversionDate: "2025-08-22",
      commission: 500,
      status: "paid"
    }
  ]
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

// Mock settings data
export const mockReferralPartnerSettings: ReferralPartnerSettings = {
  name: "Sarah Marketing Pro",
  email: "sarah.marketing@example.com",
  phone: "+230 5234 5678", 
  address: "789 Marketing Street, Port Louis, Mauritius",
  dateOfBirth: "1990-06-15",
  businessType: "Individual Marketer",
  taxId: "TAX-987654321"
}

export const mockBillingSettings: BillingSettings = {
  accountType: "MCB Juice",
  accountDetails: {
    accountNumber: "•••• •••• 9876",
    accountName: "Sarah Marketing Pro", 
    bankName: "MCB"
  },
  mcbJuiceNumber: "+230 5234 5678",
  payoutFrequency: "monthly"
}

export const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: true, 
  conversionAlerts: true,
  payoutNotifications: true,
  weeklyReports: true,
  marketingTips: true
}