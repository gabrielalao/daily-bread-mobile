# Audio Assets - 365 Days of Devotional Music

Place your devotional music files here - one for each day of the year.

## File Naming Convention (IMPORTANT!)

**Name files exactly as the devotion title, converted to kebab-case:**

```
Devotion Title: "Finding Peace in the Storm"
File Name: finding-peace-in-the-storm.mp3

Devotion Title: "Strength for Today"  
File Name: strength-for-today.mp3

Devotion Title: "Love in Action"
File Name: love-in-action.mp3
```

### Conversion Rules:
1. Convert to lowercase
2. Replace spaces with hyphens (`-`)
3. Remove special characters (apostrophes, quotes, etc.)
4. Add `.mp3` extension

## Complete List of Required Files (365 days)

### Days 1-10 (Jan 25 - Feb 3)
```
finding-peace-in-the-storm.mp3          # Day 1 (Jan 25)
strength-for-today.mp3                  # Day 2
love-in-action.mp3                      # Day 3
the-heart-of-stewardship.mp3            # Day 4
first-fruits-not-leftovers.mp3          # Day 5
the-measure-of-generosity.mp3           # Day 6
hope-in-hard-times.mp3                  # Day 7
walking-by-faith.mp3                    # Day 8
the-gift-of-forgiveness.mp3             # Day 9
gratitude-changes-everything.mp3        # Day 10
```

### Days 11-20
```
gods-presence-in-everyday-life.mp3      # Day 11
trusting-gods-timing.mp3                # Day 12
the-power-of-prayer.mp3                 # Day 13
contentment-in-christ.mp3               # Day 14
loving-difficult-people.mp3             # Day 15
wisdom-from-above.mp3                   # Day 16
resting-in-god.mp3                      # Day 17
the-promise-of-eternal-life.mp3         # Day 18
overcoming-fear.mp3                     # Day 19
serving-with-joy.mp3                    # Day 20
```

(Continue for all 365 days - see devotionals.ts for complete list)

## Supported Formats

- **MP3** (recommended) - Best compatibility
- **M4A** - Also supported
- **WAV** - Supported but larger file size
- **AAC** - Supported

## File Size Recommendations

- **Optimal**: 2-5 MB per file (3-5 minutes at 128-192 kbps)
- **Maximum**: 10 MB per file
- **Total for 365 files**: ~1-2 GB

## How the System Works

1. **Automatic Daily Rotation**: The app automatically shows the correct devotion and music for each day of the year
2. **Day Calculation**: Jan 25 = Day 1, Jan 26 = Day 2, etc.
3. **Dynamic Loading**: The app tries to load the audio file matching the devotion title
4. **Graceful Fallback**: If a file is missing, the music player simply doesn't show (no error)

## Adding Your Music Files

### Step 1: Name Your Files
Convert each devotion title to kebab-case as shown above.

### Step 2: Copy to This Folder
```bash
# Copy all your MP3 files to:
/Users/gabbydev5/Desktop/daily-bread-mob/assets/audio/

# Example:
cp ~/Music/Devotions/*.mp3 /Users/gabbydev5/Desktop/daily-bread-mob/assets/audio/
```

### Step 3: Update audioHelper.ts
Add each file to the switch statement in `/utils/audioHelper.ts`:

```typescript
case 'your-devotion-title':
  return require('@/assets/audio/your-devotion-title.mp3');
```

### Step 4: Rebuild the App
```bash
npx expo start
```

## Getting the Complete List of File Names

Run this command to generate the exact file names you need:

```bash
cd /Users/gabbydev5/Desktop/daily-bread-mob
node scripts/generate-audio-file-list.js
```

This will output all 365 file names you need to create.

## Current Structure

```
assets/
└── audio/
    ├── README.md (this file)
    ├── finding-peace-in-the-storm.mp3  # Day 1 (Jan 25)
    ├── strength-for-today.mp3          # Day 2
    ├── love-in-action.mp3              # Day 3
    └── ... (362 more files)
```

## Testing

To test if your audio file works:
1. Add the MP3 file with the correct name
2. Update `audioHelper.ts` to include the case for your file
3. Run the app
4. Navigate to Home tab
5. The music player should appear below the prayer card
6. Click play to test

## Notes

- Files are bundled with the app during build
- Users can play offline once downloaded
- Audio continues playing when app is backgrounded
- Player shows progress and allows skip forward/backward
- If a file is missing for a day, the player won't show (no error to user)

## Need Help?

See the full list of devotion titles in:
`/constants/devotionals.ts`

Each devotion has a `title` field - convert that to kebab-case for your file name.
