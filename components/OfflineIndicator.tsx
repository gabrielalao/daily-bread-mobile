import colors from '@/constants/colors';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export function OfflineIndicator() {
  const { isOffline } = useNetworkStatus();
  const [slideAnim] = useState(new Animated.Value(-60));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setIsVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [isOffline, slideAnim]);

  if (!isVisible && !isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <WifiOff size={16} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.text}>You&apos;re offline</Text>
        <Text style={styles.subtext}>Some features may be limited</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: colors.light.error,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  subtext: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500' as const,
    opacity: 0.9,
  },
});
