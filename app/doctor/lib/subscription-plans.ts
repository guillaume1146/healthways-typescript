export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 10 patients/month',
      'Basic consultation features',
      'Email support'
    ],
    default: true
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 4999,
    features: [
      'Unlimited patients',
      'Video consultations',
      'Priority support',
      'Advanced analytics'
    ]
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 9999,
    features: [
      'Everything in Professional',
      'Multi-clinic support',
      'API access',
      'Custom branding'
    ]
  }
}