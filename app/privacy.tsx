import colors from "@/constants/colors";
import { useContent } from "@/contexts/ContentContext";
import { translateTextCached } from "@/utils/translate";
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
  const { userPreferences } = useContent();
  const lang = userPreferences.appLanguage;
  const [tr, setTr] = React.useState<Record<string, string>>({});

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTr({});
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") return;

      const base = {
        title: "Privacy Policy",
        subtitle: "Protecting Your Data",
        intro: "At Daily Bread, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your data.",
        s1t: "Data Collection",
        s1b: "We collect minimal data to improve our services. No personal data is required to use Daily Bread.",
        s2t: "Data Use",
        s2b: "We use data to improve our services and personalize your experience.",
        s3t: "Data Protection",
        s3b: "We implement reasonable security measures to protect your data.",
      };

      const entries = await Promise.all(
        Object.entries(base).map(async ([k, v]) => {
          const res = await translateTextCached({ text: v, targetLang: lang });
          return [k, res.text] as const;
        })
      );
      if (cancelled) return;
      setTr(Object.fromEntries(entries));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [lang, userPreferences.autoTranslateContent]);

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
            <Text style={styles.title}>{tr.title ?? "Privacy Policy"}</Text>
            <Text style={styles.subtitle}>{tr.subtitle ?? "Protecting Your Data"}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.intro}>
              {tr.intro ?? "At Daily Bread, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your data."}
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tr.s1t ?? "Data Collection"}</Text>
              <Text style={styles.sectionText}>
                {tr.s1b ?? "We collect minimal data to improve our services. No personal data is required to use Daily Bread."}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tr.s2t ?? "Data Use"}</Text>
              <Text style={styles.sectionText}>
                {tr.s2b ?? "We use data to improve our services and personalize your experience."}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tr.s3t ?? "Data Protection"}</Text>
              <Text style={styles.sectionText}>
                {tr.s3b ?? "We implement reasonable security measures to protect your data."}
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
