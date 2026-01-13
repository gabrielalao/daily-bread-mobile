export type BibleVersion = {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  language: string;
  popular: boolean;
  /**
   * Optional translation code for the in-app passage fetch provider.
   * Note: many modern copyrighted translations (e.g. NIV/ESV/NLT) may not be available
   * via the free provider used for "View Full Passage".
   */
  apiCode?: string;
};

export const bibleVersions: BibleVersion[] = [
  // --- Popular (common in settings) ---
  {
    id: 'niv',
    name: 'New International Version',
    abbreviation: 'NIV',
    description: 'Contemporary English translation balancing accuracy and readability',
    language: 'English',
    popular: true,
  },
  {
    id: 'nvi',
    name: 'Nueva Versión Internacional',
    abbreviation: 'NVI',
    description: 'Spanish New International Version (modern Spanish)',
    language: 'Spanish',
    popular: true,
  },
  {
    id: 'kjv',
    name: 'King James Version',
    abbreviation: 'KJV',
    description: 'Classic English translation known for beautiful, poetic language',
    language: 'English',
    popular: true,
    apiCode: 'kjv',
  },
  {
    id: 'nkjv',
    name: 'New King James Version',
    abbreviation: 'NKJV',
    description: 'Modern update of the KJV with contemporary language',
    language: 'English',
    popular: true,
  },
  {
    id: 'esv',
    name: 'English Standard Version',
    abbreviation: 'ESV',
    description: 'Word-for-word translation emphasizing accuracy and literary excellence',
    language: 'English',
    popular: true,
  },
  {
    id: 'nlt',
    name: 'New Living Translation',
    abbreviation: 'NLT',
    description: 'Thought-for-thought translation making Scripture accessible and clear',
    language: 'English',
    popular: true,
  },
  {
    id: 'msg',
    name: 'The Message',
    abbreviation: 'MSG',
    description: 'Contemporary paraphrase in everyday language',
    language: 'English',
    popular: true,
  },
  {
    id: 'rvr1960',
    name: 'Reina-Valera 1960',
    abbreviation: 'RVR60',
    description: 'Classic Spanish translation widely used in churches',
    language: 'Spanish',
    popular: true,
  },
  {
    id: 'lsg',
    name: 'Louis Segond',
    abbreviation: 'LSG',
    description: 'Classic French translation (widely used)',
    language: 'French',
    popular: true,
  },
  {
    id: 'lut',
    name: 'Lutherbibel',
    abbreviation: 'LUT',
    description: 'Classic German translation in Luther tradition',
    language: 'German',
    popular: true,
  },

  // --- Original language texts (free/public domain sources vary by provider) ---
  {
    id: 'hebrew-wlc',
    name: 'Hebrew Bible (WLC)',
    abbreviation: 'WLC',
    description: 'Original-language Hebrew/Aramaic Old Testament text (Westminster Leningrad Codex)',
    language: 'Hebrew',
    popular: false,
    apiCode: 'wlc',
  },
  {
    id: 'greek-sblgnt',
    name: 'Greek New Testament (SBLGNT)',
    abbreviation: 'SBLGNT',
    description: 'Original-language Greek New Testament text (Society of Biblical Literature Greek New Testament)',
    language: 'Greek',
    popular: false,
    apiCode: 'sblgnt',
  },
  {
    id: 'greek-lxx',
    name: 'Septuagint (LXX)',
    abbreviation: 'LXX',
    description: 'Greek translation of the Old Testament (Septuagint)',
    language: 'Greek',
    popular: false,
    apiCode: 'lxx',
  },

  // --- Public domain / generally available via free passage providers ---
  {
    id: 'web',
    name: 'World English Bible',
    abbreviation: 'WEB',
    description: 'Public domain modern English translation',
    language: 'English',
    popular: false,
    apiCode: 'web',
  },
  {
    id: 'asv',
    name: 'American Standard Version (1901)',
    abbreviation: 'ASV',
    description: 'Classic word-for-word English translation (public domain)',
    language: 'English',
    popular: false,
    apiCode: 'asv',
  },
  {
    id: 'darby',
    name: "Darby's Translation",
    abbreviation: 'DARBY',
    description: 'Literal English translation by J.N. Darby (public domain)',
    language: 'English',
    popular: false,
    apiCode: 'darby',
  },
  {
    id: 'ylt',
    name: "Young's Literal Translation",
    abbreviation: 'YLT',
    description: 'Very literal English translation (public domain)',
    language: 'English',
    popular: false,
    apiCode: 'ylt',
  },
  {
    id: 'wbt',
    name: "Webster's Bible",
    abbreviation: 'WBT',
    description: '19th-century English revision of KJV (public domain)',
    language: 'English',
    popular: false,
    apiCode: 'wbt',
  },
  {
    id: 'bbe',
    name: 'Bible in Basic English',
    abbreviation: 'BBE',
    description: 'Simple English vocabulary translation (public domain)',
    language: 'English',
    popular: false,
    apiCode: 'bbe',
  },

  // --- Additional English versions (many are copyrighted; passage provider support may vary) ---
  {
    id: 'nasb',
    name: 'New American Standard Bible',
    abbreviation: 'NASB',
    description: 'Literal word-for-word translation known for precision',
    language: 'English',
    popular: false,
  },
  {
    id: 'amp',
    name: 'Amplified Bible',
    abbreviation: 'AMP',
    description: 'Includes additional words to clarify and amplify meaning',
    language: 'English',
    popular: false,
  },
  {
    id: 'csb',
    name: 'Christian Standard Bible',
    abbreviation: 'CSB',
    description: 'Balance of accuracy and readability for modern readers',
    language: 'English',
    popular: false,
  },
  {
    id: 'nrsv',
    name: 'New Revised Standard Version',
    abbreviation: 'NRSV',
    description: 'Scholarly translation used widely in academic settings',
    language: 'English',
    popular: false,
  },
  {
    id: 'rsv',
    name: 'Revised Standard Version',
    abbreviation: 'RSV',
    description: 'Classic English translation in the RSV tradition',
    language: 'English',
    popular: false,
  },
  {
    id: 'net',
    name: 'New English Translation',
    abbreviation: 'NET',
    description: 'Modern translation known for extensive study notes',
    language: 'English',
    popular: false,
  },
  {
    id: 'ceb',
    name: 'Common English Bible',
    abbreviation: 'CEB',
    description: 'Modern, readable English translation',
    language: 'English',
    popular: false,
  },
  {
    id: 'cev',
    name: 'Contemporary English Version',
    abbreviation: 'CEV',
    description: 'Easy-to-read English translation',
    language: 'English',
    popular: false,
  },
  {
    id: 'gnt',
    name: 'Good News Translation',
    abbreviation: 'GNT',
    description: 'Simple, clear English translation',
    language: 'English',
    popular: false,
  },
  {
    id: 'gw',
    name: "God's Word Translation",
    abbreviation: 'GW',
    description: 'Clear, modern English translation',
    language: 'English',
    popular: false,
  },
  {
    id: 'isv',
    name: 'International Standard Version',
    abbreviation: 'ISV',
    description: 'Modern English translation with a semi-literal approach',
    language: 'English',
    popular: false,
  },
  {
    id: 'leb',
    name: 'Lexham English Bible',
    abbreviation: 'LEB',
    description: 'Translation designed for readability and accuracy',
    language: 'English',
    popular: false,
  },
  {
    id: 'nheb',
    name: 'New Heart English Bible',
    abbreviation: 'NHEB',
    description: 'Public domain modernization of ASV-style English',
    language: 'English',
    popular: false,
  },
  {
    id: 'kjv2000',
    name: 'King James 2000',
    abbreviation: 'KJ2000',
    description: 'Modernized spelling update of KJV-style English',
    language: 'English',
    popular: false,
  },
  {
    id: 'nivuk',
    name: 'New International Version (UK)',
    abbreviation: 'NIVUK',
    description: 'UK edition of the NIV translation',
    language: 'English',
    popular: false,
  },
  {
    id: 'nabre',
    name: 'New American Bible (Revised Edition)',
    abbreviation: 'NABRE',
    description: 'Catholic Bible translation used in the United States',
    language: 'English',
    popular: false,
  },
  {
    id: 'ncb',
    name: 'New Catholic Bible',
    abbreviation: 'NCB',
    description: 'Catholic translation in modern English',
    language: 'English',
    popular: false,
  },
  {
    id: 'dra',
    name: 'Douay-Rheims Bible',
    abbreviation: 'DRA',
    description: 'Classic Catholic English translation (public domain)',
    language: 'English',
    popular: false,
  },
  {
    id: 'tpt',
    name: 'The Passion Translation',
    abbreviation: 'TPT',
    description: 'Devotional paraphrase-style English translation',
    language: 'English',
    popular: false,
  },
  {
    id: 'nkjv-study',
    name: 'NKJV (Study-friendly)',
    abbreviation: 'NKJV+',
    description: 'NKJV-style reading with study emphasis',
    language: 'English',
    popular: false,
  },
  {
    id: 'kjv-audio',
    name: 'King James Version (Audio-friendly)',
    abbreviation: 'KJV-A',
    description: 'KJV variant optimized for listening/readability',
    language: 'English',
    popular: false,
  },

  // --- Spanish ---
  {
    id: 'rvr1909',
    name: 'Reina-Valera 1909',
    abbreviation: 'RVR09',
    description: 'Classic Spanish Reina-Valera revision',
    language: 'Spanish',
    popular: false,
  },
  {
    id: 'rvr1995',
    name: 'Reina-Valera 1995',
    abbreviation: 'RVR95',
    description: 'Modern Spanish Reina-Valera revision',
    language: 'Spanish',
    popular: false,
  },
  {
    id: 'lbla',
    name: 'La Biblia de las Américas',
    abbreviation: 'LBLA',
    description: 'Spanish translation in the NASB tradition',
    language: 'Spanish',
    popular: false,
  },
  {
    id: 'dhh',
    name: 'Dios Habla Hoy',
    abbreviation: 'DHH',
    description: 'Good News Bible in Spanish',
    language: 'Spanish',
    popular: false,
  },

  // --- French ---
  {
    id: 'sg21',
    name: 'Segond 21',
    abbreviation: 'SG21',
    description: 'Modern French translation in Segond tradition',
    language: 'French',
    popular: false,
  },

  // --- German ---
  {
    id: 'elb',
    name: 'Elberfelder Bibel',
    abbreviation: 'ELB',
    description: 'Accurate German translation in Elberfelder tradition',
    language: 'German',
    popular: false,
  },

  // --- Portuguese ---
  {
    id: 'acf',
    name: 'Almeida Corrigida Fiel',
    abbreviation: 'ACF',
    description: 'Traditional Portuguese translation',
    language: 'Portuguese',
    popular: false,
  },
  {
    id: 'nvi-pt',
    name: 'Nova Versão Internacional (PT)',
    abbreviation: 'NVI-PT',
    description: 'Portuguese NIV-style translation',
    language: 'Portuguese',
    popular: false,
  },

  // --- Italian ---
  {
    id: 'cei',
    name: 'Bibbia CEI',
    abbreviation: 'CEI',
    description: 'Italian Catholic translation',
    language: 'Italian',
    popular: false,
  },

  // --- Simplified Chinese ---
  {
    id: 'cuvs',
    name: 'Chinese Union Version (Simplified)',
    abbreviation: 'CUV-S',
    description: 'Widely used Chinese Bible translation (simplified)',
    language: 'Chinese',
    popular: false,
  },

  // --- Traditional Chinese ---
  {
    id: 'cuvt',
    name: 'Chinese Union Version (Traditional)',
    abbreviation: 'CUV-T',
    description: 'Widely used Chinese Bible translation (traditional)',
    language: 'Chinese',
    popular: false,
  },

  // --- Korean ---
  {
    id: 'krv',
    name: 'Korean Revised Version',
    abbreviation: 'KRV',
    description: 'Traditional Korean Bible translation',
    language: 'Korean',
    popular: false,
  },

  // --- Indonesian ---
  {
    id: 'tb',
    name: 'Terjemahan Baru',
    abbreviation: 'TB',
    description: 'Common Indonesian Bible translation',
    language: 'Indonesian',
    popular: false,
  },

  // --- Swahili ---
  {
    id: 'suv',
    name: 'Swahili Union Version',
    abbreviation: 'SUV',
    description: 'Common Swahili Bible translation',
    language: 'Swahili',
    popular: false,
  },

  // --- Filipino / Tagalog ---
  {
    id: 'asnd',
    name: 'Ang Salita ng Diyos',
    abbreviation: 'ASND',
    description: 'Filipino Bible translation in modern language',
    language: 'Filipino',
    popular: false,
  },

  // --- Russian ---
  {
    id: 'synodal',
    name: 'Russian Synodal Translation',
    abbreviation: 'RST',
    description: 'Classic Russian Bible translation',
    language: 'Russian',
    popular: false,
  },
];

export const getVersionByAbbreviation = (abbreviation: string): BibleVersion | undefined => {
  return bibleVersions.find(v => v.abbreviation.toLowerCase() === abbreviation.toLowerCase());
};

export const getVersionById = (id: string): BibleVersion | undefined => {
  return bibleVersions.find(v => v.id === id);
};

export const getPopularVersions = (): BibleVersion[] => {
  return bibleVersions.filter(v => v.popular);
};

export const DEFAULT_BIBLE_VERSION = 'niv';

export function getPassageProviderCode(versionId: string): { code: string; didFallback: boolean } {
  const v = getVersionById(versionId);
  if (v?.apiCode) return { code: v.apiCode, didFallback: false };

  // Fallback for versions that aren't supported by the free provider used for "View Full Passage".
  return { code: 'kjv', didFallback: true };
}
