import colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Shield } from "lucide-react-native";
import React from "react";
import { useFocusEffect } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PrivacyScreen() {
  const scrollRef = React.useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.light.background, colors.light.cardBackground]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Shield size={32} color={colors.light.primary} />
            </View>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.subtitle}>Protecting Your Data</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.intro}>
              At Daily Bread, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your data.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Collection</Text>
              <Text style={styles.sectionText}>
                We collect minimal data to improve our services. No personal data is required to use Daily Bread.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Use</Text>
              <Text style={styles.sectionText}>
                We use data to improve our services and personalize your experience.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Protection</Text>
              <Text style={styles.sectionText}>
                We implement reasonable security measures to protect your data.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    lineHeight: 22,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  intro: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
  },
});
