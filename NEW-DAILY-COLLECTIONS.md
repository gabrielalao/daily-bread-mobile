# New Daily Content Collections

## Overview
Created **separate daily content collections** for Prayer and Study that correlate thematically with the Daily Devotion. Now all three features (Devotion, Prayer, Study) have their own daily cycling content that flows together based on shared themes.

## What Changed

### Before
- **Devotion**: Had 20 daily cycling items ✅
- **Prayer**: Showed prayer *guides* (like "Peace & Anxiety" with 5+ prayers)
- **Study**: Showed the devotion's verse again

### After  
- **Devotion**: Still has 20 daily cycling items ✅
- **Prayer**: Now has **20 individual daily prayers** that cycle and correlate ✅
- **Study**: Now has **20 individual daily studies** (verse + insight) that cycle and correlate ✅

## New Content Files

### 1. `constants/daily-prayers.ts`

**Type Definition:**
```typescript
export type DailyPrayer = {
  id: string;
  title: string;
  prayer: string;          // Full prayer text
  scripture: string;       // Supporting Bible verse
  themes: string[];        // peace, strength, love, faith, etc.
};
```

**Content:**
- 20 individual prayers
- Each themed (peace, strength, love, faith, guidance, forgiveness, gratitude, finances, health, parenting, career, purpose)
- Each includes title, full prayer text, and supporting scripture
- Examples:
  - "Prayer for Peace in Anxiety"
  - "Prayer for Strength and Renewal"
  - "Prayer for Financial Wisdom"
  - "Prayer for Parenting Wisdom"

**Functions:**
- `getTodayDailyPrayer()` - Cycles through all prayers daily
- `getCorrelatedDailyPrayer(themes)` - Finds prayer matching devotion themes

### 2. `constants/daily-studies.ts`

**Type Definition:**
```typescript
export type DailyStudy = {
  id: string;
  title: string;
  scripture: string;       // Bible reference
  verse: string;           // Full verse text
  insight: string;         // Biblical/theological insight
  reflection: string;      // Personal application question
  themes: string[];        // peace, strength, love, faith, etc.
};
```

**Content:**
- 20 individual study items
- Each themed to match devotion categories
- Each includes:
  - Title (e.g., "The Promise of God's Peace")
  - Scripture reference and verse
  - Spiritual insight explaining the verse
  - Reflection question for personal application
- Examples:
  - "The Promise of God's Peace" (John 14:27)
  - "Strength from the Lord" (Psalm 46:1)
  - "Faithful in Little Things" (Luke 16:10)
  - "Wisdom for Parents" (Deuteronomy 6:6-7)

**Functions:**
- `getTodayDailyStudy()` - Cycles through all studies daily
- `getCorrelatedDailyStudy(themes)` - Finds study matching devotion themes

## How Correlation Works

### Daily Flow Example

**1. Morning - Devotion (Home Page)**
```
Title: "Finding Peace in the Storm"
Scripture: Philippians 4:6-7
Theme: peace, anxiety, worry
```

**2. Midday - Prayer (Prayer Page)**
```
Title: "Prayer for Peace in Anxiety"
Prayer: "Heavenly Father, I come to You with a heavy heart..."
Scripture: 1 Peter 5:7
Themes: [peace, anxiety, trust]
```

**3. Evening - Study (Study Page)**
```
Title: "The Promise of God's Peace"
Scripture: John 14:27
Verse: "Peace I leave with you; my peace I give you..."
Insight: "Jesus offers a peace that's fundamentally different from what the world offers..."
Reflection: "What situations are disturbing your peace today?"
Themes: [peace, trust, faith]
```

### Theme Matching Logic

1. **Devotion is selected** (day-based cycling)
2. **Theme extracted** from devotion using `getCorrelatedDevotionalTheme()`
3. **Prayer matched** by finding a daily prayer with matching themes
4. **Study matched** by finding a daily study with matching themes

### Matching Priority

For both Prayer and Study:
1. **First**: Find unviewed item with matching theme
2. **Second**: Find any item with matching theme (even if viewed)
3. **Fallback**: Use today's cycling item (day of year % 20)

## Benefits

### 1. **Richer Content**
- Users get **full individual prayers** instead of prayer guides
- Users get **deeper study insights** with theological explanation and reflection questions
- More engaging and actionable content

### 2. **Thematic Unity**
- All three pieces reinforce the same spiritual truth
- Different expressions of the same theme throughout the day
- Creates a cohesive daily spiritual journey

### 3. **Content Variety**
- 20 devotions × 20 prayers × 20 studies = diverse combinations
- Theme-based matching ensures relevance
- Users won't see the exact same combination twice in a row

### 4. **Daily Cycling**
- Fresh content every day
- All three pieces update together every 24 hours
- Built-in content recycling after 20 days

### 5. **Scalable**
- Easy to add more prayers/studies in the future
- Just add to the arrays with appropriate theme tags
- Matching algorithm automatically includes new content

## User Experience

### Prayer Page

**Before:**
- Showed "Today's Prayer" as a prayer *guide*
- Card showed title, description, and category badge
- Tapping opened full guide with 5+ prayers

**After:**
- Shows "Today's Prayer" as a single *daily prayer*
- Card shows title and prayer excerpt
- Full prayer text visible immediately
- Supporting scripture included
- Correlated with today's devotion theme

### Study Page

**Before:**
- Showed devotion's verse again
- Just reference and text
- Tag: "Correlated with today's devotion"

**After:**
- Shows "Today's Study" as a complete study item
- Includes verse, insight, and reflection question
- More depth than just the verse
- Still correlated with devotion theme
- Tappable to read full passage if desired

## Implementation Status

✅ **Phase 1: Content Creation**
- Created `daily-prayers.ts` with 20 prayers
- Created `daily-studies.ts` with 20 studies
- Added theme tags to all items
- Implemented correlation functions

⏳ **Phase 2: UI Integration** (Next)
- Update Prayer page to display daily prayer
- Update Study page to display daily study
- Update ContentContext to track new daily items
- Add translation support
- Test theme correlation

⏳ **Phase 3: Documentation** (Next)
- Update CORRELATED-DAILY-CONTENT.md
- Add usage examples
- Document API

## Theme Categories

All content uses these 12 theme tags:
1. `peace` - Peace, anxiety, worry, calm
2. `strength` - Strength, courage, power
3. `love` - Love, compassion, kindness
4. `faith` - Faith, trust, belief
5. `guidance` - Guidance, wisdom, direction
6. `forgiveness` - Forgiveness, mercy, grace
7. `gratitude` - Gratitude, thanksgiving, praise
8. `finances` - Money, stewardship, provision
9. `health` - Health, healing, wellness
10. `parenting` - Parenting, family, children
11. `career` - Work, career, profession
12. `purpose` - Purpose, calling, mission

## Next Steps

1. Update `ContentContext` to use new daily collections
2. Modify Prayer page to display `DailyPrayer` instead of `PrayerGuide`
3. Modify Study page to display `DailyStudy` with insight and reflection
4. Add translation support for new content fields
5. Update UI styling for new content format
6. Test correlation across all three features
7. Update documentation with final implementation

## Summary

We've created **20 daily prayers** and **20 daily studies** that cycle daily and correlate thematically with the devotions. This gives users:

- **Devotion**: Read and reflect on biblical teaching
- **Prayer**: Pray a focused prayer about the same theme  
- **Study**: Study a related verse with deeper insight

All three pieces work together to create a unified, comprehensive daily spiritual experience that goes deeper than before. 🎉
