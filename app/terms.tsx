import colors from "@/constants/colors";
import { useContent } from "@/contexts/ContentContext";
import { translateTextCached } from "@/utils/translate";
import { t } from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { FileText } from "lucide-react-native";
import React from "react";
import { useFocusEffect } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TermsScreen() {
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
        title: "Terms of Service",
        subtitle: "User Agreement & Guidelines",
        lastUpdated: `Last updated: ${new Date().toLocaleDateString(lang)}`,
        intro:
          `Welcome to Christian Daily Bread! These Terms of Service ("Terms") govern your use of our mobile application, website, and services. By using Christian Daily Bread, you agree to be bound by these Terms. Please read them carefully.`,
        s1t: "Use of Service",
        s1b: "Christian Daily Bread is available for personal, non-commercial use. You are responsible for complying with these Terms.",
        s2t: "Intellectual Property",
        s2b: "Christian Daily Bread and its content are protected by intellectual property laws. You may not copy, reproduce, or distribute any content from Christian Daily Bread without our prior written consent.",
        s3t: "Disclaimer of Warranties",
        s3b: 'Christian Daily Bread is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, express or implied.',
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
              <FileText size={32} color={colors.light.primary} />
            </View>
            <Text style={styles.title}>{tr.title ?? "Terms of Service"}</Text>
            <Text style={styles.subtitle}>{tr.subtitle ?? "User Agreement & Guidelines"}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.lastUpdated}>{tr.lastUpdated ?? `Last updated: ${new Date().toLocaleDateString(lang)}`}</Text>

            <Text style={styles.intro}>
              {tr.intro ?? `Welcome to Christian Daily Bread! These Terms of Service ("Terms") govern your use of our mobile application, website, and services. By using Christian Daily Bread, you agree to be bound by these Terms. Please read them carefully.`}
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tr.s1t ?? "Use of Service"}</Text>
              <Text style={styles.sectionText}>
                {tr.s1b ?? "Christian Daily Bread is available for personal, non-commercial use. You are responsible for complying with these Terms."}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tr.s2t ?? "Intellectual Property"}</Text>
              <Text style={styles.sectionText}>
                {tr.s2b ?? "Christian Daily Bread and its content are protected by intellectual property laws. You may not copy, reproduce, or distribute any content from Christian Daily Bread without our prior written consent."}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tr.s3t ?? "Disclaimer of Warranties"}</Text>
              <Text style={styles.sectionText}>
                {tr.s3b ?? 'Christian Daily Bread is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, express or implied.'}
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
  lastUpdated: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: 16,
    fontStyle: "italic",
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
