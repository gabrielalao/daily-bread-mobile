import colors from "@/constants/colors";
import { A11yText as Text } from "@/components/A11yText";
import {
  getAllJournalEntries,
  parseDateKey,
  saveJournalEntry,
  type JournalListItem,
} from "@/utils/journalStorage";
import { t } from "@/utils/i18n";
import { getAppLanguageById } from "@/constants/app-languages";
import { ArrowLeft, BookOpen, Edit3, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type JournalListModalProps = {
  visible: boolean;
  lang: string;
  onClose: () => void;
  onViewDevotion: (dateKey: string) => void;
};

function previewText(content: string, maxLength = 100): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}

export function JournalListModal({
  visible,
  lang,
  onClose,
  onViewDevotion,
}: JournalListModalProps) {
  const insets = useSafeAreaInsets();
  const locale = getAppLanguageById(lang)?.locale ?? "en-US";
  const [entries, setEntries] = useState<JournalListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<JournalListItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContentRef = useRef("");

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    const items = await getAllJournalEntries();
    setEntries(items);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (visible) {
      void loadEntries();
    } else {
      setEditingEntry(null);
      setEditContent("");
      setLastSavedAt(null);
    }
  }, [visible, loadEntries]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const formatJournalDate = (dateKey: string) =>
    parseDateKey(dateKey).toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatWrittenAt = (updatedAt: string) =>
    new Date(updatedAt).toLocaleString(locale, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const openEditor = (entry: JournalListItem) => {
    setEditingEntry(entry);
    setEditContent(entry.content);
    latestContentRef.current = entry.content;
    setLastSavedAt(entry.updatedAt);
  };

  const closeEditor = async (closeModal = false) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    if (editingEntry) {
      await persistEdit(latestContentRef.current);
    }
    setEditingEntry(null);
    setEditContent("");
    setLastSavedAt(null);
    await loadEntries();
    if (closeModal) {
      onClose();
    }
  };

  const persistEdit = async (nextContent: string) => {
    if (!editingEntry) return;

    setIsSaving(true);
    try {
      const date = parseDateKey(editingEntry.dateKey);
      await saveJournalEntry(date, nextContent);
      const trimmed = nextContent.trim();
      const updatedAt = trimmed ? new Date().toISOString() : editingEntry.updatedAt;

      if (trimmed) {
        setLastSavedAt(updatedAt);
        setEditingEntry((prev) =>
          prev
            ? {
                ...prev,
                content: nextContent,
                updatedAt,
              }
            : prev
        );
      } else {
        setEditingEntry(null);
        setEditContent("");
        setLastSavedAt(null);
        await loadEntries();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const scheduleSave = (nextContent: string) => {
    latestContentRef.current = nextContent;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      void persistEdit(nextContent);
    }, 600);
  };

  const handleViewDevotion = (dateKey: string) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    if (editingEntry) {
      void persistEdit(latestContentRef.current);
    }
    onViewDevotion(dateKey);
  };

  const renderList = () => (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.light.primary} />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <BookOpen size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.emptyTitle}>{t(lang, "settings.journalsEmptyTitle")}</Text>
          <Text style={styles.emptyText}>{t(lang, "settings.journalsEmptyDescription")}</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.dateKey}
          contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.entryCard}>
              <Text style={styles.entryDate}>{formatJournalDate(item.dateKey)}</Text>
              <Text style={styles.entryWrittenAt}>
                {t(lang, "settings.journalWrittenAt")} {formatWrittenAt(item.updatedAt)}
              </Text>
              <Text style={styles.entryPreview} numberOfLines={3}>
                {previewText(item.content)}
              </Text>
              <View style={styles.entryActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.85}
                  onPress={() => openEditor(item)}
                >
                  <Edit3 size={16} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>{t(lang, "settings.journalEdit")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.devotionButton}
                  activeOpacity={0.85}
                  onPress={() => handleViewDevotion(item.dateKey)}
                >
                  <BookOpen size={16} color="#6A4C93" />
                  <Text style={styles.devotionButtonText}>{t(lang, "settings.journalViewDevotion")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </>
  );

  const renderEditor = () => {
    if (!editingEntry) return null;

    return (
      <KeyboardAvoidingView
        style={styles.editorContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.editorScroll, { paddingBottom: Math.max(insets.bottom, 24) }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.editorCard}>
            <Text style={styles.editorDate}>{formatJournalDate(editingEntry.dateKey)}</Text>
            <Text style={styles.editorWrittenAt}>
              {lastSavedAt
                ? `${t(lang, "settings.journalWrittenAt")} ${formatWrittenAt(lastSavedAt)}`
                : null}
            </Text>
            <TextInput
              style={styles.editorInput}
              value={editContent}
              onChangeText={(text) => {
                setEditContent(text);
                scheduleSave(text);
              }}
              onBlur={() => {
                if (saveTimerRef.current) {
                  clearTimeout(saveTimerRef.current);
                }
                void persistEdit(latestContentRef.current);
              }}
              placeholder={t(lang, "home.journalPlaceholder")}
              placeholderTextColor={colors.light.textSecondary}
              multiline
              textAlignVertical="top"
              autoCorrect
              spellCheck
              autoFocus
            />
            {isSaving ? (
              <ActivityIndicator size="small" color="#6A4C93" style={styles.savingIndicator} />
            ) : lastSavedAt ? (
              <Text style={styles.savedText}>{t(lang, "home.journalSaved")}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.viewDevotionFullButton}
            activeOpacity={0.85}
            onPress={() => handleViewDevotion(editingEntry.dateKey)}
          >
            <BookOpen size={18} color="#FFFFFF" />
            <Text style={styles.viewDevotionFullButtonText}>{t(lang, "settings.journalViewDevotion")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (editingEntry) {
          void closeEditor(true);
        } else {
          onClose();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.header}>
            {editingEntry ? (
              <TouchableOpacity onPress={() => void closeEditor()} style={styles.backButton}>
                <ArrowLeft size={22} color={colors.light.text} />
                <Text style={styles.backButtonText}>{t(lang, "settings.journalBackToList")}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.headerText}>
                <Text style={styles.title}>{t(lang, "settings.myJournals")}</Text>
                <Text style={styles.subtitle}>{t(lang, "settings.myJournalsDescription")}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                if (editingEntry) {
                  void closeEditor(true);
                } else {
                  onClose();
                }
              }}
              style={styles.closeButton}
              accessibilityLabel={t(lang, "common.close")}
            >
              <X size={24} color={colors.light.text} />
            </TouchableOpacity>
          </View>

          {editingEntry ? (
            <>
              <Text style={styles.editorHeaderTitle}>{t(lang, "settings.journalEditEntry")}</Text>
              {renderEditor()}
            </>
          ) : (
            renderList()
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modal: {
    flex: 1,
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textSecondary,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  editorHeaderTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#6A4C93",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  entryCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6A4C93",
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  entryWrittenAt: {
    marginTop: 6,
    fontSize: 13,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  entryPreview: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.text,
  },
  entryActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#6A4C93",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  devotionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.light.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#6A4C93",
  },
  devotionButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#6A4C93",
  },
  editorContainer: {
    flex: 1,
  },
  editorScroll: {
    paddingHorizontal: 20,
  },
  editorCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6A4C93",
  },
  editorDate: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  editorWrittenAt: {
    marginTop: 6,
    fontSize: 13,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  editorInput: {
    marginTop: 14,
    minHeight: 220,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.light.background,
    color: colors.light.text,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: colors.light.borderLight,
  },
  savingIndicator: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  savedText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  viewDevotionFullButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  viewDevotionFullButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
