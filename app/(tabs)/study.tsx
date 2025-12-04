import colors from "@/constants/colors";
import { getRecommendedStudies, BibleStudyPlan } from "@/constants/bible-studies";
import { useContent } from "@/contexts/ContentContext";
import { usePersonalization } from "@/hooks/usePersonalization";
import { LinearGradient } from "expo-linear-gradient";
import { Book, Calendar, ChevronRight, X } from "lucide-react-native";
import React, { useState } from "react";
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
} from "react-native";
import { useMutation } from "@tanstack/react-query";

type BibleVerse = {
  reference: string;
  text: string;
};

type FormattedVerse = {
  number: number;
  text: string;
};

export default function BibleStudyScreen() {
  const { contentHistory, userPreferences, markStudyViewed, addStudyCategory, isLoaded } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  const [selectedPlan, setSelectedPlan] = useState<BibleStudyPlan | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [verses, setVerses] = useState<FormattedVerse[]>([]);
  const scrollRef = React.useRef<ScrollView>(null);
  
  const recommendedStudies = getRecommendedStudies(
    contentHistory.studies,
    userPreferences.studyCategories
  );

  const fetchVerseMutation = useMutation({
    mutationFn: async (reference: string): Promise<{ reference: string; verses: { number: number; text: string }[] }> => {
      try {
        console.log('Fetching verse:', reference);
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch verse');
        }
        
        const data = await response.json();
        console.log('Verse fetched successfully');
        
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
    },
  });

  const handleReadVerse = (reference: string) => {
    fetchVerseMutation.mutate(reference);
  };

  const handleCloseVerse = () => {
    setSelectedVerse(null);
    setVerses([]);
  };

  const handleSelectPlan = (plan: BibleStudyPlan) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPlan(plan);
      
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

  const handleBack = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPlan(null);
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

  if (selectedPlan) {
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
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back to Studies</Text>
            </TouchableOpacity>

            <View style={styles.detailHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {selectedPlan.category}
                </Text>
              </View>
              <Text style={styles.detailTitle}>{selectedPlan.title}</Text>
              <Text style={styles.detailDescription}>
                {selectedPlan.description}
              </Text>
              <View style={styles.durationContainer}>
                <Calendar size={16} color={colors.light.textSecondary} />
                <Text style={styles.durationText}>{selectedPlan.duration}</Text>
              </View>
            </View>

            <View style={styles.readingsSection}>
              <Text style={styles.sectionTitle}>Reading Plan</Text>
              {selectedPlan.readings.map((reading) => (
                <TouchableOpacity
                  key={reading.day}
                  style={styles.readingCard}
                  onPress={() => handleReadVerse(reading.reference)}
                  activeOpacity={0.7}
                >
                  <View style={styles.readingLeft}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>Day {reading.day}</Text>
                    </View>
                    <View style={styles.readingContent}>
                      <Text style={styles.readingReference}>
                        {reading.reference}
                      </Text>
                      <Text style={styles.readingFocus}>{reading.focus}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={colors.light.textLight} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Study Tips</Text>
              <Text style={styles.tipText}>
                • Find a quiet place and time for daily reading{'\n'}
                • Read the passage slowly and thoughtfully{'\n'}
                • Journal your thoughts and questions{'\n'}
                • Pray for understanding and application
              </Text>
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
            <View style={styles.modalContent}>
              {fetchVerseMutation.isPending ? (
                <View style={styles.loadingVerseContainer}>
                  <ActivityIndicator size="large" color={colors.light.primary} />
                  <Text style={styles.loadingVerseText}>Loading verse...</Text>
                </View>
              ) : selectedVerse ? (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.verseReference}>{selectedVerse.reference}</Text>
                    <TouchableOpacity onPress={handleCloseVerse} style={styles.closeButton}>
                      <X size={24} color={colors.light.text} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView 
                    style={styles.verseScrollView}
                    contentContainerStyle={styles.verseScrollContent}
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
                </>
              ) : null}
              {fetchVerseMutation.isError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Unable to load verse. Please try again.</Text>
                  <TouchableOpacity onPress={handleCloseVerse} style={styles.errorButton}>
                    <Text style={styles.errorButtonText}>Close</Text>
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
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              Explore Scripture with structured reading plans and insights
            </Text>
          </View>

          <View style={styles.plansContainer}>
            {recommendedStudies.map((plan) => (
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
                    <Text style={styles.planBadgeText}>{plan.category}</Text>
                  </View>
                </View>

                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planDescription} numberOfLines={2}>
                  {plan.description}
                </Text>

                <View style={styles.planFooter}>
                  <View style={styles.planDuration}>
                    <Calendar size={14} color={colors.light.textSecondary} />
                    <Text style={styles.planDurationText}>{plan.duration}</Text>
                  </View>
                  <View style={styles.planReadings}>
                    <Text style={styles.planReadingsText}>
                      {plan.readings.length} readings
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
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
    padding: 24,
    width: "100%",
    maxHeight: "80%",
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
    maxHeight: 400,
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
});
