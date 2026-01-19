# Alarm-like Notifications for Therapy Sessions

## Overview

Therapy session reminders now feature **alarm-like notifications** with enhanced prominence, including:

- 🔊 **Sound** - Plays device notification sound
- 📳 **Vibration** - Vibration pattern to grab attention
- 🔔 **Maximum Priority** - Notifications appear prominently on screen
- 💡 **LED Light** (Android) - Visual indicator when phone is idle
- 📱 **Lock Screen** - Visible even when device is locked

## Features

### 1. **Sound Notifications**

**iOS:**
- Uses the default iOS notification sound
- Sound plays even when device is on silent (if notification permissions allow)
- Respects user's notification sound settings

**Android:**
- Uses the default Android notification sound
- Configured through dedicated "Therapy Session Reminders" notification channel
- Sound plays at notification volume level

**Configuration:**
```typescript
content: {
  sound: true, // Enable sound
  ...(Platform.OS === 'ios' && {
    sound: 'default', // Use default iOS sound
  }),
}
```

### 2. **Vibration Pattern**

Notifications include a custom vibration pattern that creates an alarm-like feel:

**Pattern:** `[0, 250, 250, 250]`
- 0ms wait
- 250ms vibrate
- 250ms pause
- 250ms vibrate

This pattern ensures the notification is noticeable without being overly aggressive.

**Configuration:**
```typescript
content: {
  vibrate: [0, 250, 250, 250],
}
```

### 3. **Maximum Priority (Android)**

Android notifications use `AndroidNotificationPriority.MAX` to ensure they:
- Appear as heads-up notifications (pop up on screen)
- Play sound even on priority mode (if allowed)
- Show on lock screen
- Appear at the top of notification list

**Priority Levels:**
- `MIN` - Minimal, no sound
- `LOW` - Low importance
- `DEFAULT` - Normal importance
- `HIGH` - High importance (previous setting)
- `MAX` - **Maximum importance** (new setting) ✅

### 4. **Android Notification Channel**

A dedicated notification channel "Therapy Session Reminders" is created with optimal settings:

```typescript
await Notifications.setNotificationChannelAsync('therapy-sessions', {
  name: 'Therapy Session Reminders',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  sound: 'default',
  enableVibrate: true,
  enableLights: true,
  lightColor: '#6366f1', // Indigo color
  lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  bypassDnd: false, // Respects Do Not Disturb
  description: 'Reminders for your scheduled therapy sessions with sound and vibration',
});
```

**Channel Features:**
- **Name:** "Therapy Session Reminders"
- **Importance:** MAX (highest level)
- **Vibration:** Enabled with custom pattern
- **Sound:** Default notification sound
- **LED Light:** Enabled with indigo color (#6366f1)
- **Lock Screen:** Visible publicly
- **Do Not Disturb:** Respects DND settings
- **User Customizable:** Users can customize in Android settings

### 5. **Lock Screen Visibility**

**iOS:**
- Notifications appear on lock screen by default
- User can control in iOS Settings → Notifications → Daily Bread

**Android:**
- Set to `AndroidNotificationVisibility.PUBLIC`
- Full notification content visible on lock screen
- User can change in notification channel settings

### 6. **LED Light (Android)**

For Android devices with notification LEDs:
- **Color:** Indigo (#6366f1) - matches app theme
- **Behavior:** Blinks when device is idle
- **Duration:** Until notification is dismissed

## Notification Behavior Comparison

| Feature | Before | After |
|---------|--------|-------|
| Sound | ✅ Basic | ✅ **Enhanced** |
| Vibration | ❌ None | ✅ **Custom Pattern** |
| Priority | HIGH | **MAX** |
| Android Channel | None | ✅ **Dedicated** |
| LED Light | ❌ None | ✅ **Indigo** |
| Lock Screen | ✅ Basic | ✅ **Public** |
| Badge (iOS) | ❌ None | ✅ **Shows 1** |

## User Control

Users have full control over notification behavior through their device settings:

### iOS Settings
1. Go to **Settings** → **Notifications** → **Daily Bread**
2. Customize:
   - Allow Notifications
   - Sounds
   - Badges
   - Lock Screen visibility
   - Banner style

### Android Settings
1. Go to **Settings** → **Apps** → **Daily Bread** → **Notifications**
2. Select **"Therapy Session Reminders"** channel
3. Customize:
   - Importance level
   - Sound
   - Vibration
   - LED light
   - Lock screen visibility
   - Override Do Not Disturb

## Technical Implementation

### Context Setup

**`contexts/ScheduledSessionsContext.tsx`**

#### Notification Channel Setup
```typescript
const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('therapy-sessions', {
      name: 'Therapy Session Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
      lightColor: '#6366f1',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
      description: 'Reminders for your scheduled therapy sessions with sound and vibration',
    });
  }
};
```

#### Enhanced Notification Scheduling
```typescript
const notificationId = await Notifications.scheduleNotificationAsync({
  content: {
    title: '🧠 Therapy Session',
    body: "Time for your therapy session. Take a moment to check in with yourself and God.",
    sound: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
    vibrate: [0, 250, 250, 250],
    data: { 
      type: 'therapy_session',
      sessionId: sessionId,
    },
    // Android-specific
    ...(Platform.OS === 'android' && {
      channelId: 'therapy-sessions',
      sticky: false,
      autoDismiss: true,
    }),
    // iOS-specific
    ...(Platform.OS === 'ios' && {
      sound: 'default',
      badge: 1,
      categoryIdentifier: 'therapy_session',
    }),
  },
  trigger: {
    date: dateTime,
    channelId: Platform.OS === 'android' ? 'therapy-sessions' : undefined,
  },
});
```

### Root Layout Handler

**`app/_layout.tsx`**

Enhanced notification handler to prioritize therapy sessions:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isTherapySession = notification.request.content.data?.type === 'therapy_session';
    
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: isTherapySession ? true : false,
      shouldShowBanner: true,
      shouldShowList: true,
      priority: isTherapySession 
        ? Notifications.AndroidNotificationPriority.MAX 
        : Notifications.AndroidNotificationPriority.HIGH,
    };
  },
});
```

## Notification Content

**Title:** 🧠 Therapy Session

**Body:** Time for your therapy session. Take a moment to check in with yourself and God.

**Icon:** App icon (configured in app.json)

**Actions:** Tap to open app (default behavior)

## Platform-Specific Behavior

### iOS

**Characteristics:**
- Uses iOS notification sound system
- Badge number shows on app icon
- Notification appears in Notification Center
- Available as banner or alert style
- Respects iOS notification settings

**Sound:**
- Plays default notification sound
- Respects silent/vibrate mode based on iOS settings
- Can be customized by user in Settings

**Vibration:**
- Follows iOS haptic feedback patterns
- Respects vibration settings

### Android

**Characteristics:**
- Uses dedicated notification channel
- Appears as heads-up notification (MAX importance)
- LED light indicator (if device supports)
- Fully customizable through channel settings

**Sound:**
- Uses default notification ringtone
- Plays at notification volume level
- Can be changed to custom sound in channel settings

**Vibration:**
- Custom pattern: 250ms vibrate, 250ms pause, 250ms vibrate
- Can be disabled in channel settings

**LED:**
- Blinks in indigo color when device is idle
- Continues until notification is cleared
- Can be disabled in channel settings

### Web

**Behavior:**
- Notifications not supported (platform limitation)
- Sessions are still saved and viewable
- Users see message about web limitations

## Do Not Disturb (DND) Mode

**Configuration:** `bypassDnd: false`

Therapy session notifications **respect** Do Not Disturb mode by default:

- **When DND is ON:** Notification is delivered silently
- **When DND is OFF:** Full alarm-like behavior (sound + vibration)

**Why this approach?**
- Respects user's explicit intention for quiet time
- Prevents unwanted disruptions during meetings, sleep, etc.
- User can override in Android notification channel settings if desired

**To Allow During DND (Android only):**
1. Long-press on a therapy notification
2. Tap "All categories" or channel name
3. Select "Therapy Session Reminders"
4. Enable "Override Do Not Disturb"

## Testing Notifications

### Test Immediate Notification (Development)

To test notification behavior without waiting:

```typescript
// Schedule notification for 5 seconds from now
const testDate = new Date();
testDate.setSeconds(testDate.getSeconds() + 5);

await scheduleSession(
  testDate,
  '🧠 Test Session',
  'This is a test notification',
  'none'
);
```

### Test Scenarios

1. **Sound Test:**
   - Schedule notification 10 seconds ahead
   - Ensure device volume is up
   - Listen for notification sound

2. **Vibration Test:**
   - Schedule notification 10 seconds ahead
   - Hold device to feel vibration pattern
   - Should feel: vibrate → pause → vibrate

3. **Lock Screen Test:**
   - Schedule notification 10 seconds ahead
   - Lock device
   - Notification should appear on lock screen with full content

4. **Priority Test:**
   - Schedule notification 10 seconds ahead
   - Open another app
   - Notification should appear as heads-up/banner

5. **LED Test (Android with LED):**
   - Schedule notification 30 seconds ahead
   - Lock device and place face down
   - LED should blink in indigo color

## Troubleshooting

### No Sound Playing

**Check:**
1. Device volume is up
2. Notification volume is not muted (Android)
3. App has notification permission
4. Do Not Disturb is OFF
5. Silent mode is OFF (iOS)

**Fix:**
- iOS: Settings → Notifications → Daily Bread → Sounds → Enabled
- Android: Settings → Apps → Daily Bread → Notifications → Therapy Session Reminders → Sound → Select sound

### No Vibration

**Check:**
1. Device vibration is enabled
2. Vibration on ring/silent is enabled
3. Battery saver mode might disable vibration

**Fix:**
- iOS: Settings → Sounds & Haptics → Vibrate on Ring/Silent → ON
- Android: Settings → Sound → Vibration & haptics → ON

### Notification Not Appearing

**Check:**
1. App has notification permission
2. Notification channel is not disabled (Android)
3. App is not in battery optimization mode

**Fix:**
1. Grant notification permission when prompted
2. Android: Check notification channel settings
3. Disable battery optimization for Daily Bread

### Silent Notification

**Check:**
1. Do Not Disturb mode is active
2. Notification channel importance is reduced (Android)
3. App notification settings changed

**Fix:**
1. Disable DND mode
2. Reset notification channel to MAX importance
3. Restore default app notification settings

## Permissions

The app requests notification permissions when:
1. User enables daily devotional notifications
2. User schedules first therapy session

**Permission Flow:**
```
User schedules session
  → Check if permission granted
  → If not, request permission
  → If granted, schedule notification
  → If denied, save session without notification
```

**Permission Types:**
- **iOS:** Notification permission (includes sound, badge, alert)
- **Android:** Notification permission (POST_NOTIFICATIONS on Android 13+)

## Privacy & Security

**Data Stored in Notifications:**
- Session title: "🧠 Therapy Session"
- Generic reminder message
- No personal therapy content
- No sensitive information

**Lock Screen:**
- Notifications are set to PUBLIC visibility
- Users can change to PRIVATE or SECRET in device settings
- PRIVATE mode hides content on lock screen
- SECRET mode hides entire notification when locked

## Accessibility

**For Users with Hearing Impairments:**
- Vibration provides tactile feedback
- LED light provides visual feedback (Android)
- Lock screen display ensures visibility

**For Users with Visual Impairments:**
- Sound alert for audio feedback
- Vibration for tactile feedback
- Notification content is screen-reader accessible

**For Users in Quiet Environments:**
- Vibration-only option available through device settings
- Silent notification option through DND mode

## Battery Impact

**Optimization:**
- Notifications are scheduled, not actively running
- No background processes for notifications
- Minimal battery impact
- Channel setup runs once on app launch

**Best Practices:**
- Notifications use system-level APIs
- No custom alarm manager
- Respects device battery optimization
- Automatically cleaned up when cancelled

## Future Enhancements

Potential improvements for future versions:

1. **Custom Sounds:**
   - Allow users to select custom notification sounds
   - Peaceful/calming sound options
   - Upload custom audio files

2. **Snooze Functionality:**
   - Snooze notification for 5/10/15 minutes
   - Notification action buttons
   - Configurable snooze duration

3. **Escalating Alerts:**
   - Quiet alert initially
   - Louder if not dismissed
   - Repeating pattern option

4. **Smart Timing:**
   - Detect if user is active/idle
   - Adjust notification intensity
   - Machine learning for best timing

5. **Notification Actions:**
   - "Start Session" button
   - "Reschedule" button
   - "Mark Complete" button

6. **Integration with Device Features:**
   - Focus mode integration (iOS)
   - Adaptive notifications (Android 12+)
   - Conversation notifications style

## No Breaking Changes

✅ **All existing functionality preserved:**
- Daily devotional notifications unchanged
- Existing notification settings work as before
- No impact on other app features
- Backwards compatible with older sessions
- Settings page remains functional

**What Changed:**
- ✨ Enhanced therapy session notifications only
- ✨ Added notification channel (Android)
- ✨ Enhanced notification handler (root layout)
- ✨ Improved notification priority and visibility

**What Stayed the Same:**
- Daily devotional notification system
- User notification preferences
- Permission request flow
- Notification enable/disable toggles
- All other app functionality

## Summary

Therapy session reminders are now **significantly more noticeable** with:

✅ **Loud notification sound**  
✅ **Custom vibration pattern**  
✅ **Maximum priority display**  
✅ **LED light indicator (Android)**  
✅ **Lock screen visibility**  
✅ **Dedicated notification channel (Android)**  
✅ **Badge on app icon (iOS)**  

The notifications behave like alarms while still respecting:
- ✅ User's Do Not Disturb settings
- ✅ Device notification preferences
- ✅ Platform-specific behaviors
- ✅ Battery optimization
- ✅ User privacy

Users will **not miss** their scheduled therapy sessions! 🔔📳🎵
