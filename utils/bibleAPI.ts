import AsyncStorage from '@react-native-async-storage/async-storage';

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

/**
 * Fetch a chapter from Bible API with offline caching
 * Supports multiple translations
 */
export async function fetchBibleChapter(
  bookId: string,
  chapter: number,
  translation: string = 'kjv'
): Promise<BibleChapter | null> {
  const cacheKey = `${BIBLE_CACHE_PREFIX}${translation}_${bookId}_${chapter}`;
  
  try {
    // Try to get from cache first
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      console.log(`Bible: Loaded ${bookId} ${chapter} from cache`);
      return JSON.parse(cached);
    }

    // Fetch from API
    console.log(`Bible: Fetching ${bookId} ${chapter} from API`);
    const response = await fetch(
      `${BIBLE_API_URL}/${bookId}+${chapter}?translation=${translation}`
    );
    
    if (!response.ok) {
      console.error(`Bible API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    // Parse verses from the API response
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

    // Cache for offline use
    await AsyncStorage.setItem(cacheKey, JSON.stringify(chapterData));
    console.log(`Bible: Cached ${bookId} ${chapter}`);

    return chapterData;
  } catch (error) {
    console.error('Bible API fetch error:', error);
    
    // Try cache again in case of network error
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        console.log(`Bible: Using cached ${bookId} ${chapter} (offline)`);
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
  const translationMap: Record<string, string> = {
    'niv': 'web', // Using World English Bible as NIV isn't available in free API
    'kjv': 'kjv',
    'esv': 'web',
    'nkjv': 'kjv',
    'nasb': 'web',
    'nlt': 'web',
  };
  
  return translationMap[bibleVersion.toLowerCase()] || 'kjv';
}

/**
 * Pre-cache a range of chapters for offline use
 */
export async function preCacheBibleChapters(
  bookId: string,
  startChapter: number,
  endChapter: number,
  translation: string = 'kjv'
): Promise<void> {
  const promises = [];
  for (let chapter = startChapter; chapter <= endChapter; chapter++) {
    promises.push(fetchBibleChapter(bookId, chapter, translation));
    // Add a small delay to avoid overwhelming the API
    if (chapter % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  await Promise.all(promises);
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
