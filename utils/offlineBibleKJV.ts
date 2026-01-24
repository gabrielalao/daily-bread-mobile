import type { BibleChapter, BibleVerse } from "@/utils/bibleAPI";
import { BIBLE_BOOKS } from "@/constants/bibleBooks";

// Bundled offline KJV dataset (public domain).
// Format: books[bookIndex][chapterIndex][verseIndex] = { n: number, txt: string }
// Where bookIndex matches the order of `BIBLE_BOOKS`.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const KJV_BOOKS: any[] = require("../assets/bible/kjv.json");

export function getBundledKjvChapter(bookId: string, chapter: number): BibleChapter | null {
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  if (bookIndex < 0) return null;
  if (!Number.isFinite(chapter) || chapter < 1) return null;

  const chapters = KJV_BOOKS?.[bookIndex];
  const chapterArr = chapters?.[chapter - 1];
  if (!Array.isArray(chapterArr)) return null;

  const bookName = BIBLE_BOOKS[bookIndex]?.name ?? bookId;
  const verses: BibleVerse[] = chapterArr
    .map((v: any) => ({
      book: bookName,
      chapter,
      verse: Number(v?.n) || 0,
      text: (v?.txt ?? "").toString(),
    }))
    .filter((v: BibleVerse) => v.verse > 0 && v.text.length > 0);

  return {
    book: bookId,
    bookName,
    chapter,
    verses,
  };
}

