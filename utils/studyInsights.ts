export type StudyReading = {
  day: number;
  reference: string;
  focus: string;
  spiritualInsight?: string;
  keyThemes?: string[];
  practicalApplication?: string;
};

export type GeneratedInsight = {
  spiritualInsight: string;
  keyThemes: string[];
  practicalApplication: string;
  meta: {
    book: string;
    group: BookGroup;
    week: number;
    cycle: number;
  };
};

type BookGroup =
  | 'Torah'
  | 'History'
  | 'Wisdom'
  | 'MajorProphet'
  | 'MinorProphet'
  | 'Gospel'
  | 'Acts'
  | 'Pauline'
  | 'General'
  | 'Apocalypse'
  | 'Unknown';

const BOOK_GROUP_BY_BOOK: Record<string, BookGroup> = {
  Genesis: 'Torah',
  Exodus: 'Torah',
  Leviticus: 'Torah',
  Numbers: 'Torah',
  Deuteronomy: 'Torah',

  Joshua: 'History',
  Judges: 'History',
  Ruth: 'History',
  '1 Samuel': 'History',
  '2 Samuel': 'History',
  '1 Kings': 'History',
  '2 Kings': 'History',
  '1 Chronicles': 'History',
  '2 Chronicles': 'History',
  Ezra: 'History',
  Nehemiah: 'History',
  Esther: 'History',

  Job: 'Wisdom',
  Psalms: 'Wisdom',
  Proverbs: 'Wisdom',
  Ecclesiastes: 'Wisdom',
  'Song of Solomon': 'Wisdom',

  Isaiah: 'MajorProphet',
  Jeremiah: 'MajorProphet',
  Lamentations: 'MajorProphet',
  Ezekiel: 'MajorProphet',
  Daniel: 'MajorProphet',

  Hosea: 'MinorProphet',
  Joel: 'MinorProphet',
  Amos: 'MinorProphet',
  Obadiah: 'MinorProphet',
  Jonah: 'MinorProphet',
  Micah: 'MinorProphet',
  Nahum: 'MinorProphet',
  Habakkuk: 'MinorProphet',
  Zephaniah: 'MinorProphet',
  Haggai: 'MinorProphet',
  Zechariah: 'MinorProphet',
  Malachi: 'MinorProphet',

  Matthew: 'Gospel',
  Mark: 'Gospel',
  Luke: 'Gospel',
  John: 'Gospel',
  Acts: 'Acts',

  Romans: 'Pauline',
  '1 Corinthians': 'Pauline',
  '2 Corinthians': 'Pauline',
  Galatians: 'Pauline',
  Ephesians: 'Pauline',
  Philippians: 'Pauline',
  Colossians: 'Pauline',
  '1 Thessalonians': 'Pauline',
  '2 Thessalonians': 'Pauline',
  '1 Timothy': 'Pauline',
  '2 Timothy': 'Pauline',
  Titus: 'Pauline',
  Philemon: 'Pauline',

  Hebrews: 'General',
  James: 'General',
  '1 Peter': 'General',
  '2 Peter': 'General',
  '1 John': 'General',
  '2 John': 'General',
  '3 John': 'General',
  Jude: 'General',

  Revelation: 'Apocalypse',
};

const BOOK_TAGLINES: Partial<Record<string, string>> = {
  Genesis: 'Beginnings: creation, fall, and God’s covenant family.',
  Exodus: 'Rescue and covenant: God delivers and dwells with His people.',
  Leviticus: 'Holiness and worship: God makes a way for sinners to draw near.',
  Numbers: 'Wilderness lessons: faith, rebellion, and God’s steady faithfulness.',
  Deuteronomy: 'Covenant renewal: love the Lord, obey His word, choose life.',
  Joshua: 'Promise fulfilled: God gives the land and calls for faithful obedience.',
  Judges: 'Cycles of compromise: God rescues again and again in mercy.',
  Ruth: 'Redeeming love: God works through ordinary faithfulness.',
  '1 Samuel': 'From judges to kings: God looks at the heart.',
  '2 Samuel': 'David’s kingdom: covenant promise and the need for a greater King.',
  '1 Kings': 'Wisdom and warning: the kingdom rises and begins to fracture.',
  '2 Kings': 'Decline and exile: prophets speak as the nation falls.',
  Psalms: 'Prayer and worship: honest faith in every season.',
  Proverbs: 'Wisdom for life: fear of the Lord shapes every choice.',
  Isaiah: 'Holy God, hopeful promise: judgment and salvation in the coming Servant.',
  Jeremiah: 'Tears and truth: judgment, new covenant hope, and steadfast love.',
  Ezekiel: 'Glory and renewal: God gives a new heart and restores His people.',
  Matthew: 'Jesus the King: the promised Messiah fulfills the Scriptures.',
  Acts: 'The Spirit’s mission: the gospel advances to the nations.',
  Romans: 'The gospel explained: righteousness by faith and a transformed life.',
  Revelation: 'Jesus wins: faithful hope through trials to new creation.',
};

type Phase = {
  title: string;
  fromWeek: number;
  toWeek: number;
  focusByCycle: [string, string, string];
};

const PHASES: Phase[] = [
  {
    title: 'Beginnings & Foundations',
    fromWeek: 1,
    toWeek: 4,
    focusByCycle: [
      'Focus on the big story: creation → fall → promise.',
      'Look for Christ foreshadowed (seed, ark, sacrifice, covenant).',
      'Ask: how does this shape my identity and worship today?',
    ],
  },
  {
    title: 'Covenant, Law, and Worship',
    fromWeek: 5,
    toWeek: 8,
    focusByCycle: [
      'Notice God’s holiness and His gracious ways of approach.',
      'See how Jesus fulfills sacrifice, priesthood, and atonement.',
      'Practice obedience from love—not earning, but response.',
    ],
  },
  {
    title: 'Conquest, Judges, and the Need for a King',
    fromWeek: 9,
    toWeek: 12,
    focusByCycle: [
      'Track faithfulness vs. compromise and its outcomes.',
      'Watch how leaders point to (and fall short of) the true King.',
      'Apply: repent quickly; build habits that keep you close to God.',
    ],
  },
  {
    title: 'Kingdom, Wisdom, and Prophetic Warning',
    fromWeek: 13,
    toWeek: 20,
    focusByCycle: [
      'Follow the kingdom storyline and learn wisdom for daily life.',
      'Read wisdom and prophets with a Christ-centered lens.',
      'Apply: let Scripture reshape priorities, money, relationships, speech.',
    ],
  },
  {
    title: 'Exile, Hope, and Restoration',
    fromWeek: 21,
    toWeek: 30,
    focusByCycle: [
      'Notice God’s justice and His commitment to restore.',
      'Look for promises that converge in Jesus and the Spirit.',
      'Apply: cultivate faithfulness in hard seasons; keep hope anchored.',
    ],
  },
  {
    title: 'Jesus and the Kingdom',
    fromWeek: 31,
    toWeek: 42,
    focusByCycle: [
      'Watch Jesus’ words and works; learn His way of the kingdom.',
      'Compare Gospels: fulfillment, identity, and mission of Christ.',
      'Apply: follow Jesus in everyday obedience and love.',
    ],
  },
  {
    title: 'Early Church and the Gospel to the Nations',
    fromWeek: 43,
    toWeek: 47,
    focusByCycle: [
      'See the Spirit empower witness and community.',
      'Notice how the gospel reshapes identity, unity, and ethics.',
      'Apply: live as a witness—small faithful steps, real love.',
    ],
  },
  {
    title: 'Letters and Living the Gospel',
    fromWeek: 48,
    toWeek: 51,
    focusByCycle: [
      'Learn doctrine that fuels devotion and transformation.',
      'Trace how Christ’s finished work changes everything.',
      'Apply: practice grace-driven holiness in real life.',
    ],
  },
  {
    title: 'Faithful Endurance and Final Hope',
    fromWeek: 52,
    toWeek: 60,
    focusByCycle: [
      'Hold fast: God finishes what He starts.',
      'Read with eyes on Jesus’ victory and final restoration.',
      'Apply: persevere; worship; live with eternity in view.',
    ],
  },
];

function pickVariant<T>(cycle: number, variants: [T, T, T]): T {
  const idx = ((cycle - 1) % 3 + 3) % 3;
  return variants[idx];
}

export function getBookFromReference(reference: string): string {
  // Example refs:
  // "1 Corinthians 6:19-20"
  // "Genesis 1-3"
  // "Song of Solomon 1-8"
  // "Obadiah 1"
  const trimmed = reference.trim();
  const parts = trimmed.split(' ');
  if (parts.length === 0) return 'Unknown';

  // Handle numeric prefix books: "1 Samuel", "2 Kings", "1 Corinthians"
  if (/^[1-3]$/.test(parts[0]) && parts.length >= 2) {
    const maybeTwoWord = `${parts[0]} ${parts[1]}`;
    // Some have 3 words like "1 Song"? not relevant; "Song of Solomon" handled below
    return maybeTwoWord;
  }

  // Handle "Song of Solomon"
  if (parts[0] === 'Song' && parts[1] === 'of' && parts[2] === 'Solomon') {
    return 'Song of Solomon';
  }

  return parts[0];
}

export function getStudyInsight(reading: StudyReading, cycle: number): GeneratedInsight {
  const safeCycle = Number.isFinite(cycle) && cycle > 0 ? Math.floor(cycle) : 1;
  const week = Math.ceil(reading.day / 7);
  const book = getBookFromReference(reading.reference);
  const group = BOOK_GROUP_BY_BOOK[book] ?? 'Unknown';

  const phase = PHASES.find((p) => week >= p.fromWeek && week <= p.toWeek);
  const phaseLine = phase ? `This week (${phase.title}): ${pickVariant(safeCycle, phase.focusByCycle)}` : '';

  const tagline = BOOK_TAGLINES[book] ?? `${book}: read with a humble, worshipful heart and watch for God’s character, promises, and call to faith.`;

  const groupThemes: Record<BookGroup, string[]> = {
    Torah: ['God’s holiness and covenant', 'Sin and atonement', 'Faithful presence with His people'],
    History: ['God’s faithfulness in history', 'Leadership and the heart', 'Consequences of obedience vs. compromise'],
    Wisdom: ['Fear of the Lord', 'Prayerful honesty', 'Wisdom for daily life'],
    MajorProphet: ['Judgment and mercy', 'Hope of restoration', 'Promises fulfilled in Christ'],
    MinorProphet: ['Return to the Lord', 'Justice and mercy', 'God’s steadfast love'],
    Gospel: ['Jesus’ identity', 'Kingdom of God', 'Discipleship and faith'],
    Acts: ['The Holy Spirit’s power', 'Mission to the nations', 'Community and witness'],
    Pauline: ['Grace and justification', 'Life in the Spirit', 'The church and holy living'],
    General: ['Persevering faith', 'Love in action', 'Truth, holiness, and hope'],
    Apocalypse: ['Jesus’ victory', 'Faithful endurance', 'New creation hope'],
    Unknown: ['Trust God’s word', 'Worship and obedience', 'Hope in God’s promises'],
  };

  const cycleAngleByGroup: Record<BookGroup, [string, string, string]> = {
    Torah: [
      'Notice how God reveals His holiness and draws near by covenant grace.',
      'Look for shadows that Jesus fulfills: sacrifice, priest, and atonement.',
      'Apply holiness: worship God sincerely and obey from love.',
    ],
    History: [
      'Track the storyline and notice God’s faithful hand in real events.',
      'Look for the true King hinted in every flawed leader.',
      'Apply: learn from successes and failures; choose faithful obedience.',
    ],
    Wisdom: [
      'Pray the truth and learn wisdom for everyday decisions.',
      'See how Jesus embodies wisdom and fulfills longing for righteousness.',
      'Apply: practice humility, gratitude, and disciplined speech.',
    ],
    MajorProphet: [
      'Hear God’s warnings and His invitations to return.',
      'Trace promises that converge in Christ and the Spirit.',
      'Apply: repent, hope, and live as a faithful witness.',
    ],
    MinorProphet: [
      'Listen for God’s call: return, seek justice, love mercy.',
      'See how judgment and mercy meet in Christ.',
      'Apply: let worship shape ethics—integrity, generosity, compassion.',
    ],
    Gospel: [
      'Watch Jesus: what He does, what He says, who He claims to be.',
      'Focus on the cross/resurrection and fulfillment of Scripture.',
      'Apply: follow Jesus today—faith, obedience, forgiveness, love.',
    ],
    Acts: [
      'Notice how the Spirit forms a witnessing community.',
      'See Jesus’ mission continue through His people.',
      'Apply: ask for Spirit-empowered courage and practical love.',
    ],
    Pauline: [
      'Let the gospel shape identity: justified by faith, adopted by grace.',
      'Trace union with Christ and life in the Spirit.',
      'Apply: put off the old self, put on love, build the church.',
    ],
    General: [
      'Keep faith practical: integrity, endurance, and love.',
      'See Christ as the anchor of hope and the model of holiness.',
      'Apply: persevere; forgive quickly; live truthfully.',
    ],
    Apocalypse: [
      'Read with worship: Jesus reigns, evil falls, hope stands.',
      'See the Lamb’s victory and the faithfulness He calls for.',
      'Apply: endure in faith; resist compromise; worship God alone.',
    ],
    Unknown: [
      'Read with reverence and openness to correction.',
      'Look for Christ and gospel patterns throughout.',
      'Apply one clear step of obedience today.',
    ],
  };

  const spiritualInsight =
    `${tagline}\n\n` +
    `Today’s focus: ${reading.focus} (${reading.reference}). ` +
    pickVariant(safeCycle, cycleAngleByGroup[group]) +
    (phaseLine ? `\n\n${phaseLine}` : '');

  const keyThemes = [
    ...new Set([
      `${book} overview`,
      ...(groupThemes[group] ?? groupThemes.Unknown),
      `Day focus: ${reading.focus}`,
    ]),
  ];

  const applicationByCycle: [string, string, string] = [
    `Pray: “Lord, teach me from ${book}. Help me obey one clear thing today.” Then write 1 sentence: “Because of this reading, I will ______.”`,
    `Ask: “How does this passage point to Jesus?” Write 1 line of worship and 1 line of trust.`,
    `Practice: choose one habit (prayer, generosity, forgiveness, truthfulness) and do it today as an act of worship.`,
  ];

  return {
    spiritualInsight,
    keyThemes,
    practicalApplication: pickVariant(safeCycle, applicationByCycle),
    meta: { book, group, week, cycle: safeCycle },
  };
}

export function mergeInsightOverrides(
  reading: StudyReading,
  generated: GeneratedInsight
): GeneratedInsight {
  return {
    ...generated,
    spiritualInsight: reading.spiritualInsight ?? generated.spiritualInsight,
    keyThemes: reading.keyThemes ?? generated.keyThemes,
    practicalApplication: reading.practicalApplication ?? generated.practicalApplication,
  };
}

