# 🎨 Quick Album Art Setup

## The Issue
The music player needs `.jpg` image files, not MP3 files, for the album art.

## Your MP3 File
You have: `finding-peace-in-the-storm.mp3` with embedded album art (the lighthouse image)

## What You Need To Do

### Option 1: Extract Album Art (Easiest)

1. **Install ffmpeg** (if not installed):
   ```bash
   brew install ffmpeg
   ```

2. **Extract album art from your MP3**:
   ```bash
   cd /Users/gabbydev5/Desktop/daily-bread-mob/assets/audio
   ffmpeg -i finding-peace-in-the-storm.mp3 -an -vcodec copy finding-peace-in-the-storm.jpg
   ```

3. **Rebuild the app** - Done!

### Option 2: Use MP3Tag (macOS App)

1. Download MP3Tag from https://mp3tag.app
2. Open `finding-peace-in-the-storm.mp3`
3. Right-click the cover art → "Export cover to file"
4. Save as `finding-peace-in-the-storm.jpg` in `/assets/audio/`
5. Rebuild the app

### Option 3: Manual Screenshot

1. Open the MP3 in Finder
2. Press Space to Quick Look
3. If album art shows, take screenshot
4. Crop to square
5. Save as `finding-peace-in-the-storm.jpg` in `/assets/audio/`
6. Rebuild the app

## What Happens Now?

Currently, the player shows a 🕊️ emoji placeholder because no `.jpg` file exists.

Once you add `finding-peace-in-the-storm.jpg`, the player will display the lighthouse image!

## For All 365 Devotions

You'll need to create 365 `.jpg` files (one for each audio file). Use the same naming:

```
Day 1:  finding-peace-in-the-storm.mp3  →  finding-peace-in-the-storm.jpg
Day 2:  strength-for-today.mp3          →  strength-for-today.jpg
Day 3:  love-in-action.mp3              →  love-in-action.jpg
...
```

## Batch Extract (For All Files)

Once you have all 365 MP3s:

```bash
cd /Users/gabbydev5/Desktop/daily-bread-mob/assets/audio
for file in *.mp3; do
  base="${file%.mp3}"
  ffmpeg -i "$file" -an -vcodec copy "${base}.jpg" 2>/dev/null
done
```

This will extract album art from all MP3s at once!
