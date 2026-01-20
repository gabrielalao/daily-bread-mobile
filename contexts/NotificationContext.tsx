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
    console.log('expo-notifications not available, notifications disabled');
  }
}

export type NotificationSettings = {
  enabled: boolean;
  time: string;
  permissionGranted: boolean;
};

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';
const DEFAULT_TIME = '07:00';

// Only set notification handler if notifications are available and conditions are met
if (Notifications && (!isExpoGo || Platform.OS === 'ios')) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (error) {
    console.log('Could not set notification handler:', error);
  }
}

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    time: DEFAULT_TIME,
    permissionGranted: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPermission();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const checkPermission = async () => {
    if (Platform.OS === 'web' || !Notifications) {
      setSettings(prev => ({ ...prev, permissionGranted: false }));
      return;
    }

    // Skip permission check in Expo Go on Android (SDK 53+)
    if (isExpoGo && Platform.OS === 'android') {
      console.log('Notifications not available in Expo Go on Android. Use a development build.');
      setSettings(prev => ({ ...prev, permissionGranted: false }));
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      const granted = existingStatus === 'granted';
      setSettings(prev => ({ ...prev, permissionGranted: granted }));
    } catch (error) {
      console.warn('Error checking notification permissions:', error);
      setSettings(prev => ({ ...prev, permissionGranted: false }));
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web' || !Notifications) {
      console.log('Notifications not supported');
      return false;
    }

    // Skip in Expo Go on Android
    if (isExpoGo && Platform.OS === 'android') {
      console.log('Notifications require a development build on Android.');
      return false;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setSettings(prev => ({ ...prev, permissionGranted: granted }));
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const scheduleDailyNotification = async (time: string) => {
    if (Platform.OS === 'web' || !Notifications) {
      console.log('Cannot schedule notifications');
      return;
    }

    // Skip in Expo Go on Android
    if (isExpoGo && Platform.OS === 'android') {
      console.log('Notification scheduling requires a development build on Android.');
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const [hours, minutes] = time.split(':').map(Number);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Christian Daily Bread 📖🙏📚',
          body: 'Your daily devotional, prayer, and Bible study are ready. Spend time with God today.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hours,
          minute: minutes,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
      });

      console.log(`Daily notification scheduled for ${time}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const enableNotifications = async (time: string) => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return false;
    }

    const hasPermission = settings.permissionGranted || (await requestPermission());

    if (!hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    await scheduleDailyNotification(time);

    const updated: NotificationSettings = {
      enabled: true,
      time,
      permissionGranted: hasPermission,
    };

    setSettings(updated);
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
    return true;
  };

  const disableNotifications = async () => {
    // Cancel scheduled notifications if available
    if (Platform.OS !== 'web' && Notifications) {
      // Skip in Expo Go on Android
      if (!(isExpoGo && Platform.OS === 'android')) {
        try {
          await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
          console.warn('Error canceling notifications:', error);
        }
      }
    }

    const updated: NotificationSettings = {
      ...settings,
      enabled: false,
    };

    setSettings(updated);
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
  };

  const updateNotificationTime = async (time: string) => {
    if (settings.enabled) {
      await scheduleDailyNotification(time);
    }

    const updated: NotificationSettings = {
      ...settings,
      time,
    };

    setSettings(updated);
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
  };

  return {
    settings,
    isLoaded,
    requestPermission,
    enableNotifications,
    disableNotifications,
    updateNotificationTime,
  };
});
