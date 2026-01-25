# Daily Bread — App Features

This document lists the user-facing features implemented in the Daily Bread app (iOS/Android, with partial web support).

---

## Core tabs (main product)

### Home (Daily Devotional)
- **Daily devotional feed**: title, verse, reflection (rotates daily with viewed-history awareness).
- **Calendar / date navigation**: view past devotionals by date.
- **Share devotional content**:
  - Per-card sharing (image + share text).
  - Global screenshot/share support (where available).
- **Offline-first**: devotionals are available offline (stored locally).

### Prayer (Prayer Guides)
- **Today’s Prayer**: featured daily prayer card (daily rotation).
- **All Prayer Guides**: browse all guides.
- **Prayer guide detail**:
  - prayers list
  - scripture references
  - simple UI animations/transitions
- **Progress/usage tracking**: marks items viewed + stores history locally.
- **Share**:
  - Per-card sharing (image + share text).
  - Global screenshot/share support (where available).

### Study (Bible Study + Reading Plans)
- **Today’s Study**: featured daily study plan card (daily rotation).
- **All Study Plans**: browse full catalog of plans.
- **Study plan detail**:
  - day-by-day reading list
  - focus statements per day
  - spiritual insights + themes + practical application
  - progress tracking (completed days + cycle/year progression)
- **In-app passage reader**:
  - opens “View Full Passage” for a reading (supports chapter ranges and verse ranges).
  - supports large passages with performant rendering.
- **Share**:
  - Per-card sharing (image + share text).
  - Verse modal share (image + download link text).

### Therapy (Faith-based support)
- **Daily therapy content** (available offline).
- **AI-powered therapy experiences (online required)**:
  - supportive conversation/chat
  - personalized therapy generation
  - voice transcription features (online required)
- **Voice features**:
  - Text-to-speech (device native)
  - voice mode options (where supported)
- **Schedule next session**:
  - shown after meaningful engagement (e.g., 5+ messages)
  - quick schedule (tomorrow / 3 days / next week)
  - suggested times
  - local persistence via AsyncStorage
  - notification reminders on iOS/Android

### Bible (Scripture Reader)
- **Book selector + chapter selector**.
- **Bible version selector** (top pill):
  - shows effective version abbreviation
  - supports preferred vs effective version behavior
- **Offline-first Bible**:
  - **KJV is bundled** for offline reading.
  - other public-domain versions can be used online (and cached where available).
- **Reading position saved** (resume where you left off).
- **Verse animations** for reading experience (lightweight UI).

---

## Offline & Online modes

### Offline mode (toggle in Settings)
- **Offline mode toggle**: users can switch between Offline and Online modes.
- **Network indicator UI**:
  - persistent “status dot” indicator on key screens.
  - offline banner/indicator for clear state.
- **Offline-first behavior**:
  - KJV Bible works fully offline (bundled).
  - cached content is used before any network fetches.

### Online-only capabilities (gracefully gated)
- **Translation**: auto-translation requires internet (but caches results).
- **Personalization**: AI-powered personalization requires internet.
- **Therapy AI**: generation/chat/transcription require internet.
- **Prompts**: when users attempt online-only features in Offline mode, the app explains what’s unavailable and offers to switch Online.

---

## Sharing & marketing

### Share card images (per-card)
- Share individual cards (devotional/prayer/study/therapy cards).
- Shared message includes the **download link**: `https://daily-bread.app/`.

### Screenshot sharing (screen-level)
- One-tap screenshot capture/share on supported screens.
- Web fallback downloads a PNG.

### Share watermark / branding
- Shared images include branding/watermark depending on platform implementation.

### “Share with Friends” in Settings
- One-tap share to invite friends.
- Includes App Store / Play Store links plus `https://daily-bread.app/`.

---

## Notifications

### Daily devotional reminder
- Daily scheduled reminder (local notifications).
- Message references daily devotional + prayer + study (coordinated routine).

### Therapy session reminders (alarm-like)
- High prominence reminders:
  - sound + vibration
  - high/max priority (Android)
  - lock-screen visibility
  - dedicated notification channel on Android

---

## Accessibility

### Settings toggles
- **Larger text**
- **Dyslexia-friendly font** (Atkinson Hyperlegible)
- **Bold text**

### App-wide text system
- Central text wrapper applies scaling/font/bold consistently across screens.

---

## Legal & Support
- **Terms of Service**
- **Privacy Policy**
- **Support**
- **Offline & Online FAQ** (in-app explanation of what works offline vs online)

---

## Data & persistence (local)
- AsyncStorage-backed persistence for:
  - user preferences (language, offline mode, accessibility, Bible version, etc.)
  - viewing history for devotionals/prayers/studies
  - progress tracking (study plan days + cycles)
  - saved Bible reading position
  - cached Bible chapters + cached translations
  - scheduled therapy sessions

---

## Platform support notes
- **iOS**: full feature set (except platform-limited web-only functionality).
- **Android**: full feature set.
- **Web**: supported for reading/browsing; some native features may degrade (notifications, certain share flows).

---

## Download link
- `https://daily-bread.app/`

