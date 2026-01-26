import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TypingIndicatorProps {
  style?: any;
}

export const TypingIndicator = memo(({ style }: TypingIndicatorProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dotContainer}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
    </View>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});
