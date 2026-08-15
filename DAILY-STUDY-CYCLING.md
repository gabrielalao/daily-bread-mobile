# Daily Bible Study Cycling Feature

## Overview
Implemented daily cycling for Bible study plans to match the devotional and prayer systems. Users now receive a coordinated "Today's Devotion", "Today's Prayer", and "Today's Study" each day, creating a comprehensive daily spiritual practice routine.

## Changes Made

### 1. **Study Cycling Functions** (`constants/bible-studies.ts`)

Added two new functions similar to devotionals and prayers:

#### `getTodayStudy(viewedIds)`
```typescript
export function getTodayStudy(viewedIds: string[] = []): BibleStudyPlan {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  const unviewed = bibleStudyPlans.filter(s => !viewedIds.includes(s.id));
  
  if (unviewed.length > 0) {
    return unviewed[dayOfYear % unviewed.length];
  }
  
  return bibleStudyPlans[dayOfYear % bibleStudyPlans.length];
}
```

**How it works:**
- Calculates the day of the year (1-365/366)
- Filters out already-viewed study plans
- Uses modulo to cycle through plans: `dayOfYear % bibleStudyPlans.length`
- With 19 study plans, cycles approximately every 19 days
- Prioritizes unviewed content first

#### `getPersonalizedStudy(viewedIds, preferences)`
```typescript
export function getPersonalizedStudy(viewedIds: string[], preferences: string[] = []): BibleStudyPlan {
  const unviewed = bibleStudyPlans.filter(s => !viewedIds.includes(s.id));
  
  if (unviewed.length === 0) {
    return bibleStudyPlans[Math.floor(Math.random() * bibleStudyPlans.length)];
  }
  
  if (preferences.length > 0) {
    const preferredStudies = unviewed.filter(s => 
      preferences.some(pref => 
        s.title.toLowerCase().includes(pref.toLowerCase()) ||
        s.description.toLowerCase().includes(pref.toLowerCase()) ||
        s.category.toLowerCase().includes(pref.toLowerCase())
      )
    );
    
    if (preferredStudies.length > 0) {
      return preferredStudies[Math.floor(Math.random() * preferredStudies.length)];
    }
  }
  
  return unviewed[Math.floor(Math.random() * unviewed.length)];
}
```

**How it works:**
- Filters unviewed study plans
- Matches user preferences (study categories, topics)
- Returns random plan from matching plans
- Falls back to random unviewed plan if no matches
- Recycles all plans randomly once all are viewed

### 2. **Updated Study Screen UI** (`app/(tabs)/study.tsx`)

#### Added "Today's Study" Section
- Prominent featured card at the top of the study page
- Shows the daily study plan selected by `getTodayStudy()`
- Matches the visual design of "Today's Devotional" and "Today's Prayer"
- Includes:
  - 📚 Icon indicator
  - "Today's Study" heading
  - "Your daily Bible study plan" subtitle
  - Large featured card with icon, title, category badge, description, and duration
  - Primary color border for emphasis

#### Updated Layout Structure
```
📚 Study Screen
├── Header
│   ├── "Bible Study" title
│   └── Subtitle
├── 📚 Today's Study (Featured)
│   └── Large card with today's study plan
├── All Study Plans
│   └── Grid of all 19 study plans
```

#### New Styles Added
- `todaySection` - Container for today's study
- `todaySectionHeader` - Header with title and subtitle
- `todayStudyCard` - Large featured card with primary border
- `todayIconContainer` - 64x64 icon circle
- `todayTextContainer` - Text content wrapper
- `todayTitleRow` - Title and badge row
- `todayTitle` - Bold study title
- `todayBadge` - Category badge
- `todayDescription` - Study description
- `todayFooter` - Duration display
- `allStudiesHeader` - "All Study Plans" section header

### 3. **Translation Keys Added** (`utils/i18n.ts`)

Added new translation keys for 5 languages:

| Key | English | French | Danish | Spanish | German |
|-----|---------|--------|--------|---------|--------|
| `study.greeting` | Bible Study | Étude biblique | Bibelstudium | Estudio Bíblico | Bibelstudium |
| `study.todaysStudy` | Today's Study | Étude du Jour | Dagens Studium | Estudio del Día | Heutiges Studium |
| `study.dailyGuidance` | Your daily Bible study plan | Votre plan d'étude biblique quotidien | Din daglige bibelstudieplan | Tu plan de estudio bíblico diario | Dein täglicher Bibelstudienplan |
| `study.allPlans` | All Study Plans | Tous les Plans d'Étude | Alle Studieplaner | Todos los Planes de Estudio | Alle Studienpläne |

### 4. **Enhanced Notifications** (`contexts/NotificationContext.tsx`)

#### Updated Notification Message
**Before:**
```
Title: "CDB Therapy 📖🙏"
Body: "Your daily devotional and prayer are ready. Take a moment with God today."
```

**After:**
```
Title: "CDB Therapy 📖🙏📚"
Body: "Your daily devotional, prayer, and Bible study are ready. Spend time with God today."
```

**Changes:**
- Added 📚 study emoji to title
- Updated body to mention devotional, prayer, AND Bible study
- Changed "Take a moment" to "Spend time" (more comprehensive)
- Emphasizes the complete daily spiritual routine

## User Experience Flow

### Daily Cycle Coordination
1. **Day 1**:
   - Devotional #1 + Prayer #1 + Study #1
   - Notification: "Your daily devotional, prayer, and Bible study are ready"

2. **Day 19**:
   - Devotional #19 + Prayer #19 + Study #19
   - Study plans cycle back after Day 19

3. **Day 20**:
   - Devotional #20 + Prayer #20 + Study #1 (recycled)
   - Prayers cycle back after Day 20

4. **Day 24**:
   - Devotional #24 + Prayer #4 + Study #5
   - Devotionals cycle back after Day 24

5. **Day 25**:
   - Devotional #1 (recycled) + Prayer #5 + Study #6
   - All content now in recycling phase with smart rotation

### Content Synchronization
- **19 Study Plans** cycle every ~19 days
- **20 Prayer Guides** cycle every ~20 days
- **24 Devotionals** cycle every ~24 days
- Content viewed tracking ensures fresh content first
- Intelligent recycling after all content viewed

## Technical Details

### Cycle Length Comparison
| Content Type | Total Items | Cycle Length | Behavior |
|-------------|-------------|--------------|----------|
| Devotionals | 24 | ~24 days | Day-based cycling with viewed tracking |
| Prayers | 20 | ~20 days | Day-based cycling with viewed tracking |
| **Study Plans** | **19** | **~19 days** | **Day-based cycling with viewed tracking** |

### Viewed Content Tracking
All three systems track what users have seen:
- `contentHistory.devotionals` - Array of viewed devotional IDs
- `contentHistory.prayers` - Array of viewed prayer guide IDs
- `contentHistory.studies` - Array of viewed study plan IDs
- Prioritizes unviewed content
- Recycles intelligently after all content viewed

### Algorithm Consistency
All three features use the same algorithm:
```typescript
const dayOfYear = Math.floor((today - yearStart) / 86400000);
const unviewed = content.filter(item => !viewedIds.includes(item.id));

if (unviewed.length > 0) {
  return unviewed[dayOfYear % unviewed.length];
}

return content[dayOfYear % content.length];
```

## Study Plan Categories

The 19 study plans cover:
1. **Peace** - Psalms of Peace (7 days)
2. **Character** - Fruit of the Spirit (9 days)
3. **Teachings** - Teachings of Jesus (5 days)
4. **Faith** - Faith & Trust (6 days)
5. **Finances** - Biblical Financial Wisdom (7 days)
6. **Finances** - Mastering Biblical Stewardship (10 days)
7. **Entrepreneurship** - Kingdom Business Principles (10 days)
8. **Entrepreneurship** - Marketplace Ministry (7 days)
9. **Entrepreneurship** - Biblical Leadership Wisdom (8 days)
10. **Finances** - Biblical Wealth Management (7 days)
11. **Health** - Honoring God with Your Body (5 days)
12. **Parenting** - Biblical Parenting (7 days)
13. **Finances** - Biblical Investment Principles (5 days)
14. **Finances** - Breaking Free from Debt (6 days)
15. **Career** - Excellence in Your Career (6 days)
16. **Finances** - Biblical Budgeting (5 days)
17. **Relationships** - Biblical Communication (7 days)
18. **Career** - Growing Your Income Biblically (5 days)
19. **Finances** - The Path to Financial Freedom (8 days)
20. **Health** - Physical Discipline for God's Glory (5 days)
21. **Reading Plan** - Chronological + Book-Focused Bible Reading (52 weeks/365 days)

## Benefits

### 1. **Complete Daily Routine**
- Users now have a full spiritual practice: devotional, prayer, AND study
- One notification covers all three features
- Encourages comprehensive daily engagement with Scripture

### 2. **Consistent User Experience**
- All three main features (devotionals, prayers, studies) work the same way
- Users understand the pattern: new content daily
- Predictable, reliable spiritual routine

### 3. **Daily Engagement**
- Fresh study plan guidance every day
- Matches devotional and prayer rhythm
- Encourages daily app usage and Scripture reading

### 4. **Content Discovery**
- Featured "Today's Study" increases visibility
- All 19 study plans still accessible anytime
- Smart prioritization of unseen content

### 5. **Enhanced Notifications**
- Single notification covers all three features
- Clear value proposition: devotional + prayer + study
- Comprehensive daily spiritual content

### 6. **Intelligent Recycling**
- Content never runs out
- Automatic replay after completing all plans
- Smart rotation keeps content feeling fresh

## Testing Recommendations

### Manual Testing
1. ✅ Open Study tab → Verify "Today's Study" appears at top
2. ✅ Click "Today's Study" → Should open study plan detail view
3. ✅ Scroll down → Verify "All Study Plans" section exists
4. ✅ Check translations → Test all 5 languages (en, fr, da, es, de)
5. ✅ Test notification → Verify updated message includes study

### Automated Testing
1. Test `getTodayStudy()` returns different plans on different days
2. Test viewed tracking prioritizes unviewed content
3. Test cycling resets after all 19 plans viewed
4. Test `getPersonalizedStudy()` respects preferences
5. Test notification scheduling with updated message

### Edge Cases
- User views all 19 plans → Should recycle gracefully
- Day 366 (leap year) → Modulo should handle correctly
- Empty viewed array → Should return day-based plan
- Multiple viewed cycles → Random selection from all plans

## Summary

The Bible study feature now mirrors the devotionals and prayers system, completing the trifecta of daily spiritual content:

- ✅ **Daily Study Cycling**: 19 study plans rotate every ~19 days
- ✅ **Featured "Today's Study"**: Prominent display on study tab
- ✅ **Smart Tracking**: Prioritizes unviewed content
- ✅ **Intelligent Recycling**: Automatic replay after viewing all
- ✅ **Updated Notifications**: Mentions devotional, prayer, AND study
- ✅ **Multi-language Support**: All UI text translated for 5 languages
- ✅ **Consistent UX**: Matches devotional and prayer patterns perfectly

Users now receive a complete daily spiritual practice routine:
- 📖 **Daily Devotional** (24-day cycle)
- 🙏 **Daily Prayer** (20-day cycle)
- 📚 **Daily Bible Study** (19-day cycle)

All delivered via a single daily notification, creating a comprehensive, coordinated approach to daily Scripture engagement and spiritual growth.
