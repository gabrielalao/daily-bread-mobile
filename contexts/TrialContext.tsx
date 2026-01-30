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
