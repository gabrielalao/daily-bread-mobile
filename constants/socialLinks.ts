import Constants from "expo-constants";

/**
 * Public YouTube channel for CDB Therapy.
 * Set EXPO_PUBLIC_YOUTUBE_CHANNEL_URL in .env or app.json extra.
 */
export function getYouTubeChannelUrl(): string | null {
  const raw =
    process.env.EXPO_PUBLIC_YOUTUBE_CHANNEL_URL?.trim() ||
    (Constants.expoConfig?.extra?.EXPO_PUBLIC_YOUTUBE_CHANNEL_URL as string | undefined)?.trim() ||
    "";

  return raw || null;
}
