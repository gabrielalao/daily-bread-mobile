import colors from "@/constants/colors";
import { useNotifications } from "@/contexts/NotificationContext";
import { useContent } from "@/contexts/ContentContext";
import { useScheduledSessions, type ScheduledSession } from "@/contexts/ScheduledSessionsContext";
import { ScheduleNextSessionModal } from "@/components/ScheduleNextSessionModal";
import { getVersionById } from "@/constants/bible-versions";
import { appLanguages, getAppLanguageById } from "@/constants/app-languages";
import { t, tParams } from "@/utils/i18n";
import { NetworkStatusDot } from "@/components/NetworkStatusDot";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { requireOnlineOrPrompt } from "@/utils/networkPolicy";
import { BibleVersionPickerModal } from "@/components/BibleVersionPickerModal";
import { getEffectiveBibleVersionId } from "@/utils/bibleVersionPolicy";
import { A11yText as Text } from "@/components/A11yText";
import { TrialBanner } from "@/components/TrialBanner";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Constants from "expo-constants";
import { Bell, BellOff, Clock, FileText, Shield, HelpCircle, ChevronRight, BookOpen, Check, Calendar as CalendarIcon, Share2, Edit3, Trash2, Plus, Play, CreditCard, RefreshCw, ArrowRightLeft } from "lucide-react-native";
import React, { useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Alert,
  Platform,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
  Share,
  Dimensions,
  Linking,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, enableNotifications, disableNotifications, updateNotificationTime } = useNotifications();
  const { isSubscribed, restorePurchases } = useSubscription();
  const {
    userPreferences,
    setBibleVersion,
    setAppLanguage,
    setAutoTranslateContent,
    setOfflineModeEnabled,
    setAccessibilityLargeTextEnabled,
    setAccessibilityDyslexiaFontEnabled,
    setAccessibilityBoldTextEnabled,
    setAutoPlayDailyAudio,
  } = useContent();
  const { scheduleSession, cancelSession, updateSession, getUpcomingSessions } = useScheduledSessions();
  const { isOnline } = useNetworkStatus();
  const tLang = userPreferences.appLanguage;
  const [selectedHour, setSelectedHour] = useState(parseInt(settings.time.split(':')[0]));
  const [selectedMinute, setSelectedMinute] = useState(parseInt(settings.time.split(':')[1]));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showBibleVersionPicker, setShowBibleVersionPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [languageQuery, setLanguageQuery] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showOfflineOnlineFaqModal, setShowOfflineOnlineFaqModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  
  const upcomingSessions = getUpcomingSessions();

  const openManageSubscriptions = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "Subscription management is available on iOS/Android.");
      return;
    }

    const iosUrl = "https://apps.apple.com/account/subscriptions";

    const androidPackage =
      Constants.expoConfig?.android?.package ??
      // fallback to known value from app.json
      "app.rork.daily_bread_app_mp9wlbr";
    const androidUrl = `https://play.google.com/store/account/subscriptions?package=${encodeURIComponent(androidPackage)}`;

    const url = Platform.OS === "ios" ? iosUrl : androidUrl;

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("Unable to open", "Could not open subscription management on this device.");
      return;
    }
    await Linking.openURL(url);
  };

  const openChangePlan = () => {
    router.push("/paywall");
  };

  const handleRestore = async () => {
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert("Restored", "Your subscription has been restored.");
      }
    } catch (e: any) {
      Alert.alert("Restore failed", e?.message ?? "Unable to restore purchases. Please try again.");
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not Available',
        'Push notifications are not supported on web. Please use the mobile app to receive daily notifications.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (value) {
      const time = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
      const success = await enableNotifications(time);

      if (!success) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive daily reminders.',
          [{ text: 'OK' }]
        );
      }
    } else {
      await disableNotifications();
    }
  };

  const handleTimeChange = async () => {
    const time = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    await updateNotificationTime(time);

    if (settings.enabled) {
      Alert.alert(
        'Time Updated',
        `You will now receive daily notifications at ${formatTime(time)}`,
        [{ text: 'OK' }]
      );
    }

    setShowTimePicker(false);
  };

  const handleBibleVersionChange = async (versionId: string) => {
    const doChange = async () => {
      await setBibleVersion(versionId);
      const version = getVersionById(versionId);
      Alert.alert(
        t(tLang, "settings.bibleVersionUpdatedTitle"),
        tParams(tLang, "settings.bibleVersionUpdatedBody", { name: version?.name ?? versionId, abbr: version?.abbreviation ?? "" }),
        [{ text: t(tLang, "common.ok") }]
      );
    };

    // If offline mode is enabled and they pick non-KJV, allow saving the preference but explain that KJV will be shown until Online mode.
    if (userPreferences.offlineModeEnabled && versionId !== "kjv") {
      await requireOnlineOrPrompt({
        feature: "bibleVersions",
        offlineModeEnabled: userPreferences.offlineModeEnabled,
        isOnline,
        setOfflineModeEnabled,
        onContinue: doChange,
      });
      return;
    }

    await doChange();
  };

  const handleLanguageChange = async (langId: string) => {
    if (userPreferences.offlineModeEnabled && langId !== "en") {
      await requireOnlineOrPrompt({
        feature: "translation",
        offlineModeEnabled: userPreferences.offlineModeEnabled,
        isOnline,
        setOfflineModeEnabled,
        onContinue: async () => {
          await setAppLanguage(langId);
        },
      });
      return;
    }
    await setAppLanguage(langId);
    const language = getAppLanguageById(langId);
    setShowLanguagePicker(false);
    Alert.alert(
      t(langId, "settings.languageUpdatedTitle"),
      tParams(langId, "settings.languageUpdatedBody", { name: language?.name ?? langId }),
      [{ text: t(langId, "common.ok") }]
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: t(tLang, "settings.shareMessage"),
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleScheduleSession = async (
    dateTime: Date,
    recurrence: any,
    recurrenceEndDate?: Date
  ) => {
    try {
      await scheduleSession(
        dateTime,
        'Therapy Session Reminder',
        "It's time for your scheduled therapy session. Take a moment for yourself.",
        recurrence,
        recurrenceEndDate
      );
      setShowScheduleModal(false);
      Alert.alert(
        'Session Scheduled',
        `Your therapy session has been scheduled for ${dateTime.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })} at ${dateTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error scheduling session:', error);
      Alert.alert('Error', 'Failed to schedule session. Please try again.');
    }
  };

  const handleUpdateSession = async (
    sessionId: string,
    dateTime: Date,
    recurrence: any,
    recurrenceEndDate?: Date
  ) => {
    try {
      const success = await updateSession(sessionId, {
        dateTime,
        recurrence,
        recurrenceEndDate,
      });
      
      if (success) {
        setShowScheduleModal(false);
        setEditingSession(null);
        Alert.alert(
          'Session Updated',
          `Your therapy session has been updated to ${dateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })} at ${dateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to update session. Please try again.');
      }
    } catch (error) {
      console.error('Error updating session:', error);
      Alert.alert('Error', 'Failed to update session. Please try again.');
    }
  };

  const openTermsOfService = () => {
    setShowTermsModal(true);
  };

  const openPrivacyPolicy = () => {
    setShowPrivacyModal(true);
  };

  const openSupport = () => {
    setShowSupportModal(true);
  };

  const openOfflineOnlineFaq = () => {
    setShowOfflineOnlineFaqModal(true);
  };

  const currentVersion = getVersionById(userPreferences.bibleVersion);
  const currentLanguage = getAppLanguageById(userPreferences.appLanguage);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const effectiveVersionId = getEffectiveBibleVersionId({
    preferredVersionId: userPreferences.bibleVersion,
    offlineModeEnabled: userPreferences.offlineModeEnabled,
  });
  const effectiveVersion = getVersionById(effectiveVersionId);

  const filteredLanguages = languageQuery
    ? appLanguages.filter(l =>
        l.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
      )
    : appLanguages;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TrialBanner />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>{t(tLang, "settings.title")}</Text>
              <NetworkStatusDot />
            </View>
            <Text style={styles.subtitle}>{t(tLang, "settings.subtitle")}</Text>
          </View>

          {/* Billing & Subscription Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Billing &amp; Subscription Management</Text>
            <Text style={styles.sectionSubtitle}>
              {isSubscribed
                ? "Manage your subscription, switch plans, or restore purchases."
                : "Manage your plan, subscribe, or restore purchases."}
            </Text>

            <View style={styles.settingCard}>
              <TouchableOpacity style={styles.settingRow} onPress={openManageSubscriptions}>
                <View style={styles.iconContainer}>
                  <CreditCard size={22} color={colors.light.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Manage subscription</Text>
                  <Text style={styles.settingDescription}>Open App Store / Google Play subscription settings</Text>
                </View>
                <ChevronRight size={20} color={colors.light.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingRow} onPress={openChangePlan}>
                <View style={styles.iconContainer}>
                  <ArrowRightLeft size={22} color={colors.light.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Change plan</Text>
                  <Text style={styles.settingDescription}>Switch between monthly and annual</Text>
                </View>
                <ChevronRight size={20} color={colors.light.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingRow} onPress={handleRestore}>
                <View style={styles.iconContainer}>
                  <RefreshCw size={22} color={colors.light.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Restore purchases</Text>
                  <Text style={styles.settingDescription}>If you already subscribed on this Apple/Google account</Text>
                </View>
                <ChevronRight size={20} color={colors.light.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* What's Free vs Premium */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What&apos;s free?</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Free forever</Text>
              <Text style={styles.infoText}>
                • Daily Devotionals{'\n'}
                • Prayer Guidance{'\n'}
                • KJV Bible
              </Text>
              <Text style={[styles.infoTitle, { marginTop: 14 }]}>Premium</Text>
              <Text style={styles.infoText}>
                • AI Therapy{'\n'}
                • Worship Music{'\n'}
                • Study Plans{'\n'}
                • Bible translations (NIV and more)
              </Text>
            </View>
          </View>

          {/* Daily Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(tLang, "settings.dailyNotifications")}</Text>
            <Text style={styles.sectionSubtitle}>{t(tLang, "settings.notificationDescription")}</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  {settings.enabled ? (
                    <Bell size={22} color={colors.light.primary} />
                  ) : (
                    <BellOff size={22} color={colors.light.textSecondary} />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>{t(tLang, "settings.enableNotifications")}</Text>
                  <Text style={styles.settingDescription}>{t(tLang, "settings.receiveReminders")}</Text>
                </View>
                <Switch
                  value={settings.enabled}
                  onValueChange={handleToggleNotifications}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>

              {settings.enabled && (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={18} color={colors.light.textSecondary} />
                  <Text style={styles.timeButtonText}>
                    {formatTime(settings.time)}
                  </Text>
                  <ChevronRight size={18} color={colors.light.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* How it works info box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{t(tLang, "settings.howItWorks")}</Text>
              <Text style={styles.infoText}>{t(tLang, "settings.howItWorksDescription")}</Text>
            </View>
          </View>

          {/* Bible Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(tLang, "settings.biblePreferences")}</Text>
            
            <TouchableOpacity
              style={[styles.settingCard, styles.bibleCard]}
              onPress={() => setShowBibleVersionPicker(true)}
            >
              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <BookOpen size={22} color="#FFFFFF" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, styles.lightText]}>{t(tLang, "settings.bibleVersion")}</Text>
                  <Text style={[styles.settingValue, styles.lightText]}>
                    Preferred: {currentVersion?.abbreviation} - {currentVersion?.name}
                    {effectiveVersionId !== userPreferences.bibleVersion && effectiveVersion
                      ? ` • Showing: ${effectiveVersion.abbreviation} (${userPreferences.offlineModeEnabled ? "Offline mode" : "Effective"})`
                      : ""}
                  </Text>
                </View>
                <Text style={[styles.changeButton, styles.lightText]}>{t(tLang, "common.change")}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(tLang, "settings.appPreferences")}</Text>

            {/* Offline & Data */}
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.offlineDotLabel}>●</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Offline mode</Text>
                  <Text style={styles.settingDescription}>
                    When enabled: disables Translation + Personalization + extra Bible versions. Therapy already needs internet.
                  </Text>
                </View>
                <Switch
                  value={userPreferences.offlineModeEnabled}
                  onValueChange={(v) => setOfflineModeEnabled(v)}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>
            </View>
            
            <View style={[styles.settingCard, styles.appCard]}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setShowLanguagePicker(true)}
                disabled={userPreferences.offlineModeEnabled}
              >
                <View style={styles.iconContainer}>
                  <FileText size={22} color="#FFFFFF" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, styles.lightText]}>{t(tLang, "settings.appLanguage")}</Text>
                  <Text style={[styles.settingValue, styles.lightText]}>
                    {currentLanguage?.nativeName}
                  </Text>
                </View>
                <Text style={[styles.changeButton, styles.lightText]}>{t(tLang, "common.change")}</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <FileText size={22} color="#FFFFFF" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, styles.lightText]}>{t(tLang, "settings.autoTranslate")}</Text>
                  <Text style={[styles.settingDescription, styles.lightText]}>
                    {t(tLang, "settings.autoTranslateDescription")}
                  </Text>
                </View>
                <Switch
                  value={userPreferences.autoTranslateContent}
                  onValueChange={(v) => setAutoTranslateContent(v)}
                  disabled={userPreferences.offlineModeEnabled}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>
            </View>
          </View>

          {/* Accessibility Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessibility</Text>
            <Text style={styles.sectionSubtitle}>Adjust reading and display options</Text>

            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.offlineDotLabel}>A11y</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Larger text</Text>
                  <Text style={styles.settingDescription}>Increase readable text size across the app</Text>
                </View>
                <Switch
                  value={userPreferences.accessibilityLargeTextEnabled}
                  onValueChange={setAccessibilityLargeTextEnabled}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.offlineDotLabel}>Font</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Dyslexia-friendly font</Text>
                  <Text style={styles.settingDescription}>Use Atkinson Hyperlegible for improved readability</Text>
                </View>
                <Switch
                  value={userPreferences.accessibilityDyslexiaFontEnabled}
                  onValueChange={setAccessibilityDyslexiaFontEnabled}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.offlineDotLabel}>Bold</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Bold text</Text>
                  <Text style={styles.settingDescription}>Increase text weight for better contrast</Text>
                </View>
                <Switch
                  value={userPreferences.accessibilityBoldTextEnabled}
                  onValueChange={setAccessibilityBoldTextEnabled}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <Play size={20} color={colors.light.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Auto-Play Daily Audio</Text>
                  <Text style={styles.settingDescription}>Automatically play music at 5 AM when content changes</Text>
                </View>
                <Switch
                  value={userPreferences.autoPlayDailyAudio}
                  onValueChange={setAutoPlayDailyAudio}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>
            </View>
          </View>

          {/* Scheduled Sessions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t(tLang, "settings.scheduledSessions")}</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                  setEditingSession(null);
                  setShowScheduleModal(true);
                }}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
            
            {upcomingSessions.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <CalendarIcon size={48} color={colors.light.textSecondary} />
                <Text style={styles.emptyStateTitle}>{t(tLang, "settings.noScheduledSessions")}</Text>
                <Text style={styles.emptyStateText}>
                  {t(tLang, "settings.scheduleSessionDescription")}
                </Text>
              </View>
            ) : (
              <View style={styles.sessionsListCard}>
                {upcomingSessions.map((session, index) => (
                  <View key={session.id}>
                    {index > 0 && <View style={styles.divider} />}
                    <View style={styles.sessionRow}>
                      <View style={styles.sessionInfo}>
                        <View style={styles.sessionIconContainer}>
                          <CalendarIcon size={20} color={colors.light.primary} />
                        </View>
                        <View style={styles.sessionDetails}>
                          <Text style={styles.sessionTitle}>{session.title}</Text>
                          <Text style={styles.sessionDateTime}>
                            {new Date(session.dateTime).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })} at {new Date(session.dateTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </Text>
                          {session.recurrence !== 'none' && (
                            <Text style={styles.sessionRecurrence}>
                              Repeats {session.recurrence}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.sessionActions}>
                        <TouchableOpacity
                          style={styles.sessionActionButton}
                          onPress={() => {
                            setEditingSession(session);
                            setShowScheduleModal(true);
                          }}
                        >
                          <Edit3 size={18} color={colors.light.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.sessionActionButton}
                          onPress={() => {
                            Alert.alert(
                              'Cancel Session',
                              'Are you sure you want to cancel this scheduled session?',
                              [
                                { text: 'No', style: 'cancel' },
                                { 
                                  text: 'Yes, Cancel', 
                                  style: 'destructive',
                                  onPress: () => cancelSession(session.id)
                                },
                              ]
                            );
                          }}
                        >
                          <Trash2 size={18} color={colors.light.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Legal & Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(tLang, "settings.legalSupport")}</Text>
            
            <View style={styles.settingCard}>
              <TouchableOpacity style={styles.settingRow} onPress={openTermsOfService}>
                <View style={styles.iconContainer}>
                  <FileText size={22} color={colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>{t(tLang, "settings.termsOfService")}</Text>
                <ChevronRight size={20} color={colors.light.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingRow} onPress={openPrivacyPolicy}>
                <View style={styles.iconContainer}>
                  <Shield size={22} color={colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>{t(tLang, "settings.privacyPolicy")}</Text>
                <ChevronRight size={20} color={colors.light.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingRow} onPress={openSupport}>
                <View style={styles.iconContainer}>
                  <HelpCircle size={22} color={colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>{t(tLang, "settings.support")}</Text>
                <ChevronRight size={20} color={colors.light.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingRow} onPress={openOfflineOnlineFaq}>
                <View style={styles.iconContainer}>
                  <FileText size={22} color={colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>Offline &amp; Online FAQ</Text>
                <ChevronRight size={20} color={colors.light.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Share App Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(tLang, "settings.shareAppTitle")}</Text>
            
            <TouchableOpacity
              style={styles.shareCard}
              onPress={shareApp}
            >
              <View style={styles.shareIconContainer}>
                <Share2 size={24} color="#FFFFFF" />
              </View>
              <View style={styles.shareContent}>
                <Text style={styles.shareTitle}>{t(tLang, "settings.shareWithFriends")}</Text>
                <Text style={styles.shareDescription}>
                  {t(tLang, "settings.shareDescription")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t(tLang, "settings.selectTime")}</Text>
            
            <View style={styles.timePickerContainer}>
              <View style={styles.timePicker}>
                <Text style={styles.timeLabel}>{t(tLang, "settings.hour")}</Text>
                <TextInput
                  style={styles.timeInput}
                  value={selectedHour.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    setSelectedHour(Math.max(0, Math.min(23, num)));
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              
              <Text style={styles.timeSeparator}>:</Text>
              
              <View style={styles.timePicker}>
                <Text style={styles.timeLabel}>{t(tLang, "settings.minute")}</Text>
                <TextInput
                  style={styles.timeInput}
                  value={selectedMinute.toString().padStart(2, '0')}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    setSelectedMinute(Math.max(0, Math.min(59, num)));
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.modalButtonCancelText}>{t(tLang, "common.cancel")}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleTimeChange}
              >
                <Text style={styles.modalButtonConfirmText}>{t(tLang, "common.save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <BibleVersionPickerModal
        visible={showBibleVersionPicker}
        onClose={() => setShowBibleVersionPicker(false)}
        preferredVersionId={userPreferences.bibleVersion}
        offlineModeEnabled={userPreferences.offlineModeEnabled}
        isOnline={isOnline}
        setOfflineModeEnabled={setOfflineModeEnabled}
        setPreferredVersionId={async (id) => {
          await handleBibleVersionChange(id);
          setShowBibleVersionPicker(false);
        }}
      />

      {/* Language Picker Modal */}
      <Modal
        visible={showLanguagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{t(tLang, "settings.selectLanguage")}</Text>
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                <Text style={styles.pickerClose}>{t(tLang, "common.close")}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder={t(tLang, "settings.searchLanguages")}
              placeholderTextColor={colors.light.textSecondary}
              value={languageQuery}
              onChangeText={setLanguageQuery}
            />

            <ScrollView style={styles.pickerScroll}>
              {filteredLanguages.map((language) => (
                <TouchableOpacity
                  key={language.id}
                  style={styles.pickerItem}
                  onPress={() => handleLanguageChange(language.id)}
                >
                  <View style={styles.pickerItemContent}>
                    <Text style={styles.pickerItemTitle}>{language.nativeName}</Text>
                    <Text style={styles.pickerItemSubtitle}>{language.name}</Text>
                  </View>
                  {userPreferences.appLanguage === language.id && (
                    <Check size={20} color={colors.light.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.legalModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Terms of Service</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Text style={styles.pickerClose}>{t(tLang, "common.close")}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.legalScroll} 
              contentContainerStyle={styles.legalContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.legalSubtitle}>User Agreement & Guidelines</Text>
              <Text style={styles.legalDate}>Last modified on December 14, 2025</Text>

              <Text style={styles.legalParagraph}>
                Welcome to Christian Daily Bread! These Terms of Service (&quot;Terms&quot;) govern your use of our mobile application, website, and services. By using Christian Daily Bread, you agree to be bound by these Terms. Please read them carefully.
              </Text>

              <Text style={styles.legalSectionTitle}>Use of Service</Text>
              <Text style={styles.legalParagraph}>
                Daily Bread is available for personal, non-commercial use. You are responsible for complying with these Terms.
              </Text>

              <Text style={styles.legalSubsectionTitle}>Intellectual Property</Text>
              <Text style={styles.legalParagraph}>
                All content on Christian Daily Bread is protected by intellectual property laws and cannot be copied, reproduced, or distributed without prior written consent.
              </Text>

              <Text style={styles.legalSectionTitle}>Disclaimer of Warranties</Text>
              <Text style={styles.legalParagraph}>
                Christian Daily Bread is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We disclaim all warranties, express or implied.
              </Text>

              <View style={styles.legalInfoBox}>
                <Text style={styles.legalInfoTitle}>Important Information</Text>
                <Text style={styles.legalInfoText}>
                  Christian Daily Bread&apos;s AI-powered conversations provide emotional support and biblical guidance based on scripture and Christian principles. This service does not replace professional mental health care, medical advice, or pastoral counseling.
                </Text>
                <Text style={styles.legalInfoText}>
                  If you are experiencing a mental health crisis, thoughts of self-harm, or severe distress, please contact a licensed mental health professional, your healthcare provider, or a crisis hotline immediately.
                </Text>
              </View>

              <Text style={styles.legalSectionTitle}>FAQ</Text>

              <Text style={styles.legalQuestion}>Q: Is Christian Daily Bread free to download and use?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Christian Daily Bread is free to download. Basic features are available for free. Premium subscriptions with enhanced features are available for users in the US, Canada, and Europe, with a 7-day free trial. Users in other regions get all premium features free.</Text>

              <Text style={styles.legalQuestion}>Q: What are the subscription options?</Text>
              <Text style={styles.legalAnswer}>A: We offer Monthly and Annual premium subscriptions for users in the US, Canada, and Europe. Both include a 7-day free trial. Prices are shown in the app. Users in other regions get premium features free.</Text>

              <Text style={styles.legalQuestion}>Q: How do I cancel my subscription?</Text>
              <Text style={styles.legalAnswer}>A: For iOS: Go to Settings → [Your Name] → Subscriptions. Select Christian Daily Bread and tap &quot;Cancel Subscription&quot;. For Android: Open Play Store → Menu → Subscriptions. Select Christian Daily Bread and tap &quot;Cancel Subscription&quot;. Cancellation takes effect at the end of your current billing period.</Text>

              <Text style={styles.legalQuestion}>Q: Do I need to create an account to use Christian Daily Bread?</Text>
              <Text style={styles.legalAnswer}>A: No, you don&apos;t need to sign up or log in to use Christian Daily Bread. Just download and start exploring!</Text>

              <Text style={styles.legalQuestion}>Q: How often is new content added?</Text>
              <Text style={styles.legalAnswer}>A: We refresh our therapy resources and devotions daily to support your ongoing journey.</Text>

              <Text style={styles.legalQuestion}>Q: What kind of therapy resources are available?</Text>
              <Text style={styles.legalAnswer}>A: Christian Daily Bread offers Christ-centered therapy resources, including devotions, scriptural reflections, and spiritual guidance for mental and emotional well-being.</Text>

              <Text style={styles.legalQuestion}>Q: Is Christian Daily Bread available on multiple devices?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Christian Daily Bread is available on iOS and Android devices.</Text>

              <Text style={styles.legalFooter}>© {new Date().getFullYear()} Christian Daily Bread. All rights reserved.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.legalModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Text style={styles.pickerClose}>{t(tLang, "common.close")}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.legalScroll} 
              contentContainerStyle={styles.legalContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.legalSubtitle}>Protecting Your Data</Text>
              <Text style={styles.legalDate}>Last modified on December 14, 2025</Text>

              <Text style={styles.legalParagraph}>
                At Christian Daily Bread, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your data.
              </Text>

              <Text style={styles.legalSectionTitle}>Data Collection</Text>
              <Text style={styles.legalParagraph}>
                We collect minimal data to improve our services. No personal data is required to use Christian Daily Bread.
              </Text>

              <Text style={styles.legalSectionTitle}>Data Use</Text>
              <Text style={styles.legalParagraph}>
                We use data to improve our services and personalize your experience.
              </Text>

              <Text style={styles.legalSectionTitle}>Data Protection</Text>
              <Text style={styles.legalParagraph}>
                We implement reasonable security measures to protect your data.
              </Text>

              <View style={styles.legalInfoBox}>
                <Text style={styles.legalInfoTitle}>Important Information</Text>
                <Text style={styles.legalInfoText}>
                  Christian Daily Bread&apos;s AI-powered conversations provide emotional support and biblical guidance based on scripture and Christian principles. This service does not replace professional mental health care, medical advice, or pastoral counseling.
                </Text>
                <Text style={styles.legalInfoText}>
                  If you are experiencing a mental health crisis, thoughts of self-harm, or severe distress, please contact a licensed mental health professional, your healthcare provider, or a crisis hotline immediately.
                </Text>
              </View>

              <Text style={styles.legalSectionTitle}>FAQ</Text>

              <Text style={styles.legalQuestion}>Q: Is Christian Daily Bread free to download and use?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Christian Daily Bread is free to download. Basic features are available for free. Premium subscriptions are available for users in the US, Canada, and Europe, with a 7-day free trial. Users in other regions get all premium features free.</Text>

              <Text style={styles.legalQuestion}>Q: What subscription data do you collect?</Text>
              <Text style={styles.legalAnswer}>A: We only receive basic subscription status from Apple/Google (active/expired, start date, renewal date). We never have access to your payment information or credit card details. All payments are processed securely by Apple/Google.</Text>

              <Text style={styles.legalQuestion}>Q: Do I need to create an account to use Christian Daily Bread?</Text>
              <Text style={styles.legalAnswer}>A: No, you don&apos;t need to sign up or log in to use Christian Daily Bread. Just download and start exploring!</Text>

              <Text style={styles.legalQuestion}>Q: How often is new content added?</Text>
              <Text style={styles.legalAnswer}>A: We refresh our therapy resources and devotions daily to support your ongoing journey.</Text>

              <Text style={styles.legalQuestion}>Q: What kind of therapy resources are available?</Text>
              <Text style={styles.legalAnswer}>A: Christian Daily Bread offers Christ-centered therapy resources, including devotions, scriptural reflections, and spiritual guidance for mental and emotional well-being.</Text>

              <Text style={styles.legalQuestion}>Q: Is Christian Daily Bread available on multiple devices?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Christian Daily Bread is available on iOS and Android devices.</Text>

              <Text style={styles.legalFooter}>© {new Date().getFullYear()} Christian Daily Bread. All rights reserved.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Support Modal */}
      <Modal
        visible={showSupportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSupportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.legalModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Support</Text>
              <TouchableOpacity onPress={() => setShowSupportModal(false)}>
                <Text style={styles.pickerClose}>{t(tLang, "common.close")}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.legalScroll} 
              contentContainerStyle={styles.legalContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.legalSubtitle}>Get in Touch</Text>
              <Text style={styles.legalParagraph}>
                We&apos;re here to help you the best way we can.
              </Text>

              {/* Contact Options */}
              <TouchableOpacity 
                style={styles.supportContactCard}
                onPress={() => {
                  const email = 'support@dailybread.app';
                  const subject = 'Christian Daily Bread - Support Request';
                  const body = 'Hello, I need help with...';
                  Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                }}
              >
                <View style={styles.supportIconContainer}>
                  <Text style={styles.supportIcon}>✉️</Text>
                </View>
                <View style={styles.supportContactContent}>
                  <Text style={styles.supportContactTitle}>Email Us</Text>
                  <Text style={styles.supportContactValue}>support@dailybread.app</Text>
                </View>
              </TouchableOpacity>

              {/* Free Therapy Services */}
              <View style={styles.legalInfoBox}>
                <Text style={styles.legalInfoTitle}>Free Christian Therapy Services</Text>
                <Text style={styles.legalInfoText}>
                  Christian Daily Bread is committed to providing free therapy services to those who cannot afford it. If you need support, please contact us. We&apos;ll do our best to connect you with a licensed therapist.
                </Text>
              </View>

              <Text style={styles.legalSectionTitle}>Partner with Us</Text>
              <Text style={styles.legalParagraph}>
                Are you a licensed therapist passionate about providing faith-based services? We&apos;re looking for therapists to partner with us and provide Christian therapy services on our app.
              </Text>
              <View style={styles.supportRequirementsList}>
                <Text style={styles.supportRequirement}>• Must be a licensed therapist (LCSW, LPC, LMFT, etc.)</Text>
                <Text style={styles.supportRequirement}>• Share our mission to provide Christ-centered therapy services</Text>
                <Text style={styles.supportRequirement}>• Committed to providing high-quality, compassionate care</Text>
              </View>

              <Text style={styles.legalSectionTitle}>Partnerships</Text>
              <Text style={styles.legalParagraph}>
                Christian Daily Bread is seeking partnerships with churches, Christian faith organizations, and individuals to support our mission. Your support will help us provide free therapy services and resources to those in need.
              </Text>

              <Text style={styles.legalSectionTitle}>Support Our Mission</Text>
              <Text style={styles.legalParagraph}>
                Your donation will help us continue to provide free Christian therapy resources and services to those who need them. Please contact us to learn more about supporting Daily Bread.
              </Text>

              <Text style={styles.legalFooter}>© {new Date().getFullYear()} Christian Daily Bread. All rights reserved.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Offline & Online FAQ Modal */}
      <Modal
        visible={showOfflineOnlineFaqModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOfflineOnlineFaqModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.legalModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Offline &amp; Online FAQ</Text>
              <TouchableOpacity onPress={() => setShowOfflineOnlineFaqModal(false)}>
                <Text style={styles.pickerClose}>{t(tLang, "common.close")}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.legalScroll}
              contentContainerStyle={styles.legalContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.legalSubtitle}>Quick clarity on what needs internet</Text>

              <View style={styles.legalInfoBox}>
                <Text style={styles.legalInfoTitle}>Offline mode</Text>
                <Text style={styles.legalInfoText}>
                  Offline mode is designed for maximum privacy and reliability. When enabled, the app avoids network calls (except Therapy).
                </Text>
                <Text style={styles.legalInfoText}>
                  Offline mode disables: Translation, Personalization, and extra Bible versions. Therapy already needs internet.
                </Text>
              </View>

              <Text style={styles.legalSectionTitle}>What works offline</Text>
              <Text style={styles.legalParagraph}>
                • Home (daily devotionals, reflection, prayer prompt){'\n'}
                • Daily Music Player (all 100 tracks + album art){'\n'}
                • Prayers (daily prayer + guides){'\n'}
                • Study (plans + insights) and reading passages in KJV{'\n'}
                • Bible reading in KJV (fully offline){'\n'}
                • Settings + local notifications + sharing
              </Text>

              <Text style={styles.legalSectionTitle}>What works online</Text>
              <Text style={styles.legalParagraph}>
                • Therapy AI chat, personalized sessions, voice transcription{'\n'}
                • Translation (when not already cached){'\n'}
                • Personalization (topic extraction/suggestions){'\n'}
                • Extra Bible versions (WEB/ASV/DARBY/YLT/WBT/BBE, etc.) can be loaded while online and cached for later
              </Text>

              <Text style={styles.legalFooter}>You can toggle Offline mode anytime in Settings.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Schedule Session Modal */}
      <ScheduleNextSessionModal
        visible={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setEditingSession(null);
        }}
        onSchedule={handleScheduleSession}
        editingSession={editingSession}
        onUpdate={handleUpdateSession}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background, // Dark theme background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: isTablet ? 32 : 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "700" as const,
    color: colors.light.text, // Dark theme text
  },
  subtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.light.text, // Dark theme text
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: colors.light.cardBackground, // Dark theme card
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bibleCard: {
    backgroundColor: '#5B7BB4', // Soft Blue for Bible preferences
    shadowOpacity: 0.2,
    elevation: 4,
  },
  appCard: {
    backgroundColor: '#D97758', // Coral for App preferences
    shadowOpacity: 0.2,
    elevation: 4,
  },
  lightText: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 60,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.cardBackgroundSecondary, // Dark theme secondary
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  offlineDotLabel: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: colors.light.primary,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: colors.light.text, // Dark theme text
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.light.textSecondary, // Dark theme secondary text
    lineHeight: 18,
  },
  settingValue: {
    fontSize: 15,
    color: colors.light.textSecondary,
  },
  changeButton: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.primary, // Dark theme primary (teal)
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Lighter divider for colored cards
    marginLeft: 72,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.borderLight,
  },
  timeButtonText: {
    flex: 1,
    fontSize: 15,
    color: colors.light.textSecondary,
  },
  infoBox: {
    marginTop: 16,
    backgroundColor: '#2A9D8F', // Vibrant teal
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  emptyStateCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  sessionsListCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 80,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  sessionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.light.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionDetails: {
    flex: 1,
    gap: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.light.text,
  },
  sessionDateTime: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.light.textSecondary,
  },
  sessionRecurrence: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.light.primary,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  sessionActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  shareCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  shareIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.primary, // Dark theme primary (teal)
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  shareContent: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  shareDescription: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.light.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  timePicker: {
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: colors.light.cardBackgroundTertiary,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.light.text,
    textAlign: "center",
    width: 80,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginHorizontal: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: colors.light.cardBackgroundTertiary,
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  modalButtonConfirm: {
    backgroundColor: colors.light.primary,
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  pickerModal: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderRadius: 24,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80%",
    overflow: "hidden",
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  pickerClose: {
    fontSize: 16,
    color: colors.light.primary,
    fontWeight: "600" as const,
  },
  searchInput: {
    backgroundColor: colors.light.cardBackgroundTertiary,
    borderRadius: 12,
    padding: 12,
    margin: 16,
    fontSize: 16,
    color: colors.light.text,
  },
  pickerScroll: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
  },
  pickerItemContent: {
    flex: 1,
  },
  pickerItemTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  pickerItemSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  legalModal: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: "100%",
    height: "90%",
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
  },
  legalScroll: {
    flex: 1,
  },
  legalContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  legalSubtitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  legalDate: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginBottom: 20,
  },
  legalSectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginTop: 20,
    marginBottom: 10,
  },
  legalSubsectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  legalParagraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textSecondary,
    marginBottom: 12,
  },
  legalInfoBox: {
    backgroundColor: colors.light.cardBackgroundTertiary,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.warning,
    borderRadius: 12,
    padding: 14,
    marginVertical: 16,
  },
  legalInfoTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  legalInfoText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  legalQuestion: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginTop: 12,
    marginBottom: 6,
  },
  legalAnswer: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  legalFooter: {
    fontSize: 13,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.borderLight,
  },
  supportContactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.cardBackgroundTertiary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  supportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  supportIcon: {
    fontSize: 24,
  },
  supportContactContent: {
    flex: 1,
  },
  supportContactTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  supportContactValue: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.light.primary,
  },
  supportRequirementsList: {
    marginBottom: 16,
  },
  supportRequirement: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
});
