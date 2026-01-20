import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if we're in Expo Go BEFORE importing
const isExpoGo = Constants.appOwnership === 'expo';

// Dynamically import notifications with error handling
let Notifications: any = null;

// Only import notifications if not in Expo Go on Android
if (!(isExpoGo && Platform.OS === 'android')) {
  try {
    Notifications = require('expo-notifications');
  } catch (error) {
    console.log('expo-notifications not available, scheduled sessions notifications disabled');
  }
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export type ScheduledSession = {
  id: string;
  dateTime: Date;
  title: string;
  message: string;
  notificationId?: string;
  completed: boolean;
  createdAt: Date;
  recurrence: RecurrenceType;
  recurrenceEndDate?: Date;
};

const SCHEDULED_SESSIONS_KEY = '@scheduled_therapy_sessions';

// Configure notification channel for Android with alarm-like behavior
const setupNotificationChannel = async () => {
  if (!Notifications) return;
  
  // Skip in Expo Go on Android
  if (isExpoGo && Platform.OS === 'android') {
    console.log('Scheduled sessions notifications require a development build on Android.');
    return;
  }

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('therapy-sessions', {
        name: 'Therapy Session Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250], // Vibrate pattern
        sound: 'default', // Use default notification sound
        enableVibrate: true,
        enableLights: true,
        lightColor: '#6366f1',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: false, // Don't bypass Do Not Disturb
        description: 'Reminders for your scheduled therapy sessions with sound and vibration',
      });
      console.log('Therapy notification channel configured');
    } catch (error) {
      console.warn('Error setting up notification channel:', error);
    }
  }
};

export const [ScheduledSessionsProvider, useScheduledSessions] = createContextHook(() => {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSessions();
    setupNotificationChannel(); // Setup notification channel on mount
  }, []);

  const loadSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem(SCHEDULED_SESSIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          dateTime: new Date(session.dateTime),
          createdAt: new Date(session.createdAt),
        }));
        // Filter out past sessions
        const upcomingSessions = sessionsWithDates.filter(
          (session: ScheduledSession) => !session.completed && session.dateTime > new Date()
        );
        setSessions(upcomingSessions);
      }
    } catch (error) {
      console.error('Error loading scheduled sessions:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveSessions = async (updatedSessions: ScheduledSession[]) => {
    try {
      await AsyncStorage.setItem(SCHEDULED_SESSIONS_KEY, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Error saving scheduled sessions:', error);
    }
  };

  const scheduleSession = async (
    dateTime: Date,
    title: string = 'Therapy Session Reminder',
    message: string = "It's time for your scheduled therapy session. Take a moment for yourself.",
    recurrence: RecurrenceType = 'none',
    recurrenceEndDate?: Date
  ): Promise<string | null> => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      // Still save the session, just without notification
      const sessionId = `session-${Date.now()}`;
      const newSession: ScheduledSession = {
        id: sessionId,
        dateTime,
        title,
        message,
        completed: false,
        createdAt: new Date(),
        recurrence,
        recurrenceEndDate,
      };
      await saveSessions([...sessions, newSession]);
      return sessionId;
    }

    try {
      // Check notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return null;
      }

      // Schedule the notification with alarm-like behavior
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          sound: true, // Enable sound
          priority: Notifications.AndroidNotificationPriority.MAX, // Maximum priority
          vibrate: [0, 250, 250, 250], // Vibration pattern
          data: { 
            type: 'therapy_session',
            sessionId: `session-${Date.now()}`,
          },
          // Android-specific
          ...(Platform.OS === 'android' && {
            channelId: 'therapy-sessions',
            sticky: false,
            autoDismiss: true,
          }),
          // iOS-specific - make it more prominent
          ...(Platform.OS === 'ios' && {
            sound: 'default',
            badge: 1,
            categoryIdentifier: 'therapy_session',
          }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: dateTime,
        },
      });

      // Save the session
      const sessionId = `session-${Date.now()}`;
      const newSession: ScheduledSession = {
        id: sessionId,
        dateTime,
        title,
        message,
        notificationId,
        completed: false,
        createdAt: new Date(),
        recurrence,
        recurrenceEndDate,
      };

      await saveSessions([...sessions, newSession]);
      console.log(`Scheduled therapy session for ${dateTime.toLocaleString()}`);
      return sessionId;
    } catch (error) {
      console.error('Error scheduling session:', error);
      return null;
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (session && session.notificationId && Platform.OS !== 'web') {
        await Notifications.cancelScheduledNotificationAsync(session.notificationId);
      }

      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      await saveSessions(updatedSessions);
      console.log(`Cancelled session: ${sessionId}`);
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const markSessionCompleted = async (sessionId: string) => {
    try {
      const updatedSessions = sessions.map(s =>
        s.id === sessionId ? { ...s, completed: true } : s
      );
      await saveSessions(updatedSessions);
    } catch (error) {
      console.error('Error marking session completed:', error);
    }
  };

  const getUpcomingSessions = (): ScheduledSession[] => {
    return sessions
      .filter(s => !s.completed && s.dateTime > new Date())
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  };

  const getNextSession = (): ScheduledSession | null => {
    const upcoming = getUpcomingSessions();
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const updateSession = async (
    sessionId: string,
    updates: Partial<ScheduledSession>
  ): Promise<boolean> => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        return false;
      }

      // Cancel old notification if exists
      if (session.notificationId && Platform.OS !== 'web') {
        await Notifications.cancelScheduledNotificationAsync(session.notificationId);
      }

      // Create updated session
      const updatedSession = { ...session, ...updates };

      // Schedule new notification if date/time changed
      if (updates.dateTime && Platform.OS !== 'web') {
        try {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: updatedSession.title,
              body: updatedSession.message,
              sound: true,
              priority: Notifications.AndroidNotificationPriority.MAX,
              vibrate: [0, 250, 250, 250],
              data: { 
                type: 'therapy_session',
                sessionId,
              },
              ...(Platform.OS === 'android' && {
                channelId: 'therapy-sessions',
                sticky: false,
                autoDismiss: true,
              }),
              ...(Platform.OS === 'ios' && {
                sound: 'default',
                badge: 1,
                categoryIdentifier: 'therapy_session',
              }),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: updatedSession.dateTime,
            },
          });
          updatedSession.notificationId = notificationId;
        } catch (error) {
          console.error('Error rescheduling notification:', error);
        }
      }

      // Update sessions array
      const updatedSessions = sessions.map(s => 
        s.id === sessionId ? updatedSession : s
      );
      await saveSessions(updatedSessions);
      
      console.log(`Updated session: ${sessionId}`);
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  };

  const getNextOccurrence = (session: ScheduledSession): Date | null => {
    if (session.recurrence === 'none') {
      return session.dateTime > new Date() ? session.dateTime : null;
    }

    const now = new Date();
    let nextDate = new Date(session.dateTime);

    while (nextDate <= now) {
      switch (session.recurrence) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
      }

      if (session.recurrenceEndDate && nextDate > session.recurrenceEndDate) {
        return null;
      }
    }

    return nextDate;
  };

  return {
    sessions,
    isLoaded,
    scheduleSession,
    cancelSession,
    markSessionCompleted,
    updateSession,
    getUpcomingSessions,
    getNextSession,
    getNextOccurrence,
  };
});
