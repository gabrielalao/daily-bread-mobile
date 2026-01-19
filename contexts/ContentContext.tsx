import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { DEFAULT_BIBLE_VERSION } from '@/constants/bible-versions';
import { DEFAULT_APP_LANGUAGE } from '@/constants/app-languages';

export type ContentHistory = {
  devotionals: string[];
  prayers: string[];
  studies: string[];
  therapy: string[];
  lastUpdated: string;
  currentDayDevotional?: string;
  currentDayPrayer?: string; // ID of daily prayer
  currentDayStudy?: string; // ID of daily study
  currentDayTherapy?: string;
};

export type UserPreferences = {
  topicsOfInterest: string[];
  prayerCategories: string[];
  studyCategories: string[];
  therapyCategories: string[];
  bibleVersion: string;
  appLanguage: string;
  autoTranslateContent: boolean;
};

const CONTENT_HISTORY_KEY = '@content_history';
const USER_PREFERENCES_KEY = '@user_preferences';
const USER_ID_KEY = '@user_unique_id';
const STUDY_PROGRESS_KEY = '@study_plan_progress';

export type StudyPlanProgress = Record<
  string,
  {
    cycle: number; // 1 = year 1, 2 = year 2, ...
    completedDays: number[]; // days completed within current cycle
    cycleStartedAt: string; // ISO timestamp
    lastCompletedAt?: string; // ISO timestamp
    lastDayCompleted?: number;
  }
>;

export const [ContentProvider, useContent] = createContextHook(() => {
  const [contentHistory, setContentHistory] = useState<ContentHistory>({
    devotionals: [],
    prayers: [],
    studies: [],
    therapy: [],
    lastUpdated: new Date().toISOString(),
    currentDayDevotional: undefined,
    currentDayPrayer: undefined,
    currentDayStudy: undefined,
    currentDayTherapy: undefined,
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    topicsOfInterest: [],
    prayerCategories: [],
    studyCategories: [],
    therapyCategories: [],
    bibleVersion: DEFAULT_BIBLE_VERSION,
    appLanguage: DEFAULT_APP_LANGUAGE,
    autoTranslateContent: false,
  });

  const [userId, setUserId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [studyPlanProgress, setStudyPlanProgress] = useState<StudyPlanProgress>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let storedUserId = await AsyncStorage.getItem(USER_ID_KEY);
      if (!storedUserId) {
        storedUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        await AsyncStorage.setItem(USER_ID_KEY, storedUserId);
        console.log('Generated new unique user ID:', storedUserId);
      } else {
        console.log('Loaded existing user ID:', storedUserId);
      }
      setUserId(storedUserId);

      const [historyData, preferencesData] = await Promise.all([
        AsyncStorage.getItem(CONTENT_HISTORY_KEY),
        AsyncStorage.getItem(USER_PREFERENCES_KEY),
      ]);

      if (historyData) {
        const parsed = JSON.parse(historyData);
        const lastUpdated = new Date(parsed.lastUpdated);
        const now = new Date();
        const hoursSinceLastUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastUpdate >= 12) {
          console.log(`Content refresh: ${hoursSinceLastUpdate.toFixed(1)} hours since last update`);
          const resetHistory: ContentHistory = {
            devotionals: [],
            prayers: [],
            studies: [],
            therapy: [],
            lastUpdated: now.toISOString(),
            currentDayDevotional: undefined,
            currentDayPrayer: undefined,
            currentDayStudy: undefined,
            currentDayTherapy: undefined,
          };
          await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(resetHistory));
          setContentHistory(resetHistory);
        } else {
          console.log(`Content still fresh: ${hoursSinceLastUpdate.toFixed(1)} hours since last update`);
          // Migrate old data structure to new structure
          const migratedData: ContentHistory = {
            devotionals: parsed.devotionals || [],
            prayers: parsed.prayers || [],
            studies: parsed.studies || [],
            therapy: parsed.therapy || [],
            lastUpdated: parsed.lastUpdated,
            currentDayDevotional: parsed.currentDayDevotional,
            currentDayPrayer: parsed.currentDayPrayer,
            currentDayStudy: parsed.currentDayStudy,
            currentDayTherapy: parsed.currentDayTherapy,
          };
          setContentHistory(migratedData);
        }
      }

      if (preferencesData) {
        const parsed = JSON.parse(preferencesData);
        setUserPreferences({
          topicsOfInterest: parsed.topicsOfInterest || [],
          prayerCategories: parsed.prayerCategories || [],
          studyCategories: parsed.studyCategories || [],
          therapyCategories: parsed.therapyCategories || [],
          bibleVersion: parsed.bibleVersion || DEFAULT_BIBLE_VERSION,
          appLanguage: parsed.appLanguage || DEFAULT_APP_LANGUAGE,
          autoTranslateContent: Boolean(parsed.autoTranslateContent),
        });
      }

      // Load study plan progress (separate from content refresh)
      const progressData = await AsyncStorage.getItem(STUDY_PROGRESS_KEY);
      if (progressData) {
        setStudyPlanProgress(JSON.parse(progressData) as StudyPlanProgress);
      }
    } catch (error) {
      console.error('Error loading content data:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveStudyProgress = async (next: StudyPlanProgress) => {
    setStudyPlanProgress(next);
    await AsyncStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(next));
  };

  const getStudyPlanCycle = (planId: string) => {
    return studyPlanProgress[planId]?.cycle ?? 1;
  };

  const getStudyPlanCompletedDays = (planId: string) => {
    return studyPlanProgress[planId]?.completedDays ?? [];
  };

  const markStudyDayCompleted = async (planId: string, day: number, totalDays?: number) => {
    const existing = studyPlanProgress[planId];
    const cycle = existing?.cycle ?? 1;
    const completedDays = new Set(existing?.completedDays ?? []);
    completedDays.add(day);

    const nextEntry = {
      cycle,
      completedDays: Array.from(completedDays).sort((a, b) => a - b),
      cycleStartedAt: existing?.cycleStartedAt ?? new Date().toISOString(),
      lastCompletedAt: new Date().toISOString(),
      lastDayCompleted: day,
    };

    const next = { ...studyPlanProgress, [planId]: nextEntry };
    await saveStudyProgress(next);

    const didCompleteCycle = Boolean(totalDays && nextEntry.completedDays.length >= totalDays);
    return { didCompleteCycle, cycle };
  };

  const advanceStudyPlanCycle = async (planId: string) => {
    const existing = studyPlanProgress[planId];
    const nextCycle = (existing?.cycle ?? 1) + 1;
    const nextEntry = {
      cycle: nextCycle,
      completedDays: [],
      cycleStartedAt: new Date().toISOString(),
      lastCompletedAt: undefined,
      lastDayCompleted: undefined,
    };
    const next = { ...studyPlanProgress, [planId]: nextEntry };
    await saveStudyProgress(next);
    return nextCycle;
  };

  const markDevotionalViewed = async (devotionalId: string) => {
    const updated = {
      ...contentHistory,
      devotionals: [...new Set([...contentHistory.devotionals, devotionalId])],
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const setCurrentDayDevotional = async (devotionalId: string) => {
    const updated = {
      ...contentHistory,
      currentDayDevotional: devotionalId,
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const setCurrentDayPrayer = async (prayerId: string) => {
    const updated = {
      ...contentHistory,
      currentDayPrayer: prayerId,
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const setCurrentDayStudy = async (studyId: string) => {
    const updated = {
      ...contentHistory,
      currentDayStudy: studyId,
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const markPrayerViewed = async (prayerId: string) => {
    const updated = {
      ...contentHistory,
      prayers: [...new Set([...contentHistory.prayers, prayerId])],
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const markStudyViewed = async (studyId: string) => {
    const updated = {
      ...contentHistory,
      studies: [...new Set([...contentHistory.studies, studyId])],
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    const updated = { ...userPreferences, ...preferences };
    setUserPreferences(updated);
    await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
  };

  const addTopicOfInterest = async (topic: string) => {
    const topics = [...new Set([...userPreferences.topicsOfInterest, topic])];
    await updatePreferences({ topicsOfInterest: topics });
  };

  const addPrayerCategory = async (category: string) => {
    const categories = [...new Set([...userPreferences.prayerCategories, category])];
    await updatePreferences({ prayerCategories: categories });
  };

  const addStudyCategory = async (category: string) => {
    const categories = [...new Set([...userPreferences.studyCategories, category])];
    await updatePreferences({ studyCategories: categories });
  };

  const markTherapyViewed = async (therapyId: string) => {
    const updated = {
      ...contentHistory,
      therapy: [...new Set([...contentHistory.therapy, therapyId])],
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const setCurrentDayTherapy = async (therapyId: string) => {
    const updated = {
      ...contentHistory,
      currentDayTherapy: therapyId,
    };
    setContentHistory(updated);
    await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
  };

  const addTherapyCategory = async (category: string) => {
    const categories = [...new Set([...userPreferences.therapyCategories, category])];
    await updatePreferences({ therapyCategories: categories });
  };

  const setBibleVersion = async (version: string) => {
    await updatePreferences({ bibleVersion: version });
  };

  const setAppLanguage = async (languageId: string) => {
    // If the user selects a non-English UI language, auto-enable content translation so
    // the app reads fully in that language (they can still turn it off manually).
    if (languageId && languageId !== 'en' && !userPreferences.autoTranslateContent) {
      await updatePreferences({ appLanguage: languageId, autoTranslateContent: true });
      return;
    }
    await updatePreferences({ appLanguage: languageId });
  };

  const setAutoTranslateContent = async (enabled: boolean) => {
    await updatePreferences({ autoTranslateContent: enabled });
  };

  return {
    contentHistory,
    userPreferences,
    userId,
    isLoaded,
    studyPlanProgress,
    markDevotionalViewed,
    markPrayerViewed,
    markStudyViewed,
    markTherapyViewed,
    updatePreferences,
    addTopicOfInterest,
    addPrayerCategory,
    addStudyCategory,
    addTherapyCategory,
    setCurrentDayDevotional,
    setCurrentDayPrayer,
    setCurrentDayStudy,
    setCurrentDayTherapy,
    setBibleVersion,
    setAppLanguage,
    setAutoTranslateContent,
    getStudyPlanCycle,
    getStudyPlanCompletedDays,
    markStudyDayCompleted,
    advanceStudyPlanCycle,
  };
});
