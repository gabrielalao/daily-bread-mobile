import colors from "@/constants/colors";
import { useNotifications } from "@/contexts/NotificationContext";
import { useContent } from "@/contexts/ContentContext";
import { useScheduledSessions } from "@/contexts/ScheduledSessionsContext";
import type { ScheduledSession } from "@/contexts/ScheduledSessionsContext";
import { bibleVersions, getPopularVersions, getVersionById } from "@/constants/bible-versions";
import { appLanguages, getAppLanguageById } from "@/constants/app-languages";
import { t, tParams } from "@/utils/i18n";
import { Bell, BellOff, Clock, FileText, Shield, HelpCircle, ChevronRight, BookOpen, Check, Calendar as CalendarIcon, Trash2, Edit, Repeat, Share2 } from "lucide-react-native";
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
  Dimensions,
  Linking,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ScheduleNextSessionModal } from "@/components/ScheduleNextSessionModal";

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function SettingsScreen() {
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
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

  const handleLanguageChange = async (langId: string) => {
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

  const openTermsOfService = () => {
    setShowTermsModal(true);
  };

  const openPrivacyPolicy = () => {
    setShowPrivacyModal(true);
  };

  const openSupport = () => {
    setShowSupportModal(true);
  };

  const currentVersion = getVersionById(userPreferences.bibleVersion);
  const currentLanguage = getAppLanguageById(userPreferences.appLanguage);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const filteredVersions = bibleVersionQuery
    ? bibleVersions.filter(v =>
        v.name.toLowerCase().includes(bibleVersionQuery.toLowerCase()) ||
        v.abbreviation.toLowerCase().includes(bibleVersionQuery.toLowerCase())
      )
    : getPopularVersions();

  const filteredLanguages = languageQuery
    ? appLanguages.filter(l =>
        l.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
      )
    : appLanguages;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
            <Text style={styles.title}>{t(tLang, "settings.title")}</Text>
            <Text style={styles.subtitle}>{t(tLang, "settings.subtitle")}</Text>
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
                    {currentVersion?.abbreviation} - {currentVersion?.name}
                  </Text>
                </View>
                <Text style={[styles.changeButton, styles.lightText]}>{t(tLang, "common.change")}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(tLang, "settings.appPreferences")}</Text>
            
            <View style={[styles.settingCard, styles.appCard]}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setShowLanguagePicker(true)}
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
                  onValueChange={setAutoTranslateContent}
                  trackColor={{ false: colors.light.borderLight, true: colors.light.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.light.text : undefined}
                />
              </View>
            </View>
          </View>

          {/* Scheduled Sessions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(tLang, "settings.scheduledSessions")}</Text>
            
            <View style={styles.emptyStateCard}>
              <CalendarIcon size={48} color={colors.light.textSecondary} />
              <Text style={styles.emptyStateTitle}>{t(tLang, "settings.noScheduledSessions")}</Text>
              <Text style={styles.emptyStateText}>
                {t(tLang, "settings.scheduleSessionDescription")}
              </Text>
            </View>
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

      {/* Bible Version Picker Modal */}
      <Modal
        visible={showBibleVersionPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBibleVersionPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{t(tLang, "settings.selectBibleVersion")}</Text>
              <TouchableOpacity onPress={() => setShowBibleVersionPicker(false)}>
                <Text style={styles.pickerClose}>{t(tLang, "common.close")}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder={t(tLang, "settings.searchVersions")}
              placeholderTextColor={colors.light.textSecondary}
              value={bibleVersionQuery}
              onChangeText={setBibleVersionQuery}
            />

            <ScrollView style={styles.pickerScroll}>
              {filteredVersions.map((version) => (
                <TouchableOpacity
                  key={version.id}
                  style={styles.pickerItem}
                  onPress={() => handleBibleVersionChange(version.id)}
                >
                  <View style={styles.pickerItemContent}>
                    <Text style={styles.pickerItemTitle}>{version.name}</Text>
                    <Text style={styles.pickerItemSubtitle}>{version.abbreviation}</Text>
                  </View>
                  {userPreferences.bibleVersion === version.id && (
                    <Check size={20} color={colors.light.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                Welcome to Daily Bread! These Terms of Service ("Terms") govern your use of our mobile application, website, and services. By using Daily Bread, you agree to be bound by these Terms. Please read them carefully.
              </Text>

              <Text style={styles.legalSectionTitle}>Use of Service</Text>
              <Text style={styles.legalParagraph}>
                Daily Bread is available for personal, non-commercial use. You are responsible for complying with these Terms.
              </Text>

              <Text style={styles.legalSubsectionTitle}>Intellectual Property</Text>
              <Text style={styles.legalParagraph}>
                All content on Daily Bread is protected by intellectual property laws and cannot be copied, reproduced, or distributed without prior written consent.
              </Text>

              <Text style={styles.legalSectionTitle}>Disclaimer of Warranties</Text>
              <Text style={styles.legalParagraph}>
                Daily Bread is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, express or implied.
              </Text>

              <View style={styles.legalInfoBox}>
                <Text style={styles.legalInfoTitle}>Important Information</Text>
                <Text style={styles.legalInfoText}>
                  Daily Bread's AI-powered conversations provide emotional support and biblical guidance based on scripture and Christian principles. This service does not replace professional mental health care, medical advice, or pastoral counseling.
                </Text>
                <Text style={styles.legalInfoText}>
                  If you are experiencing a mental health crisis, thoughts of self-harm, or severe distress, please contact a licensed mental health professional, your healthcare provider, or a crisis hotline immediately.
                </Text>
              </View>

              <Text style={styles.legalSectionTitle}>FAQ</Text>

              <Text style={styles.legalQuestion}>Q: Is Daily Bread free to download and use?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Daily Bread is completely free to download and use, with no hidden fees or subscriptions.</Text>

              <Text style={styles.legalQuestion}>Q: Do I need to create an account to use Daily Bread?</Text>
              <Text style={styles.legalAnswer}>A: No, you don't need to sign up or log in to use Daily Bread. Just download and start exploring!</Text>

              <Text style={styles.legalQuestion}>Q: How often is new content added?</Text>
              <Text style={styles.legalAnswer}>A: We refresh our therapy resources and devotions daily to support your ongoing journey.</Text>

              <Text style={styles.legalQuestion}>Q: What kind of therapy resources are available?</Text>
              <Text style={styles.legalAnswer}>A: Daily Bread offers Christ-centered therapy resources, including devotions, scriptural reflections, and spiritual guidance for mental and emotional well-being.</Text>

              <Text style={styles.legalQuestion}>Q: Is Daily Bread available on multiple devices?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Daily Bread is available on iOS and Android devices.</Text>

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
                At Daily Bread, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your data.
              </Text>

              <Text style={styles.legalSectionTitle}>Data Collection</Text>
              <Text style={styles.legalParagraph}>
                We collect minimal data to improve our services. No personal data is required to use Daily Bread.
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
                  Daily Bread's AI-powered conversations provide emotional support and biblical guidance based on scripture and Christian principles. This service does not replace professional mental health care, medical advice, or pastoral counseling.
                </Text>
                <Text style={styles.legalInfoText}>
                  If you are experiencing a mental health crisis, thoughts of self-harm, or severe distress, please contact a licensed mental health professional, your healthcare provider, or a crisis hotline immediately.
                </Text>
              </View>

              <Text style={styles.legalSectionTitle}>FAQ</Text>

              <Text style={styles.legalQuestion}>Q: Is Daily Bread free to download and use?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Daily Bread is completely free to download and use, with no hidden fees or subscriptions.</Text>

              <Text style={styles.legalQuestion}>Q: Do I need to create an account to use Daily Bread?</Text>
              <Text style={styles.legalAnswer}>A: No, you don't need to sign up or log in to use Daily Bread. Just download and start exploring!</Text>

              <Text style={styles.legalQuestion}>Q: How often is new content added?</Text>
              <Text style={styles.legalAnswer}>A: We refresh our therapy resources and devotions daily to support your ongoing journey.</Text>

              <Text style={styles.legalQuestion}>Q: What kind of therapy resources are available?</Text>
              <Text style={styles.legalAnswer}>A: Daily Bread offers Christ-centered therapy resources, including devotions, scriptural reflections, and spiritual guidance for mental and emotional well-being.</Text>

              <Text style={styles.legalQuestion}>Q: Is Daily Bread available on multiple devices?</Text>
              <Text style={styles.legalAnswer}>A: Yes, Daily Bread is available on iOS and Android devices.</Text>

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
                We're here to help you the best way we can.
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
                  Daily Bread is committed to providing free therapy services to those who cannot afford it. If you need support, please contact us. We'll do our best to connect you with a licensed therapist.
                </Text>
              </View>

              <Text style={styles.legalSectionTitle}>Partner with Us</Text>
              <Text style={styles.legalParagraph}>
                Are you a licensed therapist passionate about providing faith-based services? We're looking for therapists to partner with us and provide Christian therapy services on our app.
              </Text>
              <View style={styles.supportRequirementsList}>
                <Text style={styles.supportRequirement}>• Must be a licensed therapist (LCSW, LPC, LMFT, etc.)</Text>
                <Text style={styles.supportRequirement}>• Share our mission to provide Christ-centered therapy services</Text>
                <Text style={styles.supportRequirement}>• Committed to providing high-quality, compassionate care</Text>
              </View>

              <Text style={styles.legalSectionTitle}>Partnerships</Text>
              <Text style={styles.legalParagraph}>
                Daily Bread is seeking partnerships with churches, Christian faith organizations, and individuals to support our mission. Your support will help us provide free therapy services and resources to those in need.
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
