import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

interface NetworkStatusDotProps {
  isOnline?: boolean;
}

export const NetworkStatusDot = memo(({ isOnline = true }: NetworkStatusDotProps) => {
  return (
    <View style={[
      styles.dot,
      { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }
    ]} />
  );
});

NetworkStatusDot.displayName = 'NetworkStatusDot';

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
