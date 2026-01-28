/**
 * Shared helpers for resolving remote devotional audio/art URLs.
 *
 * Note: These are used by Android overrides to avoid bundling huge assets into the AAB.
 * Set EXPO_PUBLIC_AUDIO_BASE_URL in EAS build env for Android production.
 */

function normalizeBaseUrl(url: string): string {
  // remove trailing slashes
  return url.replace(/\/+$/, "");
}

function getBaseUrlFromEnv(): string | null {
  const raw =
    process.env.EXPO_PUBLIC_AUDIO_BASE_URL ||
    process.env.EXPO_PUBLIC_AUDIO_URL ||
    "";

  const trimmed = raw.trim();
  if (!trimmed) return null;
  return normalizeBaseUrl(trimmed);
}

/**
 * Returns remote MP3 URL for a given kebab-case file name (without extension).
 */
export function getRemoteAudioUrl(fileName: string): string | null {
  const base = getBaseUrlFromEnv();
  if (!base) return null;
  return `${base}/${fileName}.mp3`;
}

/**
 * Returns remote JPG URL for a given kebab-case file name (without extension).
 */
export function getRemoteAlbumArtUrl(fileName: string): string | null {
  const base = getBaseUrlFromEnv();
  if (!base) return null;
  return `${base}/${fileName}.jpg`;
}

