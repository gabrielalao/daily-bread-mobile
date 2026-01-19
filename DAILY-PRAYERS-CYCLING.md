# Daily Prayers Cycling Feature

## Overview
Updated the prayer system to match the devotional system with daily cycling, so users receive a coordinated "Today's Devotion" and "Today's Prayer" each day. Also updated notifications to include both devotionals and prayers.

## Changes Made

### 1. **Prayer Cycling Functions** (`constants/prayers.ts`)

Added two new functions to match the devotional system:

#### `getTodayPrayer(viewedIds)`
```typescript
export function getTodayPrayer(viewedIds: string[] = []): PrayerGuide {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  const unviewed = prayerGuides.filter(p => !viewedIds.includes(p.id));
  
  if (unviewed.length > 0) {
    return unviewed[dayOfYear % unviewed.length];
  }
  
  return prayerGuides[dayOfYear % prayerGuides.length];
}
```

**How it works:**
- Calculates the day of the year (1-365/366)
- Filters out already-viewed prayers
- Uses modulo to cycle through prayers: `dayOfYear % prayerGuides.length`
- With 20 prayer guides, cycles approximately every 20 days
- Prioritizes unviewed content first

#### `getPersonalizedPrayer(viewedIds, preferences)`
```typescript
export function getPersonalizedPrayer(viewedIds: string[], preferences: string[] = []): PrayerGuide {
  const unviewed = prayerGuides.filter(p => !viewedIds.includes(p.id));
  
  if (unviewed.length === 0) {
    return prayerGuides[Math.floor(Math.random() * prayerGuides.length)];
  }
  
  if (preferences.length > 0) {
    const preferredPrayers = unviewed.filter(p => 
      preferences.some(pref => 
        p.title.toLowerCase().includes(pref.toLowerCase()) ||
        p.description.toLowerCase().includes(pref.toLowerCase())
      )
    );
    
    if (preferredPrayers.length > 0) {
      return preferredPrayers[Math.floor(Math.random() * preferredPrayers.length)];
    }
  }
  
  return unviewed[Math.floor(Math.random() * unviewed.length)];
}
```

**How it works:**
- Filters unviewed prayers
- Matches user preferences (topics of interest)
- Returns random prayer from matching prayers
- Falls back to random unviewed prayer if no matches
- Recycles all prayers randomly once all are viewed

### 2. **Updated Prayer Screen UI** (`app/(tabs)/prayers.tsx`)

#### Added "Today's Prayer" Section
- Prominent featured card at the top of the prayers page
- Shows the daily prayer selected by `getTodayPrayer()`
- Matches the visual design of "Today's Devotional" on the home screen
- Includes:
  - 🙏 Icon indicator
  - "Today's Prayer" heading
  - "Your daily prayer guidance" subtitle
  - Large featured card with icon, title, and description
  - Primary color border for emphasis

#### Updated Layout Structure
```
📱 Prayer Screen
├── Header
│   ├── "Prayer Guides" title
│   └── Subtitle
├── 🙏 Today's Prayer (Featured)
│   └── Large card with today's prayer
├── All Prayer Guides
│   └── Grid of all 20 prayer guides
```

#### New Styles Added
- `todaySection` - Container for today's prayer
- `todaySectionHeader` - Header with title and subtitle
- `todayPrayerCard` - Large featured card with primary border
- `todayIconContainer` - 64x64 icon circle
- `todayTextContainer` - Text content wrapper
- `todayTitle` - Bold prayer title
- `todayDescription` - Prayer description
- `allPrayersHeader` - "All Prayer Guides" section header

### 3. **Translation Keys Added** (`utils/i18n.ts`)

Added new translation keys for 5 languages:

| Key | English | French | Danish | Spanish | German |
|-----|---------|--------|--------|---------|--------|
| `prayers.greeting` | Prayer Guides | Guides de Prière | Bønneguider | Guías de Oración | Gebetsanleitungen |
| `prayers.todaysPrayer` | Today's Prayer | Prière du Jour | Dagens Bøn | Oración del Día | Heutiges Gebet |
| `prayers.dailyGuidance` | Your daily prayer guidance | Votre guidance quotidienne de prière | Din daglige bønnevejledning | Tu guía diaria de oración | Deine tägliche Gebetsanleitung |
| `prayers.allPrayers` | All Prayer Guides | Tous les Guides de Prière | Alle Bønneguider | Todas las Guías de Oración | Alle Gebetsanleitungen |

### 4. **Updated Notifications** (`contexts/NotificationContext.tsx`)

#### Enhanced Notification Message
**Before:**
```
Title: "Daily Bread 📖"
Body: "Your daily devotional is ready. Take a moment with God today."
```

**After:**
```
Title: "Daily Bread 📖🙏"
Body: "Your daily devotional and prayer are ready. Take a moment with God today."
```

**Changes:**
- Added 🙏 prayer hands emoji to title
- Updated body to mention both devotional and prayer
- Emphasizes the coordinated daily content

## User Experience Flow

### Daily Cycle
1. **Day 1**: 
   - Devotional #1 + Prayer #1
   - Notification: "Your daily devotional and prayer are ready"

2. **Day 2**:
   - Devotional #2 + Prayer #2
   - Content progresses in sync

3. **Day 20**:
   - Devotional #20 + Prayer #20
   - Both cycles complete their first rotation

4. **Day 21**:
   - Devotional #21 + Prayer #1 (prayers cycle back)
   - Devotionals continue (24 total)

5. **Day 25**:
   - Devotional #1 (devotionals cycle back) + Prayer #5
   - Both now in their recycling phase

### Content Synchronization
- **20 Prayer Guides** cycle every ~20 days
- **24 Devotionals** cycle every ~24 days
- Content viewed tracking ensures fresh content first
- Once all content viewed, intelligent recycling begins

## Technical Details

### Cycle Length Comparison
| Content Type | Total Items | Cycle Length | Behavior |
|-------------|-------------|--------------|----------|
| Devotionals | 24 | ~24 days | Day-based cycling with viewed tracking |
| Prayers | 20 | ~20 days | Day-based cycling with viewed tracking |

### Viewed Content Tracking
Both systems track what users have seen:
- `contentHistory.devotionals` - Array of viewed devotional IDs
- `contentHistory.prayers` - Array of viewed prayer guide IDs
- Prioritizes unviewed content
- Recycles intelligently after all content viewed

### Algorithm
```typescript
// For both devotionals and prayers
const dayOfYear = Math.floor((today - yearStart) / 86400000);
const unviewed = content.filter(item => !viewedIds.includes(item.id));

if (unviewed.length > 0) {
  return unviewed[dayOfYear % unviewed.length];
}

return content[dayOfYear % content.length];
```

## Benefits

### 1. **Consistent User Experience**
- Both devotionals and prayers now work the same way
- Users understand the pattern: new content daily
- Predictable, reliable spiritual routine

### 2. **Daily Engagement**
- Fresh prayer guidance every day
- Matches devotional rhythm
- Encourages daily app usage

### 3. **Content Discovery**
- Featured "Today's Prayer" increases visibility
- All 20 prayers still accessible anytime
- Smart prioritization of unseen content

### 4. **Enhanced Notifications**
- One notification covers both features
- Clear value proposition: devotional + prayer
- Reduces notification fatigue

### 5. **Intelligent Recycling**
- Content never runs out
- Automatic replay after completing all prayers
- Smart rotation keeps content feeling fresh

## Future Enhancements

### Potential Improvements
1. **Sync Cycles**: Adjust content counts to sync perfectly (20/20 or 24/24)
2. **Theme Matching**: Align prayer topics with devotional themes daily
3. **Notification Personalization**: Time-based messages (morning/evening)
4. **Progress Tracking**: Show "X/20 prayers completed" badges
5. **Streak System**: Track consecutive days engaging with daily content
6. **Custom Cycles**: Let users choose cycling speed (daily, weekly, etc.)

### Analytics to Track
- Daily engagement rates with "Today's Prayer"
- Click-through from notifications
- Time spent on daily vs. all prayers
- Content preference patterns
- Recycling engagement (repeat views)

## Testing Recommendations

### Manual Testing
1. ✅ Open Prayers tab → Verify "Today's Prayer" appears at top
2. ✅ Click "Today's Prayer" → Should open prayer detail view
3. ✅ Scroll down → Verify "All Prayer Guides" section exists
4. ✅ Check translations → Test all 5 languages (en, fr, da, es, de)
5. ✅ Test notification → Verify updated message includes prayers

### Automated Testing
1. Test `getTodayPrayer()` returns different prayers on different days
2. Test viewed tracking prioritizes unviewed content
3. Test cycling resets after all 20 prayers viewed
4. Test `getPersonalizedPrayer()` respects preferences
5. Test notification scheduling with updated message

### Edge Cases
- User views all 20 prayers → Should recycle gracefully
- Day 366 (leap year) → Modulo should handle correctly
- Empty viewed array → Should return day-based prayer
- Multiple viewed cycles → Random selection from all prayers

## Summary

The prayers feature now mirrors the devotionals system, creating a cohesive daily spiritual routine:
- ✅ **Daily Prayer Cycling**: 20 prayers rotate every ~20 days
- ✅ **Featured "Today's Prayer"**: Prominent display on prayers tab
- ✅ **Smart Tracking**: Prioritizes unviewed content
- ✅ **Intelligent Recycling**: Automatic replay after viewing all
- ✅ **Updated Notifications**: Mentions both devotionals and prayers
- ✅ **Multi-language Support**: All UI text translated for 5 languages
- ✅ **Consistent UX**: Matches devotional pattern perfectly

Users now receive coordinated daily devotional + prayer content with a single notification, creating a comprehensive daily spiritual practice routine.
