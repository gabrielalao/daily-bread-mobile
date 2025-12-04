import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type NotificationSettings = {
  enabled: boolean;
  time: string;
  permissionGranted: boolean;
};

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';
const DEFAULT_TIME = '07:00';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
    if (Platform.OS === 'web') {
      setSettings(prev => ({ ...prev, permissionGranted: false }));
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    const granted = existingStatus === 'granted';
    setSettings(prev => ({ ...prev, permissionGranted: granted }));
  };

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
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
    if (Platform.OS === 'web') {
      console.log('Cannot schedule notifications on web');
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const [hours, minutes] = time.split(':').map(Number);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Bread 📖',
          body: 'Your daily devotional is ready. Take a moment with God today.',
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
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
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
