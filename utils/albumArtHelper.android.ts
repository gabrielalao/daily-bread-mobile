/**
 * Android override to avoid bundling large album-art assets into the base module.
 *
 * Configure with:
 * - EXPO_PUBLIC_AUDIO_BASE_URL=https://<your-cdn>/audio
 *
 * Expected file layout:
 *   ${BASE_URL}/${kebabCaseTitle}.jpg
 */

import { getRemoteAlbumArtUrl } from "./audioRemote";

export function getAudioFileForDevotion(devotionTitle: string): string {
  const fileName = devotionTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return fileName;
}

export function getAlbumArtForDevotion(devotionTitle: string): any | null {
  const fileName = getAudioFileForDevotion(devotionTitle);
  const url = getRemoteAlbumArtUrl(fileName);
  return url ? { uri: url } : null;
}

