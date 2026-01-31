import colors from "@/constants/colors";
import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { A11yText as Text } from "@/components/A11yText";

export function PremiumLockedScreen({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/paywall")} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Subscribe to Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(tabs)/home")} activeOpacity={0.85}>
          <Text style={styles.secondaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: colors.light.text,
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textSecondary,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800" as const,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.light.cardBackgroundSecondary,
  },
  secondaryButtonText: {
    color: colors.light.text,
    fontSize: 15,
    fontWeight: "700" as const,
  },
});

