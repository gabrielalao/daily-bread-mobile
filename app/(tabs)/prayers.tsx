import colors from "@/constants/colors";
import { getRecommendedPrayers, PrayerGuide } from "@/constants/prayers";
import { useContent } from "@/contexts/ContentContext";
import { usePersonalization } from "@/hooks/usePersonalization";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  Shield,
  Users,
  Sparkles,
  Compass,
  CheckCircle,
  DollarSign,
  Unlock,
  Briefcase,
  Target,
  Scale,
  TrendingUp,
  HeartPulse,
  Calculator,
  MessageCircle,
  Activity,
} from "lucide-react-native";
import React, { useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  heart: Heart,
  shield: Shield,
  users: Users,
  sparkles: Sparkles,
  compass: Compass,
  "check-circle": CheckCircle,
  "dollar-sign": DollarSign,
  unlock: Unlock,
  briefcase: Briefcase,
  target: Target,
  scale: Scale,
  "trending-up": TrendingUp,
  "heart-pulse": HeartPulse,
  calculator: Calculator,
  "message-circle": MessageCircle,
  activity: Activity,
};

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function PrayerScreen() {
  const { contentHistory, userPreferences, markPrayerViewed, addPrayerCategory, isLoaded } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  const [selectedGuide, setSelectedGuide] = useState<PrayerGuide | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const insets = useSafeAreaInsets();
  const scrollRef = React.useRef<ScrollView>(null);
  
  const recommendedPrayers = getRecommendedPrayers(
    contentHistory.prayers,
    userPreferences.prayerCategories
  );

  const handleSelectGuide = (guide: PrayerGuide) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedGuide(guide);
      
      if (!contentHistory.prayers.includes(guide.id)) {
        markPrayerViewed(guide.id);
        addPrayerCategory(guide.title);
        analyzeContentInteraction({
          type: 'prayer',
          content: `${guide.title}: ${guide.description}`,
        });
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleBack = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedGuide(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (selectedGuide) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 40) }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back to Prayers</Text>
            </TouchableOpacity>

            <View style={styles.detailHeader}>
              <View
                style={[
                  styles.detailIconContainer,
                  { backgroundColor: `${colors.light.primary}20` },
                ]}
              >
                {React.createElement(iconMap[selectedGuide.icon], {
                  size: 32,
                  color: colors.light.primary,
                })}
              </View>
              <Text style={styles.detailTitle}>{selectedGuide.title}</Text>
              <Text style={styles.detailDescription}>
                {selectedGuide.description}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prayers</Text>
              {selectedGuide.prayers.map((prayer, index) => (
                <View key={index} style={styles.prayerCard}>
                  <View style={styles.prayerNumber}>
                    <Text style={styles.prayerNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.prayerText}>{prayer}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scripture References</Text>
              {selectedGuide.scriptures.map((scripture, index) => (
                <View key={index} style={styles.scriptureCard}>
                  <Text style={styles.scriptureVerse}>&quot;{scripture.verse}&quot;</Text>
                  <Text style={styles.scriptureReference}>
                    — {scripture.reference}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.light.background, colors.light.cardBackground]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 40) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              Connect with God through guided prayers for life&apos;s moments
            </Text>
          </View>

          <View style={styles.gridContainer}>
            {recommendedPrayers.map((guide) => {
              const IconComponent = iconMap[guide.icon];
              return (
                <TouchableOpacity
                  key={guide.id}
                  style={styles.guideCard}
                  onPress={() => handleSelectGuide(guide)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.guideIconContainer,
                      { backgroundColor: `${colors.light.primary}15` },
                    ]}
                  >
                    <IconComponent size={28} color={colors.light.primary} />
                  </View>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideDescription} numberOfLines={2}>
                    {guide.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
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
    flexGrow: 1,
  },
  content: {
    padding: isSmallScreen ? 16 : 20,
  },
  header: {
    marginBottom: isSmallScreen ? 20 : 24,
  },
  greeting: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.light.textSecondary,
    lineHeight: 32,
  },
  gridContainer: {
    gap: 16,
  },
  guideCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  guideIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 6,
  },
  guideDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.light.primary,
    fontWeight: "600" as const,
  },
  detailHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  detailIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
    textAlign: "center" as const,
    paddingHorizontal: 8,
  },
  detailDescription: {
    fontSize: isSmallScreen ? 14 : 16,
    color: colors.light.textSecondary,
    textAlign: "center" as const,
    lineHeight: isSmallScreen ? 20 : 22,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.primary,
    marginBottom: 16,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  prayerCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: isSmallScreen ? 10 : 12,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  prayerNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  prayerNumberText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.light.cardBackground,
  },
  prayerText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 15,
    lineHeight: isSmallScreen ? 22 : 24,
    color: colors.light.text,
    fontStyle: "italic" as const,
  },
  scriptureCard: {
    backgroundColor: `${colors.light.accent}10`,
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.light.accent,
  },
  scriptureVerse: {
    fontSize: isSmallScreen ? 14 : 15,
    lineHeight: isSmallScreen ? 22 : 24,
    color: colors.light.text,
    marginBottom: 8,
    fontStyle: "italic" as const,
  },
  scriptureReference: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
});
