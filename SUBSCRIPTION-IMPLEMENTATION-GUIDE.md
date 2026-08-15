# iOS Mobile & Android Subscription Implementation Guide
**Complete guide for implementing subscriptions in CDB Therapy mobile app**

Based on the successful macOS implementation with StoreKit 2.

---

## 📋 Table of Contents

- [Overview](#overview)
- [macOS vs Mobile Comparison](#macos-vs-mobile-comparison)
- [Recommended Approach: RevenueCat](#recommended-approach-revenuecat)
- [Installation & Setup](#installation--setup)
- [Code Implementation](#code-implementation)
- [iOS Setup (App Store Connect)](#ios-setup-app-store-connect)
- [Android Setup (Google Play Console)](#android-setup-google-play-console)
- [Testing Guide](#testing-guide)
- [Implementation Timeline](#implementation-timeline)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Overview

### What We're Implementing

✅ **7-Day Free Trial**
- Starts automatically on first app launch
- Trial countdown banner with days/hours remaining
- Full-screen paywall after trial expires

✅ **Subscription Plans**
- **Monthly:** $1.99/month with 7-day free trial
- **Annual:** $9.99/year with 7-day free trial (58% savings)
- **Family Sharing:** Up to 6 family members

✅ **Cross-Platform**
- Same code works on iOS and Android
- Same product IDs across all platforms
- Single codebase for subscription logic

✅ **Regional Support**
- Subscriptions required in: US, CA, GB, DE, FR, IT, ES, AU, NZ, JP, KR, SG, HK, TW, BR, MX, IN
- Free access in other regions

---

## macOS vs Mobile Comparison

### Architecture Mapping

Your macOS Swift implementation maps directly to React Native:

| macOS Component | Mobile Component | Technology |
|-----------------|------------------|------------|
| `TrialManager.swift` | `contexts/TrialContext.tsx` | Trial tracking |
| `SubscriptionManager.swift` | `contexts/SubscriptionContext.tsx` | Purchase logic |
| `PaywallView.swift` | `app/paywall.tsx` | Paywall screen |
| `TrialBannerView.swift` | `components/TrialBanner.tsx` | Trial banner |
| `Configuration.storekit` | Sandbox testing | Local testing |
| UserDefaults | AsyncStorage | Local storage |

### What Stays the Same

✅ Product ID: `cdb_premium`
✅ Trial duration: 7 days
✅ Pricing: $9.99/year
✅ App Store Connect setup (identical for macOS and iOS)
✅ Trial logic and countdown
✅ Regional restrictions

### What Changes

❌ No native Swift code - Use RevenueCat SDK
❌ React Native UI components instead of SwiftUI
❌ Custom development build required (not Expo Go)
✅ Android support added (Google Play Billing)

---

## Recommended Approach: RevenueCat

### Why RevenueCat?

**Pros:**
- ✅ Handles both iOS (StoreKit) and Android (Play Billing) with same code
- ✅ Server-side receipt validation included
- ✅ Real-time subscription status updates
- ✅ Built-in analytics dashboard
- ✅ Handles edge cases (refunds, renewals, grace periods)
- ✅ Free up to $10k/month in tracked revenue
- ✅ A/B testing for paywalls
- ✅ Proven at scale (used by major apps)

**Cons:**
- External dependency
- Costs money after free tier ($0.01 per tracked dollar after $10k)

**Alternative:** `react-native-iap` (more control, but you handle validation)

**Verdict:** RevenueCat is recommended for your app because:
1. You already have complex features (AI therapy, offline sync)
2. Focus on product, not subscription infrastructure
3. Cross-platform support out of the box
4. Your revenue will likely stay in free tier initially

---

## Installation & Setup

### Step 1: Install Dependencies

```bash
# Install RevenueCat SDK
npm install react-native-purchases

# iOS - Install pods
cd ios && pod install && cd ..

# Note: Requires custom development build (not Expo Go)
```

### Step 2: Create Custom Development Build

**Required because Expo Go doesn't support in-app purchases**

```bash
# Build for iOS
eas build --profile development --platform ios

# Build for Android
eas build --profile development --platform android

# Install on device
eas build:run --profile development --platform ios
```

### Step 3: Update app.json

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-purchases",
        {
          "iOSUsesStoreKit2IfAvailable": true
        }
      ]
    ],
    "ios": {
      "bundleIdentifier": "app.rork.daily-bread-app-mp9wlbr",
      "infoPlist": {
        "SKAdNetworkItems": []
      }
    },
    "android": {
      "package": "app.rork.daily_bread_app_mp9wlbr"
    }
  }
}
```

### Step 4: Create RevenueCat Account

1. Go to [RevenueCat](https://www.revenuecat.com)
2. Sign up for free account
3. Create new project: "CDB Therapy"
4. Get API keys:
   - **iOS API Key:** `appl_xxxxxxxxxxxxxx`
   - **Android API Key:** `goog_xxxxxxxxxxxxxx`
5. Configure products:
   - Product ID: `cdb_premium`
6. Create entitlement: `pro`
7. Link product to entitlement

### Step 5: Add Environment Variables

Create `.env` file:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_your_ios_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_your_android_key_here
```

Update `.gitignore` to exclude API keys:

```
.env
.env.*
```

---

## Code Implementation

### File Structure

Create these new files:

```
/contexts
  ├── TrialContext.tsx              ← 7-day trial management
  └── SubscriptionContext.tsx       ← RevenueCat integration

/app
  └── paywall.tsx                   ← Full-screen paywall modal

/components
  └── TrialBanner.tsx               ← Trial countdown banner

/constants
  └── subscriptions.ts              ← Product IDs & config
```

### 1. Constants (`constants/subscriptions.ts`)

```typescript
// Product IDs - MUST match App Store Connect & Play Console
export const SUBSCRIPTION_PRODUCTS = {
  PREMIUM: 'cdb_premium',
} as const;

export const SUBSCRIPTION_CONFIG = {
  TRIAL_DAYS: 7,
  PREMIUM_PRICE: '$9.99',
  PREMIUM_PERIOD: 'year',
  
  // Regional restrictions (from macOS app)
  PAID_REGIONS: [
    'US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 
    'AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'TW', 
    'BR', 'MX', 'IN'
  ],
} as const;

export type SubscriptionProduct = typeof SUBSCRIPTION_PRODUCTS[keyof typeof SUBSCRIPTION_PRODUCTS];
```

### 2. Trial Context (`contexts/TrialContext.tsx`)

**Direct port of macOS `TrialManager.swift`**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { SUBSCRIPTION_CONFIG } from '@/constants/subscriptions';

const FIRST_LAUNCH_KEY = '@trial_first_launch_date';
const TRIAL_DURATION_MS = SUBSCRIPTION_CONFIG.TRIAL_DAYS * 24 * 60 * 60 * 1000; // 7 days

type TrialStatus = 
  | { status: 'loading' }
  | { status: 'active'; daysLeft: number; hoursLeft: number }
  | { status: 'expired' }
  | { status: 'subscribed' };

interface TrialContextType {
  trialStatus: TrialStatus;
  daysRemaining: number;
  hoursRemaining: number;
  hasAccess: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  checkTrialStatus: () => Promise<void>;
  resetTrial: () => Promise<void>; // Debug only
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export const TrialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({ status: 'loading' });
  const [daysRemaining, setDaysRemaining] = useState(7);
  const [hoursRemaining, setHoursRemaining] = useState(0);

  const checkTrialStatus = async () => {
    try {
      // Get first launch date
      const firstLaunchStr = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      
      // If no first launch date, this IS the first launch
      if (!firstLaunchStr) {
        const now = new Date();
        await AsyncStorage.setItem(FIRST_LAUNCH_KEY, now.toISOString());
        console.log('🎁 Trial started:', now.toISOString());
        
        setTrialStatus({ status: 'active', daysLeft: 7, hoursLeft: 0 });
        setDaysRemaining(7);
        setHoursRemaining(0);
        return;
      }

      const firstLaunchDate = new Date(firstLaunchStr);
      const now = new Date();
      const elapsed = now.getTime() - firstLaunchDate.getTime();
      const remaining = TRIAL_DURATION_MS - elapsed;

      if (remaining <= 0) {
        // Trial expired
        console.log('⏰ Trial expired');
        setTrialStatus({ status: 'expired' });
        setDaysRemaining(0);
        setHoursRemaining(0);
      } else {
        // Trial active
        const daysLeft = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hoursLeft = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        console.log(`🎁 Trial active: ${daysLeft} days, ${hoursLeft} hours remaining`);
        setTrialStatus({ status: 'active', daysLeft, hoursLeft });
        setDaysRemaining(daysLeft);
        setHoursRemaining(hoursLeft);
      }
    } catch (error) {
      console.error('Error checking trial status:', error);
    }
  };

  const resetTrial = async () => {
    // DEBUG ONLY - Remove in production
    if (__DEV__) {
      await AsyncStorage.removeItem(FIRST_LAUNCH_KEY);
      console.log('🔄 Trial reset to day 1');
      await checkTrialStatus();
    }
  };

  useEffect(() => {
    checkTrialStatus();
    
    // Check trial status hourly
    const interval = setInterval(checkTrialStatus, 60 * 60 * 1000);
    
    // Check when app becomes active
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkTrialStatus();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const hasAccess = 
    trialStatus.status === 'active' || 
    trialStatus.status === 'subscribed' ||
    trialStatus.status === 'loading';

  const isTrialActive = trialStatus.status === 'active';
  const isTrialExpired = trialStatus.status === 'expired';

  return (
    <TrialContext.Provider
      value={{
        trialStatus,
        daysRemaining,
        hoursRemaining,
        hasAccess,
        isTrialActive,
        isTrialExpired,
        checkTrialStatus,
        resetTrial,
      }}
    >
      {children}
    </TrialContext.Provider>
  );
};

export const useTrial = () => {
  const context = useContext(TrialContext);
  if (!context) {
    throw new Error('useTrial must be used within TrialProvider');
  }
  return context;
};
```

### 3. Subscription Context (`contexts/SubscriptionContext.tsx`)

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases, { 
  CustomerInfo, 
  PurchasesOffering, 
  PurchasesPackage,
  LOG_LEVEL 
} from 'react-native-purchases';
import { Platform, Alert } from 'react-native';
import { SUBSCRIPTION_PRODUCTS, SUBSCRIPTION_CONFIG } from '@/constants/subscriptions';
import * as Localization from 'expo-localization';

// RevenueCat API Keys (get from RevenueCat dashboard)
const REVENUECAT_API_KEY = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
};

interface SubscriptionContextType {
  isSubscribed: boolean;
  isPro: boolean;
  offerings: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  isInPaidRegion: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is in a paid region
  const isInPaidRegion = SUBSCRIPTION_CONFIG.PAID_REGIONS.includes(
    Localization.region || 'US'
  );

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Initialize RevenueCat
      Purchases.configure({
        apiKey: Platform.OS === 'ios' 
          ? REVENUECAT_API_KEY.ios 
          : REVENUECAT_API_KEY.android,
      });

      // Get current customer info
      const info = await Purchases.getCustomerInfo();
      updateCustomerInfo(info);

      // Get available offerings
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOfferings(offerings.current);
        console.log('✅ Loaded subscription offerings');
      }
    } catch (error) {
      console.error('❌ Error initializing purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfo(info);
    
    // Check if user has active subscription
    const hasActiveSubscription = 
      info.entitlements.active['pro'] !== undefined ||
      Object.keys(info.entitlements.active).length > 0;
    
    setIsSubscribed(hasActiveSubscription);
    console.log('💳 Subscription status:', hasActiveSubscription ? 'Active' : 'Inactive');
  };

  const purchase = async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      console.log('💰 Starting purchase:', pkg.identifier);
      
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      updateCustomerInfo(customerInfo);
      
      if (customerInfo.entitlements.active['pro']) {
        console.log('✅ Purchase successful!');
        Alert.alert(
          'Success!',
          'Welcome to Premium! All features are now unlocked.',
          [{ text: 'OK' }]
        );
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Purchase error:', error);
      
      if (!error.userCancelled) {
        Alert.alert(
          'Purchase Failed',
          error.message || 'Unable to complete purchase. Please try again.',
          [{ text: 'OK' }]
        );
      }
      
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      console.log('🔄 Restoring purchases...');
      
      const info = await Purchases.restorePurchases();
      updateCustomerInfo(info);
      
      if (info.entitlements.active['pro']) {
        Alert.alert(
          'Restored!',
          'Your subscription has been restored successfully.',
          [{ text: 'OK' }]
        );
        return true;
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases to restore.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error: any) {
      console.error('❌ Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isPro: isSubscribed,
        offerings,
        customerInfo,
        isLoading,
        purchase,
        restorePurchases,
        isInPaidRegion,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
```

### 4. Trial Banner Component (`components/TrialBanner.tsx`)

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTrial } from '@/contexts/TrialContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const TrialBanner = () => {
  const router = useRouter();
  const { trialStatus, daysRemaining, hoursRemaining } = useTrial();
  const { isSubscribed } = useSubscription();

  // Don't show if subscribed or loading
  if (isSubscribed || trialStatus.status === 'loading') {
    return null;
  }

  // Don't show if trial expired (paywall will show instead)
  if (trialStatus.status === 'expired') {
    return null;
  }

  const isLastDay = daysRemaining === 0 || (daysRemaining === 1 && hoursRemaining < 24);
  
  const gradientColors = isLastDay
    ? ['#FF6B6B', '#FF8E53'] // Red/Orange warning
    : ['#4ECDC4', '#44A08D']; // Green success

  const icon = isLastDay ? '⏰' : '🎁';
  
  const message = isLastDay
    ? 'Last day! Subscribe to keep access →'
    : `Free Trial: ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;

  return (
    <TouchableOpacity 
      onPress={() => router.push('/paywall')}
      activeOpacity={0.8}
      style={styles.container}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.message}>{message}</Text>
          {!isLastDay && (
            <Text style={styles.cta}>Subscribe</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
```

### 5. Paywall Screen (`app/paywall.tsx`)

```typescript
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTrial } from '@/contexts/TrialContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Check } from 'lucide-react-native';

export default function PaywallScreen() {
  const router = useRouter();
  const { isTrialExpired } = useTrial();
  const { offerings, purchase, restorePurchases, isSubscribed, isLoading } = useSubscription();
  
  const [isPurchasing, setIsPurchasing] = useState(false);

  // If user is subscribed, go back
  React.useEffect(() => {
    if (isSubscribed) {
      router.back();
    }
  }, [isSubscribed]);

  const handlePurchase = async () => {
    if (!offerings) return;
    
    setIsPurchasing(true);
    
    try {
      // Find the Premium package by product ID
      const pkg = offerings.current?.availablePackages?.find(
        (p) => p.product.identifier === 'cdb_premium'
      );
      
      if (pkg) {
        const success = await purchase(pkg);
        if (success) {
          router.back();
        }
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        router.back();
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#2A9D8F', '#264653']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🍃</Text>
            <Text style={styles.title}>
              {isTrialExpired ? 'Your 7-Day Trial Has Ended' : 'Upgrade to Premium'}
            </Text>
            <Text style={styles.subtitle}>
              Continue your spiritual journey
            </Text>
            <Text style={styles.familySharing}>
              👥 Share with up to 6 family members
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Feature text="Daily Devotionals" />
            <Feature text="Complete Bible" />
            <Feature text="AI Therapy" />
            <Feature text="Worship Music" />
            <Feature text="Prayer Guidance" />
            <Feature text="Study Plans" />
          </View>

          {/* Subscription Options */}
          <View style={styles.plans}>
            {/* Annual Plan */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedProduct === 'annual' && styles.planCardSelected
              ]}
              onPress={() => setSelectedProduct('annual')}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <View style={styles.radioOuter}>
                  {selectedProduct === 'annual' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>Annual - $9.99/year</Text>
                  <Text style={styles.planDetail}>Only $0.83/month</Text>
                </View>
                <View style={styles.bestValue}>
                  <Text style={styles.bestValueText}>Best Value</Text>
                </View>
              </View>
              <Text style={styles.familyBadge}>👥 Family</Text>
            </TouchableOpacity>

            {/* Monthly Plan */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedProduct === 'monthly' && styles.planCardSelected
              ]}
              onPress={() => setSelectedProduct('monthly')}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <View style={styles.radioOuter}>
                  {selectedProduct === 'monthly' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>Monthly - $1.99/month</Text>
                </View>
              </View>
              <Text style={styles.familyBadge}>👥 Family</Text>
            </TouchableOpacity>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.subscribeButton, isPurchasing && styles.subscribeButtonDisabled]}
            onPress={handlePurchase}
            disabled={isPurchasing}
            activeOpacity={0.8}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.subscribeButtonText}>✓ Subscribe Now</Text>
            )}
          </TouchableOpacity>

          {/* Restore Button */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isPurchasing}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            Auto-renews unless cancelled
          </Text>
          <View style={styles.links}>
            <TouchableOpacity onPress={() => router.push('/terms')}>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.linkDivider}>•</Text>
            <TouchableOpacity onPress={() => router.push('/privacy')}>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const Feature = ({ text }: { text: string }) => (
  <View style={styles.feature}>
    <Check size={20} color="#4ECDC4" strokeWidth={3} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  familySharing: {
    fontSize: 15,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  features: {
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 17,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  plans: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planDetail: {
    fontSize: 14,
    color: '#4ECDC4',
    marginTop: 2,
  },
  bestValue: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#264653',
  },
  familyBadge: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#264653',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  footer: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 24,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  link: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  linkDivider: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    marginHorizontal: 8,
  },
});
```

### 6. Integrate into App

**Update `app/_layout.tsx`:**

```typescript
import { TrialProvider } from '@/contexts/TrialContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ScheduledSessionsProvider>
          <ContentProvider>
            {/* Add subscription providers */}
            <SubscriptionProvider>
              <TrialProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <RootLayoutNav />
                </GestureHandlerRootView>
              </TrialProvider>
            </SubscriptionProvider>
          </ContentProvider>
        </ScheduledSessionsProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
```

**Update `app/(tabs)/_layout.tsx` to add Trial Banner:**

```typescript
import { TrialBanner } from '@/components/TrialBanner';
import { useTrial } from '@/contexts/TrialContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  const { isTrialExpired } = useTrial();
  const { isSubscribed } = useSubscription();
  const router = useRouter();

  // Show paywall if trial expired and not subscribed
  React.useEffect(() => {
    if (isTrialExpired && !isSubscribed) {
      router.push('/paywall');
    }
  }, [isTrialExpired, isSubscribed]);

  return (
    <View style={{ flex: 1 }}>
      <TrialBanner />
      <Tabs
        screenOptions={{
          // your existing options
        }}
      >
        {/* your tabs */}
      </Tabs>
    </View>
  );
}
```

---

## iOS Setup (App Store Connect)

### Critical: Same Setup as macOS ✅

**Good news:** iOS mobile uses the exact same App Store Connect configuration as your macOS app!

### Step 1: Accept Paid Apps Agreement

⚠️ **This is why apps get rejected!**

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click your name → **Agreements, Tax, and Banking**
3. Find **"Paid Applications Agreement"**
4. If status is "Action Required":
   - Click "View"
   - Review and Accept
   - Complete tax forms (W-8BEN or W-9)
   - Add banking info
   - Wait 24-48 hours for approval

### Step 2: Create Subscription Group

1. App Store Connect → Your App → **Subscriptions**
2. Click "+" → **Create Subscription Group**
3. Name: "Premium Access"
4. Click "Create"

### Step 3: Create Premium Subscription (Yearly)

1. Click "+" inside the group
2. **Product ID:** `cdb_premium` ⚠️ **MUST BE EXACTLY THIS**
3. **Reference Name:** Premium
4. **Duration:** 1 year
5. **Pricing:** $9.99
6. **Localization:**
   - Display Name: Premium
   - Description: Premium access. Includes 7-day free trial.
7. **Free Trial:** 7 days
8. **Family Sharing:** ON
9. Status: "Ready to Submit"

### Step 5: Link Subscriptions to App Version ⚠️

**This is the #1 reason for rejection!**

1. App Store Connect → App Store → **[Your Version]**
2. Scroll to "In-App Purchases and Subscriptions"
3. Click "+"
4. Select:
   - ✅ cdb_premium
5. Click "Done"
6. **Save**

**⚠️ Must do this for EVERY new version!**

### Step 6: Upload Build

```bash
# Update version number in app.json
# Build: 7 → 8
# Version: 6.0.1 → 6.0.2

# Create production build
eas build --platform ios --profile production

# Wait for build to complete (10-30 minutes)
# Build will auto-upload to App Store Connect

# Wait for processing (10-30 minutes)
# Check status in TestFlight section
```

### Step 7: Select Build & Submit

1. App Store Connect → App Store → Your Version
2. Build section → "Select a build"
3. Choose your latest build
4. **Save**
5. Click "Submit for Review"

---

## Android Setup (Google Play Console)

### Good News: RevenueCat Handles Both! ✅

Same code works on Android with Google Play Billing.

### Step 1: Create Subscription Products

1. **Google Play Console** → Your App → **Monetize → Subscriptions**
2. Click **"Create subscription"**

**Premium Subscription (Yearly):**
```
Subscription ID: cdb_premium
Name: Premium
Description: Premium access (yearly)
```

3. Click **"Add base plan"**
```
Base plan ID: yearly
Billing period: 1 year (P1Y)
Price: $9.99 USD
```

4. Click **"Add offer"** (Free trial)
```
Offer ID: trial
Eligibility: New customers only
Free trial: 7 days
```

5. Click **"Activate"**

### Step 2: Set Up License Testers

1. Google Play Console → **Setup → License testing**
2. Add Gmail addresses
3. Save

Testers can purchase without charges.

### Step 3: Submit for Testing

```bash
# Build Android
eas build --platform android --profile production

# Submit to Internal Testing
eas submit --platform android --track internal

# Add testers in Play Console
# Internal Testing → Testers → Add emails

# Test purchases with license tester accounts
```

### Step 4: Promote to Production

After testing works:
1. Internal Testing → Promote to Production
2. Fill out store listing
3. Submit for review

---

## Testing Guide

### Local Testing (Development)

**Speed Up Trial for Testing:**

```typescript
// In contexts/TrialContext.tsx
// Temporarily change line with TRIAL_DURATION_MS:

// PRODUCTION (7 days):
const TRIAL_DURATION_MS = SUBSCRIPTION_CONFIG.TRIAL_DAYS * 24 * 60 * 60 * 1000;

// TESTING (1 minute):
const TRIAL_DURATION_MS = 60 * 1000;

// Run app, wait 1 minute, paywall appears
// ⚠️ CHANGE BACK BEFORE PRODUCTION!
```

**Or Reset Trial:**

```typescript
// In debug console (React Native Debugger):
import { useTrial } from '@/contexts/TrialContext';
const { resetTrial } = useTrial();
await resetTrial();
```

### iOS TestFlight Testing

1. **Create Sandbox Tester:**
   - App Store Connect → Users → Sandbox Testers
   - Create test account (`test1@yourdomain.com`)

2. **Sign Out of Production Apple ID:**
   - iPhone Settings → Apple ID → Sign Out

3. **Install from TestFlight**

4. **Test Purchase:**
   - Trial starts
   - Wait for trial to expire (or shorten duration)
   - Paywall appears
   - Click Subscribe
   - Sign in with sandbox tester
   - **Purchase is FREE** (test environment)

### Android Internal Testing

1. **Add License Testers:**
   - Play Console → License Testing
   - Add Gmail addresses

2. **Install via Internal Testing Link**

3. **Test Purchase:**
   - Use license tester Gmail
   - **Purchase is FREE**

---

## Implementation Timeline

### Week 1: Core Implementation
- [ ] Day 1: Install dependencies (RevenueCat, expo-purchases)
- [ ] Day 1-2: Create TrialContext (port from macOS)
- [ ] Day 2-3: Create SubscriptionContext (RevenueCat)
- [ ] Day 3-4: Build PaywallScreen
- [ ] Day 4-5: Build TrialBanner
- [ ] Day 5: Integrate into app layout

### Week 2: Testing
- [ ] Day 1-2: Local testing (shorten trial)
- [ ] Day 2-3: iOS TestFlight testing
- [ ] Day 3-4: Android Internal Testing
- [ ] Day 4-5: Bug fixes and polish

### Week 3: Store Setup & Launch
- [ ] Day 1: Create subscriptions in App Store Connect
- [ ] Day 1: Create subscriptions in Play Console
- [ ] Day 2: Build production versions
- [ ] Day 3: Submit iOS for review
- [ ] Day 3: Submit Android for review
- [ ] Day 4-7: Address feedback

---

## Troubleshooting

### Issue: "Cannot locate in-app purchases"

**Cause:** Product IDs mismatch or not linked to version

**Solution:**
1. Verify code product ID: `cdb_premium`
2. Verify App Store Connect product IDs match
3. Verify subscriptions are linked to version
4. Rebuild and resubmit

### Issue: Trial not starting

**Check:**
1. TrialProvider is in app tree
2. AsyncStorage permissions
3. First launch date in storage

**Debug:**
```typescript
// Check if trial started
await AsyncStorage.getItem('@trial_first_launch_date');
// Should return date or null
```

### Issue: Paywall not showing after trial

**Check:**
1. TrialContext is checking status
2. Router navigation is working
3. Trial actually expired

**Force expire:**
```typescript
// Set trial duration to -1 in TrialContext
const TRIAL_DURATION_MS = -1;
```

### Issue: Products not loading

**iOS:**
- Wait 2-4 hours after creating products
- Verify products are "Ready to Submit"
- Check product IDs match code

**Android:**
- Verify subscriptions are "Active"
- Check base plans exist
- Verify license tester setup

---

## Next Steps

### Immediate Actions

1. **Set up RevenueCat:**
   - [ ] Create account
   - [ ] Get iOS API key
   - [ ] Get Android API key
   - [ ] Configure products

2. **Start iOS implementation:**
   - [ ] Install dependencies
   - [ ] Create contexts
   - [ ] Build UI
   - [ ] Test locally

3. **App Store Connect setup:**
   - [ ] Accept paid agreement
   - [ ] Create subscriptions
   - [ ] Link to version

### Resources

- [RevenueCat Documentation](https://www.revenuecat.com/docs)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Billing](https://developer.android.com/google/play/billing)
- [React Native Purchases](https://github.com/RevenueCat/react-native-purchases)

---

## 🚨 Critical Reminders

1. **Product IDs must be identical everywhere:**
   - Code: `cdb_premium`
   - App Store Connect: `cdb_premium`
   - Play Console: `cdb_premium`
   - RevenueCat: `cdb_premium`

2. **Custom development build required**
   - Expo Go does NOT support IAP
   - Use `eas build --profile development`

3. **Link subscriptions to version** (iOS)
   - Must do for EVERY new version
   - #1 cause of rejection

4. **Trial duration in production**
   - Always 7 days in production
   - Only shorten for testing

5. **Environment variables**
   - Never commit API keys
   - Use `.env` file
   - Add to `.gitignore`

---

## Summary Checklist

### Code Implementation
- [ ] Create `constants/subscriptions.ts`
- [ ] Create `contexts/TrialContext.tsx`
- [ ] Create `contexts/SubscriptionContext.tsx`
- [ ] Create `components/TrialBanner.tsx`
- [ ] Create `app/paywall.tsx`
- [ ] Update `app/_layout.tsx` (providers)
- [ ] Update `app/(tabs)/_layout.tsx` (banner)
- [ ] Install dependencies
- [ ] Configure app.json
- [ ] Add environment variables

### RevenueCat Setup
- [ ] Create account
- [ ] Create project
- [ ] Get iOS API key
- [ ] Get Android API key
- [ ] Configure products
- [ ] Create entitlement

### iOS Setup
- [ ] Accept Paid Apps Agreement
- [ ] Create subscription group
- [ ] Create `cdb_premium` subscription
- [ ] Enable family sharing
- [ ] Link to app version
- [ ] Build and submit

### Android Setup
- [ ] Create `cdb_premium` subscription
- [ ] Add license testers
- [ ] Test internal testing
- [ ] Submit for review

### Testing
- [ ] Local testing (shortened trial)
- [ ] iOS sandbox testing
- [ ] iOS TestFlight testing
- [ ] Android license testing
- [ ] Android internal testing

---

**Document Version:** 1.0  
**Last Updated:** January 30, 2026  
**Status:** Ready for Implementation

**Good luck with your subscription implementation! 🚀**

For questions, refer to:
1. This guide
2. macOS implementation (successful reference)
3. RevenueCat documentation
4. Apple/Google documentation
