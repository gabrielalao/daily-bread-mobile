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
  
  const gradientColors: [string, string] = isLastDay
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
