// Product IDs - MUST match App Store Connect & Play Console
export const SUBSCRIPTION_PRODUCTS = {
  PREMIUM: 'cdb_premium',
} as const;

export const SUBSCRIPTION_CONFIG = {
  TRIAL_DAYS: 7,
  PREMIUM_PRICE: '$9.99',
  PREMIUM_PERIOD: 'year',
  
  // Regional restrictions (same as macOS app)
  PAID_REGIONS: [
    'US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 
    'AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'TW', 
    'BR', 'MX', 'IN'
  ],
} as const;

export type SubscriptionProduct = typeof SUBSCRIPTION_PRODUCTS[keyof typeof SUBSCRIPTION_PRODUCTS];
