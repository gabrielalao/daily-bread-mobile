import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVersionById } from '@/constants/bible-versions';
import { getBundledKjvChapter } from '@/utils/offlineBibleKJV';

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}

const BIBLE_CACHE_PREFIX = 'bible_cache_';
const BIBLE_API_URL = 'https://bible-api.com';

// We'll use API + aggressive caching as a practical "offline-first" approach
// True 100% offline would require bundling ~5MB of Bible JSON data
// This approach: loads once with internet, then works 100% offline forever

/**
 * Fetch a chapter from Bible API with permanent offline caching
 * After first fetch, works 100% offline
 */
export async function fetchBibleChapter(
  bookId: string,
  chapter: number,
  translation: string = 'kjv',
  opts?: { allowNetwork?: boolean }
): Promise<BibleChapter | null> {
  // Prefer bundled KJV when requested (true offline).
  if (translation === 'kjv') {
    const bundled = getBundledKjvChapter(bookId, chapter);
    if (bundled) return bundled;
  }

  const cacheKey = `${BIBLE_CACHE_PREFIX}${translation}_${bookId}_${chapter}`;
  const allowNetwork = opts?.allowNetwork !== false;
  
  try {
    // Try cache first (works offline)
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      console.log(`Bible: Loaded ${bookId} ${chapter} from offline cache`);
      return JSON.parse(cached);
    }

    // In strict offline mode, do not attempt any network fetches.
    if (!allowNetwork) {
      console.log(`Bible: Offline mode - cache miss for ${bookId} ${chapter} (${translation})`);
      return null;
    }

    // Only fetch if not in cache (requires internet once)
    console.log(`Bible: Fetching ${bookId} ${chapter} from API (first time only)`);
    const response = await fetch(
      `${BIBLE_API_URL}/${bookId}+${chapter}?translation=${translation}`,
      { timeout: 10000 } as any
    );
    
    if (!response.ok) {
      console.warn(`Bible API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    // Parse verses
    const verses: BibleVerse[] = data.verses.map((v: any) => ({
      book: v.book_name,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
    }));

    const chapterData: BibleChapter = {
      book: bookId,
      bookName: data.verses[0]?.book_name || bookId,
      chapter,
      verses,
    };

    // Permanently cache for offline use
    await AsyncStorage.setItem(cacheKey, JSON.stringify(chapterData));
    console.log(`Bible: Permanently cached ${bookId} ${chapter} for offline use`);

    return chapterData;
  } catch (error) {
    console.error('Bible fetch error:', error);
    
    // Always try cache on error (enables offline)
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        console.log(`Bible: Using offline cache for ${bookId} ${chapter}`);
        return JSON.parse(cached);
      }
    } catch (cacheError) {
      console.error('Bible cache error:', cacheError);
    }
    
    return null;
  }
}

/**
 * Map Bible version preference to API translation code
 */
export function getBibleAPITranslation(bibleVersion: string): string {
  const id = (bibleVersion ?? '').toLowerCase();

  // If the selected version is supported by the passage provider, use its apiCode directly.
  const v = getVersionById(id);
  if (v?.apiCode) return v.apiCode;

  // Otherwise, fall back to a public-domain equivalent so "online mode" still works.
  // (These popular/copyrighted translations are not provided by bible-api.com.)
  const fallbackMap: Record<string, string> = {
    niv: 'web',
    esv: 'web',
    nlt: 'web',
    nasb: 'web',
    msg: 'web',
    nkjv: 'kjv',
  };

  return fallbackMap[id] || 'kjv';
}

/**
 * Pre-cache commonly read chapters for immediate offline access
 * Call this on app launch or settings screen
 */
export async function preCachePopularChapters(
  translation: string = 'kjv'
): Promise<void> {
  const popularChapters = [
    // Genesis
    { book: 'gen', chapter: 1 },
    // Psalms
    { book: 'psalm', chapter: 23 },
    { book: 'psalm', chapter: 91 },
    // Proverbs
    { book: 'proverbs', chapter: 3 },
    // John
    { book: 'john', chapter: 1 },
    { book: 'john', chapter: 3 },
    { book: 'john', chapter: 14 },
    // Romans
    { book: 'romans', chapter: 8 },
    // Ephesians
    { book: 'ephesians', chapter: 6 },
    // Revelation
    { book: 'revelation', chapter: 21 },
  ];

  console.log('Bible: Pre-caching popular chapters for offline use...');
  
  for (const { book, chapter } of popularChapters) {
    try {
      await fetchBibleChapter(book, chapter, translation);
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.warn(`Failed to pre-cache ${book} ${chapter}:`, error);
    }
  }
  
  console.log('Bible: Pre-caching complete!');
}

/**
 * Check how many chapters are cached offline
 */
export async function getCachedChapterCount(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const bibleKeys = keys.filter(key => key.startsWith(BIBLE_CACHE_PREFIX));
    return bibleKeys.length;
  } catch (error) {
    console.error('Error counting cached chapters:', error);
    return 0;
  }
}

/**
 * Clear Bible cache (for troubleshooting or version switching)
 */
export async function clearBibleCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const bibleKeys = keys.filter(key => key.startsWith(BIBLE_CACHE_PREFIX));
    await AsyncStorage.multiRemove(bibleKeys);
    console.log(`Bible: Cleared ${bibleKeys.length} cached chapters`);
  } catch (error) {
    console.error('Bible: Error clearing cache:', error);
  }
}
