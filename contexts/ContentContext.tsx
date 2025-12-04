import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

export type ContentHistory = {
  devotionals: string[];
  prayers: string[];
  studies: string[];
  therapy: string[];
  lastUpdated: string;
  currentDayDevotional?: string;
  currentDayTherapy?: string;
};

export type UserPreferences = {
  topicsOfInterest: string[];
  prayerCategories: string[];
  studyCategories: string[];
  therapyCategories: string[];
};

const CONTENT_HISTORY_KEY = '@content_history';
const USER_PREFERENCES_KEY = '@user_preferences';
const USER_ID_KEY = '@user_unique_id';

export const [ContentProvider, useContent] = createContextHook(() => {
  const [contentHistory, setContentHistory] = useState<ContentHistory>({
    devotionals: [],
    prayers: [],
    studies: [],
    therapy: [],
    lastUpdated: new Date().toISOString(),
    currentDayDevotional: undefined,
    currentDayTherapy: undefined,
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    topicsOfInterest: [],
    prayerCategories: [],
    studyCategories: [],
    therapyCategories: [],
  });

  const [userId, setUserId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

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
            currentDayTherapy: undefined,
          };
          await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(resetHistory));
          setContentHistory(resetHistory);
        } else {
          console.log(`Content still fresh: ${hoursSinceLastUpdate.toFixed(1)} hours since last update`);
          const migratedData: ContentHistory = {
            devotionals: parsed.devotionals || [],
            prayers: parsed.prayers || [],
            studies: parsed.studies || [],
            therapy: parsed.therapy || [],
            lastUpdated: parsed.lastUpdated,
            currentDayDevotional: parsed.currentDayDevotional,
            currentDayTherapy: parsed.currentDayTherapy,
          };
          setContentHistory(migratedData);
        }
      }

      if (preferencesData) {
        setUserPreferences(JSON.parse(preferencesData));
      }
    } catch (error) {
      console.error('Error loading content data:', error);
    } finally {
      setIsLoaded(true);
    }
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

  return {
    contentHistory,
    userPreferences,
    userId,
    isLoaded,
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
    setCurrentDayTherapy,
  };
});
