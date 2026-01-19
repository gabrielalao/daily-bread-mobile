import colors from "@/constants/colors";
import { getRecommendedStudies, getTodayStudy, BibleStudyPlan, getCorrelatedStudyVerse, type DailyStudyVerse } from "@/constants/bible-studies";
import { getPassageProviderCode, getVersionById } from "@/constants/bible-versions";
import { translateTextCached } from "@/utils/translate";
import { useContent } from "@/contexts/ContentContext";
import { devotionals } from "@/constants/devotionals";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useScreenshotShare } from "@/hooks/useScreenshotShare";
import { getStudyInsight, mergeInsightOverrides } from "@/utils/studyInsights";
import { t } from "@/utils/i18n";
import { tParams } from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { Book, Calendar, ChevronRight, X, Share2, ChevronDown, ChevronUp, Lightbulb, BookOpen, Heart, Clock } from "lucide-react-native";
import React, { useState, useRef } from "react";
import { useFocusEffect } from "expo-router";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BibleVerse = {
  reference: string;
  text: string;
};

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

type FormattedVerse = {
  number: number;
  text: string;
};

export default function BibleStudyScreen() {
  const { contentHistory, userPreferences, markStudyViewed, addStudyCategory, isLoaded, getStudyPlanCycle, getStudyPlanCompletedDays, markStudyDayCompleted, advanceStudyPlanCycle, setCurrentDayStudyVerse, getCorrelatedDailyContent } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  const { viewRef, captureAndShare, isCapturing } = useScreenshotShare();
  const modalViewRef = useRef<any>(null); // Separate ref for modal content
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<BibleStudyPlan | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [verses, setVerses] = useState<FormattedVerse[]>([]);
  const [isCapturingModal, setIsCapturingModal] = useState(false);
  const [expandedReadings, setExpandedReadings] = useState<Set<number>>(new Set()); // Track which readings are expanded
  const [activeReadingDay, setActiveReadingDay] = useState<number | null>(null); // which day opened the verse modal
  const [isModalInsightExpanded, setIsModalInsightExpanded] = useState(true);
  const [didWarnTranslationFallback, setDidWarnTranslationFallback] = useState(false);
  const [translatedVerseRef, setTranslatedVerseRef] = useState<string | null>(null);
  const [translatedModalInsight, setTranslatedModalInsight] = useState<string | null>(null);
  const [translatedModalApplication, setTranslatedModalApplication] = useState<string | null>(null);
  const [translatedPlanHeader, setTranslatedPlanHeader] = useState<{ title?: string; description?: string } | null>(null);
  const [translatedPlanCards, setTranslatedPlanCards] = useState<Record<string, { title?: string; description?: string }>>({});
  const [translatedReadings, setTranslatedReadings] = useState<
    Record<number, { focus?: string; spiritualInsight?: string; keyThemes?: string[]; practicalApplication?: string }>
  >({});
  const [translatedStudyVerse, setTranslatedStudyVerse] = useState<{ reference?: string; text?: string } | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  
  // Get correlated daily content
  const dailyContent = React.useMemo(() => getCorrelatedDailyContent(), [contentHistory.currentDayDevotional]);
  
  // Use the correlated study verse or create one from today's devotional
  const todayStudyVerse = React.useMemo<DailyStudyVerse | null>(() => {
    if (contentHistory.currentDayStudyVerse) {
      return contentHistory.currentDayStudyVerse;
    }
    
    // Get correlated study verse based on devotional
    if (dailyContent.devotional) {
      const devotion = devotionals.find(d => d.id === dailyContent.devotional);
      if (devotion) {
        return getCorrelatedStudyVerse(devotion.scripture, devotion.verse);
      }
    }
    
    return null;
  }, [contentHistory.currentDayStudyVerse, dailyContent.devotional]);
  
  const todayStudy = getTodayStudy(contentHistory.studies);
  const recommendedStudies = getRecommendedStudies(
    contentHistory.studies,
    userPreferences.studyCategories
  );
  
  // Save the correlated study verse to context
  React.useEffect(() => {
    if (isLoaded && todayStudyVerse && 
        (!contentHistory.currentDayStudyVerse || 
         contentHistory.currentDayStudyVerse.reference !== todayStudyVerse.reference)) {
      setCurrentDayStudyVerse(todayStudyVerse);
    }
  }, [todayStudyVerse, isLoaded, contentHistory.currentDayStudyVerse, setCurrentDayStudyVerse]);

  const translateCategory = (category: string) => {
    const key = `cat.${category.toLowerCase().replace(/[^a-z]+/g, "")}`;
    const translated = t(userPreferences.appLanguage, key);
    return translated === key ? category : translated;
  };

  const formatDuration = (duration: string) => {
    const m = String(duration).trim().match(/^(\d+)\s*days?$/i);
    if (!m) return duration;
    const count = Number(m[1]);
    return tParams(userPreferences.appLanguage, "common.daysCount", { count });
  };

  // Update time display (only when minute changes to reduce re-renders)
  React.useEffect(() => {
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

  // Translate plan cards (title + description) on list view when enabled.
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") {
        setTranslatedPlanCards({});
        return;
      }

      const next: Record<string, { title?: string; description?: string }> = {};
      for (const p of recommendedStudies) {
        if (cancelled) return;
        const [titleRes, descRes] = await Promise.all([
          translateTextCached({ text: p.title, targetLang: lang }),
          translateTextCached({ text: p.description, targetLang: lang }),
        ]);
        next[p.id] = { title: titleRes.text, description: descRes.text };
      }
      if (cancelled) return;
      setTranslatedPlanCards(next);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [recommendedStudies.map(p => p.id).join("|"), userPreferences.appLanguage, userPreferences.autoTranslateContent]);

  // Translate daily study verse when enabled.
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTranslatedStudyVerse(null);
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") return;
      if (!todayStudyVerse) return;

      const [refRes, textRes] = await Promise.all([
        translateTextCached({ text: todayStudyVerse.reference, targetLang: lang }),
        translateTextCached({ text: todayStudyVerse.text, targetLang: lang }),
      ]);

      if (cancelled) return;
      setTranslatedStudyVerse({ reference: refRes.text, text: textRes.text });
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [todayStudyVerse?.reference, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

  // Translate selected plan reading list content progressively (focus + insights) when enabled.
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTranslatedReadings({});
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") return;
      if (!selectedPlan) return;

      const next: Record<number, { focus?: string; spiritualInsight?: string; keyThemes?: string[]; practicalApplication?: string }> = {};
      let processed = 0;

      for (const reading of selectedPlan.readings) {
        if (cancelled) return;
        const cycle = getStudyPlanCycle(selectedPlan.id);
        const insight = mergeInsightOverrides(reading, getStudyInsight(reading, cycle));

        const [focusRes, siRes, paRes] = await Promise.all([
          translateTextCached({ text: reading.focus ?? "", targetLang: lang }),
          translateTextCached({ text: insight.spiritualInsight ?? "", targetLang: lang }),
          translateTextCached({ text: insight.practicalApplication ?? "", targetLang: lang }),
        ]);

        const themes = insight.keyThemes ?? [];
        const themesRes = themes.length
          ? await Promise.all(themes.map((th) => translateTextCached({ text: th, targetLang: lang })))
          : [];

        next[reading.day] = {
          focus: focusRes.text || reading.focus,
          spiritualInsight: siRes.text || insight.spiritualInsight,
          practicalApplication: paRes.text || insight.practicalApplication,
          keyThemes: themesRes.map((r) => r.text),
        };

        processed += 1;
        // Reduce re-render churn: commit every 10 items.
        if (processed % 10 === 0) {
          setTranslatedReadings((prev) => ({ ...prev, ...next }));
        }
      }

      setTranslatedReadings((prev) => ({ ...prev, ...next }));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedPlan?.id, userPreferences.appLanguage, userPreferences.autoTranslateContent, getStudyPlanCycle]);

  const fetchVerseMutation = useMutation({
    mutationFn: async (reference: string): Promise<{ reference: string; verses: { number: number; text: string }[] }> => {
      try {
        const preferred = getVersionById(userPreferences.bibleVersion);
        const { code, didFallback } = getPassageProviderCode(userPreferences.bibleVersion);
        const urlFor = (t: string) => `https://bible-api.com/${encodeURIComponent(reference)}?translation=${encodeURIComponent(t)}`;

        let usedCode = code;
        let response = await fetch(urlFor(usedCode));

        // If provider doesn't support the requested translation, auto-fallback to KJV so UX never breaks.
        if (!response.ok && usedCode !== 'kjv') {
          usedCode = 'kjv';
          response = await fetch(urlFor(usedCode));
        }

        if (!response.ok) {
          throw new Error('Failed to fetch verse');
        }

        const data = await response.json();
        if (didFallback && !didWarnTranslationFallback) {
          setDidWarnTranslationFallback(true);
          Alert.alert(
            'Translation note',
            `Full passages are currently shown in KJV for some versions. Your selected version (${preferred?.abbreviation ?? userPreferences.bibleVersion}) may not be available for “View Full Passage” yet.`
          );
        }
        // Also warn if we had to auto-fallback because the provider rejected the selected translation code.
        if (usedCode === 'kjv' && code !== 'kjv' && !didWarnTranslationFallback) {
          setDidWarnTranslationFallback(true);
          Alert.alert(
            'Translation note',
            `Full passages are currently shown in KJV for some versions. Your selected version (${preferred?.abbreviation ?? userPreferences.bibleVersion}) may not be available for “View Full Passage” yet.`
          );
        }
        
        const verses = data.verses?.map((v: any) => ({
          number: v.verse,
          text: v.text.trim(),
        })) || [];
        
        return {
          reference: data.reference || reference,
          verses: verses.length > 0 ? verses : [{ number: 1, text: data.text || 'Verse not available' }],
        };
      } catch (error) {
        console.error('Error fetching verse:', error);
        throw error;
      }
    },
    onSuccess: (data, reference) => {
      setSelectedVerse({ reference: data.reference, text: '' });
      setVerses(data.verses);
      setTranslatedVerseRef(null);
    },
  });

  // Auto-translate verse modal content (cached) when enabled.
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent) return;
      if (!lang || lang === "en") return;
      if (!selectedVerse) return;
      if (!verses || verses.length === 0) return;

      const translated = await Promise.all(
        verses.map((v) => translateTextCached({ text: v.text, targetLang: lang }))
      );
      if (cancelled) return;
      setVerses(verses.map((v, idx) => ({ ...v, text: translated[idx].text })));

      const refRes = await translateTextCached({ text: selectedVerse.reference, targetLang: lang });
      if (cancelled) return;
      setTranslatedVerseRef(refRes.text);
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVerse?.reference, verses.length, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

  const handleReadVerse = async (reading: BibleStudyPlan["readings"][number]) => {
    setActiveReadingDay(reading.day);
    setIsModalInsightExpanded(true);
    fetchVerseMutation.mutate(reading.reference);

    // Mark progress for cycle tracking (Phase 2)
    if (selectedPlan?.id) {
      const totalDays = selectedPlan.readings.length;
      const { didCompleteCycle, cycle } = await markStudyDayCompleted(selectedPlan.id, reading.day, totalDays);
      if (didCompleteCycle) {
        Alert.alert(
          `Year ${cycle} Complete! 🎉`,
          `You completed the full reading plan. Want to start Year ${cycle + 1} with fresh spiritual insights?`,
          [
            { text: "Not now", style: "cancel" },
            {
              text: `Start Year ${cycle + 1}`,
              onPress: async () => {
                await advanceStudyPlanCycle(selectedPlan.id);
              },
            },
          ]
        );
      }
    }
  };

  const handleCloseVerse = () => {
    setSelectedVerse(null);
    setVerses([]);
    setActiveReadingDay(null);
    setTranslatedVerseRef(null);
    setTranslatedModalInsight(null);
    setTranslatedModalApplication(null);
  };

  // Translate the "Daily Insight" devotional panel inside the verse modal (cached).
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTranslatedModalInsight(null);
      setTranslatedModalApplication(null);

      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent) return;
      if (!lang || lang === "en") return;
      if (!selectedPlan || activeReadingDay == null) return;
      if (!selectedVerse) return; // only translate when modal is actually open

      const reading = selectedPlan.readings.find((r) => r.day === activeReadingDay);
      if (!reading) return;
      const cycle = getStudyPlanCycle(selectedPlan.id);
      const insight = mergeInsightOverrides(reading, getStudyInsight(reading, cycle));

      const [insightRes, appRes] = await Promise.all([
        translateTextCached({ text: insight.spiritualInsight ?? "", targetLang: lang }),
        translateTextCached({ text: insight.practicalApplication ?? "", targetLang: lang }),
      ]);

      if (cancelled) return;
      setTranslatedModalInsight(insightRes.text || null);
      setTranslatedModalApplication(appRes.text || null);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [selectedPlan?.id, activeReadingDay, selectedVerse?.reference, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

  const captureModalContent = async () => {
    if (!modalViewRef.current) {
      Alert.alert('Error', 'Unable to capture screenshot. Please try again.');
      return;
    }

    setIsCapturingModal(true);

    try {
      if (Platform.OS === 'web') {
        const html2canvas = (await import('html2canvas')).default;
        const element = modalViewRef.current;
        
        let canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
        });

        // Add watermark with logo and dailybread.app
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const padding = 20;
          const fontSize = 14;
          const logoSize = 24;
          const spacing = 8;
          const watermarkText = 'dailybread.app';
          
          // Load logo
          const logo = new Image();
          logo.crossOrigin = 'anonymous';
          
          const logoPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            logo.onload = () => resolve(logo);
            logo.onerror = () => reject();
            logo.src = '/assets/images/icon.png';
            setTimeout(() => reject(), 2000);
          });

          ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          const textMetrics = ctx.measureText(watermarkText);
          const textWidth = textMetrics.width;
          
          const rectPadding = 10;
          const contentWidth = logoSize + spacing + textWidth;
          const rectWidth = contentWidth + (rectPadding * 2);
          const rectHeight = Math.max(logoSize, fontSize) + (rectPadding * 2);
          
          const rectX = canvas.width - rectWidth - padding;
          const rectY = canvas.height - rectHeight - padding;
          
          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;
          
          // Background - Draw rounded rectangle manually
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          const radius = 8;
          ctx.beginPath();
          ctx.moveTo(rectX + radius, rectY);
          ctx.lineTo(rectX + rectWidth - radius, rectY);
          ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius);
          ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
          ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight);
          ctx.lineTo(rectX + radius, rectY + rectHeight);
          ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
          ctx.lineTo(rectX, rectY + radius);
          ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
          ctx.closePath();
          ctx.fill();
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          // Draw logo or fallback
          try {
            const loadedLogo = await logoPromise;
            const logoX = rectX + rectPadding;
            const logoY = rectY + (rectHeight - logoSize) / 2;
            ctx.drawImage(loadedLogo, logoX, logoY, logoSize, logoSize);
          } catch {
            // Fallback book icon
            const logoX = rectX + rectPadding;
            const logoY = rectY + (rectHeight - logoSize) / 2;
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(logoX + 2, logoY + 2, logoSize - 4, logoSize - 4);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(logoX + 6, logoY + 8, logoSize - 12, 2);
            ctx.fillRect(logoX + 6, logoY + 14, logoSize - 12, 2);
          }
          
          // Draw text
          ctx.fillStyle = '#6366f1';
          ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          
          const textX = rectX + rectPadding + logoSize + spacing;
          const textY = rectY + rectHeight / 2;
          ctx.fillText(watermarkText, textX, textY);
        }

        const uri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = uri;
        link.download = `daily-bread-verse-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert(
          'Screenshot Saved! 📸',
          'Your Bible verse screenshot has been saved with dailybread.app branding.',
          [{ text: 'Great!' }]
        );
      } else {
        // Mobile
        const uri = await captureRef(modalViewRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share from dailybread.app',
          UTI: 'public.png',
        });
      }
    } catch (error) {
      console.error('Error capturing modal:', error);
      Alert.alert(
        'Screenshot Failed',
        'Unable to capture screenshot. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturingModal(false);
    }
  };

  const handleSelectPlan = (plan: BibleStudyPlan) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPlan(plan);
      setTranslatedPlanHeader(null);
      
      if (!contentHistory.studies.includes(plan.id)) {
        markStudyViewed(plan.id);
        addStudyCategory(plan.category);
        analyzeContentInteraction({
          type: 'study',
          content: `${plan.title}: ${plan.description}`,
        });
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Translate selected plan title/description (on demand) when enabled.
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTranslatedPlanHeader(null);
      const lang = userPreferences.appLanguage;
      if (!userPreferences.autoTranslateContent) return;
      if (!lang || lang === "en") return;
      if (!selectedPlan) return;

      const [t1, t2] = await Promise.all([
        translateTextCached({ text: selectedPlan.title, targetLang: lang }),
        translateTextCached({ text: selectedPlan.description, targetLang: lang }),
      ]);
      if (cancelled) return;
      setTranslatedPlanHeader({ title: t1.text, description: t2.text });
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedPlan?.id, userPreferences.appLanguage, userPreferences.autoTranslateContent]);

  const handleBack = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPlan(null);
      setExpandedReadings(new Set()); // Reset expanded state
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
  };

  const toggleReadingExpanded = (day: number) => {
    setExpandedReadings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
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

  if (selectedPlan) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Share Button - Floating Action Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => captureAndShare(`Share this Bible study from Daily Bread: ${selectedPlan.title}`)}
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View ref={viewRef} collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>{t(userPreferences.appLanguage, "study.backToStudies")}</Text>
            </TouchableOpacity>

            <View style={styles.detailHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {translateCategory(selectedPlan.category)}
                </Text>
              </View>
              <Text style={styles.detailTitle}>{translatedPlanHeader?.title ?? selectedPlan.title}</Text>
              <Text style={styles.detailDescription}>
                {translatedPlanHeader?.description ?? selectedPlan.description}
              </Text>
              <View style={styles.durationContainer}>
                <Calendar size={16} color={colors.light.textSecondary} />
                <Text style={styles.durationText}>{formatDuration(selectedPlan.duration)}</Text>
              </View>

              {/* Phase 2: Cycle + progress */}
              {selectedPlan.id === "chronological-book-focused" && (
                <View style={styles.progressPillsRow}>
                  <View style={styles.progressPill}>
                    <Text style={styles.progressPillText}>
                      {tParams(userPreferences.appLanguage, "study.year", { year: getStudyPlanCycle(selectedPlan.id) })}
                    </Text>
                  </View>
                  <View style={styles.progressPillSecondary}>
                    <Text style={styles.progressPillSecondaryText}>
                      {tParams(userPreferences.appLanguage, "study.completedCount", { done: getStudyPlanCompletedDays(selectedPlan.id).length, total: selectedPlan.readings.length })}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.readingsSection}>
              <Text style={styles.sectionTitle}>{t(userPreferences.appLanguage, "study.readingPlan")}</Text>
              {selectedPlan.readings.map((reading) => {
                const isExpanded = expandedReadings.has(reading.day);
                const cycle = getStudyPlanCycle(selectedPlan.id);
                const generated = getStudyInsight(reading, cycle);
                const insight = mergeInsightOverrides(reading, generated);
                const hasInsights = Boolean(insight.spiritualInsight || (insight.keyThemes && insight.keyThemes.length > 0) || insight.practicalApplication);
                const tr = translatedReadings[reading.day];
                
                return (
                  <View key={reading.day} style={styles.readingCardContainer}>
                    <TouchableOpacity
                      style={styles.readingCard}
                      onPress={() => handleReadVerse(reading)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.readingLeft}>
                        <View style={styles.dayBadge}>
                          <Text style={styles.dayBadgeText}>{tParams(userPreferences.appLanguage, "study.day", { day: reading.day })}</Text>
                        </View>
                        <View style={styles.readingContent}>
                          <Text style={styles.readingReference}>
                            {reading.reference}
                          </Text>
                          <Text style={styles.readingFocus}>{tr?.focus ?? reading.focus}</Text>
                        </View>
                      </View>
                      <ChevronRight size={20} color={colors.light.textLight} />
                    </TouchableOpacity>

                    {/* Insights Section */}
                    {hasInsights && (
                      <>
                        <TouchableOpacity
                          style={styles.insightsToggle}
                          onPress={() => toggleReadingExpanded(reading.day)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.insightsToggleContent}>
                            <Lightbulb size={16} color={colors.light.primary} />
                            <Text style={styles.insightsToggleText}>
                              {isExpanded ? t(userPreferences.appLanguage, "study.hideInsights") : t(userPreferences.appLanguage, "study.showInsights")}
                            </Text>
                          </View>
                          {isExpanded ? (
                            <ChevronUp size={18} color={colors.light.primary} />
                          ) : (
                            <ChevronDown size={18} color={colors.light.primary} />
                          )}
                        </TouchableOpacity>

                        {isExpanded && (
                          <View style={styles.insightsContent}>
                            {insight.spiritualInsight && (
                              <View style={styles.insightSection}>
                                <View style={styles.insightHeader}>
                                  <BookOpen size={18} color={colors.light.accent} />
                                  <Text style={styles.insightTitle}>{t(userPreferences.appLanguage, "study.spiritualInsightTitle")}</Text>
                                </View>
                                        <Text style={styles.insightText}>{tr?.spiritualInsight ?? insight.spiritualInsight}</Text>
                              </View>
                            )}

                            {insight.keyThemes && insight.keyThemes.length > 0 && (
                              <View style={styles.insightSection}>
                                <View style={styles.insightHeader}>
                                  <Book size={18} color={colors.light.accent} />
                                  <Text style={styles.insightTitle}>{t(userPreferences.appLanguage, "study.keyThemesTitle")}</Text>
                                </View>
                                        {(tr?.keyThemes && tr.keyThemes.length ? tr.keyThemes : insight.keyThemes).map((theme, idx) => (
                                  <View key={idx} style={styles.themeItem}>
                                    <Text style={styles.themeBullet}>•</Text>
                                    <Text style={styles.themeText}>{theme}</Text>
                                  </View>
                                ))}
                              </View>
                            )}

                            {insight.practicalApplication && (
                              <View style={styles.insightSection}>
                                <View style={styles.insightHeader}>
                                  <Heart size={18} color={colors.light.accent} />
                                  <Text style={styles.insightTitle}>{t(userPreferences.appLanguage, "study.practicalApplicationTitle")}</Text>
                                </View>
                                        <Text style={styles.insightText}>{tr?.practicalApplication ?? insight.practicalApplication}</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </>
                    )}
                  </View>
                );
              })}
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>{t(userPreferences.appLanguage, "study.studyTips")}</Text>
              <Text style={styles.tipText}>{t(userPreferences.appLanguage, "study.tipText")}</Text>
            </View>
          </Animated.View>
        </ScrollView>

        <Modal
          visible={fetchVerseMutation.isPending || selectedVerse !== null}
          transparent
          animationType="fade"
          onRequestClose={handleCloseVerse}
        >
          <View style={styles.modalOverlay}>
            <View ref={modalViewRef} collapsable={false} style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
              
              {fetchVerseMutation.isPending ? (
                <View style={styles.loadingVerseContainer}>
                  <ActivityIndicator size="large" color={colors.light.primary} />
                  <Text style={styles.loadingVerseText}>{t(userPreferences.appLanguage, "study.loadingVerse")}</Text>
                </View>
              ) : selectedVerse ? (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.verseReference}>{translatedVerseRef ?? selectedVerse.reference}</Text>
                    <TouchableOpacity onPress={handleCloseVerse} style={styles.closeButton}>
                      <X size={24} color={colors.light.text} />
                    </TouchableOpacity>
                  </View>

                  {/* Daily Insight (Devotional) */}
                  {selectedPlan && activeReadingDay != null && (
                    (() => {
                      const reading = selectedPlan.readings.find(r => r.day === activeReadingDay);
                      if (!reading) return null;
                      const cycle = getStudyPlanCycle(selectedPlan.id);
                      const insight = mergeInsightOverrides(reading, getStudyInsight(reading, cycle));
                      return (
                        <View style={styles.modalDevotionalCard}>
                          <TouchableOpacity
                            style={styles.modalDevotionalHeader}
                            onPress={() => setIsModalInsightExpanded(v => !v)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.modalDevotionalHeaderLeft}>
                              <Lightbulb size={16} color={colors.light.primary} />
                              <Text style={styles.modalDevotionalTitle}>{t(userPreferences.appLanguage, "study.dailyInsight")}</Text>
                              <Text style={styles.modalDevotionalDay}>{tParams(userPreferences.appLanguage, "study.day", { day: reading.day })}</Text>
                            </View>
                            {isModalInsightExpanded ? (
                              <ChevronUp size={18} color={colors.light.primary} />
                            ) : (
                              <ChevronDown size={18} color={colors.light.primary} />
                            )}
                          </TouchableOpacity>

                          {isModalInsightExpanded && (
                            <View style={styles.modalDevotionalBody}>
                              <Text style={styles.modalDevotionalText}>{translatedModalInsight ?? insight.spiritualInsight}</Text>
                              {insight.practicalApplication ? (
                                <View style={styles.modalDevotionalApplicationRow}>
                                  <Heart size={16} color={colors.light.accent} />
                                  <Text style={styles.modalDevotionalApplicationText}>{translatedModalApplication ?? insight.practicalApplication}</Text>
                                </View>
                              ) : null}
                            </View>
                          )}
                        </View>
                      );
                    })()
                  )}

                  <ScrollView 
                    style={[styles.verseScrollView, { minHeight: isTablet ? 400 : 300 }]}
                    contentContainerStyle={[styles.verseScrollContent, { paddingBottom: 80 }]}
                    showsVerticalScrollIndicator={false}
                  >
                    {verses.map((verse, index) => (
                      <View key={index} style={styles.verseContainer}>
                        <View style={styles.verseNumberContainer}>
                          <Text style={styles.verseNumber}>{verse.number}</Text>
                        </View>
                        <Text style={styles.verseText}>{verse.text}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  
                  {/* Share Button - Inside modal, at bottom-right */}
                  <TouchableOpacity
                    style={styles.modalShareButton}
                    onPress={captureModalContent}
                    disabled={isCapturingModal}
                    activeOpacity={0.8}
                  >
                    {isCapturingModal ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Share2 size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </>
              ) : null}
              {fetchVerseMutation.isError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{t(userPreferences.appLanguage, "study.unableToLoadVerse")}</Text>
                  <TouchableOpacity onPress={handleCloseVerse} style={styles.errorButton}>
                    <Text style={styles.errorButtonText}>{t(userPreferences.appLanguage, "common.close")}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
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
        onPress={() => captureAndShare("Share this Bible study from Daily Bread")}
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 32, 120) }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View ref={viewRef} collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateRow}>
              <Calendar size={20} color={colors.light.textSecondary} />
              <Text style={styles.dateText}>{today}</Text>
            </View>
            <View style={styles.timeRow}>
              <Clock size={20} color={colors.light.textSecondary} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t(userPreferences.appLanguage, "study.subtitle")}
            </Text>
          </View>

          {/* Today's Study Verse */}
          {todayStudyVerse && (
            <View style={styles.todaySection}>
              <View style={styles.todaySectionHeader}>
                <Text style={styles.todaySectionTitle}>📚 {t(userPreferences.appLanguage, "study.todaysStudy")}</Text>
                <Text style={styles.todaySectionSubtitle}>{t(userPreferences.appLanguage, "study.dailyGuidance")}</Text>
              </View>
              <TouchableOpacity
                style={styles.todayVerseCard}
                onPress={() => {
                  setActiveReadingDay(0);
                  setIsModalInsightExpanded(true);
                  fetchVerseMutation.mutate(todayStudyVerse.reference);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.todayIconContainer}>
                  <BookOpen size={32} color={colors.light.primary} />
                </View>
                <View style={styles.todayTextContainer}>
                  <Text style={styles.todayVerseReference}>
                    {translatedStudyVerse?.reference ?? todayStudyVerse.reference}
                  </Text>
                  <Text style={styles.todayVerseText} numberOfLines={2}>
                    &quot;{translatedStudyVerse?.text ?? todayStudyVerse.text}&quot;
                  </Text>
                  <View style={styles.todayVerseFooter}>
                    <Text style={styles.todayVerseTag}>{t(userPreferences.appLanguage, "study.correlatedWithDevotion")}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* All Study Plans */}
          <View style={styles.allStudiesHeader}>
            <Text style={styles.allStudiesTitle}>{t(userPreferences.appLanguage, "study.allPlans")}</Text>
          </View>

          <View style={styles.plansContainer}>
            {recommendedStudies.map((plan) => {
              const translated = translatedPlanCards[plan.id];
              const displayTitle = translated?.title ?? plan.title;
              const displayDesc = translated?.description ?? plan.description;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planCard}
                  onPress={() => handleSelectPlan(plan)}
                  activeOpacity={0.8}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planIconContainer}>
                      <Book size={24} color={colors.light.primary} />
                    </View>
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{translateCategory(plan.category)}</Text>
                    </View>
                  </View>

                  <Text style={styles.planTitle}>{displayTitle}</Text>
                  <Text style={styles.planDescription} numberOfLines={2}>
                    {displayDesc}
                  </Text>

                  <View style={styles.planFooter}>
                    <View style={styles.planDuration}>
                      <Calendar size={14} color={colors.light.textSecondary} />
                      <Text style={styles.planDurationText}>{formatDuration(plan.duration)}</Text>
                    </View>
                    <View style={styles.planReadings}>
                      <Text style={styles.planReadingsText}>
                        {tParams(userPreferences.appLanguage, "study.readingsCount", { count: plan.readings.length })}
                      </Text>
                    </View>
                  </View>
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
    paddingBottom: 32,
  },
  content: {
    padding: isTablet ? 32 : (isSmallScreen ? 16 : 20),
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
  },
  dateText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: colors.light.textSecondary,
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
    color: colors.light.textSecondary,
  },
  todayVerseCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 24 : (isSmallScreen ? 16 : 20),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.light.primary,
  },
  todayVerseReference: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "700" as const,
    color: colors.light.primary,
    marginBottom: 8,
  },
  todayVerseText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.text,
    fontStyle: "italic" as const,
    marginBottom: 12,
  },
  todayVerseFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  todayVerseTag: {
    fontSize: 12,
    color: colors.light.accent,
    fontWeight: "600" as const,
    backgroundColor: `${colors.light.accent}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  todayStudyCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 24 : (isSmallScreen ? 16 : 20),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.light.primary,
  },
  todayIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.light.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  todayTextContainer: {
    flex: 1,
  },
  todayTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  todayTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    flex: 1,
  },
  todayBadge: {
    backgroundColor: `${colors.light.accent}15`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.light.accent,
    textTransform: "uppercase" as const,
  },
  todayDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  todayFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  todayDuration: {
    fontSize: 13,
    color: colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  allStudiesHeader: {
    marginBottom: 16,
  },
  allStudiesTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
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
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  planBadge: {
    backgroundColor: `${colors.light.accent}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.light.primary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 6,
  },
  planDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  planFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  planDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  planDurationText: {
    fontSize: 13,
    color: colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  planReadings: {
    backgroundColor: `${colors.light.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planReadingsText: {
    fontSize: 12,
    color: colors.light.success,
    fontWeight: "600" as const,
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
  categoryBadge: {
    backgroundColor: `${colors.light.accent}20`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.light.primary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
    textAlign: "center" as const,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  detailDescription: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center" as const,
    lineHeight: 22,
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  durationText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  readingsSection: {
    marginBottom: 24,
  },
  progressPillsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  progressPill: {
    backgroundColor: `${colors.light.primary}15`,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: `${colors.light.primary}25`,
  },
  progressPillText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: colors.light.primary,
  },
  progressPillSecondary: {
    backgroundColor: `${colors.light.accent}10`,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: `${colors.light.accent}20`,
  },
  progressPillSecondaryText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.primary,
    marginBottom: 16,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  readingCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  readingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: colors.light.cardBackground,
  },
  readingContent: {
    flex: 1,
  },
  readingReference: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  readingFocus: {
    fontSize: 13,
    color: colors.light.textSecondary,
    lineHeight: 18,
  },
  readingCardContainer: {
    marginBottom: 16,
  },
  insightsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: `${colors.light.primary}10`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: -6,
    marginBottom: 4,
  },
  insightsToggleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightsToggleText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.primary,
  },
  insightsContent: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: `${colors.light.primary}20`,
  },
  insightSection: {
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.light.accent,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.light.text,
  },
  themeItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 8,
  },
  themeBullet: {
    fontSize: 14,
    color: colors.light.accent,
    marginRight: 8,
    fontWeight: "700" as const,
  },
  themeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textSecondary,
  },
  tipCard: {
    backgroundColor: `${colors.light.accent}10`,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.accent,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 20,
    padding: isTablet ? 32 : 24,
    width: "100%",
    maxWidth: isTablet ? 700 : undefined,
    minHeight: isTablet ? "60%" : "50%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  modalDevotionalCard: {
    backgroundColor: `${colors.light.primary}08`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.light.primary}20`,
    marginBottom: 14,
    overflow: "hidden",
  },
  modalDevotionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: `${colors.light.primary}10`,
  },
  modalDevotionalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  modalDevotionalTitle: {
    fontSize: 13,
    fontWeight: "800" as const,
    color: colors.light.primary,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
  modalDevotionalDay: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: colors.light.textSecondary,
    marginLeft: 6,
  },
  modalDevotionalBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  modalDevotionalText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.light.text,
  },
  modalDevotionalApplicationRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  modalDevotionalApplicationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: colors.light.textSecondary,
  },
  verseReference: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.primary,
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.light.text}10`,
    alignItems: "center",
    justifyContent: "center",
  },
  verseScrollView: {
    maxHeight: isTablet ? 500 : 400,
    minHeight: isTablet ? 400 : 300,
  },
  verseScrollContent: {
    paddingBottom: 8,
  },
  verseContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  verseNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  verseNumber: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.light.primary,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 28,
    color: colors.light.text,
    letterSpacing: 0.2,
    fontWeight: "400" as const,
  },
  loadingVerseContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingVerseText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center" as const,
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.cardBackground,
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
  modalShareButton: {
    position: "absolute" as const,
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 22,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
});
