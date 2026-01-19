# Correlated Daily Content System

## Overview
Implemented a thematically correlated daily content system where the Devotion serves as the "anchor" and the Prayer and Study content are matched to complement it. All three pieces of content correlate thematically and update every 24 hours.

## Daily Flow
**Devotion (Anchor)** → **Prayer (Correlated)** → **Study Verse (From Devotion)**

### How It Works:
1. **Daily Devotion** is selected (same day-based cycling algorithm)
2. **Theme Keywords** are extracted from the devotion's title and reflection
3. **Prayer Guide** is matched based on the devotion's themes
4. **Study Verse** displays the scripture verse from the devotion

## ✅ Implementation Complete

### Phase 1: Backend Infrastructure ✅
All backend functions and data structures have been implemented.

### Phase 2: UI Integration ✅
All three screens have been updated to display correlated content.

## Changes Made

### 1. **Devotionals** (`constants/devotionals.ts`) ✅

#### Added Theme Extraction Function
```typescript
export function getCorrelatedDevotionalTheme(devotional: Devotional): string[] {
  const keywords: string[] = [];
  const text = `${devotional.title} ${devotional.reflection}`.toLowerCase();
  
  const themeMap: Record<string, string[]> = {
    'peace': ['peace', 'anxiety', 'worry', 'calm', 'rest'],
    'strength': ['strength', 'courage', 'power', 'strong', 'mighty'],
    'love': ['love', 'compassion', 'kindness', 'relationship'],
    'faith': ['faith', 'trust', 'believe', 'hope'],
    'guidance': ['guidance', 'wisdom', 'direction', 'path'],
    'forgiveness': ['forgive', 'mercy', 'grace', 'pardon'],
    'gratitude': ['thank', 'grateful', 'praise', 'blessing'],
    'finances': ['money', 'wealth', 'financial', 'steward', 'provision'],
    'health': ['health', 'body', 'physical', 'wellness'],
    'parenting': ['parent', 'children', 'family'],
    'career': ['work', 'career', 'job', 'profession'],
    'purpose': ['purpose', 'calling', 'mission'],
  };
  
  for (const [theme, searchTerms] of Object.entries(themeMap)) {
    if (searchTerms.some(term => text.includes(term))) {
      keywords.push(theme);
    }
  }
  
  return keywords.length > 0 ? keywords : ['peace'];
}
```

### 2. **Prayers** (`constants/prayers.ts`) ✅

#### Added Correlated Prayer Function
```typescript
export function getCorrelatedPrayer(
  devotionalTheme: string[], 
  viewedIds: string[] = []
): PrayerGuide {
  // Try to match prayer with devotional theme
  for (const theme of devotionalTheme) {
    const matchedPrayer = prayerGuides.find(p => 
      p.id.includes(theme) || 
      p.title.toLowerCase().includes(theme) ||
      p.description.toLowerCase().includes(theme)
    );
    if (matchedPrayer) return matchedPrayer;
  }
  
  // If no match, cycle through all prayers
  return getTodayPrayer(viewedIds);
}
```

### 3. **Bible Studies** (`constants/bible-studies.ts`) ✅

#### Added Study Verse Type and Function
```typescript
export type DailyStudyVerse = {
  reference: string;
  text: string;
};

export function getCorrelatedStudyVerse(
  devotionalScripture: string,
  devotionalVerse: string
): DailyStudyVerse {
  return {
    reference: devotionalScripture,
    text: devotionalVerse,
  };
}
```

### 4. **Content Context** (`contexts/ContentContext.tsx`) ✅

#### Updated ContentHistory Type
```typescript
export type ContentHistory = {
  devotionals: string[];
  prayers: string[];
  studies: string[];
  therapy: string[];
  lastUpdated: string;
  currentDayDevotional?: string;
  currentDayPrayer?: string;
  currentDayStudyVerse?: { reference: string; text: string };
  currentDayTherapy?: string;
};
```

#### Added New Functions
```typescript
const setCurrentDayPrayer = async (prayerId: string) => {
  const updated = {
    ...contentHistory,
    currentDayPrayer: prayerId,
  };
  setContentHistory(updated);
  await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
};

const setCurrentDayStudyVerse = async (verse: DailyStudyVerse) => {
  const updated = {
    ...contentHistory,
    currentDayStudyVerse: verse,
  };
  setContentHistory(updated);
  await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
};

const getCorrelatedDailyContent = () => {
  return {
    devotional: contentHistory.currentDayDevotional,
    prayer: contentHistory.currentDayPrayer,
    studyVerse: contentHistory.currentDayStudyVerse,
  };
};
```

#### Updated loadData Function
- Resets `currentDayPrayer` and `currentDayStudyVerse` when content cycles
- Ensures all three pieces update together every 24 hours

### 5. **Home Screen** (`app/(tabs)/home.tsx`) ✅

The home screen already had the devotion logic in place. It:
- Selects and displays the daily devotion
- Saves it to `currentDayDevotional` via `setCurrentDayDevotional()`
- Serves as the anchor for the correlated prayer and study

### 6. **Prayer Screen** (`app/(tabs)/prayers.tsx`) ✅

Updated to use correlated prayer:
```typescript
// Get correlated daily content
const dailyContent = React.useMemo(() => 
  getCorrelatedDailyContent(), 
  [contentHistory.currentDayDevotional]
);

// Use the correlated prayer or fallback to today's prayer
const todayPrayer = React.useMemo<PrayerGuide>(() => {
  if (contentHistory.currentDayPrayer) {
    const cached = getRecommendedPrayers([], []).find(
      p => p.id === contentHistory.currentDayPrayer
    );
    if (cached) return cached;
  }
  
  // Get correlated prayer based on devotional theme
  if (dailyContent.devotional) {
    const devotion = devotionals.find(d => d.id === dailyContent.devotional);
    if (devotion) {
      const theme = getCorrelatedDevotionalTheme(devotion);
      return getCorrelatedPrayer(theme, contentHistory.prayers);
    }
  }
  
  // Fallback to daily cycle
  return getTodayPrayer(contentHistory.prayers);
}, [contentHistory.currentDayPrayer, contentHistory.prayers, dailyContent.devotional]);

// Save the correlated prayer to context
React.useEffect(() => {
  if (isLoaded && todayPrayer && contentHistory.currentDayPrayer !== todayPrayer.id) {
    setCurrentDayPrayer(todayPrayer.id);
  }
}, [todayPrayer, isLoaded, contentHistory.currentDayPrayer, setCurrentDayPrayer]);
```

### 7. **Study Screen** (`app/(tabs)/study.tsx`) ✅

Updated to display correlated study verse:
```typescript
// Get correlated daily content
const dailyContent = React.useMemo(() => 
  getCorrelatedDailyContent(), 
  [contentHistory.currentDayDevotional]
);

// Use the correlated study verse or create one from today's devotional
const todayStudyVerse = React.useMemo<DailyStudyVerse | null>(() => {
  if (contentHistory.currentDayStudyVerse) {
    return contentHistory.currentDayStudyVerse;
  }
  
  // Get correlated study verse based on devotional
  if (dailyContent.devotional) {
    const devotion = devotionals.find(d => d.id === dailyContent.devotional);
    if (devotion) {
      return getCorrelatedStudyVerse(devotion.scripture, devotion.verse);
    }
  }
  
  return null;
}, [contentHistory.currentDayStudyVerse, dailyContent.devotional]);
```

**UI Changes:**
- Replaced "Today's Study Plan" card with "Today's Study Verse" card
- Shows the devotional's scripture reference and verse text
- Added tag: "Correlated with today's devotion"
- Tapping the verse opens the full passage modal
- Added translation support for the verse

### 8. **Internationalization** (`utils/i18n.ts`) ✅

Added translation for the correlation indicator:
```typescript
"study.correlatedWithDevotion": "Correlated with today's devotion",
"study.correlatedWithDevotion": "Corrélé à la dévotion d'aujourd'hui",  // French
"study.correlatedWithDevotion": "Korreleret med dagens andagt",  // Danish
"study.correlatedWithDevotion": "Correlacionado con la devoción de hoy",  // Spanish
"study.correlatedWithDevotion": "Korreliert mit der heutigen Andacht",  // German
```

## Benefits

### 1. **Thematic Unity**
- All three content pieces work together
- Creates a cohesive daily spiritual experience
- Reinforces the same biblical truth throughout the day

### 2. **Deeper Engagement**
- Users encounter the same theme in different formats:
  - **Devotion**: Read and reflect on the teaching
  - **Prayer**: Pray about the theme
  - **Study**: Meditate on the biblical foundation (same verse as devotion)
- Multi-modal learning strengthens retention

### 3. **Simplified User Experience**
- Clear daily direction with correlated content
- Study verse directly from the devotion
- Focused spiritual practice

### 4. **Content Synergy**
- Leverages existing devotional structure
- Each devotion already has a theme, scripture reference, and verse text
- Prayers cover all major themes
- Perfect alignment without creating new content

## Example Daily Flow

### Example: Peace Theme
**Morning - Devotion (Home Page)**
- Title: "Finding Peace in the Storm"
- Scripture: Philippians 4:6-7
- Verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God..."
- Theme extracted: peace, anxiety

**Midday - Prayer (Prayer Page)**
- Title: "Peace & Anxiety"
- Correlated prayers for peace and calm
- Supporting scriptures: 1 Peter 5:7, John 14:27

**Evening - Study (Study Page)**
- Today's Study Verse: Philippians 4:6-7 (same as devotion)
- Tag: "Correlated with today's devotion"
- Full passage available to read
- User can meditate on the same verse again

## 24-Hour Update Cycle

The content refreshes based on the existing system:
- Content resets after 12 hours of inactivity
- When reset, all three pieces update together:
  - `currentDayDevotional` → cleared
  - `currentDayPrayer` → cleared
  - `currentDayStudyVerse` → cleared
- Next time user opens the app:
  - New devotion is selected
  - Prayer is correlated based on devotion theme
  - Study verse is extracted from devotion
  - All three are saved together

## Technical Notes

### Theme Matching Priority (Prayer)
1. **Direct ID match** (e.g., prayer ID contains "peace")
2. **Title match** (prayer title contains theme keyword)
3. **Description match** (prayer description contains theme keyword)
4. **Fallback** (cycles through all prayers using `getTodayPrayer()`)

### Storage
All correlated content is stored in AsyncStorage:
```json
{
  "currentDayDevotional": "1",
  "currentDayPrayer": "anxiety",
  "currentDayStudyVerse": {
    "reference": "Philippians 4:6-7",
    "text": "Do not be anxious about anything..."
  }
}
```

### Performance
- Theme extraction happens once per day
- Results are cached in AsyncStorage
- No performance impact on daily usage
- Only recalculates when devotion changes

## Summary

✅ **Phase 1 Complete**: All backend functions and data structures implemented
✅ **Phase 2 Complete**: All three screens updated to display correlated content

This correlated content system creates a unified daily spiritual experience where:
- ✅ **Devotion sets the theme** for the day
- ✅ **Prayer reinforces the theme** through guided prayer
- ✅ **Study displays the devotion's verse** for deeper meditation
- ✅ **All three update together** every 24 hours
- ✅ **Content flows naturally** from one to the next
- ✅ **Users experience deeper** thematic engagement

The system leverages existing content structure and creates powerful synergy between the three main features without requiring new content creation.
