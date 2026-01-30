// Product IDs - MUST match App Store Connect & Play Console
export const SUBSCRIPTION_PRODUCTS = {
  MONTHLY: 'monthly_30',
  ANNUAL: 'yearly_365',
} as const;

export const SUBSCRIPTION_CONFIG = {
  TRIAL_DAYS: 7,
  MONTHLY_PRICE: '$1.99',
  ANNUAL_PRICE: '$9.99',
  ANNUAL_MONTHLY_EQUIVALENT: '$0.83',
  
  // Regional restrictions (same as macOS app)
  PAID_REGIONS: [
    'US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 
    'AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'TW', 
    'BR', 'MX', 'IN'
  ],
} as const;

export type SubscriptionProduct = typeof SUBSCRIPTION_PRODUCTS[keyof typeof SUBSCRIPTION_PRODUCTS];
