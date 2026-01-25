# Album Art for Devotional Music

This folder should contain album art images for each devotional audio file.

## File Naming Convention

Album art images should have the **same base name** as the audio file:

```
Audio File:     finding-peace-in-the-storm.mp3
Album Art:      finding-peace-in-the-storm.jpg
```

## Supported Formats

- `.jpg` / `.jpeg` (recommended)
- `.png`

## Recommended Specs

- **Size**: 300x300px to 1000x1000px
- **Format**: JPG (smaller file size)
- **Quality**: 80-90% (good balance)

## How to Extract Album Art from MP3

If your MP3 files already have embedded album art, you can extract them:

### Using ffmpeg (macOS/Linux):
```bash
# Extract album art from MP3
ffmpeg -i finding-peace-in-the-storm.mp3 -an -vcodec copy finding-peace-in-the-storm.jpg

# Extract from all MP3 files
for file in *.mp3; do
  base="${file%.mp3}"
  ffmpeg -i "$file" -an -vcodec copy "${base}.jpg" 2>/dev/null
done
```

### Using Online Tools:
- Upload MP3 to https://www.mp3tag.de/en/ (free desktop app)
- Or use online converters

## Current Album Art

- `finding-peace-in-the-storm.jpg` - ✅ Ready to add

## Adding Your Album Art

1. Create/extract 365 album art images (one for each devotion)
2. Name them using kebab-case matching the audio files
3. Place them in `/assets/audio/` folder
4. Rebuild the app

The app will automatically load and display the album art!
