# Watermark Visual Reference

## Quick Check: What to Look For

When you take a screenshot, check for these elements in the **bottom-right corner**:

```
┌─────────────────────────────┐
│                             │
│   [Your Content Here]       │
│                             │
│                             │
│       ╔════════════════╗    │
│       ║ [📱] dailybread.app ║    │
│       ╚════════════════╝    │
└─────────────────────────────┘
```

### ✅ Watermark Checklist

- [ ] **Location**: Bottom-right corner
- [ ] **Background**: White (not colored)
- [ ] **Logo**: App icon visible (24x24px)
- [ ] **Text**: "dailybread.app" (not "CDB Therapy")
- [ ] **Text Color**: Indigo/purple (#6366f1)
- [ ] **Shape**: Rounded rectangle
- [ ] **Shadow**: Subtle shadow visible
- [ ] **Spacing**: Logo and text have space between them
- [ ] **Content**: Watermark doesn't cover any text

### ❌ Common Issues to Check

**Issue 1: Watermark covers content text**
- ❌ Bad: Watermark blocks Bible verse or devotional text
- ✅ Good: Watermark in empty space, content fully readable

**Issue 2: Wrong branding**
- ❌ Bad: Shows "📖 CDB Therapy" (old version)
- ✅ Good: Shows "[Logo] dailybread.app" (new version)

**Issue 3: Logo not visible**
- ❌ Bad: Only text, no logo
- ✅ Good: App icon + text together

**Issue 4: Wrong background color**
- ❌ Bad: Blue/purple/colored background
- ✅ Good: White background with colored text

## Example Screenshots

### Example 1: Devotional Screenshot (CORRECT)

```
┌──────────────────────────────────────────┐
│                                          │
│  First Fruits, Not Leftovers             │
│                                          │
│  "Honor the Lord with your wealth,       │
│  with the firstfruits of all your        │
│  crops..." - Proverbs 3:9-10 (NIV)       │
│                                          │
│  Today's Reflection                      │
│  The principle of firstfruits teaches    │
│  us to honor God with the best...        │
│                                          │
│                    ╔══════════════════╗  │
│                    ║ [📱] dailybread.app ║  │ ← CORRECT!
│                    ╚══════════════════╝  │
└──────────────────────────────────────────┘
```

**What's correct:**
- ✅ Watermark in bottom-right
- ✅ Doesn't cover any text
- ✅ Logo + dailybread.app visible
- ✅ White background on watermark
- ✅ Professional appearance

### Example 2: Bible Verse Modal (CORRECT)

```
┌──────────────────────────────────────────┐
│                                          │
│           Genesis 1:26-28                │
│                                          │
│  26 And God said, Let us make mankind   │
│  in our image, in our likeness...        │
│                                          │
│  27 So God created mankind in his own   │
│  image, in the image of God he           │
│  created them...                         │
│                                          │
│  28 God blessed them and said to        │
│  them, "Be fruitful and increase..."    │
│                                          │
│                    ╔══════════════════╗  │
│                    ║ [📱] dailybread.app ║  │ ← CORRECT!
│                    ╚══════════════════╝  │
└──────────────────────────────────────────┘
```

**What's correct:**
- ✅ Verse text fully readable
- ✅ Watermark positioned in empty space
- ✅ Logo and URL clearly visible
- ✅ Consistent branding

### Example 3: Prayer Guide (CORRECT)

```
┌──────────────────────────────────────────┐
│                                          │
│      🙏 Work-Life Balance                │
│                                          │
│  Finding Harmony in a Busy World         │
│                                          │
│  Scripture Foundation                    │
│  "Come to me, all you who are weary..."  │
│  - Matthew 11:28-30                      │
│                                          │
│  Prayer Points                           │
│  • Wisdom to prioritize...               │
│  • Strength for daily tasks...           │
│  • Peace in busy seasons...              │
│                                          │
│                    ╔══════════════════╗  │
│                    ║ [📱] dailybread.app ║  │ ← CORRECT!
│                    ╚══════════════════╝  │
└──────────────────────────────────────────┘
```

**What's correct:**
- ✅ All prayer content visible
- ✅ Watermark doesn't obstruct emojis or text
- ✅ Professional branded appearance

## Testing on Different Platforms

### Web Browser Test

1. **Open app in browser**
2. **Go to any page** (Home, Prayers, Study, Therapy)
3. **Click share button**
4. **Check Downloads folder**
5. **Open PNG file**
6. **Verify checklist above**

Expected result:
- File downloads with name `daily-bread-[timestamp].png`
- Watermark visible with logo + dailybread.app
- White background, indigo text

### Mobile Test (iOS/Android)

1. **Open Expo Go app**
2. **Navigate to any page**
3. **Tap share button (floating FAB)**
4. **Select "Save to Photos" or "Save Image"**
5. **Open Photos app**
6. **View saved screenshot**
7. **Verify watermark appearance**

Expected result:
- Screenshot saved to camera roll
- Watermark rendered clearly
- Logo and text sharp and readable

### Modal Test (Bible Verse)

1. **Go to Study tab**
2. **Open any Bible study**
3. **Scroll to "View Full Passage" button**
4. **Tap to open modal**
5. **Tap small share button IN the modal** (top-right of modal)
6. **Check screenshot**

Expected result:
- Modal content captured (not background)
- Watermark on modal screenshot
- Verse text fully readable

## Watermark Specifications

### Dimensions (Reference)

```
Total Watermark Width = Logo (24px) + Spacing (8px) + Text Width + Padding (20px)

┌─ Logo ─┐ ┌─ Space ─┐ ┌─────── Text ────────┐
│  [📱]  │ │    ↔     │ │  dailybread.app      │
│  24px  │ │   8px    │ │  ~100-120px          │
└────────┘ └──────────┘ └──────────────────────┘

Total: ~150-160px width
Height: ~40-44px
```

### Colors (Hex Values)

```css
Background: rgba(255, 255, 255, 0.95) /* White with 95% opacity */
Text: #6366f1 /* Primary indigo color */
Shadow: rgba(0, 0, 0, 0.2) /* Subtle black shadow at 20% */
```

### Typography

```
Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Font Weight: 600 (Semi-bold)
Font Size: 14px
Letter Spacing: Normal
```

### Positioning

```
Position: Absolute
Right: 20px from edge
Bottom: 20px from edge
Z-index: Not applicable (added after capture)
```

## Quick Test Commands

### Test Checklist

Run through these steps quickly to verify everything works:

```
✓ Home Tab Screenshot
  - Open CDB Therapy
  - Go to Home
  - Tap share button
  - Check watermark

✓ Prayers Tab Screenshot (List)
  - Go to Prayers
  - Tap share button on main list
  - Check watermark

✓ Prayers Tab Screenshot (Detail)
  - Tap any prayer
  - Tap share button on detail page
  - Check watermark

✓ Study Tab Screenshot (List)
  - Go to Study
  - Tap share button on main list
  - Check watermark

✓ Study Tab Screenshot (Detail)
  - Tap any study plan
  - Tap share button on detail page
  - Check watermark

✓ Study Tab Screenshot (Modal)
  - Tap "View Full Passage"
  - Tap share button IN modal
  - Check watermark on verse only

✓ Therapy Tab Screenshot
  - Go to Therapy
  - Select any session
  - Tap share button
  - Check watermark
```

## Troubleshooting

### Problem: Watermark not showing

**Solution:**
1. Hard refresh browser (Ctrl/Cmd + Shift + R)
2. Clear cache
3. Restart Expo dev server
4. Check browser console for errors

### Problem: Wrong branding (old "📖 CDB Therapy")

**Solution:**
1. Check you're on latest code
2. Verify `hooks/useScreenshotShare.ts` has new watermark code
3. Restart dev server

### Problem: Watermark covers text

**Solution:**
1. Check screenshot - watermark should be in bottom-right with 20px padding
2. If content is too long and reaches bottom-right, this is expected
3. Most content leaves bottom-right corner empty

### Problem: Logo not loading (web)

**Solution:**
- Fallback book icon should render automatically
- Check `/assets/images/icon.png` exists
- Check browser console for image load errors
- Fallback is blue square with white lines (acceptable)

### Problem: Low quality watermark

**Solution:**
- Watermark renders at 2x scale automatically
- Check canvas scale setting
- Verify font rendering (should be anti-aliased)

## Share Testing

After taking screenshots, test sharing:

### WhatsApp Test
1. Take screenshot
2. Share to WhatsApp
3. Check in chat/status
4. Verify watermark visible and readable

### Instagram Test
1. Take screenshot
2. Share to Instagram Story
3. Post story
4. View story
5. Verify URL readable

### Email Test
1. Take screenshot
2. Share via email
3. Send to yourself
4. Open email
5. Download attachment
6. Verify watermark quality maintained

## Success Criteria

Screenshot watermark is working correctly if:

✅ **Visual**
- Logo + "dailybread.app" visible
- White background
- Indigo text color
- Bottom-right position
- Doesn't cover content

✅ **Technical**
- High resolution (2x scale)
- Clean rendering
- Proper file format (PNG)
- Reasonable file size

✅ **Functional**
- Screenshots download/save
- Sharing works
- Quality maintained across platforms
- Watermark survives compression (WhatsApp, Instagram)

✅ **Marketing**
- URL clearly readable
- Logo recognizable
- Professional appearance
- Encourages downloads

## Before/After Comparison

### BEFORE (Old Watermark)
```
Background: Blue/Purple (colored)
Text: "📖 CDB Therapy"
Style: White text on colored bg
```

### AFTER (New Watermark)
```
Background: White (clean)
Logo: [App Icon]
Text: "dailybread.app"
Style: Colored text on white bg
Benefit: Direct URL for downloads!
```

## Final Checklist

Before considering testing complete:

- [ ] Web screenshots work
- [ ] Mobile screenshots work  
- [ ] Modal screenshots work
- [ ] Watermark has logo + URL
- [ ] Background is white
- [ ] Text is indigo color
- [ ] Position is bottom-right
- [ ] Content is not covered
- [ ] File downloads successfully
- [ ] Sharing works
- [ ] URL is readable when shared
- [ ] Professional appearance maintained

Once all checked, watermark feature is **production ready**! 🎉
