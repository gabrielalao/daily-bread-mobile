import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useContent } from "@/contexts/ContentContext";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { showOfflineOnlineInfoPrompt } from "@/utils/networkPolicy";

export function NetworkStatusDot(props: { size?: number }) {
  const size = props.size ?? 10;
  const { userPreferences, setOfflineModeEnabled } = useContent();
  const { isOnline } = useNetworkStatus();

  const isGreen = !userPreferences.offlineModeEnabled && isOnline;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={isGreen ? "Online" : "Offline"}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={() => showOfflineOnlineInfoPrompt({ offlineModeEnabled: userPreferences.offlineModeEnabled, setOfflineModeEnabled })}
      style={styles.touch}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isGreen ? "#2ECC71" : "#E74C3C",
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
});

