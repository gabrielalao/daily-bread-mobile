import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Mail } from "lucide-react-native";
import colors from "@/constants/colors";

export default function SupportScreen() {
  const handleEmail = () => {
    const email = 'support@dailybread.app';
    const subject = 'CDB Therapy - Support Request';
    const body = 'Hello, I need help with...';
    
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      .catch(() => {
        Alert.alert('Contact Us', `Please email us at: ${email}`);
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.light.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.subtitle}>We&apos;re here to help you the best way we can.</Text>

        {/* Contact Options */}
        <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
          <View style={styles.iconContainer}>
            <Mail size={24} color={colors.light.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Email Us</Text>
            <Text style={styles.contactValue}>support@dailybread.app</Text>
          </View>
        </TouchableOpacity>

        {/* Free Therapy Services */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Free Christian Therapy Services</Text>
          <Text style={styles.infoText}>
            CDB Therapy is committed to providing free therapy services to those who cannot afford it. If you need support, please contact us. We&apos;ll do our best to connect you with a licensed therapist.
          </Text>
        </View>

        {/* Partner with Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partner with Us</Text>
          <Text style={styles.paragraph}>
            Are you a licensed therapist passionate about providing faith-based services? We&apos;re looking for therapists to partner with us and provide Christian therapy services on our app.
          </Text>
          <View style={styles.requirementsList}>
            <Text style={styles.requirement}>• Must be a licensed therapist (LCSW, LPC, LMFT, etc.)</Text>
            <Text style={styles.requirement}>• Share our mission to provide Christ-centered therapy services</Text>
            <Text style={styles.requirement}>• Committed to providing high-quality, compassionate care</Text>
          </View>
          <TouchableOpacity style={styles.ctaButton} onPress={handleEmail}>
            <Text style={styles.ctaButtonText}>Contact Us to Partner</Text>
          </TouchableOpacity>
        </View>

        {/* Partnerships */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partnerships</Text>
          <Text style={styles.paragraph}>
            CDB Therapy is seeking partnerships with churches, Christian faith organizations, and individuals to support our mission. Your support will help us provide free therapy services and resources to those in need.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleEmail}>
            <Text style={styles.ctaButtonText}>Become a Partner</Text>
          </TouchableOpacity>
        </View>

        {/* Donations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Our Mission</Text>
          <Text style={styles.paragraph}>
            Your donation will help us continue to provide free Christian therapy resources and services to those who need them.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleEmail}>
            <Text style={styles.ctaButtonText}>Support CDB Therapy</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© {new Date().getFullYear()} CDB Therapy. All rights reserved.</Text>
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
    fontSize: 16,
    color: colors.light.textSecondary,
    marginBottom: 24,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.cardBackgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
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
  infoBox: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.success,
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
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.light.textSecondary,
    marginBottom: 16,
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
  ctaButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  footer: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginTop: 32,
  },
});
