export const PAYMENT_METHODS = {
  MCB_JUICE: {
    id: 'mcb_juice',
    name: 'MCB Juice',
    icon: '/icons/mcb-juice.svg',
    enabled: true,
    apiEndpoint: process.env.MCB_JUICE_API
  },
  VISA: {
    id: 'visa',
    name: 'Visa',
    icon: '/icons/visa.svg',
    enabled: true
  },
  MASTERCARD: {
    id: 'mastercard',
    name: 'Mastercard',
    icon: '/icons/mastercard.svg',
    enabled: true
  }
}