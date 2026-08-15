# Bible Versions Feature

CDB Therapy now supports multiple Bible translations, allowing users to choose their preferred version.

## ✨ Features

### 📖 **10 Popular Bible Versions**

#### Popular Versions:
1. **NIV** - New International Version (Default)
   - Contemporary English translation balancing accuracy and readability
   
2. **KJV** - King James Version
   - Classic English translation known for beautiful, poetic language
   
3. **NKJV** - New King James Version
   - Modern update of the KJV with contemporary language
   
4. **ESV** - English Standard Version
   - Word-for-word translation emphasizing accuracy and literary excellence
   
5. **NLT** - New Living Translation
   - Thought-for-thought translation making Scripture accessible and clear
   
6. **MSG** - The Message
   - Contemporary paraphrase in everyday language

#### Additional Versions:
7. **NASB** - New American Standard Bible
   - Literal word-for-word translation known for precision
   
8. **AMP** - Amplified Bible
   - Includes additional words to clarify and amplify meaning
   
9. **CSB** - Christian Standard Bible
   - Balance of accuracy and readability for modern readers
   
10. **NRSV** - New Revised Standard Version
    - Scholarly translation used widely in academic settings

## 🎯 Implementation

### Settings Screen
- **Location**: Settings > Bible Preferences
- **Sections**: 
  - Popular Versions (6 most common)
  - All Versions (complete list)
- **Selection UI**:
  - Shows abbreviation, full name, and description
  - Check mark indicates current selection
  - Immediate feedback with confirmation alert

### Version Display
- **Shown in**:
  - Daily Devotionals (Home screen)
  - Therapy Sessions
- **Format**: `Scripture Reference (VERSION)`
  - Example: `Philippians 4:6-7 (NIV)`

### Storage
- Saved in user preferences (AsyncStorage)
- Persists across app sessions
- Default: NIV

## 📁 New Files

```
constants/
  └── bible-versions.ts      # Bible versions data & utilities
```

## 📝 Modified Files

```
contexts/
  └── ContentContext.tsx     # Added bibleVersion to preferences

app/(tabs)/
  ├── settings.tsx           # Version selection UI
  ├── home.tsx               # Display version on devotionals  
  └── therapy.tsx            # Display version on therapy
```

## 🔧 API Reference

### `constants/bible-versions.ts`

```typescript
// Get version by abbreviation
getVersionByAbbreviation('NIV') // Returns BibleVersion

// Get version by ID
getVersionById('niv') // Returns BibleVersion

// Get popular versions only
getPopularVersions() // Returns BibleVersion[]

// Default version constant
DEFAULT_BIBLE_VERSION // 'niv'
```

### `ContentContext`

```typescript
// Set user's preferred Bible version
setBibleVersion(versionId: string): Promise<void>

// Access current version
userPreferences.bibleVersion // string (version ID)
```

## 💡 Usage Example

```typescript
import { useContent } from '@/contexts/ContentContext';
import { getVersionById } from '@/constants/bible-versions';

function MyComponent() {
  const { userPreferences, setBibleVersion } = useContent();
  
  // Get current version
  const currentVersion = getVersionById(userPreferences.bibleVersion);
  console.log(currentVersion?.abbreviation); // 'NIV'
  
  // Change version
  await setBibleVersion('kjv');
}
```

## 🎨 User Experience

### Changing Bible Version:
1. Navigate to Settings tab
2. Scroll to "Bible Preferences" section
3. Tap "Bible Version" row
4. See current version highlighted
5. Browse Popular Versions or All Versions
6. Tap desired version
7. Confirmation alert appears
8. Version updates immediately across all content

### Viewing Content:
- Scripture references now show version
- Example: **John 3:16 (KJV)** instead of just **John 3:16**
- Consistent display across all screens

## ✅ Benefits

1. **User Preference**: Readers can use their familiar translation
2. **Accessibility**: Some versions easier to understand than others
3. **Study**: Compare different translations
4. **Personal Connection**: Enhance spiritual experience
5. **No Breaking Changes**: All existing features work normally

## 🔄 Future Enhancements

Potential future features:
- [ ] Actual verse text fetching from Bible API
- [ ] Side-by-side version comparison
- [ ] Verse highlighting/bookmarking per version
- [ ] Download versions for offline use
- [ ] Version-specific search
- [ ] Study notes per translation

## 📊 Version Metadata

Each version includes:
- `id`: Unique identifier
- `name`: Full name
- `abbreviation`: Short code (NIV, KJV, etc.)
- `description`: What makes it unique
- `language`: Currently English only
- `popular`: Flag for popular/common versions

## 🧪 Testing

### Manual Testing:
1. ✅ Open Settings
2. ✅ Change Bible version
3. ✅ Verify confirmation appears
4. ✅ Navigate to Home screen
5. ✅ Check devotional shows new version
6. ✅ Navigate to Therapy
7. ✅ Check therapy session shows new version
8. ✅ Close app and reopen
9. ✅ Verify version preference persisted

### Automated Testing:
```bash
# Test version selection
# Test persistence
# Test display in content
```

## 🎓 Educational Note

**Why Multiple Versions Matter:**
- Different translation philosophies (word-for-word vs. thought-for-thought)
- Some preserve original language structure
- Others prioritize readability
- Scholars may prefer literal translations
- New believers may prefer contemporary language
- All are faithful to original manuscripts

## 📱 Compatibility

- ✅ iOS
- ✅ Android  
- ✅ Web
- ✅ Offline (version preference stored locally)
- ✅ All existing features maintained
