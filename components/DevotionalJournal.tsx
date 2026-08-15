import { A11yText as Text } from "@/components/A11yText";
import { getJournalEntry, saveJournalEntry, toDateKey } from "@/utils/journalStorage";
import { t } from "@/utils/i18n";
import { Edit3 } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

type DevotionalJournalProps = {
  date: Date;
  locale: string;
  lang: string;
  onSaved?: (dateKey: string, hasContent: boolean) => void;
};

export function DevotionalJournal({ date, locale, lang, onSaved }: DevotionalJournalProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContentRef = useRef("");
  const loadedDateKeyRef = useRef<string | null>(null);

  const dateKey = toDateKey(date);
  const formattedDate = date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const persist = useCallback(
    async (nextContent: string) => {
      setIsSaving(true);
      try {
        await saveJournalEntry(date, nextContent);
        const hasContent = Boolean(nextContent.trim());
        setLastSavedAt(hasContent ? new Date().toISOString() : null);
        onSaved?.(dateKey, hasContent);
      } finally {
        setIsSaving(false);
      }
    },
    [date, dateKey, onSaved]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const entry = await getJournalEntry(date);
      if (cancelled) return;

      const next = entry?.content ?? "";
      setContent(next);
      latestContentRef.current = next;
      setLastSavedAt(entry?.updatedAt ?? null);
      loadedDateKeyRef.current = dateKey;
      setIsLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [date, dateKey]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const scheduleSave = (nextContent: string) => {
    latestContentRef.current = nextContent;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      void persist(nextContent);
    }, 600);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Edit3 size={22} color="#FFFFFF" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{t(lang, "home.journalTitle")}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        {isSaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
      </View>

      <Text style={styles.prompt}>{t(lang, "home.journalPrompt")}</Text>

      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      ) : (
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={(text) => {
            setContent(text);
            scheduleSave(text);
          }}
          onBlur={() => {
            if (saveTimerRef.current) {
              clearTimeout(saveTimerRef.current);
            }
            void persist(latestContentRef.current);
          }}
          placeholder={t(lang, "home.journalPlaceholder")}
          placeholderTextColor="rgba(255, 255, 255, 0.55)"
          multiline
          textAlignVertical="top"
          autoCorrect
          spellCheck
        />
      )}

      {!isLoading && lastSavedAt ? (
        <Text style={styles.savedText}>{t(lang, "home.journalSaved")}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: "#6A4C93",
    borderRadius: isTablet ? 24 : 16,
    padding: isTablet ? 28 : (isSmallScreen ? 16 : 20),
    borderLeftWidth: 4,
    borderLeftColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  dateText: {
    marginTop: 2,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600" as const,
  },
  prompt: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  input: {
    minHeight: isTablet ? 180 : 140,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
  loadingRow: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  savedText: {
    marginTop: 10,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
    fontWeight: "600" as const,
  },
});
