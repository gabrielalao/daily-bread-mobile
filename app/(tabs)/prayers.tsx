import colors from "@/constants/colors";
import { getRecommendedPrayers, PrayerGuide } from "@/constants/prayers";
import { useContent } from "@/contexts/ContentContext";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useScreenshotShare } from "@/hooks/useScreenshotShare";
import { translateTextCached } from "@/utils/translate";
import { t } from "@/utils/i18n";
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
  Share2,
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
  ActivityIndicator,
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
const isTablet = width >= 768;
const isSmallScreen = width < 375;

export default function PrayerScreen() {
  const { contentHistory, userPreferences, markPrayerViewed, addPrayerCategory, isLoaded } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  const { viewRef, captureAndShare, isCapturing } = useScreenshotShare();
  const [selectedGuide, setSelectedGuide] = useState<PrayerGuide | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [translatedListItems, setTranslatedListItems] = useState<Record<string, { title?: string; description?: string }>>({});
  const [translatedDetail, setTranslatedDetail] = useState<{
    title?: string;
    description?: string;
    prayers?: string[];
    scriptureVerses?: string[];
  } | null>(null);
  const insets = useSafeAreaInsets();
  const scrollRef = React.useRef<ScrollView>(null);
  
  const recommendedPrayers = getRecommendedPrayers(
    contentHistory.prayers,
    userPreferences.prayerCategories
  );

  // Translate list cards (title + description) when enabled.
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") {
        setTranslatedListItems({});
        return;
      }

      // Be gentle to free providers: translate sequentially (cached results are instant).
      const next: Record<string, { title?: string; description?: string }> = {};
      for (const g of recommendedPrayers) {
        if (cancelled) return;
        const [titleRes, descRes] = await Promise.all([
          translateTextCached({ text: g.title, targetLang: lang }),
          translateTextCached({ text: g.description, targetLang: lang }),
        ]);
        next[g.id] = { title: titleRes.text, description: descRes.text };
      }
      if (cancelled) return;
      setTranslatedListItems(next);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [recommendedPrayers.map(p => p.id).join("|"), userPreferences.appLanguage, userPreferences.autoTranslateContent]);

  // Translate selected prayer detail (full) when enabled.
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTranslatedDetail(null);
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent) return;
      if (!lang || lang === "en") return;
      if (!selectedGuide) return;

      const [titleRes, descRes] = await Promise.all([
        translateTextCached({ text: selectedGuide.title, targetLang: lang }),
        translateTextCached({ text: selectedGuide.description, targetLang: lang }),
      ]);

      const prayersRes = await Promise.all(
        selectedGuide.prayers.map((p) => translateTextCached({ text: p, targetLang: lang }))
      );
      const scriptureVersesRes = await Promise.all(
        selectedGuide.scriptures.map((s) => translateTextCached({ text: s.verse, targetLang: lang }))
      );

      if (cancelled) return;
      setTranslatedDetail({
        title: titleRes.text,
        description: descRes.text,
        prayers: prayersRes.map((r) => r.text),
        scriptureVerses: scriptureVersesRes.map((r) => r.text),
      });
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedGuide?.id, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

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
          <Text style={styles.loadingText}>{t(userPreferences.appLanguage, "common.loading")}</Text>
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
        
        {/* Share Button - Floating Action Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => captureAndShare(`Share this prayer guide from Daily Bread: ${selectedGuide.title}`)}
          disabled={isCapturing}
          activeOpacity={0.8}
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Share2 size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 40) }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View ref={viewRef} collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>{t(userPreferences.appLanguage, "prayers.backToPrayers")}</Text>
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
              <Text style={styles.detailTitle}>{translatedDetail?.title ?? selectedGuide.title}</Text>
              <Text style={styles.detailDescription}>
                {translatedDetail?.description ?? selectedGuide.description}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(userPreferences.appLanguage, "prayers.sectionPrayers")}</Text>
              {selectedGuide.prayers.map((prayer, index) => (
                <View key={index} style={styles.prayerCard}>
                  <View style={styles.prayerNumber}>
                    <Text style={styles.prayerNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.prayerText}>{translatedDetail?.prayers?.[index] ?? prayer}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(userPreferences.appLanguage, "prayers.sectionScripture")}</Text>
              {selectedGuide.scriptures.map((scripture, index) => (
                <View key={index} style={styles.scriptureCard}>
                  <Text style={styles.scriptureVerse}>&quot;{translatedDetail?.scriptureVerses?.[index] ?? scripture.verse}&quot;</Text>
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
      
      {/* Share Button - Floating Action Button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => captureAndShare("Share prayer guides from Daily Bread")}
        disabled={isCapturing}
        activeOpacity={0.8}
      >
        {isCapturing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Share2 size={24} color="#FFFFFF" />
        )}
      </TouchableOpacity>
      
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 40) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View ref={viewRef} collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t(userPreferences.appLanguage, "prayers.subtitle")}
            </Text>
          </View>

          <View style={styles.gridContainer}>
            {recommendedPrayers.map((guide) => {
              const IconComponent = iconMap[guide.icon];
              const translated = translatedListItems[guide.id];
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
                  <Text style={styles.guideTitle}>{translated?.title ?? guide.title}</Text>
                  <Text style={styles.guideDescription} numberOfLines={2}>
                    {translated?.description ?? guide.description}
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
    padding: isTablet ? 32 : (isSmallScreen ? 16 : 20),
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
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 28 : (isSmallScreen ? 16 : 20),
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
    flexWrap: "wrap",
    flexShrink: 1,
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
  shareButton: {
    position: "absolute" as const,
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});
