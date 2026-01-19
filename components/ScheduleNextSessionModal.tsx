import colors from '@/constants/colors';
import { Calendar, Clock, X, Check, Repeat, Edit3 } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import type { RecurrenceType, ScheduledSession } from '@/contexts/ScheduledSessionsContext';

type ScheduleNextSessionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSchedule: (dateTime: Date, recurrence: RecurrenceType, recurrenceEndDate?: Date) => void;
  editingSession?: ScheduledSession | null;
  onUpdate?: (sessionId: string, dateTime: Date, recurrence: RecurrenceType, recurrenceEndDate?: Date) => void;
};

export function ScheduleNextSessionModal({
  visible,
  onClose,
  onSchedule,
  editingSession,
  onUpdate,
}: ScheduleNextSessionModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ hour: number; minute: number } | null>(null);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [hasRecurrenceEnd, setHasRecurrenceEnd] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);

  const isEditMode = !!editingSession;

  // Initialize with editing session data
  useEffect(() => {
    if (editingSession) {
      const dt = new Date(editingSession.dateTime);
      setSelectedDate(dt);
      setSelectedTime({ hour: dt.getHours(), minute: dt.getMinutes() });
      setRecurrence(editingSession.recurrence || 'none');
      if (editingSession.recurrenceEndDate) {
        setHasRecurrenceEnd(true);
        setRecurrenceEndDate(new Date(editingSession.recurrenceEndDate));
      }
    } else {
      // Reset for new schedule
      setSelectedDate(null);
      setSelectedTime(null);
      setRecurrence('none');
      setHasRecurrenceEnd(false);
      setRecurrenceEndDate(null);
    }
  }, [editingSession, visible]);

  // Generate quick options (Tomorrow, 3 days, 1 week)
  const quickOptions = [
    {
      label: 'Tomorrow',
      days: 1,
      icon: '📅',
    },
    {
      label: 'In 3 Days',
      days: 3,
      icon: '🗓️',
    },
    {
      label: 'Next Week',
      days: 7,
      icon: '📆',
    },
  ];

  // Common therapy times
  const suggestedTimes = [
    { hour: 9, minute: 0, label: '9:00 AM' },
    { hour: 12, minute: 0, label: '12:00 PM' },
    { hour: 15, minute: 0, label: '3:00 PM' },
    { hour: 18, minute: 0, label: '6:00 PM' },
    { hour: 20, minute: 0, label: '8:00 PM' },
  ];

  const handleQuickSelect = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(9, 0, 0, 0); // Default to 9 AM
    setSelectedDate(date);
    setSelectedTime({ hour: 9, minute: 0 });
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedTime({ hour, minute });
    if (!selectedDate) {
      // If no date selected, default to tomorrow
      const date = new Date();
      date.setDate(date.getDate() + 1);
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateTime = new Date(selectedDate);
      dateTime.setHours(selectedTime.hour, selectedTime.minute, 0, 0);
      
      const finalRecurrenceEndDate = hasRecurrenceEnd && recurrenceEndDate ? recurrenceEndDate : undefined;

      if (isEditMode && editingSession && onUpdate) {
        onUpdate(editingSession.id, dateTime, recurrence, finalRecurrenceEndDate);
      } else {
        onSchedule(dateTime, recurrence, finalRecurrenceEndDate);
      }
      
      // Reset
      setSelectedDate(null);
      setSelectedTime(null);
      setRecurrence('none');
      setHasRecurrenceEnd(false);
      setRecurrenceEndDate(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: { hour: number; minute: number } | null) => {
    if (!time) return '';
    const period = time.hour >= 12 ? 'PM' : 'AM';
    const displayHour = time.hour % 12 || 12;
    return `${displayHour}:${time.minute.toString().padStart(2, '0')} ${period}`;
  };

  const canConfirm = selectedDate && selectedTime;

  const recurrenceOptions: { value: RecurrenceType; label: string; icon: string }[] = [
    { value: 'none', label: 'One Time', icon: '🔹' },
    { value: 'daily', label: 'Daily', icon: '📅' },
    { value: 'weekly', label: 'Weekly', icon: '🗓️' },
    { value: 'monthly', label: 'Monthly', icon: '📆' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.light.textSecondary} />
          </TouchableOpacity>

          <View style={styles.modalHeader}>
            <View style={styles.headerIconContainer}>
              {isEditMode ? (
                <Edit3 size={32} color={colors.light.primary} />
              ) : (
                <Calendar size={32} color={colors.light.primary} />
              )}
            </View>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Session' : 'Schedule Next Session'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {isEditMode 
                ? 'Update your therapy session details'
                : 'Set a reminder for your next therapy conversation'}
            </Text>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Quick Schedule</Text>
              <View style={styles.quickOptionsContainer}>
                {quickOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.quickOption,
                      selectedDate &&
                        Math.abs(
                          selectedDate.getDate() - new Date().getDate()
                        ) === option.days &&
                        styles.quickOptionSelected,
                    ]}
                    onPress={() => handleQuickSelect(option.days)}
                  >
                    <Text style={styles.quickOptionIcon}>{option.icon}</Text>
                    <Text style={styles.quickOptionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Preferred Time</Text>
              <View style={styles.timeOptionsContainer}>
                {suggestedTimes.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeOption,
                      selectedTime?.hour === time.hour &&
                        selectedTime?.minute === time.minute &&
                        styles.timeOptionSelected,
                    ]}
                    onPress={() => handleTimeSelect(time.hour, time.minute)}
                  >
                    <Clock
                      size={16}
                      color={
                        selectedTime?.hour === time.hour &&
                        selectedTime?.minute === time.minute
                          ? colors.light.primary
                          : colors.light.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.timeOptionLabel,
                        selectedTime?.hour === time.hour &&
                          selectedTime?.minute === time.minute &&
                          styles.timeOptionLabelSelected,
                      ]}
                    >
                      {time.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <Repeat size={20} color={colors.light.primary} />
                <Text style={styles.sectionTitle}>Recurrence</Text>
              </View>
              <View style={styles.recurrenceOptionsContainer}>
                {recurrenceOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.recurrenceOption,
                      recurrence === option.value && styles.recurrenceOptionSelected,
                    ]}
                    onPress={() => setRecurrence(option.value)}
                  >
                    <Text style={styles.recurrenceIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.recurrenceLabel,
                        recurrence === option.value && styles.recurrenceLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {recurrence !== 'none' && (
                <View style={styles.recurrenceEndContainer}>
                  <View style={styles.recurrenceEndRow}>
                    <Text style={styles.recurrenceEndLabel}>Set End Date</Text>
                    <Switch
                      value={hasRecurrenceEnd}
                      onValueChange={setHasRecurrenceEnd}
                      trackColor={{
                        false: colors.light.border,
                        true: colors.light.primary,
                      }}
                      thumbColor="#fff"
                      ios_backgroundColor={colors.light.border}
                    />
                  </View>
                  {hasRecurrenceEnd && (
                    <View style={styles.endDatePickerContainer}>
                      <Text style={styles.endDateLabel}>Ends on:</Text>
                      <TouchableOpacity
                        style={styles.endDateButton}
                        onPress={() => {
                          // Set default end date if not set
                          if (!recurrenceEndDate) {
                            const endDate = new Date(selectedDate || new Date());
                            endDate.setMonth(endDate.getMonth() + 3); // Default 3 months
                            setRecurrenceEndDate(endDate);
                          }
                        }}
                      >
                        <Text style={styles.endDateText}>
                          {recurrenceEndDate
                            ? formatDate(recurrenceEndDate)
                            : 'Select End Date'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            {selectedDate && selectedTime && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>
                  {isEditMode ? 'Updated Session' : 'Your Next Session'}
                </Text>
                <Text style={styles.summaryDateTime}>
                  {formatDate(selectedDate)} at {formatTime(selectedTime)}
                </Text>
                {recurrence !== 'none' && (
                  <Text style={styles.summaryRecurrence}>
                    Repeats {recurrence}
                    {hasRecurrenceEnd && recurrenceEndDate && 
                      ` until ${formatDate(recurrenceEndDate)}`
                    }
                  </Text>
                )}
                <Text style={styles.summaryNote}>
                  You'll receive a notification at this time
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onClose}
            >
              <Text style={styles.skipButtonText}>Maybe Later</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !canConfirm && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!canConfirm}
            >
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>
                {isEditMode ? 'Update' : 'Schedule'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.light.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalScroll: {
    maxHeight: 400,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  quickOptionsContainer: {
    gap: 12,
  },
  quickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.light.border,
    gap: 12,
  },
  quickOptionSelected: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  quickOptionIcon: {
    fontSize: 24,
  },
  quickOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    flex: 1,
  },
  timeOptionsContainer: {
    gap: 10,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.border,
    gap: 10,
  },
  timeOptionSelected: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  timeOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  timeOptionLabelSelected: {
    color: colors.light.primary,
    fontWeight: '700',
  },
  summaryCard: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: `${colors.light.success}15`,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.success,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  summaryDateTime: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  summaryRecurrence: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.primary,
    marginBottom: 8,
  },
  summaryNote: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingBottom: 0,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.light.background,
    borderWidth: 2,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.textSecondary,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recurrenceOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recurrenceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.border,
    gap: 8,
    minWidth: '47%',
  },
  recurrenceOptionSelected: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  recurrenceIcon: {
    fontSize: 18,
  },
  recurrenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  recurrenceLabelSelected: {
    color: colors.light.primary,
    fontWeight: '700',
  },
  recurrenceEndContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  recurrenceEndRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recurrenceEndLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  endDatePickerContainer: {
    gap: 8,
  },
  endDateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  endDateButton: {
    backgroundColor: colors.light.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  endDateText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
});
