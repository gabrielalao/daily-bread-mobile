/**
 * Android override to avoid bundling huge MP3 assets into the base module.
 *
 * Instead of `require()`-ing local mp3 files (which inflates the Android AAB),
 * Android will stream and/or cache audio from a remote base URL.
 *
 * Configure the CDN/base URL with:
 * - EXPO_PUBLIC_AUDIO_BASE_URL=https://<your-cdn>/audio
 *
 * Expected file layout:
 *   ${BASE_URL}/${kebabCaseTitle}.mp3
 */

import { getRemoteAudioUrl } from "./audioRemote";

export function getAudioFileForDevotion(devotionTitle: string): string {
  const fileName = devotionTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return fileName;
}

/**
 * Returns a streaming source (uri) for Android. The player component can choose
 * to download/cache the file before playing.
 */
export function getDynamicAudioSource(devotionTitle: string): any | null {
  const fileName = getAudioFileForDevotion(devotionTitle);
  const url = getRemoteAudioUrl(fileName);
  return url ? { uri: url } : null;
}

export function getAudioSourceByDayOfYear(dayOfYear: number): any | null {
  // Import devotionals to get the title for the day
  const { devotionals } = require("@/constants/devotionals");
  const index = (dayOfYear - 1) % 365;
  const devotion = devotionals[index];

  if (!devotion) return null;
  return getDynamicAudioSource(devotion.title);
}

