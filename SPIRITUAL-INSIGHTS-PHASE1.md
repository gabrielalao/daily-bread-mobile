# Phase 1: Spiritual Insights (Study Page)

## What’s included in Phase 1

Phase 1 adds **optional spiritual insights** to the Study page reading-plan items, without changing any existing flows:

- **`spiritualInsight`**: short devotional-style interpretation for the day’s reading
- **`keyThemes`**: bullet list of key theological themes
- **`practicalApplication`**: how to apply the reading today
- **Expandable UI** per day: **“Show Spiritual Insights”** → expands/collapses

## Where this shows up

- **Study tab → Chronological + Book-Focused Bible Reading → Reading Plan list**
- For any day that has insight data, you’ll see a **“Show Spiritual Insights”** row under that day.

## Current coverage (for testing)

To keep Phase 1 safe and testable, insights are currently populated for:

- **Day 1–7** of `chronological-book-focused`

All other days continue to work normally (they simply won’t show the toggle until we add insight data).

## Files changed

- `constants/bible-studies.ts`
  - Extended `BibleStudyPlan.readings[]` to allow optional insight fields
  - Added insights content for Day 1–7 of the new 1-year plan
- `app/(tabs)/study.tsx`
  - Renders an expandable Insights UI per day (only when insights exist)

## How to test

1. Open the app and go to **Study**
2. Open **Chronological + Book-Focused Bible Reading**
3. In the reading list:
   - Expand **Day 1** (and Days 2–7) using **“Show Spiritual Insights”**
   - Confirm:
     - Expand/collapse works
     - “View Full Passage” still works (tap the reading card)
     - No layout overlap / no broken styles

## Next step (when you approve)

If you like how it feels, we’ll implement Phase 1 fully by adding insights to:

- The remainder of the 1-year plan (all days), and/or
- Additional study plans (optional)

