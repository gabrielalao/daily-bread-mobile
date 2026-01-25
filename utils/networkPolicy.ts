import { Alert } from "react-native";

export type NetworkPolicyFeature =
  | "translation"
  | "personalization"
  | "bibleVersions"
  | "bibleFetch"
  | "studyFetch"
  | "other";

const GAIN_LOSE_MESSAGE =
  "Online Mode enables: Translation, Personalization, Extra Bible versions.\n\nTherapy already needs internet.";

export async function showOfflineOnlineInfoPrompt(opts: {
  offlineModeEnabled: boolean;
  setOfflineModeEnabled: (enabled: boolean) => Promise<void>;
}) {
  const { offlineModeEnabled, setOfflineModeEnabled } = opts;

  if (offlineModeEnabled) {
    Alert.alert("Offline mode is on", GAIN_LOSE_MESSAGE, [
      { text: "Keep Offline", style: "cancel" },
      {
        text: "Enable Online Mode",
        onPress: () => {
          void setOfflineModeEnabled(false);
        },
      },
    ]);
    return;
  }

  Alert.alert("Online mode is on", GAIN_LOSE_MESSAGE, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Enable Offline Mode",
      onPress: () => {
        void setOfflineModeEnabled(true);
      },
    },
  ]);
}

export async function requireOnlineOrPrompt(opts: {
  feature: NetworkPolicyFeature;
  offlineModeEnabled: boolean;
  isOnline: boolean;
  setOfflineModeEnabled: (enabled: boolean) => Promise<void>;
  onContinue: () => void | Promise<void>;
}) {
  const { offlineModeEnabled, isOnline, setOfflineModeEnabled, onContinue } = opts;

  // If the device has no internet, switching modes won't help.
  if (!isOnline) {
    Alert.alert("No internet connection", "Connect to the internet to use this feature.", [
      { text: "OK", style: "default" },
    ]);
    return;
  }

  if (!offlineModeEnabled) {
    await onContinue();
    return;
  }

  Alert.alert("This feature needs internet", GAIN_LOSE_MESSAGE, [
    { text: "Keep Offline", style: "cancel" },
    {
      text: "Enable Online Mode",
      onPress: async () => {
        await setOfflineModeEnabled(false);
        await onContinue();
      },
    },
  ]);
}

