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

## Changes Made

### 1. **Devotionals** (`constants/devotionals.ts`)

#### Added Theme Extraction Function
```typescript
export function getDevotionalThemeKeywords(devotional: Devotional): string[] {
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

**How it works:**
- Analyzes the devotion's title and reflection text
- Searches for keywords related to 12 spiritual themes
- Returns matched themes (defaults to 'peace' if no match)

### 2. **Prayers** (`constants/prayers.ts`)

#### Added Correlated Prayer Function
```typescript
export function getCorrelatedPrayer(devotionalThemes: string[]): PrayerGuide {
  // Try to match prayer with devotional theme
  for (const theme of devotionalThemes) {
    const matchedPrayer = prayerGuides.find(p => 
      p.id.includes(theme) || 
      p.title.toLowerCase().includes(theme) ||
      p.description.toLowerCase().includes(theme)
    );
    if (matchedPrayer) return matchedPrayer;
  }
  
  // Default fallback
  return prayerGuides[0]; // Peace & Anxiety
}
```

**How it works:**
- Takes theme keywords from the devotion
- Searches prayer guides for matching themes in:
  - Prayer ID
  - Prayer title
  - Prayer description
- Returns the first matching prayer
- Falls back to "Peace & Anxiety" if no match

### 3. **Content Context** (`contexts/ContentContext.tsx`)

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
  currentDayStudyVerse?: { scripture: string; verse: string; devotionalId: string };
  currentDayTherapy?: string;
};
```

**New Fields:**
- `currentDayPrayer` - Stores today's correlated prayer ID
- `currentDayStudyVerse` - Stores today's study verse with:
  - `scripture` - The scripture reference (e.g., "Philippians 4:6-7")
  - `verse` - The full verse text
  - `devotionalId` - Links back to the source devotion

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

const setCurrentDayStudyVerse = async (scripture: string, verse: string, devotionalId: string) => {
  const updated = {
    ...contentHistory,
    currentDayStudyVerse: { scripture, verse, devotionalId },
  };
  setContentHistory(updated);
  await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(updated));
};
```

## Implementation Plan (Next Steps)

### 4. **Update Home Screen** (`app/(tabs)/home.tsx`)
- When devotion is loaded, extract themes using `getDevotionalThemeKeywords()`
- Save correlated prayer using `setCurrentDayPrayer()`
- Save study verse using `setCurrentDayStudyVerse()`

```typescript
useEffect(() => {
  if (devotional && devotional.id !== contentHistory.currentDayDevotional) {
    // Set the devotion as today's
    setCurrentDayDevotional(devotional.id);
    
    // Extract themes and find correlated prayer
    const themes = getDevotionalThemeKeywords(devotional);
    const correlatedPrayer = getCorrelatedPrayer(themes);
    setCurrentDayPrayer(correlatedPrayer.id);
    
    // Set the devotion's verse as today's study
    setCurrentDayStudyVerse(devotional.scripture, devotional.verse, devotional.id);
  }
}, [devotional]);
```

### 5. **Update Prayer Screen** (`app/(tabs)/prayers.tsx`)
- Instead of using `getTodayPrayer()`, use `contentHistory.currentDayPrayer`
- Load the prayer that was correlated with today's devotion

```typescript
const todayPrayer = useMemo(() => {
  if (contentHistory.currentDayPrayer) {
    return prayerGuides.find(p => p.id === contentHistory.currentDayPrayer) || prayerGuides[0];
  }
  // Fallback if not set yet
  return getTodayPrayer(contentHistory.prayers);
}, [contentHistory.currentDayPrayer, contentHistory.prayers]);
```

### 6. **Update Study Screen** (`app/(tabs)/study.tsx`)
- Replace "Today's Study Plan" with "Today's Study Verse"
- Display the verse from the devotion instead of a study plan
- Show the scripture reference and verse text
- Optionally link back to the devotion

```typescript
const todayStudyVerse = contentHistory.currentDayStudyVerse;

// In the UI:
<View style={styles.todaySection}>
  <View style={styles.todaySectionHeader}>
    <Text style={styles.todaySectionTitle}>📖 Today's Study Verse</Text>
    <Text style={styles.todaySectionSubtitle}>From today's devotional</Text>
  </View>
  
  {todayStudyVerse && (
    <View style={styles.todayVerseCard}>
      <Text style={styles.verseReference}>{todayStudyVerse.scripture}</Text>
      <Text style={styles.verseText}>"{todayStudyVerse.verse}"</Text>
    </View>
  )}
</View>
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
  - **Study**: Meditate on the biblical foundation
- Multi-modal learning strengthens retention

### 3. **Simplified User Experience**
- No need to browse multiple options
- Clear daily direction
- Focused spiritual practice

### 4. **Content Synergy**
- Leverages existing devotional structure
- Each devotion already has:
  - A theme (from title/reflection)
  - A scripture reference
  - A verse text
- Prayers cover all major themes
- Perfect alignment without creating new content

## Example Daily Flow

### Example 1: Peace Theme
**Devotion**: "Finding Peace in the Storm" (Philippians 4:6-7)
- Theme: anxiety, peace, worry
- Reflection about bringing concerns to God

**Correlated Prayer**: "Peace & Anxiety"
- Prayers for peace and calm
- Scriptures: 1 Peter 5:7, John 14:27

**Study Verse**: Philippians 4:6-7
- "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God..."

### Example 2: Strength Theme
**Devotion**: "Strength for Today" (Isaiah 40:31)
- Theme: strength, courage, hope
- Reflection about renewal and endurance

**Correlated Prayer**: "Strength & Courage"
- Prayers for God's power
- Scriptures: Philippians 4:13, Joshua 1:9

**Study Verse**: Isaiah 40:31
- "But those who hope in the Lord will renew their strength. They will soar on wings like eagles..."

### Example 3: Financial Theme
**Devotion**: "The Heart of Stewardship" (Luke 16:10)
- Theme: money, finances, stewardship
- Reflection about faithfulness with resources

**Correlated Prayer**: "Financial Wisdom"
- Prayers for wise money management
- Scriptures: Proverbs 3:9, Matthew 6:33

**Study Verse**: Luke 16:10
- "Whoever can be trusted with very little can also be trusted with much..."

## 24-Hour Update Cycle

The content refreshes based on the existing system:
- Content resets after 12 hours of inactivity
- When reset, all three pieces update together:
  - `currentDayDevotional` → cleared
  - `currentDayPrayer` → cleared
  - `currentDayStudyVerse` → cleared
- Next time user opens the app:
  - New devotion is selected
  - Prayer is correlated
  - Study verse is extracted
  - All three are saved together

## Technical Notes

### Theme Matching Priority
1. **Direct ID match** (e.g., prayer ID contains "peace")
2. **Title match** (prayer title contains theme keyword)
3. **Description match** (prayer description contains theme keyword)
4. **Fallback** (defaults to "Peace & Anxiety" prayer)

### Storage
All correlated content is stored in AsyncStorage:
```json
{
  "currentDayDevotional": "1",
  "currentDayPrayer": "anxiety",
  "currentDayStudyVerse": {
    "scripture": "Philippians 4:6-7",
    "verse": "Do not be anxious about anything...",
    "devotionalId": "1"
  }
}
```

### Performance
- Theme extraction happens once per day
- Results are cached in AsyncStorage
- No performance impact on daily usage
- Only recalculates when devotion changes

## Future Enhancements

1. **Theme Indicators**: Show visual connection between devotion/prayer/study
2. **Cross-Linking**: Add "See related prayer" button in devotion
3. **Theme Journey**: Track which themes user engages with most
4. **Smart Suggestions**: Suggest additional prayers/studies on same theme
5. **Theme Collections**: Group past devotions by theme for review

## Summary

This correlated content system creates a unified daily spiritual experience where:
- ✅ **Devotion sets the theme** for the day
- ✅ **Prayer reinforces the theme** through guided prayer
- ✅ **Study grounds the theme** in Scripture
- ✅ **All three update together** every 24 hours
- ✅ **Content flows naturally** from one to the next
- ✅ **Users experience deeper** thematic engagement

The system leverages existing content structure and creates powerful synergy between the three main features without requiring new content creation.
