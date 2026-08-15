# App Store Screenshots

## Required Dimensions

### iOS App Store
Apple requires screenshots for the **6.7" Display (iPhone 14 Pro Max, 15 Pro Max)**

**Required Size**: **1290 × 2796px** or **1242 × 2688px**

We use: **1242 × 2688px**

### Folder Structure

```
AppStore/Screenshots/
├── source/          # Place your original screenshots here
├── resized/         # Processed screenshots (1242 × 2688px)
└── README.md        # This file
```

## How to Create Screenshots

### Method 1: Using iOS Simulator (Recommended)

1. Open Xcode or run Expo:
   ```bash
   npx expo start
   # Press 'i' for iOS simulator
   ```

2. Choose **iPhone 15 Pro Max** or **iPhone 14 Pro Max**

3. Navigate to the screens you want to capture

4. Take screenshots:
   - Press: `Cmd + S` in simulator
   - Or: Device → Trigger Screenshot

5. Screenshots save to Desktop automatically

6. Move them to `AppStore/Screenshots/source/`

### Method 2: From Physical iPhone

1. Use iPhone 14/15 Pro Max (6.7" display)

2. Take screenshots:
   - Press: **Volume Up + Power Button**

3. AirDrop or transfer to Mac

4. Move to `AppStore/Screenshots/source/`

## Resizing Screenshots

If your screenshots are not exactly 1242 × 2688px:

```bash
cd AppStore/Screenshots

# Resize single screenshot
sips -z 2688 1242 source/screenshot1.png --out resized/screenshot1.png

# Resize all screenshots
for file in source/*.png; do
  filename=$(basename "$file")
  sips -z 2688 1242 "$file" --out "resized/$filename"
done
```

## Screenshot Guidelines

### Required Screenshots (3-10 images)

1. **Home/Daily Devotional** - Show today's devotional
2. **Prayers** - Show prayer guides and today's prayer
3. **Study** - Show Bible study plans
4. **Therapy** - Show AI therapy chat interface
5. **Bible Reader** - Show KJV Bible reading
6. **Settings** - Show schedule sessions and features

### Best Practices

✅ **Do:**
- Use real content (not placeholder text)
- Show the app's best features
- Use portrait orientation (vertical)
- Keep status bar clean
- Show light mode (better for App Store)
- Highlight unique features (offline mode, accessibility, etc.)

❌ **Don't:**
- Use developer debug info
- Show network errors
- Include profanity or sensitive content
- Use landscape orientation
- Show empty states

## Screenshot Specifications

| Device | Resolution | Aspect Ratio |
|--------|------------|--------------|
| 6.7" Display | 1290 × 2796px | 19.5:9 |
| 6.7" Display (scaled) | **1242 × 2688px** | 19.5:9 |
| 6.5" Display | 1284 × 2778px | 19.5:9 |
| 6.5" Display (scaled) | 1242 × 2688px | 19.5:9 |

*We use 1242 × 2688px as it works for both 6.7" and 6.5" displays*

## Upload to App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app: **CDB Therapy**
3. Go to: **App Store → [Version] → iOS Screenshots**
4. Upload screenshots from `AppStore/Screenshots/resized/`
5. Add captions (optional but recommended)

## Naming Convention

Use descriptive names for easy sorting:

```
01-home-daily-devotional.png
02-prayers-today-guides.png
03-study-plans.png
04-therapy-ai-chat.png
05-bible-reader-kjv.png
06-settings-schedule.png
```

## Current Version

**Version**: 6.0.0  
**Last Updated**: January 25, 2026

## Quick Commands

```bash
# Check image dimensions
sips -g pixelWidth -g pixelHeight source/screenshot.png

# Resize to App Store dimensions
sips -z 2688 1242 source/screenshot.png --out resized/screenshot.png

# Batch resize all
for f in source/*.png; do sips -z 2688 1242 "$f" --out "resized/$(basename "$f")"; done

# Verify all resized images
for f in resized/*.png; do sips -g pixelWidth -g pixelHeight "$f"; done
```

## Need Help?

- [Apple Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
- [App Preview Guidelines](https://developer.apple.com/app-store/product-page/)
