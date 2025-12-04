import colors from "@/constants/colors";
import { useNotifications } from "@/contexts/NotificationContext";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, BellOff, Clock } from "lucide-react-native";
import React, { useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { settings, isLoaded, enableNotifications, disableNotifications, updateNotificationTime } = useNotifications();
  const [selectedHour, setSelectedHour] = useState(parseInt(settings.time.split(':')[0]));
  const [selectedMinute, setSelectedMinute] = useState(parseInt(settings.time.split(':')[1]));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const scrollRef = React.useRef<ScrollView>(null);

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
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Daily Notifications</Text>
            <Text style={styles.subtitle}>
              Get reminded to read your daily devotional
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
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              When enabled, you&apos;ll receive a notification at your chosen time each day
              with a reminder to read your daily devotional. Content updates every 24 hours,
              so you&apos;ll always have fresh spiritual nourishment waiting for you.
            </Text>
          </View>
        </View>
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
});
