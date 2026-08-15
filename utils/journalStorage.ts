import AsyncStorage from "@react-native-async-storage/async-storage";

const JOURNALS_KEY = "@devotional_journals";

export type JournalEntry = {
  content: string;
  updatedAt: string;
};

export type JournalStore = Record<string, JournalEntry>;

/** Local calendar date key (YYYY-MM-DD). */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export type JournalListItem = {
  dateKey: string;
  content: string;
  updatedAt: string;
};

async function readStore(): Promise<JournalStore> {
  try {
    const raw = await AsyncStorage.getItem(JOURNALS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as JournalStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store: JournalStore): Promise<void> {
  await AsyncStorage.setItem(JOURNALS_KEY, JSON.stringify(store));
}

export async function getJournalEntry(date: Date): Promise<JournalEntry | null> {
  const store = await readStore();
  return store[toDateKey(date)] ?? null;
}

export async function saveJournalEntry(date: Date, content: string): Promise<void> {
  const key = toDateKey(date);
  const store = await readStore();
  const trimmed = content.trim();

  if (!trimmed) {
    delete store[key];
  } else {
    store[key] = {
      content,
      updatedAt: new Date().toISOString(),
    };
  }

  await writeStore(store);
}

export async function getJournalDateKeys(): Promise<string[]> {
  const store = await readStore();
  return Object.keys(store).filter((key) => Boolean(store[key]?.content?.trim()));
}

export async function getAllJournalEntries(): Promise<JournalListItem[]> {
  const store = await readStore();
  return Object.entries(store)
    .filter(([, entry]) => Boolean(entry?.content?.trim()))
    .map(([dateKey, entry]) => ({
      dateKey,
      content: entry.content,
      updatedAt: entry.updatedAt,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
