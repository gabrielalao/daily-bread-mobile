# Landing screenshots (feature pack)

These are **real iOS Simulator screenshots** of the current Daily Bread app UI, intended for your **Next.js landing page**.

## iOS screenshots

Location: `assets/landing/feature-screenshots/ios/`

- `01-home-daily-devotional.png`
  - Home tab showing **daily devotional** + share UI.
- `02-prayers-today-and-guides.png`
  - Prayer tab showing **Today’s Prayer** + **All Prayer Guides** list.
- `03-study-today-and-plans.png`
  - Study tab showing **Today’s Study** + **All Study Plans**.
- `04-therapy.png`
  - Therapy tab (faith-based therapy feature entry).
- `05-bible-reader.png`
  - Bible reader with **book/chapter/version pills** and verse reading UI.
- `06-settings.png`
  - Settings page including Offline/Online + Accessibility + Legal/Support entries.

## “Source” (provided screenshots)

Location: `assets/landing/feature-screenshots/source/`

This folder contains screenshots you provided in chat; kept here for reference/backup.

## How to regenerate (iOS)

These were captured by deep-linking into Expo Router routes and using `simctl`:

- Base URL (example): `exp://me8fbvi-statking-8081.exp.direct`
- Deep link pattern: `exp://…/--/(tabs)/home` etc.
- Capture command: `xcrun simctl io booted screenshot <path>`

If your Expo URL changes, update the base URL before capturing.

