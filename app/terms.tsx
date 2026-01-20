import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import colors from "@/constants/colors";

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.light.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Daily Bread Terms of Service</Text>
        <Text style={styles.subtitle}>User Agreement & Guidelines</Text>
        <Text style={styles.lastModified}>Last modified on December 14, 2025</Text>

        <Text style={styles.paragraph}>
          Welcome to Daily Bread! These Terms of Service ("Terms") govern your use of our mobile application, website, and services. By using Daily Bread, you agree to be bound by these Terms. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>Use of Service</Text>
        <Text style={styles.paragraph}>
          Daily Bread is available for personal, non-commercial use. You are responsible for complying with these Terms.
        </Text>

        <Text style={styles.subsectionTitle}>Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content on Daily Bread is protected by intellectual property laws and cannot be copied, reproduced, or distributed without prior written consent.
        </Text>

        <Text style={styles.sectionTitle}>Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          Daily Bread is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, express or implied.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            Daily Bread's AI-powered conversations provide emotional support and biblical guidance based on scripture and Christian principles. This service does not replace professional mental health care, medical advice, or pastoral counseling.
          </Text>
          <Text style={styles.infoText}>
            If you are experiencing a mental health crisis, thoughts of self-harm, or severe distress, please contact a licensed mental health professional, your healthcare provider, or a crisis hotline immediately.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>FAQ</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: Is Daily Bread free to download and use?</Text>
          <Text style={styles.faqAnswer}>A: Yes, Daily Bread is completely free to download and use, with no hidden fees or subscriptions.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: Do I need to create an account to use Daily Bread?</Text>
          <Text style={styles.faqAnswer}>A: No, you don't need to sign up or log in to use Daily Bread. Just download and start exploring!</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: How often is new content added?</Text>
          <Text style={styles.faqAnswer}>A: We refresh our therapy resources and devotions daily to support your ongoing journey.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: What kind of therapy resources are available?</Text>
          <Text style={styles.faqAnswer}>A: Daily Bread offers Christ-centered therapy resources, including devotions, scriptural reflections, and spiritual guidance for mental and emotional well-being.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: Is Daily Bread available on multiple devices?</Text>
          <Text style={styles.faqAnswer}>A: Yes, Daily Bread is available on iOS and Android devices.</Text>
        </View>

        <Text style={styles.sectionTitle}>Partnerships</Text>
        <Text style={styles.paragraph}>
          Daily Bread is seeking partnerships with churches, Christian faith organizations, and individuals to support our mission. Your support will help us provide free therapy services and resources to those in need.
        </Text>
        <Text style={styles.paragraph}>
          If you're interested in partnering with us, please contact us at support@dailybread.app.
        </Text>

        <Text style={styles.sectionTitle}>Donations</Text>
        <Text style={styles.paragraph}>
          Your donation will help us continue to provide free Christian therapy resources and services to those who need them. Please send us an email at support@dailybread.app.
        </Text>

        <Text style={styles.sectionTitle}>Free Christian Therapy Services</Text>
        <Text style={styles.paragraph}>
          Daily Bread is committed to providing free therapy services to those who cannot afford it. If you need support, please contact us at support@dailybread.app or call us at +1 512 500 5160. We'll do our best to connect you with a licensed therapist.
        </Text>

        <Text style={styles.sectionTitle}>Partner with Us</Text>
        <Text style={styles.paragraph}>
          Are you a licensed therapist passionate about providing faith-based services? We're looking for therapists to partner with us and provide Christian therapy services on our app. If you're interested in joining our team, please contact us at support@dailybread.app.
        </Text>
        <View style={styles.requirementsList}>
          <Text style={styles.requirement}>• Must be a licensed therapist (LCSW, LPC, LMFT, etc.)</Text>
          <Text style={styles.requirement}>• Share our mission to provide Christ-centered therapy services</Text>
          <Text style={styles.requirement}>• Committed to providing high-quality, compassionate care</Text>
        </View>

        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <Text style={styles.paragraph}>We're here to help you the best way we can.</Text>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Linking.openURL('mailto:support@dailybread.app')}
        >
          <Text style={styles.contactLabel}>✉️ Email</Text>
          <Text style={styles.contactValue}>support@dailybread.app</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>© {new Date().getFullYear()} Christian Daily Bread. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: colors.light.primary,
    fontWeight: "600" as const,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  lastModified: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.light.textSecondary,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.warning,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textSecondary,
  },
  requirementsList: {
    marginBottom: 16,
  },
  requirement: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  contactButton: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.primary,
  },
  footer: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginTop: 32,
  },
});
