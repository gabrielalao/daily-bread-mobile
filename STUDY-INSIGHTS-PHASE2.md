# Study Insights – Phase 2 (Cycles / Yearly Reset)

## What Phase 2 adds

Phase 2 adds **year/cycle tracking** for the 1‑year chronological plan, and rotates the spiritual insights automatically.

### ✅ Cycle tracking

- The app tracks **completed days per plan** (per cycle/year).
- Cycle starts at **Year 1**.
- When a user completes all days in the plan, the app **prompts** to start the next year.

### ✅ Rotating insights (Year 1 → Year 2 → Year 3…)

Insights are generated from:
- **Book-level** + **phase/week-level** templates (lightweight)
- Rotated based on **cycle/year**:
  - **Year 1**: overview + foundations
  - **Year 2**: more Christ-centered lens
  - **Year 3**: deeper discipleship/application lens
  - **Year 4+**: repeats the 3-angle cycle (still feels “fresh” by focus)

### ✅ Auto-suggest “Year 2”

When all days are completed for the plan, the app shows:
- “Year 1 Complete! Want to start Year 2 with fresh spiritual insights?”

If the user confirms:
- Progress resets to Day 0/234
- Cycle increments (Year 2)
- Insights rotate automatically

## Storage

Progress is stored separately from content recommendations so it **does not reset every 12 hours**.

Key: `@study_plan_progress`

Shape:

```ts
type StudyPlanProgress = Record<
  string,
  {
    cycle: number;
    completedDays: number[];
    cycleStartedAt: string;
    lastCompletedAt?: string;
    lastDayCompleted?: number;
  }
>;
```

## Where this shows in the UI

In the plan detail header (for the chronological plan):
- **Year X** pill
- **completedDays/totalDays** pill (e.g., `12/234 completed`)

## How to test Phase 2

1. Open the chronological plan
2. Tap a few days → confirm `X/234 completed` increases
3. (Optional) Mark the final day to trigger the completion prompt
4. Choose “Start Year 2” → confirm:
   - Year pill increments
   - Completed resets to `0/234`
   - Insight wording changes (rotated angle)

