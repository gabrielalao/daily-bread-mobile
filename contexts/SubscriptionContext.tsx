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

// RevenueCat API Keys from environment variables
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
  const userRegion = Localization.getLocales()[0]?.regionCode || 'US';
  const isInPaidRegion = SUBSCRIPTION_CONFIG.PAID_REGIONS.includes(userRegion as any);

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Initialize RevenueCat
      const apiKey = Platform.OS === 'ios' 
        ? REVENUECAT_API_KEY.ios 
        : REVENUECAT_API_KEY.android;

      if (!apiKey) {
        console.error('❌ RevenueCat API key not found. Check your .env file.');
        setIsLoading(false);
        return;
      }

      Purchases.configure({ apiKey });
      console.log('✅ RevenueCat configured for', Platform.OS);

      // Get current customer info
      const info = await Purchases.getCustomerInfo();
      updateCustomerInfo(info);

      // Get available offerings
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOfferings(offerings.current);
        console.log('✅ Loaded subscription offerings:', offerings.current.availablePackages.length, 'packages');
      } else {
        console.warn('⚠️ No current offering found. Make sure products are configured in RevenueCat.');
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
    console.log('💳 Subscription status:', hasActiveSubscription ? 'Active ✅' : 'Inactive ❌');
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
