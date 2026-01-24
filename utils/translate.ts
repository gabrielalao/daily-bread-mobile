import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const CACHE_PREFIX = "@tr_v1";

type TranslateResult = { text: string; wasCached: boolean; didTranslate: boolean };

function hashString(input: string): string {
  // djb2
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function cacheKey(lang: string, text: string): string {
  return `${CACHE_PREFIX}:${lang}:${hashString(text)}`;
}

const POST_PROVIDERS = [
  // These often work on native (no CORS), but can be blocked on web.
  "https://libretranslate.de/translate",
];

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";

// ---- Rate limiting + in-flight dedupe (free providers will 429 if we spam) ----
const inFlight = new Map<string, Promise<TranslateResult>>();

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function createLimiter(maxConcurrency: number, minIntervalMs: number) {
  let active = 0;
  let lastStart = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    const fn = queue.shift();
    if (fn) fn();
  };

  return async function limit<T>(fn: () => Promise<T>): Promise<T> {
    await new Promise<void>((resolve) => {
      const run = () => resolve();
      if (active < maxConcurrency) {
        active += 1;
        run();
      } else {
        queue.push(run);
      }
    });

    try {
      const now = Date.now();
      const wait = Math.max(0, minIntervalMs - (now - lastStart));
      if (wait > 0) await sleep(wait);
      lastStart = Date.now();
      return await fn();
    } finally {
      active = Math.max(0, active - 1);
      next();
    }
  };
}

// Web: very strict (MyMemory 429s easily). Native: slightly higher.
const limitWeb = createLimiter(1, 450);
const limitNative = createLimiter(2, 150);

async function fetchWithRetry(url: string, init: RequestInit, maxRetries: number): Promise<Response> {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, init);
    if (res.status !== 429 || attempt >= maxRetries) return res;
    // Exponential backoff for rate limiting
    const backoff = 800 * Math.pow(2, attempt);
    await sleep(backoff);
    attempt += 1;
  }
}

export async function translateTextCached(opts: {
  text: string;
  targetLang: string;
  sourceLang?: string;
  offlineModeEnabled?: boolean;
}): Promise<TranslateResult> {
  const sourceLang = opts.sourceLang ?? "en";
  const targetLang = opts.targetLang;
  const text = (opts.text ?? "").trim();

  if (!text) return { text: opts.text ?? "", wasCached: false, didTranslate: false };
  if (targetLang === "en" || targetLang === sourceLang) return { text: opts.text, wasCached: false, didTranslate: false };

  const key = cacheKey(targetLang, text);
  const cached = await AsyncStorage.getItem(key);
  if (cached) return { text: cached, wasCached: true, didTranslate: true };

  // Strict offline mode: allow cache hits only, never call translation providers.
  if (opts.offlineModeEnabled) {
    return { text: opts.text, wasCached: false, didTranslate: false };
  }

  const existing = inFlight.get(key);
  if (existing) return existing;

  const run = (Platform.OS === "web" ? limitWeb : limitNative)(async (): Promise<TranslateResult> => {
    // Web: use a CORS-friendly GET provider (MyMemory) to avoid browser CORS/preflight issues.
    if (Platform.OS === "web") {
      try {
        const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(
          `${sourceLang}|${targetLang}`
        )}`;
        const res = await fetchWithRetry(url, { method: "GET" }, 3);
        if (res.ok) {
          const data: any = await res.json();
          const translated = (data?.responseData?.translatedText ?? "").toString().trim();
          if (translated) {
            await AsyncStorage.setItem(key, translated);
            return { text: translated, wasCached: false, didTranslate: true };
          }
        }
      } catch {
        // fall through
      }
      return { text: opts.text, wasCached: false, didTranslate: false };
    }

    // Try providers in order; keep it resilient.
    for (const endpoint of POST_PROVIDERS) {
      try {
        const res = await fetchWithRetry(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: "text",
          }),
        }, 2);

        if (!res.ok) continue;
        const data: any = await res.json();
        const translated = (data?.translatedText ?? "").toString().trim();
        if (!translated) continue;

        await AsyncStorage.setItem(key, translated);
        return { text: translated, wasCached: false, didTranslate: true };
      } catch {
        // ignore and try next provider
      }
    }

    // Native fallback: MyMemory GET
    try {
      const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(
        `${sourceLang}|${targetLang}`
      )}`;
      const res = await fetchWithRetry(url, { method: "GET" }, 3);
      if (res.ok) {
        const data: any = await res.json();
        const translated = (data?.responseData?.translatedText ?? "").toString().trim();
        if (translated) {
          await AsyncStorage.setItem(key, translated);
          return { text: translated, wasCached: false, didTranslate: true };
        }
      }
    } catch {
      // ignore
    }

    // Fallback: return original
    return { text: opts.text, wasCached: false, didTranslate: false };
  });

  inFlight.set(key, run);
  try {
    return await run;
  } finally {
    inFlight.delete(key);
  }

}

