import colors from "@/constants/colors";
import { devotionals, getPersonalizedDevotional, type Devotional } from "@/constants/devotionals";
import { useContent } from "@/contexts/ContentContext";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useScreenshotShare } from "@/hooks/useScreenshotShare";
import { getVersionById } from "@/constants/bible-versions";
import { getAppLanguageById } from "@/constants/app-languages";
import { t } from "@/utils/i18n";
import { translateTextCached } from "@/utils/translate";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Calendar, Clock, Share2, X, Settings } from "lucide-react-native";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Dimensions, PanResponder, Modal } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar as RNCalendar } from 'react-native-calendars';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

export default function HomeScreen() {
  const { contentHistory, userPreferences, markDevotionalViewed, isLoaded, setCurrentDayDevotional } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  const { viewRef, captureAndShare, isCapturing } = useScreenshotShare();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedVerse, setTranslatedVerse] = useState<string | null>(null);
  const [translatedReflection, setTranslatedReflection] = useState<string | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewingPastContent, setViewingPastContent] = useState(false);
  const hasSetInitialDevotional = useRef(false);
  
  // Draggable share button position
  const pan = useRef(new Animated.ValueXY({ x: screenWidth - 60, y: 100 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        
        // Optional: Keep button within screen bounds
        const maxX = screenWidth - 60;
        const maxY = 800; // Adjust based on your needs
        
        Animated.spring(pan, {
          toValue: {
            x: Math.max(20, Math.min((pan.x as any)._value, maxX)),
            y: Math.max(20, Math.min((pan.y as any)._value, maxY)),
          },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;
  
  const devotional = useMemo<Devotional>(() => {
    // If viewing a specific past date, get devotional for that date
    if (selectedDate && viewingPastContent) {
      const startOfYear = new Date(selectedDate.getFullYear(), 0, 1);
      const dayOfYear = Math.floor((selectedDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const devotionalIndex = (dayOfYear - 1) % 365;
      const dateDevotional = devotionals[devotionalIndex];
      console.log(`Viewing devotional for ${selectedDate.toDateString()}: Day ${dayOfYear}, ${dateDevotional.title}`);
      return dateDevotional;
    }
    
    // Otherwise, show today's devotional
    if (contentHistory.currentDayDevotional) {
      const cached = devotionals.find(d => d.id === contentHistory.currentDayDevotional);
      if (cached) {
        console.log('Using cached devotional for today:', cached.title);
        return cached;
      }
    }
    
    const selected = getPersonalizedDevotional(
      contentHistory.devotionals,
      userPreferences.topicsOfInterest
    );
    console.log('Selected new devotional for today:', selected.title);
    return selected;
  }, [contentHistory.currentDayDevotional, selectedDate, viewingPastContent]);

  const bibleVersion = getVersionById(userPreferences.bibleVersion);
  const lang = userPreferences.appLanguage;
  const locale = getAppLanguageById(lang)?.locale ?? "en-US";

  React.useEffect(() => {
    if (isLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isLoaded]);
  
  useEffect(() => {
    if (isLoaded && devotional && !hasSetInitialDevotional.current) {
      if (contentHistory.currentDayDevotional !== devotional.id) {
        setCurrentDayDevotional(devotional.id);
        hasSetInitialDevotional.current = true;
        console.log('Set current day devotional to:', devotional.id);
      }
      
      if (!contentHistory.devotionals.includes(devotional.id)) {
        markDevotionalViewed(devotional.id);
        analyzeContentInteraction({
          type: 'devotional',
          content: `${devotional.title}: ${devotional.reflection}`,
        });
      }
    }
  }, [devotional, isLoaded, contentHistory.currentDayDevotional, contentHistory.devotionals]);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Reset when devotional changes or language changes
      setTranslatedTitle(null);
      setTranslatedVerse(null);
      setTranslatedReflection(null);

      if (!userPreferences.autoTranslateContent) return;
      if (!lang || lang === "en") return;

      const [titleRes, verseRes, reflectionRes] = await Promise.all([
        translateTextCached({ text: devotional.title, targetLang: lang }),
        translateTextCached({ text: devotional.verse, targetLang: lang }),
        translateTextCached({ text: devotional.reflection, targetLang: lang }),
      ]);

      if (cancelled) return;
      setTranslatedTitle(titleRes.text);
      setTranslatedVerse(verseRes.text);
      setTranslatedReflection(reflectionRes.text);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [devotional.id, devotional.title, devotional.verse, devotional.reflection, lang, userPreferences.autoTranslateContent]);

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t(lang, "common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 32, 120) }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View ref={viewRef} collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity 
                style={styles.dateContainer}
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
              <View style={styles.timeContainer}>
                <Clock size={18} color={colors.light.textSecondary} />
                <Text style={styles.timeText}>{time}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>{t(lang, "home.subtitle")}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <BookOpen size={24} color={colors.light.primary} />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{translatedTitle ?? devotional.title}</Text>
                <Text style={styles.scripture}>
                  {devotional.scripture} {bibleVersion && `(${bibleVersion.abbreviation})`}
                </Text>
              </View>
            </View>

            <View style={styles.verseContainer}>
              <View style={styles.quoteMarkContainer}>
                <Text style={styles.quoteMark}>&quot;</Text>
              </View>
              <Text style={styles.verse}>{translatedVerse ?? devotional.verse}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reflectionContainer}>
              <Text style={styles.reflectionTitle}>{t(lang, "home.reflectionTitle")}</Text>
              <Text style={styles.reflection}>{translatedReflection ?? devotional.reflection}</Text>
            </View>
          </View>

          <View style={styles.prayerPrompt}>
            <Text style={styles.prayerPromptTitle}>{t(lang, "home.prayerTitle")}</Text>
            <Text style={styles.prayerPromptText}>
              {t(lang, "home.prayerText")}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Share Button - Draggable Floating Action Button */}
      <Animated.View
        style={[
          styles.shareButton,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.shareButtonInner}
          onPress={() => captureAndShare("Share today's devotional from Christian Daily Bread")}
          disabled={isCapturing}
          activeOpacity={0.8}
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Share2 size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </Animated.View>

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
                
                // Only allow selecting today or past dates
                if (selected <= today) {
                  setSelectedDate(selected);
                  setViewingPastContent(selected.toDateString() !== today.toDateString());
                  setShowCalendar(false);
                }
              }}
              maxDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: colors.light.cardBackgroundSecondary,
                calendarBackground: colors.light.cardBackgroundSecondary,
                textSectionTitleColor: colors.light.textTertiary,
                selectedDayBackgroundColor: colors.light.primary,
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: colors.light.primary,
                dayTextColor: colors.light.text,
                textDisabledColor: colors.light.textLight,
                dotColor: colors.light.primary,
                selectedDotColor: '#FFFFFF',
                arrowColor: colors.light.primary,
                monthTextColor: colors.light.text,
                indicatorColor: colors.light.primary,
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '400',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
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
    // paddingBottom handled dynamically
  },
  content: {
    padding: isTablet ? 32 : (isSmallScreen ? 16 : 20),
    paddingTop: 16, // Consistent top padding for all devices
  },
  header: {
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 12,
  },
  dateContainer: {
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
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.light.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 13,
    color: colors.light.textTertiary,
    fontWeight: "500" as const,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: colors.light.textTertiary,
    lineHeight: 28,
  },
  card: {
    backgroundColor: colors.light.verseCard,
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
  iconContainer: {
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
  cardTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 6,
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
  prayerPrompt: {
    marginTop: 20,
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.primary,
  },
  prayerPromptTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  prayerPromptText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
    fontStyle: "italic" as const,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.light.textTertiary,
    fontWeight: "600" as const,
    marginTop: 12,
  },
  shareButton: {
    position: "absolute" as const,
    width: 40,
    height: 40,
    zIndex: 1000,
  },
  shareButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  pastDateText: {
    color: colors.light.primary,
    fontWeight: "600" as const,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.light.primary,
    borderRadius: 14,
    marginLeft: 8,
  },
  todayButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700" as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.light.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarModal: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  calendarHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  closeButton: {
    padding: 8,
    backgroundColor: colors.light.cardBackgroundTertiary,
    borderRadius: 20,
  },
  todayButtonInModal: {
    backgroundColor: colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  todayButtonInModalText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700" as const,
  },
});
