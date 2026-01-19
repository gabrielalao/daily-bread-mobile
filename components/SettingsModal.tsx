import colors from "@/constants/colors";
import { useNotifications } from "@/contexts/NotificationContext";
import { useContent } from "@/contexts/ContentContext";
import { useScheduledSessions } from "@/contexts/ScheduledSessionsContext";
import type { ScheduledSession } from "@/contexts/ScheduledSessionsContext";
import { bibleVersions, getPopularVersions, getVersionById } from "@/constants/bible-versions";
import { appLanguages, getAppLanguageById } from "@/constants/app-languages";
import { t, tParams } from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, BellOff, Clock, FileText, Shield, HelpCircle, ChevronRight, BookOpen, Check, Calendar as CalendarIcon, Trash2, Edit, Repeat, Share2, X } from "lucide-react-native";
import React, { useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Alert,
  Platform,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScheduleNextSessionModal } from "@/components/ScheduleNextSessionModal";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { settings, isLoaded, enableNotifications, disableNotifications, updateNotificationTime } = useNotifications();
  const { userPreferences, setBibleVersion, setAppLanguage, setAutoTranslateContent, isLoaded: contentLoaded } = useContent();
  const tLang = userPreferences.appLanguage;
  const { sessions, isLoaded: sessionsLoaded, cancelSession, updateSession, getNextOccurrence } = useScheduledSessions();
  const [selectedHour, setSelectedHour] = useState(parseInt(settings.time.split(':')[0]));
  const [selectedMinute, setSelectedMinute] = useState(parseInt(settings.time.split(':')[1]));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showBibleVersionPicker, setShowBibleVersionPicker] = useState(false);
  const [bibleVersionQuery, setBibleVersionQuery] = useState("");
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [languageQuery, setLanguageQuery] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
    await setBibleVersion(versionId);
    const version = getVersionById(versionId);
    setShowBibleVersionPicker(false);
    Alert.alert(
      t(tLang, "settings.bibleVersionUpdatedTitle"),
      tParams(tLang, "settings.bibleVersionUpdatedBody", { name: version?.name ?? versionId, abbr: version?.abbreviation ?? "" }),
      [{ text: t(tLang, "common.ok") }]
    );
  };

  const handleLanguageChange = async (languageId: string) => {
    await setAppLanguage(languageId);
    setShowLanguagePicker(false);
    const language = getAppLanguageById(languageId);
    Alert.alert(
      t(languageId, "settings.languageUpdatedTitle"),
      tParams(languageId, "settings.languageUpdatedBody", { name: language?.name ?? languageId }),
      [{ text: t(languageId, "common.ok") }]
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Cancel Session',
      'Are you sure you want to cancel this scheduled session?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await cancelSession(sessionId);
            Alert.alert('Session Cancelled', 'Your scheduled session has been removed.');
          },
        },
      ]
    );
  };

  const handleEditSession = (session: ScheduledSession) => {
    setEditingSession(session);
    setShowScheduleModal(true);
  };

  const handleUpdateSession = async (
    sessionId: string,
    dateTime: Date,
    recurrence: any,
    recurrenceEndDate?: Date
  ) => {
    const success = await updateSession(sessionId, {
      dateTime,
      recurrence,
      recurrenceEndDate,
    });

    if (success) {
      Alert.alert(
        'Session Updated! ✅',
        'Your therapy session has been updated successfully.',
        [{ text: 'Great!' }]
      );
      setShowScheduleModal(false);
      setEditingSession(null);
    } else {
      Alert.alert(
        'Update Failed',
        'Unable to update the session. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNewSchedule = async (
    dateTime: Date,
    recurrence: any,
    recurrenceEndDate?: Date
  ) => {
    // This would need scheduleSession from context - but since we're in settings,
    // we'll just show a message to use the therapy tab
    Alert.alert(
      'Schedule from Therapy',
      'To schedule a new therapy session, please use the Schedule button in the Therapy tab during or after a conversation.',
      [{ text: 'OK' }]
    );
    setShowScheduleModal(false);
  };

  const handleShareApp = async () => {
    try {
      const message = `Check out Christian Daily Bread - Christian Therapy! 🙏\n\nGet daily spiritual guidance, Bible studies, prayers, and AI-powered Christian therapy sessions.\n\n📱 Download Links:\n\n🍎 App Store:\nhttps://apps.apple.com/us/app/daily-bread-christian-therapy/id6755737219\n\n🤖 Google Play:\nhttps://play.google.com/store/apps/details?id=app.rork.daily_bread_app_mp9wlbr\n\nAvailable on both iOS and Android!`;

      const result = await Share.share({
        message,
        title: 'Christian Daily Bread - Christian Therapy',
      });

      if (result.action === Share.sharedAction) {
        if (__DEV__) {
          console.log('App shared successfully');
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error sharing app:', error);
      }
      Alert.alert(
        'Sharing Failed',
        'Unable to share the app. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatSessionDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getRecurrenceDisplay = (session: ScheduledSession): string => {
    if (session.recurrence === 'none') return '';
    let display = `Repeats ${session.recurrence}`;
    if (session.recurrenceEndDate) {
      display += ` until ${new Date(session.recurrenceEndDate).toLocaleDateString()}`;
    }
    return display;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  if (!isLoaded || !contentLoaded || !sessionsLoaded) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t(tLang, "common.loading")}</Text>
        </View>
      </View>
    );
  }

  const currentVersion = getVersionById(userPreferences.bibleVersion);
  const popularVersions = getPopularVersions();
  const allVersions = bibleVersions;
  const originalLanguageVersions = allVersions.filter(v => v.language === 'Hebrew' || v.language === 'Greek');

  const normalizedQuery = bibleVersionQuery.trim().toLowerCase();
  const filteredVersions = normalizedQuery.length === 0
    ? allVersions
    : allVersions.filter(v => {
        const hay = `${v.abbreviation} ${v.name} ${v.description} ${v.language}`.toLowerCase();
        return hay.includes(normalizedQuery);
      });

  const filteredPopular = filteredVersions.filter(v => v.popular);
  const filteredOriginal = filteredVersions.filter(v => v.language === 'Hebrew' || v.language === 'Greek');
  const filteredOther = filteredVersions.filter(v => !v.popular && v.language !== 'Hebrew' && v.language !== 'Greek');

  const renderVersionItem = (version: typeof allVersions[number]) => {
    const selected = userPreferences.bibleVersion === version.id;
    const hasProviderSupport = Boolean((version as any).apiCode);

    return (
      <TouchableOpacity
        key={version.id}
        style={[
          styles.versionItem,
          selected && styles.versionItemSelected,
        ]}
        onPress={() => handleBibleVersionChange(version.id)}
        activeOpacity={0.7}
      >
        <View style={styles.versionLeft}>
          <View>
            <View style={styles.versionTopRow}>
              <Text style={styles.versionAbbreviation}>{version.abbreviation}</Text>
              <View style={styles.versionBadges}>
                <View style={[styles.versionBadge, hasProviderSupport ? styles.versionBadgeSupported : styles.versionBadgeReference]}>
                  <Text style={[styles.versionBadgeText, hasProviderSupport ? styles.versionBadgeTextSupported : styles.versionBadgeTextReference]}>
                    {hasProviderSupport ? t(tLang, "settings.providerFullPassage") : t(tLang, "settings.providerReference")}
                  </Text>
                </View>
                {version.language !== 'English' && (
                  <View style={styles.versionBadgeLanguage}>
                    <Text style={styles.versionBadgeLanguageText}>{version.language}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.versionName}>{version.name}</Text>
            <Text style={styles.versionDescription}>{version.description}</Text>
          </View>
        </View>
        {selected && (
          <Check size={20} color={colors.light.primary} strokeWidth={3} />
        )}
      </TouchableOpacity>
    );
  };

  const currentLang = getAppLanguageById(userPreferences.appLanguage);
  const normalizedLangQuery = languageQuery.trim().toLowerCase();
  const filteredLangs = normalizedLangQuery.length === 0
    ? appLanguages
    : appLanguages.filter(l => `${l.name} ${l.nativeName} ${l.id}`.toLowerCase().includes(normalizedLangQuery));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Header with Close Button */}
        <View style={[styles.modalHeader, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.modalHeaderTitle}>{t(tLang, "headers.notificationSettings")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.light.text} />
          </TouchableOpacity>
        </View>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t(tLang, "settings.dailyNotifications")}</Text>
            <Text style={styles.subtitle}>
              {t(tLang, "settings.subtitleDailyNotifications")}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  {settings.enabled ? (
                    <Bell size={24} color={colors.light.primary} />
                  ) : (
                    <BellOff size={24} color={colors.light.textSecondary} />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Enable Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive daily reminders
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={handleToggleNotifications}
                trackColor={{
                  false: colors.light.border,
                  true: colors.light.primary,
                }}
                thumbColor="#fff"
                ios_backgroundColor={colors.light.border}
              />
            </View>

            {settings.enabled && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={() => setShowTimePicker(!showTimePicker)}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                      <Clock size={24} color={colors.light.primary} />
                    </View>
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>Notification Time</Text>
                      <Text style={styles.settingDescription}>
                        {formatTime(settings.time)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <View style={styles.timePickerContainer}>
                    <View style={styles.timePickerHeader}>
                      <Text style={styles.timePickerTitle}>Select Time</Text>
                    </View>

                    <View style={styles.pickerRow}>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Hour</Text>
                        <ScrollView
                          style={styles.picker}
                          showsVerticalScrollIndicator={false}
                        >
                          {hours.map((hour) => (
                            <TouchableOpacity
                              key={hour}
                              style={[
                                styles.pickerItem,
                                selectedHour === hour && styles.pickerItemSelected,
                              ]}
                              onPress={() => setSelectedHour(hour)}
                            >
                              <Text
                                style={[
                                  styles.pickerItemText,
                                  selectedHour === hour && styles.pickerItemTextSelected,
                                ]}
                              >
                                {hour.toString().padStart(2, '0')}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      <Text style={styles.pickerSeparator}>:</Text>

                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Minute</Text>
                        <ScrollView
                          style={styles.picker}
                          showsVerticalScrollIndicator={false}
                        >
                          {minutes.map((minute) => (
                            <TouchableOpacity
                              key={minute}
                              style={[
                                styles.pickerItem,
                                selectedMinute === minute && styles.pickerItemSelected,
                              ]}
                              onPress={() => setSelectedMinute(minute)}
                            >
                              <Text
                                style={[
                                  styles.pickerItemText,
                                  selectedMinute === minute && styles.pickerItemTextSelected,
                                ]}
                              >
                                {minute.toString().padStart(2, '0')}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleTimeChange}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.confirmButtonText}>Set Time</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{t(tLang, "settings.howItWorks")}</Text>
            <Text style={styles.infoText}>
              {t(tLang, "settings.howItWorksBody")}
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{t(tLang, "settings.biblePreferences")}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowBibleVersionPicker(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <BookOpen size={24} color={colors.light.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Bible Version</Text>
                  <Text style={styles.settingDescription}>
                    {currentVersion?.abbreviation} - {currentVersion?.name}
                  </Text>
                </View>
              </View>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Bible Version Picker Modal (safe for 50+ items) */}
          <Modal
            visible={showBibleVersionPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowBibleVersionPicker(false)}
          >
            <TouchableOpacity 
              style={styles.versionModalOverlay} 
              activeOpacity={1}
              onPress={() => setShowBibleVersionPicker(false)}
            >
              <TouchableOpacity 
                style={[styles.versionModal, { paddingBottom: Math.max(insets.bottom, 12) }]}
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.versionModalHeader}>
                  <Text style={styles.versionPickerTitle}>Select Bible Version</Text>
                  <TouchableOpacity
                    onPress={() => setShowBibleVersionPicker(false)}
                    activeOpacity={0.7}
                    style={styles.versionModalClose}
                  >
                    <Text style={styles.versionModalCloseText}>{t(tLang, "common.close")}</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={bibleVersionQuery}
                  onChangeText={setBibleVersionQuery}
                  placeholder="Search versions (e.g., KJV, Hebrew, Spanish...)"
                  placeholderTextColor={colors.light.textLight}
                  style={styles.versionSearch}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Provider support legend */}
                <View style={styles.providerLegend}>
                  <Text style={styles.providerLegendTitle}>Provider support</Text>
                  <Text style={styles.providerLegendText}>
                    - <Text style={styles.providerLegendStrong}>Full passage</Text>: “View Full Passage” can show the selected text via free sources.
                    {"\n"}- <Text style={styles.providerLegendStrong}>Reference</Text>: selection affects labels, but full passages may fall back to KJV if the free source can’t provide that translation.
                  </Text>
                </View>

                <ScrollView
                  style={styles.versionModalScroll}
                  contentContainerStyle={styles.versionModalScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.versionSectionTitle}>Popular Versions</Text>
                  {filteredPopular.length > 0 ? filteredPopular.map(renderVersionItem) : (
                    <Text style={styles.versionEmptyText}>No popular versions match your search.</Text>
                  )}

                  <Text style={styles.versionSectionTitle}>Original Languages</Text>
                  {(filteredOriginal.length > 0 ? filteredOriginal : originalLanguageVersions).map(renderVersionItem)}

                  <Text style={styles.versionSectionTitle}>All Versions</Text>
                  {filteredOther.length > 0 ? filteredOther.map(renderVersionItem) : (
                    <Text style={styles.versionEmptyText}>No versions match your search.</Text>
                  )}

                  <View style={{ height: 24 }} />
                </ScrollView>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{t(tLang, "settings.appPreferences")}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowLanguagePicker(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <BookOpen size={24} color={colors.light.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>{t(tLang, "settings.appLanguage")}</Text>
                  <Text style={styles.settingDescription}>
                    {currentLang?.nativeName ?? "English"}
                  </Text>
                </View>
              </View>
              <Text style={styles.changeText}>{t(tLang, "common.change")}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <BookOpen size={24} color={colors.light.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>{t(tLang, "settings.autoTranslate")}</Text>
                  <Text style={styles.settingDescription}>{t(tLang, "settings.autoTranslateDesc")}</Text>
                </View>
              </View>
              <Switch
                value={Boolean(userPreferences.autoTranslateContent)}
                onValueChange={async (value) => {
                  await setAutoTranslateContent(value);
                }}
                trackColor={{ false: colors.light.border, true: colors.light.primary }}
                thumbColor="#fff"
                ios_backgroundColor={colors.light.border}
              />
            </View>
          </View>

          {/* App Language Picker Modal */}
          <Modal
            visible={showLanguagePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowLanguagePicker(false)}
          >
            <TouchableOpacity 
              style={styles.versionModalOverlay} 
              activeOpacity={1}
              onPress={() => setShowLanguagePicker(false)}
            >
              <TouchableOpacity 
                style={[styles.versionModal, { paddingBottom: Math.max(insets.bottom, 12) }]}
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.versionModalHeader}>
                  <Text style={styles.versionPickerTitle}>{t(tLang, "settings.selectAppLanguage")}</Text>
                  <TouchableOpacity
                    onPress={() => setShowLanguagePicker(false)}
                    activeOpacity={0.7}
                    style={styles.versionModalClose}
                  >
                    <Text style={styles.versionModalCloseText}>{t(tLang, "common.close")}</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={languageQuery}
                  onChangeText={setLanguageQuery}
                  placeholder={`${t(tLang, "common.search")} (English, Dansk, Français...)`}
                  placeholderTextColor={colors.light.textLight}
                  style={styles.versionSearch}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <ScrollView
                  style={styles.versionModalScroll}
                  contentContainerStyle={styles.versionModalScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {filteredLangs.map((lang) => {
                    const selected = userPreferences.appLanguage === lang.id;
                    return (
                      <TouchableOpacity
                        key={lang.id}
                        style={[
                          styles.versionItem,
                          selected && styles.versionItemSelected,
                        ]}
                        onPress={() => handleLanguageChange(lang.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.versionLeft}>
                          <View>
                            <View style={styles.versionTopRow}>
                              <Text style={styles.versionAbbreviation}>{lang.nativeName}</Text>
                              <View style={styles.versionBadges}>
                                <View style={styles.versionBadgeLanguage}>
                                  <Text style={styles.versionBadgeLanguageText}>{lang.id}</Text>
                                </View>
                              </View>
                            </View>
                            <Text style={styles.versionName}>{lang.name}</Text>
                            <Text style={styles.versionDescription}>{lang.locale}</Text>
                          </View>
                        </View>
                        {selected && (
                          <Check size={20} color={colors.light.primary} strokeWidth={3} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{t(tLang, "settings.scheduledSessions")}</Text>
          </View>

          <View style={styles.card}>
            {sessions.length === 0 ? (
              <View style={styles.emptySessionsContainer}>
                <CalendarIcon size={48} color={colors.light.textSecondary} />
                <Text style={styles.emptySessionsText}>{t(tLang, "settings.noScheduledSessions")}</Text>
                <Text style={styles.emptySessionsSubtext}>
                  {t(tLang, "settings.scheduleFromTherapy")}
                </Text>
              </View>
            ) : (
              <>
                {sessions.map((session, index) => {
                  const nextOccurrence = getNextOccurrence(session);
                  return (
                    <View key={session.id}>
                      {index > 0 && <View style={styles.divider} />}
                      <View style={styles.sessionRow}>
                        <View style={styles.sessionLeft}>
                          <View style={styles.sessionIconContainer}>
                            <CalendarIcon size={20} color={colors.light.primary} />
                          </View>
                          <View style={styles.sessionDetails}>
                            <Text style={styles.sessionTitle}>{session.title}</Text>
                            <Text style={styles.sessionDateTime}>
                              {nextOccurrence ? formatSessionDate(nextOccurrence) : 'Expired'}
                            </Text>
                            {session.recurrence !== 'none' && (
                              <View style={styles.recurrenceBadge}>
                                <Repeat size={12} color={colors.light.primary} />
                                <Text style={styles.recurrenceText}>
                                  {getRecurrenceDisplay(session)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <View style={styles.sessionActions}>
                          <TouchableOpacity
                            style={styles.sessionActionButton}
                            onPress={() => handleEditSession(session)}
                            activeOpacity={0.7}
                          >
                            <Edit size={18} color={colors.light.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.sessionActionButton}
                            onPress={() => handleDeleteSession(session.id)}
                            activeOpacity={0.7}
                          >
                            <Trash2 size={18} color={colors.light.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{t(tLang, "settings.legalAndSupport")}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push("/terms")}
              activeOpacity={0.7}
            >
              <View style={styles.linkLeft}>
                <View style={styles.iconContainer}>
                  <FileText size={24} color={colors.light.primary} />
                </View>
                <Text style={styles.linkTitle}>{t(tLang, "settings.termsOfService")}</Text>
              </View>
              <ChevronRight size={20} color={colors.light.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push("/privacy")}
              activeOpacity={0.7}
            >
              <View style={styles.linkLeft}>
                <View style={styles.iconContainer}>
                  <Shield size={24} color={colors.light.primary} />
                </View>
                <Text style={styles.linkTitle}>{t(tLang, "settings.privacyPolicy")}</Text>
              </View>
              <ChevronRight size={20} color={colors.light.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push("/support")}
              activeOpacity={0.7}
            >
              <View style={styles.linkLeft}>
                <View style={styles.iconContainer}>
                  <HelpCircle size={24} color={colors.light.primary} />
                </View>
                <Text style={styles.linkTitle}>{t(tLang, "settings.support")}</Text>
              </View>
              <ChevronRight size={20} color={colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Share Christian Daily Bread</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.shareRow}
              onPress={handleShareApp}
              activeOpacity={0.7}
            >
              <View style={styles.shareContent}>
                <View style={styles.shareIconContainer}>
                  <Share2 size={28} color="#fff" />
                </View>
                <View style={styles.shareTextContainer}>
                  <Text style={styles.shareTitle}>Share with Friends</Text>
                  <Text style={styles.shareDescription}>
                    Help others discover Christian Daily Bread and grow in their faith journey
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ScheduleNextSessionModal
        visible={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setEditingSession(null);
        }}
        onSchedule={handleNewSchedule}
        editingSession={editingSession}
        onUpdate={handleUpdateSession}
      />
    </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.light.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 16,
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.primary,
  },
  timePickerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  timePickerHeader: {
    marginBottom: 16,
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    textAlign: "center" as const,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  picker: {
    height: 160,
    width: 80,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 4,
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: colors.light.primary,
  },
  pickerItemText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  pickerItemTextSelected: {
    color: "#fff",
  },
  pickerSeparator: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginTop: 24,
  },
  confirmButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
  infoCard: {
    backgroundColor: `${colors.light.primary}10`,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
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
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  versionPickerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    maxHeight: 400,
  },
  versionPickerHeader: {
    marginBottom: 16,
  },
  versionPickerTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    textAlign: "center" as const,
  },
  versionModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  versionModal: {
    backgroundColor: colors.light.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    maxHeight: "95%",
    minHeight: "75%",
  },
  versionModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  versionModalClose: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: `${colors.light.primary}12`,
  },
  versionModalCloseText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.light.primary,
  },
  versionSearch: {
    backgroundColor: colors.light.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 10,
  },
  providerLegend: {
    backgroundColor: `${colors.light.accent}08`,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: `${colors.light.accent}18`,
    marginBottom: 12,
  },
  providerLegendTitle: {
    fontSize: 12,
    fontWeight: "800" as const,
    color: colors.light.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  providerLegendText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.light.textSecondary,
  },
  providerLegendStrong: {
    fontWeight: "800" as const,
    color: colors.light.text,
  },
  versionModalScroll: {
    flex: 1,
    minHeight: 300,
  },
  versionModalScrollContent: {
    paddingBottom: 16,
  },
  versionSectionTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.light.textSecondary,
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase" as const,
  },
  versionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.light.background,
    borderWidth: 2,
    borderColor: "transparent",
  },
  versionItemSelected: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  versionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  versionAbbreviation: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.primary,
    marginBottom: 2,
  },
  versionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  versionBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap" as const,
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  versionBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
  },
  versionBadgeSupported: {
    backgroundColor: `${colors.light.success}12`,
    borderColor: `${colors.light.success}30`,
  },
  versionBadgeTextSupported: {
    color: colors.light.success,
  },
  versionBadgeReference: {
    backgroundColor: `${colors.light.textSecondary}10`,
    borderColor: `${colors.light.textSecondary}20`,
  },
  versionBadgeTextReference: {
    color: colors.light.textSecondary,
  },
  versionBadgeLanguage: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: `${colors.light.accent}10`,
    borderColor: `${colors.light.accent}20`,
  },
  versionBadgeLanguageText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: colors.light.accent,
  },
  versionName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  versionDescription: {
    fontSize: 12,
    color: colors.light.textSecondary,
    lineHeight: 18,
  },
  versionEmptyText: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  emptySessionsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptySessionsText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySessionsSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center" as const,
    paddingHorizontal: 20,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  sessionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  sessionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  sessionDateTime: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  recurrenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  recurrenceText: {
    fontSize: 12,
    color: colors.light.primary,
    fontWeight: "600" as const,
  },
  sessionActions: {
    flexDirection: "row",
    gap: 8,
  },
  sessionActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  shareRow: {
    paddingVertical: 4,
  },
  shareContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  shareIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shareTextContainer: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  shareDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
});
