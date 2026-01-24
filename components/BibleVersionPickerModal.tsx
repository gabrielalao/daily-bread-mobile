import React, { useMemo, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import colors from "@/constants/colors";
import { BibleVersion, bibleVersions, getVersionById } from "@/constants/bible-versions";
import { getEffectiveBibleVersionId } from "@/utils/bibleVersionPolicy";
import { A11yText as Text } from "@/components/A11yText";

type Props = {
  visible: boolean;
  onClose: () => void;

  preferredVersionId: string;
  offlineModeEnabled: boolean;
  isOnline: boolean;

  setOfflineModeEnabled: (enabled: boolean) => Promise<void>;
  setPreferredVersionId: (versionId: string) => Promise<void>;
};

function isSelectable(v: BibleVersion) {
  // Only show versions we can actually fetch/render as text in the app.
  // (Copyrighted versions without apiCode would silently fall back and confuse users.)
  return Boolean(v.apiCode);
}

export function BibleVersionPickerModal(props: Props) {
  const [query, setQuery] = useState("");

  const selectable = useMemo(() => bibleVersions.filter(isSelectable), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return selectable;
    return selectable.filter(
      (v) => v.name.toLowerCase().includes(q) || v.abbreviation.toLowerCase().includes(q)
    );
  }, [query, selectable]);

  const preferred = getVersionById(props.preferredVersionId);
  const effectiveId = getEffectiveBibleVersionId({
    preferredVersionId: props.preferredVersionId,
    offlineModeEnabled: props.offlineModeEnabled,
  });
  const effective = getVersionById(effectiveId);

  const select = async (versionId: string) => {
    // If Offline mode is on and they choose something other than KJV,
    // explain that KJV will still be shown until they enable Online mode.
    if (props.offlineModeEnabled && versionId !== "kjv") {
      if (!props.isOnline) {
        Alert.alert(
          "No internet connection",
          "Connect to the internet to enable Online Mode and download Bible versions.",
          [{ text: "OK", style: "default" }]
        );
        return;
      }

      Alert.alert(
        "Offline mode is on",
        "Online Mode enables: Translation, Personalization, Extra Bible versions.\n\nTherapy already needs internet.\n\nYou can keep Offline mode on and we'll save your preference, but you will still read KJV until Online Mode is enabled.",
        [
          {
            text: "Keep Offline",
            style: "cancel",
            onPress: async () => {
              await props.setPreferredVersionId(versionId);
              props.onClose();
              setQuery("");
            },
          },
          {
            text: "Enable Online Mode",
            onPress: async () => {
              await props.setOfflineModeEnabled(false);
              await props.setPreferredVersionId(versionId);
              props.onClose();
              setQuery("");
            },
          },
        ]
      );
      return;
    }

    await props.setPreferredVersionId(versionId);
    props.onClose();
    setQuery("");
  };

  return (
    <Modal visible={props.visible} animationType="slide" transparent onRequestClose={props.onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Select a Bible Version</Text>
              <Text style={styles.subtitle}>
                Preferred: {preferred?.abbreviation ?? props.preferredVersionId}
                {"  "}•{"  "}
                Showing: {effective?.abbreviation ?? "KJV"}
                {props.offlineModeEnabled ? " (Offline mode)" : ""}
              </Text>
            </View>
            <TouchableOpacity onPress={props.onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Search versions..."
            placeholderTextColor={colors.light.textSecondary}
            value={query}
            onChangeText={setQuery}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = item.id === props.preferredVersionId;
              const isBundled = item.id === "kjv";
              return (
                <TouchableOpacity
                  style={[styles.item, isSelected && styles.itemActive]}
                  onPress={() => select(item.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, isSelected && styles.itemTitleActive]}>{item.name}</Text>
                    <Text style={styles.itemSub}>
                      {item.abbreviation} • {item.language}
                      {"  "}•{"  "}
                      {isBundled ? "Offline" : "Online"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isSelected ? colors.light.primary : "rgba(255,255,255,0.18)" },
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.light.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  title: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: colors.light.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  closeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  closeText: {
    color: colors.light.primary,
    fontSize: 16,
    fontWeight: "700" as const,
  },
  search: {
    backgroundColor: colors.light.cardBackgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    margin: 16,
    fontSize: 16,
    color: colors.light.text,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  itemActive: {
    backgroundColor: "rgba(42, 157, 143, 0.08)",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  itemTitleActive: {
    color: colors.light.primary,
  },
  itemSub: {
    marginTop: 4,
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 12,
  },
});

