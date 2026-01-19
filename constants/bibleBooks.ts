export interface BibleBook {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  abbrev: string;
  chapters: number;
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'gen', name: 'Genesis', testament: 'OT', abbrev: 'Gen', chapters: 50 },
  { id: 'exo', name: 'Exodus', testament: 'OT', abbrev: 'Exo', chapters: 40 },
  { id: 'lev', name: 'Leviticus', testament: 'OT', abbrev: 'Lev', chapters: 27 },
  { id: 'num', name: 'Numbers', testament: 'OT', abbrev: 'Num', chapters: 36 },
  { id: 'deu', name: 'Deuteronomy', testament: 'OT', abbrev: 'Deu', chapters: 34 },
  { id: 'jos', name: 'Joshua', testament: 'OT', abbrev: 'Jos', chapters: 24 },
  { id: 'jdg', name: 'Judges', testament: 'OT', abbrev: 'Jdg', chapters: 21 },
  { id: 'rut', name: 'Ruth', testament: 'OT', abbrev: 'Rut', chapters: 4 },
  { id: '1sa', name: '1 Samuel', testament: 'OT', abbrev: '1Sa', chapters: 31 },
  { id: '2sa', name: '2 Samuel', testament: 'OT', abbrev: '2Sa', chapters: 24 },
  { id: '1ki', name: '1 Kings', testament: 'OT', abbrev: '1Ki', chapters: 22 },
  { id: '2ki', name: '2 Kings', testament: 'OT', abbrev: '2Ki', chapters: 25 },
  { id: '1ch', name: '1 Chronicles', testament: 'OT', abbrev: '1Ch', chapters: 29 },
  { id: '2ch', name: '2 Chronicles', testament: 'OT', abbrev: '2Ch', chapters: 36 },
  { id: 'ezr', name: 'Ezra', testament: 'OT', abbrev: 'Ezr', chapters: 10 },
  { id: 'neh', name: 'Nehemiah', testament: 'OT', abbrev: 'Neh', chapters: 13 },
  { id: 'est', name: 'Esther', testament: 'OT', abbrev: 'Est', chapters: 10 },
  { id: 'job', name: 'Job', testament: 'OT', abbrev: 'Job', chapters: 42 },
  { id: 'psa', name: 'Psalms', testament: 'OT', abbrev: 'Psa', chapters: 150 },
  { id: 'pro', name: 'Proverbs', testament: 'OT', abbrev: 'Pro', chapters: 31 },
  { id: 'ecc', name: 'Ecclesiastes', testament: 'OT', abbrev: 'Ecc', chapters: 12 },
  { id: 'sng', name: 'Song of Solomon', testament: 'OT', abbrev: 'Sng', chapters: 8 },
  { id: 'isa', name: 'Isaiah', testament: 'OT', abbrev: 'Isa', chapters: 66 },
  { id: 'jer', name: 'Jeremiah', testament: 'OT', abbrev: 'Jer', chapters: 52 },
  { id: 'lam', name: 'Lamentations', testament: 'OT', abbrev: 'Lam', chapters: 5 },
  { id: 'ezk', name: 'Ezekiel', testament: 'OT', abbrev: 'Ezk', chapters: 48 },
  { id: 'dan', name: 'Daniel', testament: 'OT', abbrev: 'Dan', chapters: 12 },
  { id: 'hos', name: 'Hosea', testament: 'OT', abbrev: 'Hos', chapters: 14 },
  { id: 'jol', name: 'Joel', testament: 'OT', abbrev: 'Jol', chapters: 3 },
  { id: 'amo', name: 'Amos', testament: 'OT', abbrev: 'Amo', chapters: 9 },
  { id: 'oba', name: 'Obadiah', testament: 'OT', abbrev: 'Oba', chapters: 1 },
  { id: 'jon', name: 'Jonah', testament: 'OT', abbrev: 'Jon', chapters: 4 },
  { id: 'mic', name: 'Micah', testament: 'OT', abbrev: 'Mic', chapters: 7 },
  { id: 'nam', name: 'Nahum', testament: 'OT', abbrev: 'Nam', chapters: 3 },
  { id: 'hab', name: 'Habakkuk', testament: 'OT', abbrev: 'Hab', chapters: 3 },
  { id: 'zep', name: 'Zephaniah', testament: 'OT', abbrev: 'Zep', chapters: 3 },
  { id: 'hag', name: 'Haggai', testament: 'OT', abbrev: 'Hag', chapters: 2 },
  { id: 'zec', name: 'Zechariah', testament: 'OT', abbrev: 'Zec', chapters: 14 },
  { id: 'mal', name: 'Malachi', testament: 'OT', abbrev: 'Mal', chapters: 4 },
  
  // New Testament
  { id: 'mat', name: 'Matthew', testament: 'NT', abbrev: 'Mat', chapters: 28 },
  { id: 'mrk', name: 'Mark', testament: 'NT', abbrev: 'Mrk', chapters: 16 },
  { id: 'luk', name: 'Luke', testament: 'NT', abbrev: 'Luk', chapters: 24 },
  { id: 'jhn', name: 'John', testament: 'NT', abbrev: 'Jhn', chapters: 21 },
  { id: 'act', name: 'Acts', testament: 'NT', abbrev: 'Act', chapters: 28 },
  { id: 'rom', name: 'Romans', testament: 'NT', abbrev: 'Rom', chapters: 16 },
  { id: '1co', name: '1 Corinthians', testament: 'NT', abbrev: '1Co', chapters: 16 },
  { id: '2co', name: '2 Corinthians', testament: 'NT', abbrev: '2Co', chapters: 13 },
  { id: 'gal', name: 'Galatians', testament: 'NT', abbrev: 'Gal', chapters: 6 },
  { id: 'eph', name: 'Ephesians', testament: 'NT', abbrev: 'Eph', chapters: 6 },
  { id: 'php', name: 'Philippians', testament: 'NT', abbrev: 'Php', chapters: 4 },
  { id: 'col', name: 'Colossians', testament: 'NT', abbrev: 'Col', chapters: 4 },
  { id: '1th', name: '1 Thessalonians', testament: 'NT', abbrev: '1Th', chapters: 5 },
  { id: '2th', name: '2 Thessalonians', testament: 'NT', abbrev: '2Th', chapters: 3 },
  { id: '1ti', name: '1 Timothy', testament: 'NT', abbrev: '1Ti', chapters: 6 },
  { id: '2ti', name: '2 Timothy', testament: 'NT', abbrev: '2Ti', chapters: 4 },
  { id: 'tit', name: 'Titus', testament: 'NT', abbrev: 'Tit', chapters: 3 },
  { id: 'phm', name: 'Philemon', testament: 'NT', abbrev: 'Phm', chapters: 1 },
  { id: 'heb', name: 'Hebrews', testament: 'NT', abbrev: 'Heb', chapters: 13 },
  { id: 'jas', name: 'James', testament: 'NT', abbrev: 'Jas', chapters: 5 },
  { id: '1pe', name: '1 Peter', testament: 'NT', abbrev: '1Pe', chapters: 5 },
  { id: '2pe', name: '2 Peter', testament: 'NT', abbrev: '2Pe', chapters: 3 },
  { id: '1jn', name: '1 John', testament: 'NT', abbrev: '1Jn', chapters: 5 },
  { id: '2jn', name: '2 John', testament: 'NT', abbrev: '2Jn', chapters: 1 },
  { id: '3jn', name: '3 John', testament: 'NT', abbrev: '3Jn', chapters: 1 },
  { id: 'jud', name: 'Jude', testament: 'NT', abbrev: 'Jud', chapters: 1 },
  { id: 'rev', name: 'Revelation', testament: 'NT', abbrev: 'Rev', chapters: 22 },
];

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(book => book.id === id);
}

export function getBooksByTestament(testament: 'OT' | 'NT'): BibleBook[] {
  return BIBLE_BOOKS.filter(book => book.testament === testament);
}
