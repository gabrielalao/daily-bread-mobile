import colors from "@/constants/colors";
import { devotionals, getPersonalizedDevotional, type Devotional } from "@/constants/devotionals";
import { useContent } from "@/contexts/ContentContext";
import { usePersonalization } from "@/hooks/usePersonalization";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Calendar, Clock } from "lucide-react-native";
import React, { useState, useEffect, useMemo } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

export default function HomeScreen() {
  const { contentHistory, userPreferences, markDevotionalViewed, isLoaded, setCurrentDayDevotional } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = React.useRef<ScrollView>(null);
  
  const devotional = useMemo<Devotional>(() => {
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
  }, [contentHistory.currentDayDevotional, contentHistory.devotionals, userPreferences.topicsOfInterest]);

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
    if (isLoaded && devotional) {
      if (contentHistory.currentDayDevotional !== devotional.id) {
        setCurrentDayDevotional(devotional.id);
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
  }, [devotional, isLoaded, contentHistory.currentDayDevotional, contentHistory.devotionals, setCurrentDayDevotional, markDevotionalViewed, analyzeContentInteraction]);

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

  const today = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

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
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <View style={styles.dateTimeRow}>
              <View style={styles.dateContainer}>
                <Calendar size={18} color={colors.light.textSecondary} />
                <Text style={styles.dateText}>{today}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Clock size={18} color={colors.light.textSecondary} />
                <Text style={styles.timeText}>{time}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Today&apos;s devotional message for your spiritual journey</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <BookOpen size={24} color={colors.light.primary} />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{devotional.title}</Text>
                <Text style={styles.scripture}>{devotional.scripture}</Text>
              </View>
            </View>

            <View style={styles.verseContainer}>
              <View style={styles.quoteMarkContainer}>
                <Text style={styles.quoteMark}>&quot;</Text>
              </View>
              <Text style={styles.verse}>{devotional.verse}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reflectionContainer}>
              <Text style={styles.reflectionTitle}>Today&apos;s Reflection</Text>
              <Text style={styles.reflection}>{devotional.reflection}</Text>
            </View>
          </View>

          <View style={styles.prayerPrompt}>
            <Text style={styles.prayerPromptTitle}>Take a moment to pray</Text>
            <Text style={styles.prayerPromptText}>
              Lord, thank You for Your Word today. Help me carry this truth with me
              and live it out in my daily life. Amen.
            </Text>
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  greeting: {
    fontSize: 32,
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
  card: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.light.border,
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
    backgroundColor: `${colors.light.primary}15`,
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
    marginBottom: 4,
    lineHeight: 28,
  },
  scripture: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
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
    color: colors.light.accent,
    fontWeight: "700" as const,
    opacity: 0.3,
  },
  verse: {
    fontSize: 17,
    lineHeight: 28,
    color: colors.light.text,
    fontStyle: "italic" as const,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 20,
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
    backgroundColor: `${colors.light.success}15`,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.success,
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
  },
  loadingText: {
    fontSize: 16,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
});
