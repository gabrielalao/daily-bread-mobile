import colors from "@/constants/colors";
import { dailyPrayers, DailyPrayer, getCorrelatedDailyPrayer, getTodayDailyPrayer } from "@/constants/daily-prayers";
import { getRecommendedPrayers, PrayerGuide } from "@/constants/prayers";
import { useContent } from "@/contexts/ContentContext";
import { usePersonalization } from "@/hooks/usePersonalization";
import { devotionals, getCorrelatedDevotionalTheme } from "@/constants/devotionals";
import { useCardShare } from "@/hooks/useCardShare";
import { translateTextCached } from "@/utils/translate";
import { t } from "@/utils/i18n";
import { NetworkStatusDot } from "@/components/NetworkStatusDot";
import { A11yText as Text } from "@/components/A11yText";
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
  Upload,
  Calendar,
  Clock,
  BookOpen,
  X,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar as RNCalendar } from 'react-native-calendars';

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

// Vibrant color map for prayer guides - mixed up to avoid repetition
const colorMap: Record<string, string> = {
  anxiety: "#2A9D8F", // Teal
  strength: "#1A1A1A", // Black
  relationships: "#D9896A", // Coral
  gratitude: "#5B7BB4", // Soft Blue
  guidance: "#6A4C93", // Deep Purple
  forgiveness: "#E85D4F", // Orange/Coral
  "financial-wisdom": "#2B9F98", // Teal Green
  "debt-freedom": "#1A1A1A", // Black
  "business-wisdom": "#A84664", // Pink/Magenta
  "marketplace-impact": "#D97758", // Coral/Orange
  "work-life-harmony": "#6B5B95", // Purple
  "wealth-building": "#2A9D8F", // Teal
  "health-healing": "#5A9C92", // Teal/Green
  "parenting-grace": "#1A1A1A", // Black
  "investment-wisdom": "#D9896A", // Coral
  "career-calling": "#4A5C8F", // Deep Blue
  "budgeting-stewardship": "#6A4C93", // Deep Purple
  "communication-relationships": "#2B9F98", // Teal Green
  "income-growth": "#E85D4F", // Orange/Coral
  "financial-freedom-journey": "#5B7BB4", // Soft Blue
  "exercise-fitness": "#A84664", // Pink/Magenta
};

// Array of colors to cycle through for individual cards within detail pages
const detailCardColors = [
  "#2A9D8F", // Teal
  "#1A1A1A", // Black
  "#D9896A", // Coral
  "#5B7BB4", // Soft Blue
  "#6A4C93", // Deep Purple
  "#E85D4F", // Orange/Coral
  "#2B9F98", // Teal Green
  "#A84664", // Pink/Magenta
  "#D97758", // Coral/Orange
  "#6B5B95", // Purple
  "#4A5C8F", // Deep Blue
  "#5A9C92", // Teal/Green
];

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallScreen = width < 375;

export default function PrayerScreen() {
  const { contentHistory, userPreferences, markPrayerViewed, addPrayerCategory, isLoaded, setCurrentDayPrayer } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  
  // Card-level sharing hooks
  const prayerCard = useCardShare();
  const verseCard = useCardShare();
  const applicationCard = useCardShare();
  
  const [selectedGuide, setSelectedGuide] = useState<PrayerGuide | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [translatedDailyPrayer, setTranslatedDailyPrayer] = useState<{ title?: string; prayer?: string; verse?: string } | null>(null);
  const [translatedListItems, setTranslatedListItems] = useState<Record<string, { title?: string; description?: string }>>({});
  const [translatedDetail, setTranslatedDetail] = useState<{
    title?: string;
    description?: string;
    prayers?: string[];
    scriptureVerses?: string[];
  } | null>(null);
  const insets = useSafeAreaInsets();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewingPastContent, setViewingPastContent] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeCardType, setActiveCardType] = useState<'prayer' | 'verse' | 'application' | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  
  const handleCardPress = (cardType: 'prayer' | 'verse' | 'application') => {
    setActiveCardType(cardType);
    setShowShareMenu(true);
  };

  const handleShare = () => {
    setShowShareMenu(false);
    setTimeout(() => {
      if (activeCardType === 'prayer') {
        prayerCard.shareCard("Share today's prayer from CDB Therapy");
      } else if (activeCardType === 'verse') {
        verseCard.shareCard("Share today's verse from CDB Therapy");
      } else if (activeCardType === 'application') {
        applicationCard.shareCard("Share today's prayer application from CDB Therapy");
      }
    }, 300);
  };

  // Use the correlated daily prayer or fallback
  const todayPrayer = React.useMemo<DailyPrayer>(() => {
    // If viewing a specific past date, get prayer for that date
    if (selectedDate && viewingPastContent) {
      const startOfYear = new Date(selectedDate.getFullYear(), 0, 1);
      const dayOfYear = Math.floor((selectedDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const prayerIndex = (dayOfYear - 1) % 365;
      const datePrayer = dailyPrayers[prayerIndex];
      console.log(`Viewing prayer for ${selectedDate.toDateString()}: Day ${dayOfYear}, ${datePrayer.title}`);
      return datePrayer;
    }
    
    // Otherwise, show today's prayer
    if (contentHistory.currentDayPrayer) {
      const cached = dailyPrayers.find(p => p.id === contentHistory.currentDayPrayer);
      if (cached) return cached;
    }
    
    // Get correlated prayer based on devotional ID and theme
    if (contentHistory.currentDayDevotional) {
      const devotion = devotionals.find(d => d.id === contentHistory.currentDayDevotional);
      if (devotion) {
        const theme = getCorrelatedDevotionalTheme(devotion);
        return getCorrelatedDailyPrayer(devotion.id, theme, contentHistory.prayers);
      }
    }
    
    // Fallback to daily cycle
    return getTodayDailyPrayer(contentHistory.prayers);
  }, [contentHistory.currentDayPrayer, contentHistory.prayers, contentHistory.currentDayDevotional, selectedDate, viewingPastContent]);
  
  const recommendedPrayers = React.useMemo(
    () =>
      getRecommendedPrayers(
        contentHistory.prayers,
        userPreferences.prayerCategories
      ),
    [contentHistory.prayers, userPreferences.prayerCategories]
  );

  const todayPrayerId = todayPrayer?.id;
  const todayPrayerTitle = todayPrayer?.title;
  const todayPrayerPrayer = todayPrayer?.prayer;
  const todayPrayerVerse = todayPrayer?.verse;
  
  // Save the correlated prayer to context
  React.useEffect(() => {
    if (isLoaded && todayPrayer && contentHistory.currentDayPrayer !== todayPrayer.id) {
      setCurrentDayPrayer(todayPrayer.id);
    }
  }, [todayPrayer, isLoaded, contentHistory.currentDayPrayer, setCurrentDayPrayer]);

  // Translate today's daily prayer when enabled
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTranslatedDailyPrayer(null);
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") return;
      if (!todayPrayerId || !todayPrayerTitle || !todayPrayerPrayer || !todayPrayerVerse) return;

      const [titleRes, prayerRes, verseRes] = await Promise.all([
        translateTextCached({ text: todayPrayerTitle, targetLang: lang }),
        translateTextCached({ text: todayPrayerPrayer, targetLang: lang }),
        translateTextCached({ text: todayPrayerVerse, targetLang: lang }),
      ]);

      if (cancelled) return;
      setTranslatedDailyPrayer({ title: titleRes.text, prayer: prayerRes.text, verse: verseRes.text });
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [todayPrayerId, todayPrayerTitle, todayPrayerPrayer, todayPrayerVerse, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

  // Update time display (only when minute changes to reduce re-renders)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const lastMinute = currentTime.getMinutes();
      const currentMinute = now.getMinutes();
      
      if (lastMinute !== currentMinute) {
        setCurrentTime(now);
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  const locale = userPreferences.appLanguage === 'en' ? 'en-US' :
                 userPreferences.appLanguage === 'fr' ? 'fr-FR' :
                 userPreferences.appLanguage === 'da' ? 'da-DK' :
                 userPreferences.appLanguage === 'es' ? 'es-ES' :
                 userPreferences.appLanguage === 'de' ? 'de-DE' : 'en-US';

  const today = currentTime.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const time = currentTime.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

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
  }, [recommendedPrayers, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

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
  }, [selectedGuide, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

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
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t(userPreferences.appLanguage, "common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedGuide) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 40) }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
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
              {selectedGuide.prayers.map((prayer, index) => {
                const cardColor = detailCardColors[index % detailCardColors.length];
                return (
                  <View key={index} style={[styles.prayerCard, { backgroundColor: cardColor }]}>
                    <View style={styles.prayerNumber}>
                      <Text style={styles.prayerNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.prayerText}>{translatedDetail?.prayers?.[index] ?? prayer}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(userPreferences.appLanguage, "prayers.sectionScripture")}</Text>
              {selectedGuide.scriptures.map((scripture, index) => {
                const cardColor = detailCardColors[(selectedGuide.prayers.length + index) % detailCardColors.length];
                return (
                  <View key={index} style={[styles.scriptureCard, { backgroundColor: cardColor }]}>
                    <Text style={styles.scriptureVerse}>&quot;{translatedDetail?.scriptureVerses?.[index] ?? scripture.verse}&quot;</Text>
                    <Text style={styles.scriptureReference}>
                      — {scripture.reference}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 40) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateRow}
              onPress={() => setShowCalendar(true)}
              activeOpacity={0.7}
            >
              <Calendar size={18} color={colors.light.primary} />
              <Text style={[styles.dateText, viewingPastContent && styles.pastDateText]}>
                {viewingPastContent && selectedDate
                  ? selectedDate.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                  : today}
              </Text>
            </TouchableOpacity>
            {viewingPastContent && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDate(null);
                  setViewingPastContent(false);
                }}
                style={styles.todayButton}
                activeOpacity={0.7}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
            )}
            <View style={styles.timeRow}>
              <Clock size={18} color={colors.light.textSecondary} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={styles.statusDotContainer}>
              <NetworkStatusDot />
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t(userPreferences.appLanguage, "prayers.subtitle")}
            </Text>
          </View>

          {/* Today's Prayer Card */}
          <View style={styles.todaySection}>
            <View style={styles.todaySectionHeader}>
              <Text style={styles.todaySectionTitle}>🙏 {t(userPreferences.appLanguage, "prayers.todaysPrayer")}</Text>
              <Text style={styles.todaySectionSubtitle}>{t(userPreferences.appLanguage, "prayers.dailyGuidance")}</Text>
            </View>
            <TouchableOpacity 
              ref={prayerCard.cardRef} 
              collapsable={false} 
              style={styles.todayPrayerCard}
              onPress={() => handleCardPress('prayer')}
              activeOpacity={0.9}
            >
              <View style={styles.todayIconContainer}>
                <Heart size={32} color="#FFFFFF" />
              </View>
              <View style={styles.todayTextContainer}>
                <Text style={styles.todayTitle}>{translatedDailyPrayer?.title ?? todayPrayer.title}</Text>
                <Text style={styles.todayPrayerText}>
                  {translatedDailyPrayer?.prayer ?? todayPrayer.prayer}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Bible Verse Card - Separate with vibrant color */}
            <TouchableOpacity 
              ref={verseCard.cardRef} 
              collapsable={false} 
              style={styles.prayerVerseCard}
              onPress={() => handleCardPress('verse')}
              activeOpacity={0.9}
            >
              <Text style={styles.todayVerse}>
                &quot;{translatedDailyPrayer?.verse ?? todayPrayer.verse}&quot;
              </Text>
              <View style={styles.todayScriptureContainer}>
                <BookOpen size={14} color="#FFFFFF" />
                <Text style={styles.todayScripture}>{todayPrayer.scripture}</Text>
              </View>
            </TouchableOpacity>

            {/* Prayer Prompt Card - Third card with vibrant color */}
            <TouchableOpacity 
              ref={applicationCard.cardRef} 
              collapsable={false} 
              style={styles.prayerPromptCard}
              onPress={() => handleCardPress('application')}
              activeOpacity={0.9}
            >
              <View style={styles.prayerPromptHeader}>
                <Heart size={14} color="#FFFFFF" />
                <Text style={styles.prayerPromptLabel}>{t(userPreferences.appLanguage, "prayers.prayerPrompt")}</Text>
              </View>
              <Text style={styles.prayerPromptText}>
                {t(userPreferences.appLanguage, "prayers.prayerPromptContent")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* All Prayer Guides */}
          <View style={styles.allPrayersHeader}>
            <Text style={styles.allPrayersTitle}>{t(userPreferences.appLanguage, "prayers.allPrayers")}</Text>
          </View>

          <View style={styles.gridContainer}>
            {recommendedPrayers.map((guide) => {
              const IconComponent = iconMap[guide.icon];
              const translated = translatedListItems[guide.id];
              const cardColor = colorMap[guide.id] || colors.light.primary;
              return (
                <TouchableOpacity
                  key={guide.id}
                  style={[styles.guideCard, { backgroundColor: cardColor }]}
                  onPress={() => handleSelectGuide(guide)}
                  activeOpacity={0.8}
                >
                  <View style={styles.guideIconContainer}>
                    <IconComponent size={28} color="#FFFFFF" strokeWidth={2.5} />
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

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select a Date</Text>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.light.text} />
              </TouchableOpacity>
            </View>

            <RNCalendar
              onDayPress={(day) => {
                const selected = new Date(day.dateString);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selected <= today) {
                  setSelectedDate(selected);
                  setViewingPastContent(selected.toDateString() !== today.toDateString());
                  setShowCalendar(false);
                }
              }}
              maxDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: colors.light.cardBackground,
                calendarBackground: colors.light.cardBackground,
                textSectionTitleColor: colors.light.textSecondary,
                selectedDayBackgroundColor: colors.light.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: colors.light.primary,
                dayTextColor: colors.light.text,
                textDisabledColor: colors.light.textSecondary,
                dotColor: colors.light.primary,
                selectedDotColor: '#ffffff',
                arrowColor: colors.light.primary,
                monthTextColor: colors.light.text,
                indicatorColor: colors.light.primary,
              }}
              markedDates={{
                [new Date().toISOString().split('T')[0]]: {
                  marked: true,
                  dotColor: colors.light.primary,
                },
                ...(selectedDate && viewingPastContent
                  ? {
                      [selectedDate.toISOString().split('T')[0]]: {
                        selected: true,
                        selectedColor: colors.light.primary,
                      },
                    }
                  : {}),
              }}
            />

            <TouchableOpacity
              style={styles.todayButtonInModal}
              onPress={() => {
                setSelectedDate(null);
                setViewingPastContent(false);
                setShowCalendar(false);
              }}
            >
              <Text style={styles.todayButtonInModalText}>Go to Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share Menu Modal */}
      <Modal
        visible={showShareMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowShareMenu(false)}
      >
        <TouchableOpacity 
          style={styles.shareMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowShareMenu(false)}
        >
          <View style={styles.shareMenuContainer}>
            <TouchableOpacity
              style={styles.shareMenuItem}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Upload size={22} color={colors.light.text} />
              <Text style={styles.shareMenuText}>Create Image</Text>
            </TouchableOpacity>

            <View style={styles.shareMenuDivider} />

            <TouchableOpacity
              style={styles.shareMenuItem}
              onPress={() => setShowShareMenu(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.shareMenuCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: isTablet ? 32 : (isSmallScreen ? 16 : 20),
    paddingTop: 16, // Consistent top padding for all devices
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.light.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 13,
    color: colors.light.textTertiary,
    fontWeight: "500" as const,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.light.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDotContainer: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 13,
    color: colors.light.textTertiary,
    fontWeight: "500" as const,
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
    fontSize: isSmallScreen ? 14 : 16,
    color: colors.light.textTertiary,
    lineHeight: 22,
  },
  todaySection: {
    marginBottom: 32,
  },
  todaySectionHeader: {
    marginBottom: 16,
  },
  todaySectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  todaySectionSubtitle: {
    fontSize: 14,
    color: colors.light.textTertiary,
  },
  todayPrayerCard: {
    backgroundColor: '#E85D4F', // Orange/Coral
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 32 : (isSmallScreen ? 20 : 24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  todayIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.light.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
  },
  todayTextContainer: {
    flex: 1,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 28,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  scripture: {
    fontSize: 13,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
    opacity: 0.9,
  },
  verseContainer: {
    position: "relative" as const,
    paddingLeft: 20,
    marginBottom: 24,
  },
  quoteMarkContainer: {
    position: "absolute" as const,
    left: -4,
    top: -8,
  },
  quoteMark: {
    fontSize: 48,
    color: colors.light.primary,
    fontWeight: "700" as const,
    opacity: 0.25,
  },
  verse: {
    fontSize: 17,
    lineHeight: 28,
    color: colors.light.textSecondary,
    fontStyle: "italic" as const,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.borderLight,
    marginVertical: 20,
    opacity: 0.2,
  },
  reflectionContainer: {
    gap: 12,
  },
  reflectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  reflection: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.light.textSecondary,
  },
  todayDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
  todayPrayerText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#FFFFFF',
    fontStyle: "italic" as const,
    marginBottom: 12,
  },
  todayScriptureContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  todayVerseCard: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.light.primary,
  },
  prayerVerseCard: {
    backgroundColor: '#5A9C92', // Teal/Green
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 32 : (isSmallScreen ? 20 : 24),
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  prayerPromptCard: {
    backgroundColor: '#6B5B95', // Purple
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 32 : (isSmallScreen ? 20 : 24),
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  prayerPromptHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  prayerPromptLabel: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: '#FFFFFF',
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginLeft: 6,
  },
  prayerPromptText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#FFFFFF',
    fontStyle: "italic" as const,
  },
  todayVerse: {
    fontSize: isSmallScreen ? 14 : 15,
    lineHeight: isSmallScreen ? 22 : 24,
    color: '#FFFFFF',
    marginBottom: 8,
    fontStyle: "italic" as const,
  },
  todayScripture: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: "600" as const,
  },
  allPrayersHeader: {
    marginBottom: 16,
  },
  allPrayersTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  gridContainer: {
    gap: 16,
  },
  guideCard: {
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 28 : (isSmallScreen ? 16 : 20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0,
  },
  guideIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  guideDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
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
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: isSmallScreen ? 10 : 12,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  prayerNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: "center",
    justifyContent: "center",
  },
  prayerNumberText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  prayerText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 15,
    lineHeight: isSmallScreen ? 22 : 24,
    color: "rgba(255, 255, 255, 0.95)",
    fontStyle: "italic" as const,
  },
  scriptureCard: {
    borderRadius: 12,
    padding: isSmallScreen ? 14 : 16,
    marginBottom: 12,
    borderLeftWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scriptureVerse: {
    fontSize: isSmallScreen ? 14 : 15,
    lineHeight: isSmallScreen ? 22 : 24,
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: 8,
    fontStyle: "italic" as const,
  },
  scriptureReference: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
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
  pastDateText: {
    color: colors.light.primary,
    fontWeight: "600" as const,
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    marginLeft: 8,
  },
  todayButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600" as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarModal: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  todayButtonInModal: {
    backgroundColor: colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  todayButtonInModalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  shareMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  shareMenuContainer: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: isTablet ? 40 : 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  shareMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 12,
  },
  shareMenuText: {
    fontSize: 18,
    color: colors.light.text,
    fontWeight: "600" as const,
  },
  shareMenuDivider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginHorizontal: 20,
  },
  shareMenuCancel: {
    fontSize: 18,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
});
