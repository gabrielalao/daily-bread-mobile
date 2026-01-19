# Share App Feature

## Overview
Added a "Share App" section to the Settings page that allows users to easily share Daily Bread with friends and family, helping drive app downloads and grow the user base.

## Implementation Details

### Location
- **File**: `app/(tabs)/settings.tsx`
- **Section**: Added at the bottom of the settings page, after "Legal and Support"

### Features

#### 1. **Share Button**
- Large, prominent share button with icon
- Uses React Native's native `Share` API
- Platform-specific sharing (respects iOS and Android share sheets)

#### 2. **Smart Message Generation**
The share message includes:
- App name and description
- Emoji for visual appeal
- Platform-specific download link (iOS → App Store, Android → Google Play)
- Mention of cross-platform availability

**Example Share Message:**
```
Check out Daily Bread - Christian Therapy! 🙏

Get daily spiritual guidance, Bible studies, prayers, and AI-powered Christian therapy sessions.

📱 Download on App Store:
https://apps.apple.com/us/app/daily-bread-christian-therapy/id6755737219

Available on both iOS and Android!
```

#### 3. **Download Links Display**
- Shows abbreviated download links for both platforms
- Apple App Store: `apps.apple.com/us/app/daily-bread...`
- Google Play Store: `play.google.com/store/apps/details...`
- Styled in an info box for easy reference

### Technical Implementation

#### Imports Added
```typescript
import { Share } from "react-native";
import { Share2 } from "lucide-react-native";
```

#### Share Handler Function
```typescript
const handleShareApp = async () => {
  try {
    const message = `Check out Daily Bread - Christian Therapy! 🙏\n\n...`;
    
    const result = await Share.share({
      message,
      title: 'Daily Bread - Christian Therapy',
      url: Platform.OS === 'ios' 
        ? 'https://apps.apple.com/us/app/daily-bread-christian-therapy/id6755737219'
        : 'https://play.google.com/store/apps/details?id=app.rork.daily_bread_app_mp9wlbr',
    });

    if (result.action === Share.sharedAction) {
      // Successfully shared
    }
  } catch (error) {
    Alert.alert('Sharing Failed', 'Unable to share the app. Please try again.');
  }
};
```

### UI Components

#### Share Section
- **Section Header**: "Share Daily Bread"
- **Large Share Button**:
  - 64x64 circular icon with Share2 icon
  - Primary color background with shadow
  - Title: "Share with Friends"
  - Description: "Help others discover Daily Bread and grow in their faith journey"
- **Download Links Info Box**:
  - Light background with border
  - Lists both App Store and Google Play links
  - Platform emojis (🍎 for iOS, 🤖 for Android)

#### Styling
```typescript
shareRow: { marginBottom: 16 },
shareContent: { flexDirection: "row", alignItems: "center", gap: 16 },
shareIconContainer: {
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: colors.light.primary,
  // ... shadow styles
},
shareTextContainer: { flex: 1 },
shareTitle: { fontSize: 18, fontWeight: "700", color: colors.light.text },
shareDescription: { fontSize: 14, color: colors.light.textSecondary },
appLinksContainer: {
  backgroundColor: `${colors.light.primary}08`,
  borderRadius: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: `${colors.light.primary}20`,
},
```

## Platform Compatibility

### iOS
- Uses native iOS share sheet
- Automatically includes App Store link
- Supports sharing via Messages, Mail, WhatsApp, etc.

### Android
- Uses native Android share sheet
- Automatically includes Google Play link
- Supports sharing via SMS, Email, WhatsApp, etc.

### Web
- Share API works on supported browsers
- Falls back gracefully if not supported

## User Benefits

1. **Easy Sharing**: One-tap sharing with pre-formatted message
2. **Viral Growth**: Encourages organic user acquisition
3. **Platform Awareness**: Shows users the app is available on both iOS and Android
4. **Social Proof**: Well-formatted message makes the app look professional and trustworthy

## Error Handling

- Try-catch block around share functionality
- User-friendly error alert if sharing fails
- Development console logging for debugging
- Graceful fallback if Share API is unavailable

## Testing Recommendations

1. **iOS Testing**:
   - Test share via Messages, Mail, AirDrop
   - Verify App Store link opens correctly
   - Check share sheet appearance

2. **Android Testing**:
   - Test share via SMS, WhatsApp, Email
   - Verify Google Play link opens correctly
   - Check share dialog appearance

3. **Cross-Platform**:
   - Verify correct link is shared based on platform
   - Test message formatting and readability
   - Ensure emojis render correctly

## Future Enhancements

1. **Referral Tracking**: Add unique referral codes to track which users bring new downloads
2. **Incentives**: Offer rewards for users who successfully refer friends
3. **Social Media Integration**: Add direct buttons for specific platforms (WhatsApp, Facebook, etc.)
4. **Custom Messages**: Allow users to personalize the share message
5. **Analytics**: Track share button clicks and successful shares
6. **Deep Linking**: Implement deep links to bring users directly to specific content

## Download Links

- **App Store**: https://apps.apple.com/us/app/daily-bread-christian-therapy/id6755737219
- **Google Play**: https://play.google.com/store/apps/details?id=app.rork.daily_bread_app_mp9wlbr
