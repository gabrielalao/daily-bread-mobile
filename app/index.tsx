import colors from "@/constants/colors";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Heart, MessageCircle, Sparkles, ArrowRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HAS_SEEN_LANDING_KEY = '@daily_bread_has_seen_landing';

export default function LandingPage() {
  console.log('LandingPage rendering');
  const [isChecking, setIsChecking] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        console.log('Checking if user has seen landing page');
        const hasSeenLanding = await AsyncStorage.getItem(HAS_SEEN_LANDING_KEY);
        
        if (hasSeenLanding === 'true') {
          console.log('User has seen landing, redirecting to home');
          router.replace('/(tabs)/home');
        } else {
          console.log('First time user, showing landing page');
          setIsChecking(false);
          startAnimations();
        }
      } catch (error) {
        console.error('Error checking first time:', error);
        setIsChecking(false);
        startAnimations();
      }
    };

    const startAnimations = () => {
      console.log('LandingPage animation starting');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    };

    checkFirstTime();
  }, [fadeAnim, slideAnim, scaleAnim]);

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </View>
    );
  }

  const features = [
    {
      icon: BookOpen,
      title: "Daily Devotionals",
      description: "Grow spiritually with personalized Scripture-based messages",
      color: "#2A9D8F", // Vibrant Teal
      bgColor: "#2A9D8F",
    },
    {
      icon: Heart,
      title: "Biblical Therapy",
      description: "AI-powered healing rooted in God's Word and grace",
      color: "#6A4C93", // Deep Purple
      bgColor: "#6A4C93",
    },
    {
      icon: MessageCircle,
      title: "Prayer Guidance",
      description: "Find comfort and strength through guided prayers",
      color: "#D9896A", // Coral
      bgColor: "#D9896A",
    },
    {
      icon: Sparkles,
      title: "Bible Study",
      description: "Deepen your faith with curated study materials",
      color: "#5B7BB4", // Soft Blue
      bgColor: "#5B7BB4",
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <BookOpen size={48} color={colors.light.primary} strokeWidth={2.5} />
              </View>
            </View>
            
            <Text style={styles.appName}>Christian Daily Bread</Text>
            <Text style={styles.tagline}>
              Nourishing Your Soul, One Day at a Time
            </Text>
            <Text style={styles.verse}>
              &quot;Man shall not live by bread alone, but by every word that comes from the mouth of God.&quot;
            </Text>
            <Text style={styles.verseReference}>Matthew 4:4</Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Your Journey to Healing</Text>
            <Text style={styles.sectionSubtitle}>
              Faith-based guidance and support for your spiritual and emotional wellbeing
            </Text>

            <View style={styles.featuresGrid}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <View key={index} style={[styles.featureCard, { backgroundColor: feature.bgColor }]}>
                    <View style={styles.featureIconContainer}>
                      <Icon size={28} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.benefitsSection}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Process trauma through biblical wisdom</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Break generational curses with God&apos;s power</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Find peace in financial planning</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Build a hopeful future rooted in faith</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={async () => {
              try {
                console.log('Saving landing page seen flag');
                await AsyncStorage.setItem(HAS_SEEN_LANDING_KEY, 'true');
                console.log('Navigating to home');
                router.replace("/(tabs)/home");
              } catch (error) {
                console.error('Error saving landing page flag:', error);
                router.replace("/(tabs)/home");
              }
            }}
          >
            <View style={styles.ctaGradient}>
              <Text style={styles.ctaText}>Begin Your Journey</Text>
              <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          </Pressable>

          <Text style={styles.footer}>
            Free • Private • Faith-Based
          </Text>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  heroSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.light.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: `${colors.light.primary}40`,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800" as const,
    color: colors.light.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
    marginBottom: 32,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  verse: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.light.textSecondary,
    fontStyle: "italic" as const,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.primary,
    textAlign: "center",
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.9)",
  },
  benefitsSection: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.light.borderLight,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light.primary,
  },
  benefitText: {
    fontSize: 15,
    color: colors.light.textSecondary,
    fontWeight: "500" as const,
    flex: 1,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
    backgroundColor: colors.light.primary,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 14,
    color: colors.light.textTertiary,
    textAlign: "center",
    fontWeight: "500" as const,
  },
});
