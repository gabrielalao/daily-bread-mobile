# Subscription Implementation Plan
**Daily Bread Mobile - iOS & Android**

**Created:** January 30, 2026  
**Estimated Duration:** 2-3 weeks  
**Target Launch:** February 21, 2026

---

## 📋 Executive Summary

### What We're Building
- 7-day free trial system (auto-starts on first launch)
- Two subscription tiers: Monthly ($1.99) and Annual ($9.99)
- Cross-platform implementation (iOS + Android, same code)
- RevenueCat integration for subscription management
- Trial countdown banner and paywall UI

### Success Criteria
✅ Trial starts automatically on first app launch  
✅ Users see countdown banner during trial  
✅ Paywall appears after 7 days  
✅ Users can purchase subscriptions on both platforms  
✅ Subscriptions sync across devices  
✅ Family Sharing works (iOS)  
✅ App passes App Store and Play Store review  

---

## 🎯 Prerequisites

### Before We Start

#### 1. Development Environment
- [ ] Expo CLI installed and working
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Expo account with EAS Build access
- [ ] iOS development: Xcode installed (Mac only)
- [ ] Android development: Android Studio installed (optional but helpful)

#### 2. App Store Accounts
- [ ] **Apple Developer Account** ($99/year)
  - Enrolled in Apple Developer Program
  - Access to App Store Connect
  - Access to Certificates, Identifiers & Profiles
  
- [ ] **Google Play Console** ($25 one-time)
  - Developer account activated
  - Access to Play Console
  - Payment profile set up

#### 3. Financial Setup
- [ ] **App Store Connect - Paid Apps Agreement**
  - Agreement signed
  - Tax forms completed (W-8BEN or W-9)
  - Banking information added
  - Status: "Active" (not "Pending")
  - ⚠️ **CRITICAL:** This takes 24-48 hours - start NOW

- [ ] **Google Play - Merchant Account**
  - Google merchant account linked
  - Banking information added
  - Tax information completed

#### 4. RevenueCat Account
- [ ] Sign up at [revenuecat.com](https://www.revenuecat.com)
- [ ] Create project: "Daily Bread"
- [ ] Free tier is sufficient to start
- [ ] Get iOS API key
- [ ] Get Android API key

### Verification Checklist

Run these commands to verify your environment:

```bash
# Check Expo CLI
expo --version
# Should show: 11.x.x or higher

# Check EAS CLI
eas --version
# Should show: 7.x.x or higher

# Check Node.js
node --version
# Should show: v20.x.x or higher

# Check if logged into Expo
eas whoami
# Should show your Expo username

# Verify you can build
eas build:configure
# Should create/update eas.json
```

---

## 📅 Implementation Timeline

### Phase 1: Setup & Configuration (Week 1: Days 1-2)
**Goal:** Development environment ready, accounts configured

### Phase 2: Code Implementation (Week 1-2: Days 3-7)
**Goal:** All subscription code written and integrated

### Phase 3: Testing (Week 2: Days 8-11)
**Goal:** Verified working on both platforms

### Phase 4: Store Configuration (Week 2-3: Days 12-14)
**Goal:** Products created in App Store Connect and Play Console

### Phase 5: Submission & Launch (Week 3: Days 15-21)
**Goal:** Apps approved and live with subscriptions

---

## Phase 1: Setup & Configuration
**Duration:** 2 days  
**Status:** Not Started

### Day 1: Financial & Account Setup

#### Morning (2-3 hours)

**Task 1.1: App Store Connect - Paid Apps Agreement** ⚠️ CRITICAL
- [ ] Log into [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Navigate to: Account Holder Name → Agreements, Tax, and Banking
- [ ] Find "Paid Applications Agreement"
- [ ] Click "View" if status is "Action Required"
- [ ] Read and accept the agreement
- [ ] Complete required forms:
  - [ ] Tax Information (W-8BEN for non-US, W-9 for US)
  - [ ] Banking Information (for receiving payments)
- [ ] Submit and wait for "Active" status (24-48 hours)

**⏰ Wait Time:** This approval takes 24-48 hours. Start this FIRST!

**Task 1.2: Google Play - Merchant Account**
- [ ] Log into [Google Play Console](https://play.google.com/console)
- [ ] Navigate to: Setup → Payments profile
- [ ] Link or create Google merchant account
- [ ] Add banking information
- [ ] Complete tax information
- [ ] Verify status is "Active"

#### Afternoon (2-3 hours)

**Task 1.3: RevenueCat Setup**
- [ ] Sign up at [revenuecat.com](https://www.revenuecat.com)
- [ ] Create new project: "Daily Bread"
- [ ] In RevenueCat Dashboard:
  - [ ] Navigate to Projects → Daily Bread
  - [ ] Click "iOS" → Get API key → Copy `appl_xxxxx`
  - [ ] Click "Android" → Get API key → Copy `goog_xxxxx`
  - [ ] Save these keys (we'll use them tomorrow)

**Task 1.4: Create Environment Variables**
- [ ] Create `.env` file in project root
- [ ] Add RevenueCat keys:
  ```bash
  EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_your_key_here
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_your_key_here
  ```
- [ ] Verify `.env` is in `.gitignore` (security!)

**Deliverables:**
- ✅ Paid Apps Agreement submitted (waiting for approval)
- ✅ Google merchant account active
- ✅ RevenueCat account created with API keys
- ✅ Environment variables configured

---

### Day 2: Development Environment Setup

#### Morning (2-3 hours)

**Task 2.1: Install Dependencies**
```bash
# Navigate to project
cd /Users/gabbysoftwarepro/Documents/daily-bread-mobile

# Install RevenueCat SDK
npm install react-native-purchases

# Install any missing dependencies
npm install
```

**Task 2.2: Update Configuration Files**

Update `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-purchases",
        {
          "iOSUsesStoreKit2IfAvailable": true
        }
      ]
    ]
  }
}
```

Update `.gitignore` (ensure these are present):
```
.env
.env.*
*.env.local
```

**Task 2.3: Configure EAS Build**

Update `eas.json` to ensure it has development profile:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store",
      "autoIncrement": true
    }
  }
}
```

#### Afternoon (2-3 hours)

**Task 2.4: Create Custom Development Build**

⚠️ **Important:** Expo Go does NOT support in-app purchases. You MUST create a custom development build.

```bash
# Configure EAS if not done
eas build:configure

# Build for iOS (development)
eas build --profile development --platform ios

# Build for Android (development)
eas build --profile development --platform android
```

⏰ **Wait Time:** Builds take 15-30 minutes each. You can run both in parallel.

**Task 2.5: Install Development Builds on Devices**

**For iOS:**
```bash
# After build completes, install on device
eas build:run --profile development --platform ios

# Or scan QR code from build page to install via TestFlight
```

**For Android:**
```bash
# After build completes, install on device
eas build:run --profile development --platform android

# Or download APK and install manually
```

**Task 2.6: Verify Development Build Works**
- [ ] Open app on iOS device
- [ ] Verify app launches without errors
- [ ] Open app on Android device
- [ ] Verify app launches without errors

**Deliverables:**
- ✅ Dependencies installed
- ✅ Configuration files updated
- ✅ Custom development builds created for iOS & Android
- ✅ Development builds installed on test devices
- ✅ App running successfully on both platforms

**End of Phase 1 Checkpoint:**
- Development environment is fully set up
- Ready to write subscription code
- Waiting for Paid Apps Agreement approval (continues in background)

---

## Phase 2: Code Implementation
**Duration:** 5 days  
**Status:** Not Started

### Day 3: Core Subscription Logic

#### Morning (3-4 hours)

**Task 3.1: Create Constants File**

File: `constants/subscriptions.ts`

```typescript
// Product IDs - MUST match App Store Connect & Play Console
export const SUBSCRIPTION_PRODUCTS = {
  MONTHLY: 'monthly_30',
  ANNUAL: 'yearly_365',
} as const;

export const SUBSCRIPTION_CONFIG = {
  TRIAL_DAYS: 7,
  MONTHLY_PRICE: '$1.99',
  ANNUAL_PRICE: '$9.99',
  ANNUAL_MONTHLY_EQUIVALENT: '$0.83',
  
  // Regional restrictions (from macOS app)
  PAID_REGIONS: [
    'US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 
    'AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'TW', 
    'BR', 'MX', 'IN'
  ],
} as const;

export type SubscriptionProduct = typeof SUBSCRIPTION_PRODUCTS[keyof typeof SUBSCRIPTION_PRODUCTS];
```

- [ ] Create file
- [ ] Copy code from implementation guide
- [ ] Verify no TypeScript errors

**Task 3.2: Create Trial Context**

File: `contexts/TrialContext.tsx`

This is a direct port of your macOS `TrialManager.swift`. 

Key features:
- Saves first launch date to AsyncStorage
- Calculates days/hours remaining
- Updates every hour
- Provides trial status to entire app

- [ ] Create file
- [ ] Copy code from implementation guide (see full code in guide)
- [ ] Test imports work
- [ ] Verify TypeScript compiles

#### Afternoon (3-4 hours)

**Task 3.3: Create Subscription Context**

File: `contexts/SubscriptionContext.tsx`

This integrates RevenueCat SDK:
- Initializes RevenueCat on app start
- Loads available subscription offerings
- Handles purchase flow
- Handles restore purchases
- Tracks subscription status

- [ ] Create file
- [ ] Copy code from implementation guide
- [ ] Replace API keys with environment variables
- [ ] Test RevenueCat initialization (check console logs)

**Task 3.4: Test Contexts in Isolation**

Create temporary test screen:

File: `app/test-subscription.tsx`

```typescript
import { View, Text, Button } from 'react-native';
import { useTrial } from '@/contexts/TrialContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function TestScreen() {
  const trial = useTrial();
  const subscription = useSubscription();

  return (
    <View style={{ padding: 20 }}>
      <Text>Trial Status: {trial.trialStatus.status}</Text>
      <Text>Days Remaining: {trial.daysRemaining}</Text>
      <Text>Is Subscribed: {subscription.isSubscribed ? 'Yes' : 'No'}</Text>
      
      <Button title="Reset Trial (Debug)" onPress={trial.resetTrial} />
      
      <Text>Offerings: {subscription.offerings ? 'Loaded' : 'Loading...'}</Text>
    </View>
  );
}
```

- [ ] Create test screen
- [ ] Navigate to test screen in app
- [ ] Verify trial data shows correctly
- [ ] Verify RevenueCat offerings load (may be empty - that's OK for now)
- [ ] Test reset trial button (debug mode)

**Deliverables:**
- ✅ Constants file created
- ✅ TrialContext working and tracking trial
- ✅ SubscriptionContext working and loading RevenueCat
- ✅ Basic functionality verified

---

### Day 4: UI Components - Part 1

#### Morning (3-4 hours)

**Task 4.1: Create Trial Banner Component**

File: `components/TrialBanner.tsx`

Features:
- Shows "🎁 Free Trial: X days remaining"
- Changes to warning on last day (⏰ red/orange)
- Clickable to open paywall
- Auto-hides when subscribed

- [ ] Create file
- [ ] Copy code from implementation guide
- [ ] Adjust colors to match app theme (use existing colors.ts)
- [ ] Test in isolation (import into test screen)

**Task 4.2: Test Trial Banner**

Add to test screen:
```typescript
import { TrialBanner } from '@/components/TrialBanner';

export default function TestScreen() {
  return (
    <View>
      <TrialBanner />
      {/* rest of test content */}
    </View>
  );
}
```

- [ ] Verify banner shows during trial
- [ ] Test clicking banner (should log navigation intent)
- [ ] Verify banner hides when "subscribed" (mock this)

#### Afternoon (3-4 hours)

**Task 4.3: Integrate Trial Banner into App**

Update `app/(tabs)/_layout.tsx`:

```typescript
import { View } from 'react-native';
import { TrialBanner } from '@/components/TrialBanner';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <TrialBanner />
      <Tabs>
        {/* existing tabs */}
      </Tabs>
    </View>
  );
}
```

- [ ] Add TrialBanner above tabs
- [ ] Test on iOS device - banner should appear at top
- [ ] Test on Android device - banner should appear at top
- [ ] Verify banner doesn't interfere with tab navigation

**Task 4.4: Add Providers to App Root**

Update `app/_layout.tsx`:

```typescript
import { TrialProvider } from '@/contexts/TrialContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <ScheduledSessionsProvider>
            <ContentProvider>
              {/* NEW: Add subscription providers */}
              <SubscriptionProvider>
                <TrialProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <RootLayoutNav />
                  </GestureHandlerRootView>
                </TrialProvider>
              </SubscriptionProvider>
            </ContentProvider>
          </ScheduledSessionsProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

- [ ] Add providers
- [ ] Reload app
- [ ] Verify no errors in console
- [ ] Verify trial banner still works

**Deliverables:**
- ✅ Trial banner component created
- ✅ Banner integrated into app navigation
- ✅ Providers added to app root
- ✅ Trial tracking working throughout app

---

### Day 5: UI Components - Part 2

#### Morning (4-5 hours)

**Task 5.1: Create Paywall Screen**

File: `app/paywall.tsx`

This is your main subscription screen. Features:
- Full-screen modal with gradient background
- Feature list (Daily Devotionals, Bible, AI Therapy, etc.)
- Two subscription options (Monthly/Annual)
- Radio button selection
- Subscribe button
- Restore purchases button
- Terms & Privacy links

- [ ] Create file
- [ ] Copy code from implementation guide
- [ ] Adjust colors to match app (teal #2A9D8F, etc.)
- [ ] Adjust feature list to match your app's features
- [ ] Verify all imports work

**Task 5.2: Test Paywall Navigation**

Update trial banner to navigate to paywall:
```typescript
// In TrialBanner.tsx - already in code
onPress={() => router.push('/paywall')}
```

- [ ] Click trial banner
- [ ] Verify paywall opens
- [ ] Verify paywall UI looks good on iPhone
- [ ] Verify paywall UI looks good on Android
- [ ] Test on different screen sizes

#### Afternoon (2-3 hours)

**Task 5.3: Wire Up Paywall Functionality**

Test paywall buttons:
- [ ] Select Monthly plan - radio button updates
- [ ] Select Annual plan - radio button updates
- [ ] Click Subscribe - triggers purchase (will fail - no products yet)
- [ ] Click Restore - triggers restore (will fail - no purchases yet)
- [ ] Click Terms - navigates to terms page
- [ ] Click Privacy - navigates to privacy page

Expected behavior at this point:
- ✅ UI works perfectly
- ❌ Purchases fail (no products configured yet - that's EXPECTED)
- ✅ Error handling shows appropriate messages

**Task 5.4: Add Paywall Auto-Open on Trial Expiry**

Update `app/(tabs)/_layout.tsx`:

```typescript
import { useTrial } from '@/contexts/TrialContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
  const { isTrialExpired } = useTrial();
  const { isSubscribed } = useSubscription();
  const router = useRouter();

  // Auto-open paywall when trial expires
  useEffect(() => {
    if (isTrialExpired && !isSubscribed) {
      router.push('/paywall');
    }
  }, [isTrialExpired, isSubscribed]);

  return (
    <View style={{ flex: 1 }}>
      <TrialBanner />
      <Tabs>
        {/* tabs */}
      </Tabs>
    </View>
  );
}
```

- [ ] Add auto-navigation logic
- [ ] Test by shortening trial duration (set to 1 minute)
- [ ] Verify paywall opens automatically when trial expires

**Deliverables:**
- ✅ Paywall screen created with beautiful UI
- ✅ All navigation working
- ✅ Paywall auto-opens when trial expires
- ✅ All buttons wired up (purchases will fail until products configured)

---

### Day 6: Testing & Polish

#### Morning (3-4 hours)

**Task 6.1: Create Debug Testing Setup**

For faster testing, temporarily shorten trial duration:

File: `contexts/TrialContext.tsx`
```typescript
// TEMPORARY - For testing only
// Change from:
const TRIAL_DURATION_MS = SUBSCRIPTION_CONFIG.TRIAL_DAYS * 24 * 60 * 60 * 1000;

// To (1 minute trial):
const TRIAL_DURATION_MS = 60 * 1000; // 1 minute

// Or (5 minute trial):
const TRIAL_DURATION_MS = 5 * 60 * 1000; // 5 minutes
```

- [ ] Shorten trial duration
- [ ] Uninstall app from device
- [ ] Reinstall app
- [ ] Wait for trial to expire (1-5 minutes)
- [ ] Verify paywall appears automatically
- [ ] **IMPORTANT:** Change duration back to 7 days after testing!

**Task 6.2: Test Complete User Flow**

Trial Start Flow:
- [ ] Fresh install (uninstall/reinstall)
- [ ] App opens
- [ ] Trial banner shows "7 days remaining"
- [ ] All features accessible
- [ ] Navigate through all tabs

Trial Warning Flow:
- [ ] Mock last day (or wait for short trial)
- [ ] Banner changes color to red/orange
- [ ] Shows "Last day!" message
- [ ] Still full access

Trial Expiry Flow:
- [ ] Trial expires
- [ ] Paywall appears automatically
- [ ] Cannot dismiss paywall without subscribing
- [ ] Content visible but blurred behind paywall

#### Afternoon (3-4 hours)

**Task 6.3: Polish UI/UX**

Review and refine:
- [ ] Trial banner fits well on all screen sizes
- [ ] Paywall looks good on small phones (iPhone SE)
- [ ] Paywall looks good on large phones (iPhone Pro Max)
- [ ] Paywall looks good on Android (different aspect ratios)
- [ ] Colors match app theme
- [ ] Fonts consistent with app
- [ ] Icons render correctly
- [ ] Animations smooth

**Task 6.4: Add Loading States**

Enhance user experience:
- [ ] Subscription loading spinner (already in code)
- [ ] Purchase in progress - disable buttons
- [ ] Success message after purchase
- [ ] Error handling with user-friendly messages

**Task 6.5: Code Review & Cleanup**

- [ ] Remove test screen (`app/test-subscription.tsx`)
- [ ] Remove debug console.logs (or make conditional on `__DEV__`)
- [ ] Remove commented code
- [ ] Verify all TypeScript types are correct
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors

**Task 6.6: Reset Trial Duration**

⚠️ **CRITICAL:** Change trial back to 7 days!

File: `contexts/TrialContext.tsx`
```typescript
// PRODUCTION - Must be 7 days
const TRIAL_DURATION_MS = SUBSCRIPTION_CONFIG.TRIAL_DAYS * 24 * 60 * 60 * 1000;
```

- [ ] Verify trial is 7 days
- [ ] Commit this change

**Deliverables:**
- ✅ Complete user flow tested
- ✅ UI polished and responsive
- ✅ Code cleaned up
- ✅ Trial duration set to 7 days
- ✅ Ready for production builds

---

### Day 7: Build & Prepare for Submission

#### Morning (2-3 hours)

**Task 7.1: Update Version Numbers**

File: `app.json`
```json
{
  "expo": {
    "version": "6.0.2",  // Increment from 6.0.1
    "ios": {
      "buildNumber": "9"  // Increment from 8
    },
    "android": {
      "versionCode": 9  // Increment from 8
    }
  }
}
```

- [ ] Increment version number
- [ ] Increment build numbers (iOS & Android)

**Task 7.2: Create Production Builds**

```bash
# Build iOS production
eas build --platform ios --profile production

# Build Android production
eas build --platform android --profile production

# Both can run in parallel
```

⏰ **Wait Time:** 20-40 minutes per platform

- [ ] Start iOS build
- [ ] Start Android build
- [ ] Monitor build progress in terminal
- [ ] Wait for both builds to complete

**Task 7.3: Verify Build Success**

iOS:
- [ ] Build completes successfully
- [ ] Check App Store Connect → TestFlight
- [ ] New build appears (wait 10-30 min for processing)
- [ ] Status: "Ready to Test"

Android:
- [ ] Build completes successfully
- [ ] APK/AAB downloadable from EAS

#### Afternoon (2-3 hours)

**Task 7.4: Internal Testing (Quick Smoke Test)**

iOS:
- [ ] Install via TestFlight
- [ ] Open app
- [ ] Verify trial starts
- [ ] Verify banner shows
- [ ] Click banner → paywall opens
- [ ] Try to purchase (will fail - no products yet)

Android:
- [ ] Install APK on device
- [ ] Open app
- [ ] Verify trial starts
- [ ] Verify banner shows
- [ ] Click banner → paywall opens

**Task 7.5: Document Any Issues**

If you find bugs:
- [ ] Create list of issues
- [ ] Prioritize: Critical / High / Medium / Low
- [ ] Fix critical issues
- [ ] Rebuild if needed

**Deliverables:**
- ✅ Version numbers updated
- ✅ Production builds created for iOS & Android
- ✅ Builds uploaded to App Store Connect and Play Console
- ✅ Basic smoke testing passed
- ✅ Ready for store configuration

**End of Phase 2 Checkpoint:**
- All subscription code is written and working
- Production builds are created
- Ready to configure store products

---

## Phase 3: Store Configuration (iOS)
**Duration:** 2 days  
**Status:** Not Started

### Day 8: iOS - App Store Connect Setup

#### Morning (2-3 hours)

**Task 8.1: Verify Paid Apps Agreement Status** ⚠️

- [ ] Log into App Store Connect
- [ ] Navigate to: Agreements, Tax, and Banking
- [ ] Verify "Paid Applications Agreement" status is **"Active"**
- [ ] If still "Pending": WAIT. Cannot proceed until active.

**Task 8.2: Create Subscription Group**

- [ ] App Store Connect → Your App → Subscriptions
- [ ] Click "+" (Create Subscription Group)
- [ ] Reference Name: `Premium Access`
- [ ] Click "Create"

**Task 8.3: Create Monthly Subscription**

Inside the subscription group:

1. Click "+" (Create Subscription)
2. Fill in details:
   - **Product ID:** `monthly_30` ⚠️ MUST BE EXACT
   - **Reference Name:** `Monthly Premium`
   - **Subscription Duration:** `1 month`
3. Click "Create"

4. Configure Pricing:
   - Click "Add Pricing"
   - Country: United States
   - Price: `$1.99`
   - Click "Equalize Worldwide" (auto-calculates other countries)
   - Click "Next" → "Create"

5. Add Localization:
   - Click "Add Localization"
   - Language: English (U.S.)
   - Display Name: `Monthly Premium`
   - Description: `Premium access to all features with monthly billing. Includes 7-day free trial.`
   - Click "Save"

6. Add Free Trial:
   - Scroll to "Introductory Offers"
   - Click "+"
   - Type: **Free**
   - Duration: **7 days** (select "1 Week")
   - Click "Save"

7. Enable Family Sharing:
   - Scroll to "Family Sharing"
   - Toggle **ON**: "Share Purchases with Family"
   - Click "Save"

8. Verify Status:
   - Status should show: **"Ready to Submit"**

- [ ] Product ID is `monthly_30`
- [ ] Price is $1.99
- [ ] 7-day free trial configured
- [ ] Family Sharing enabled
- [ ] Status: "Ready to Submit"

#### Afternoon (2-3 hours)

**Task 8.4: Create Annual Subscription**

Repeat above steps with these changes:

- **Product ID:** `yearly_365` ⚠️ MUST BE EXACT
- **Reference Name:** `Annual Premium`
- **Subscription Duration:** `1 year`
- **Price:** `$9.99`
- **Display Name:** `Annual Premium`
- **Description:** `Premium access to all features with annual billing. Best value - only $0.83/month! Includes 7-day free trial.`
- **Free Trial:** 7 days
- **Family Sharing:** ON

- [ ] Product ID is `yearly_365`
- [ ] Price is $9.99
- [ ] 7-day free trial configured
- [ ] Family Sharing enabled
- [ ] Status: "Ready to Submit"

**Task 8.5: Link Subscriptions to App Version** ⚠️ CRITICAL

This is the #1 reason for rejections!

1. App Store Connect → App Store → [Your Version] (e.g., 6.0.2)
2. Scroll down to: **"In-App Purchases and Subscriptions"**
3. Click the **"+"** button
4. Select both subscriptions:
   - ✅ Monthly Premium (monthly_30)
   - ✅ Annual Premium (yearly_365)
5. Click "Done"
6. Verify both appear in the list
7. Click **"Save"** (top right)

- [ ] Both subscriptions listed under version
- [ ] Changes saved

**Task 8.6: Select Production Build**

Still on version page:

1. Scroll to: **"Build"** section (near top)
2. Click: "Select a build before you submit your app"
3. Select your latest build (Build 9)
4. Click "Done"
5. Verify build is selected
6. Click **"Save"**

- [ ] Production build selected
- [ ] Build shows correct version (6.0.2, Build 9)

**Deliverables:**
- ✅ Paid Apps Agreement is Active
- ✅ Subscription group created
- ✅ Monthly subscription (monthly_30) configured
- ✅ Annual subscription (yearly_365) configured
- ✅ Both subscriptions linked to app version
- ✅ Production build selected
- ✅ Ready to submit iOS app

---

### Day 9: iOS Testing & Android Setup

#### Morning (3-4 hours)

**Task 9.1: iOS - Create Sandbox Tester**

- [ ] App Store Connect → Users and Access → Sandbox Testers
- [ ] Click "+" (Add Tester)
- [ ] Fill in:
  - First Name: Test
  - Last Name: User
  - Email: `test.dailybread@yourdomain.com` (must be unique, not real)
  - Password: (create secure password - SAVE IT)
  - Country: United States
- [ ] Click "Save"

**Task 9.2: iOS - Test Subscription Purchase**

⚠️ **Important:** Sign out of production Apple ID first!

On iPhone:
1. Settings → Apple ID → Sign Out (completely)
2. Delete Daily Bread app
3. Open TestFlight
4. Install latest build
5. Open app
6. Trial starts - banner shows
7. Click banner → Paywall opens
8. Select Annual plan
9. Click "Subscribe Now"
10. When prompted to sign in:
    - Use sandbox tester email
    - Enter sandbox password
11. Approve purchase (Touch ID/Face ID)
12. **Purchase completes - NO CHARGE** (sandbox)
13. Verify paywall dismisses
14. Verify banner disappears
15. Verify full access granted

Test Results:
- [ ] Products loaded successfully
- [ ] Purchase flow completed
- [ ] No errors
- [ ] Subscription detected as active
- [ ] Access granted

**If Purchase Fails:**
- Products don't load: Wait 2-4 hours (Apple propagation time)
- Wrong products: Verify product IDs match exactly
- Purchase error: Check sandbox tester is valid

#### Afternoon (3-4 hours)

**Task 9.3: Configure RevenueCat Products (Both Platforms)**

Now that App Store Connect products exist, configure RevenueCat:

1. Log into [RevenueCat Dashboard](https://app.revenuecat.com)
2. Go to: Projects → Daily Bread
3. Click: **Products** (left sidebar)
4. Click: **"+ New"**

**Add iOS Products:**
- [ ] Product ID: `monthly_30`
  - Platform: iOS
  - Product Type: Auto-renewable subscription
  - Store Product ID: `monthly_30`
  - Click "Save"

- [ ] Product ID: `yearly_365`
  - Platform: iOS
  - Product Type: Auto-renewable subscription
  - Store Product ID: `yearly_365`
  - Click "Save"

5. Click: **Entitlements** (left sidebar)
6. Click: **"+ New"**
7. Entitlement ID: `pro`
8. Attach products:
   - ✅ monthly_30
   - ✅ yearly_365
9. Click "Save"

- [ ] iOS products added to RevenueCat
- [ ] Entitlement "pro" created
- [ ] Products linked to entitlement

**Task 9.4: Android - Google Play Console Setup**

Now we configure Android subscriptions:

1. Log into [Google Play Console](https://play.google.com/console)
2. Select: Daily Bread app
3. Navigate to: **Monetize → Subscriptions**
4. Click: **"Create subscription"**

**Create Monthly Subscription:**
- Subscription ID: `monthly_30` ⚠️ MUST BE EXACT
- Name: `Monthly Premium`
- Description: `Premium access to all features with monthly billing`
- Click "Continue"

5. Click: **"Add base plan"**
   - Base plan ID: `monthly`
   - Billing period: `1 month (P1M)`
   - Price: `$1.99 USD`
   - Click "Equalize prices" (auto-calculates other countries)
   - Click "Save"

6. Click: **"Add offer"** (Free Trial)
   - Offer ID: `trial`
   - Eligibility: New customers only
   - Phases:
     - Phase 1: Free for 7 days
     - Phase 2: $1.99/month (recurring)
   - Click "Save"

7. Click: **"Activate"**

- [ ] Subscription ID is `monthly_30`
- [ ] Base plan created
- [ ] 7-day free trial configured
- [ ] Status: Active

**Create Annual Subscription:**

Repeat with:
- Subscription ID: `yearly_365`
- Name: `Annual Premium`
- Base plan ID: `yearly`
- Billing period: `1 year (P1Y)`
- Price: `$9.99 USD`
- 7-day free trial

- [ ] Subscription ID is `yearly_365`
- [ ] Base plan created
- [ ] 7-day free trial configured
- [ ] Status: Active

**Task 9.5: Add Android Products to RevenueCat**

Back in RevenueCat Dashboard:

1. Products → "+ New"
2. Add Android products:
   - [ ] Product ID: `monthly_30`
     - Platform: Android
     - Store Product ID: `monthly_30`
   - [ ] Product ID: `yearly_365`
     - Platform: Android
     - Store Product ID: `yearly_365`
3. Link to "pro" entitlement (already done)

- [ ] Android products added to RevenueCat
- [ ] Products linked to "pro" entitlement

**Deliverables:**
- ✅ iOS subscriptions tested successfully
- ✅ Android subscriptions configured in Play Console
- ✅ RevenueCat configured for both platforms
- ✅ Ready for Android testing

---

## Phase 4: Android Testing & Submission
**Duration:** 2 days  
**Status:** Not Started

### Day 10: Android Testing

#### Morning (2-3 hours)

**Task 10.1: Set Up License Testers**

- [ ] Google Play Console → Setup → License testing
- [ ] Add Gmail addresses (your test accounts)
- [ ] Click "Save"

**Task 10.2: Create Internal Testing Track**

- [ ] Play Console → Testing → Internal testing
- [ ] Click "Create new release"
- [ ] Upload your AAB (from EAS build)
- [ ] Release name: `6.0.2 (9) - Subscription Implementation`
- [ ] Release notes:
  ```
  - Added 7-day free trial
  - Added subscription plans (Monthly & Annual)
  - New trial countdown banner
  - New subscription management screen
  ```
- [ ] Click "Save"
- [ ] Click "Review release"
- [ ] Click "Start rollout to Internal testing"

**Task 10.3: Add Testers to Internal Testing**

- [ ] Internal testing → Testers tab
- [ ] Click "Create email list"
- [ ] Name: `Daily Bread Testers`
- [ ] Add email addresses (must be Gmail)
- [ ] Save

**Task 10.4: Wait for Internal Testing Link**

⏰ **Wait Time:** 5-15 minutes

- [ ] Check email for "Your app is ready to test"
- [ ] Get testing link from email or Play Console

#### Afternoon (2-3 hours)

**Task 10.5: Test on Android Device**

On Android phone/tablet:

1. Open internal testing link in email
2. Click "Download it on Google Play"
3. Install app
4. Open app
5. Trial starts - banner shows
6. Navigate app - verify everything works
7. Click banner → Paywall opens
8. Select Annual plan
9. Click "Subscribe Now"
10. Sign in with license tester Gmail
11. Complete purchase
12. **Purchase completes - NO CHARGE** (test account)
13. Verify paywall dismisses
14. Verify banner disappears
15. Verify subscription active

Test Results:
- [ ] Products loaded successfully
- [ ] Purchase flow completed
- [ ] No errors
- [ ] Subscription detected as active
- [ ] Access granted

**If Issues Found:**
- [ ] Document bugs
- [ ] Fix critical issues
- [ ] Create new build
- [ ] Upload to internal testing
- [ ] Retest

**Task 10.6: Test Restore Purchases**

1. Uninstall app
2. Reinstall app
3. Open app (trial starts again)
4. Trial expires (or click banner immediately)
5. Paywall appears
6. Click "Restore Purchases"
7. Sign in with same Gmail
8. Verify subscription restored
9. Verify access granted

- [ ] Restore purchases works
- [ ] Subscription status syncs correctly

**Deliverables:**
- ✅ Internal testing track created
- ✅ Android subscriptions tested successfully
- ✅ Restore purchases working
- ✅ All critical bugs fixed

---

### Day 11: Prepare Submissions

#### Morning (2-3 hours)

**Task 11.1: Final Code Review**

- [ ] Review all subscription code
- [ ] Verify no debug code remaining
- [ ] Verify trial duration is 7 days (not shortened)
- [ ] Verify no console.logs in production code
- [ ] Verify API keys from environment variables
- [ ] Run linter: `npm run lint` - fix all errors
- [ ] Verify TypeScript: `npm run type-check` (if you have this)

**Task 11.2: Final Testing Checklist**

Test both platforms one more time:

iOS:
- [ ] Fresh install (TestFlight)
- [ ] Trial starts automatically
- [ ] Banner shows correctly
- [ ] Navigate all tabs
- [ ] Purchase monthly subscription (sandbox)
- [ ] Verify access granted
- [ ] Uninstall/reinstall
- [ ] Restore purchases works

Android:
- [ ] Fresh install (Internal Testing)
- [ ] Trial starts automatically
- [ ] Banner shows correctly
- [ ] Navigate all tabs
- [ ] Purchase annual subscription (license tester)
- [ ] Verify access granted
- [ ] Uninstall/reinstall
- [ ] Restore purchases works

**Task 11.3: Update App Store Metadata (Optional but Recommended)**

**iOS - App Store Connect:**

Update app description to mention subscriptions:

```
🎁 7-DAY FREE TRIAL
Try all premium features free for 7 days when you first download the app.
No credit card required to start your trial.

💰 AFFORDABLE PRICING
After your free trial:
• Monthly: $1.99/month
• Annual: $9.99/year (Save 58%!)
Cancel anytime. No commitments.

👨‍👩‍👧‍👦 FAMILY SHARING INCLUDED
One subscription covers up to 6 family members at no extra cost.

✨ PREMIUM FEATURES:
• 365 daily devotionals with audio
• Complete Bible (KJV + multiple translations)
• AI-powered faith-based counseling
• 80+ worship songs and playlists
• Personalized prayer guidance
• Interactive Bible study plans
• Bookmarks and highlights
• Offline access to all content
```

**Android - Play Console:**

Update store listing similarly.

- [ ] iOS description updated (optional)
- [ ] Android description updated (optional)

#### Afternoon (2-3 hours)

**Task 11.4: Create Submission Documentation**

Create file: `SUBMISSION_NOTES.md`

```markdown
# Submission Notes - Version 6.0.2

## What's New
- Implemented 7-day free trial system
- Added subscription plans: Monthly ($1.99) and Annual ($9.99)
- Added trial countdown banner
- Added subscription paywall screen
- Family Sharing enabled (iOS)

## In-App Purchases
- Product ID: monthly_30 ($1.99/month)
- Product ID: yearly_365 ($9.99/year)
- Both include 7-day free trial
- Family Sharing enabled

## Testing Notes for Reviewers
1. Free trial starts automatically on first launch
2. Trial banner appears showing days remaining
3. After 7 days, subscription paywall appears
4. Users can subscribe or restore previous purchases
5. All features accessible during trial and after subscription

## Technical Details
- RevenueCat SDK for subscription management
- StoreKit 2 (iOS) and Play Billing Library (Android)
- Trial tracked locally via AsyncStorage
- Subscriptions validated server-side via RevenueCat

## Review Credentials
N/A - Trial functionality is automatic

## Additional Notes
Subscriptions are only required in specific regions (US, CA, GB, DE, FR, IT, ES, AU, NZ, JP, KR, SG, HK, TW, BR, MX, IN). Other regions have free access.
```

- [ ] Create submission notes
- [ ] Save to project root

**Task 11.5: Git Commit**

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: implement subscription system with 7-day free trial

- Add RevenueCat integration for iOS and Android
- Implement 7-day trial tracking with AsyncStorage
- Create trial countdown banner component
- Create subscription paywall screen
- Configure monthly ($1.99) and annual ($9.99) plans
- Add family sharing support (iOS)
- Update app to version 6.0.2, build 9

Products:
- monthly_30: $1.99/month with 7-day trial
- yearly_365: $9.99/year with 7-day trial

Tested on:
- iOS: iPhone 13 Pro (iOS 17.2) via TestFlight
- Android: Pixel 6 (Android 13) via Internal Testing"

# Push to repository
git push origin main
```

- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] Clean working tree

**Deliverables:**
- ✅ Final code review complete
- ✅ All platforms tested and working
- ✅ Submission notes created
- ✅ Code committed and pushed
- ✅ Ready to submit to stores

---

## Phase 5: Store Submission & Launch
**Duration:** 7-10 days (includes review time)  
**Status:** Not Started

### Day 12-13: Submit to App Stores

#### Task 12.1: Submit iOS to App Review

1. **Final Pre-Flight Check:**
   - [ ] App Store Connect → App Store → Version 6.0.2
   - [ ] Verify build is selected
   - [ ] Verify subscriptions are linked to version
   - [ ] Verify all metadata is complete
   - [ ] Verify screenshots are current

2. **Pricing and Availability:**
   - [ ] Verify pricing
   - [ ] Verify availability in correct countries

3. **App Review Information:**
   - [ ] Add notes for reviewer (use SUBMISSION_NOTES.md)
   - [ ] Add any special instructions

4. **Submit:**
   - [ ] Click "Submit for Review"
   - [ ] Confirm submission
   - [ ] Status changes to "Waiting for Review"

⏰ **Review Time:** Typically 1-3 days

Expected Timeline:
- Day 1: Waiting for Review
- Day 2-3: In Review
- Day 3-4: Approved (or Rejected)

**Task 12.2: Submit Android to Review**

1. **Promote to Production:**
   - [ ] Play Console → Testing → Internal testing
   - [ ] Click "Promote release"
   - [ ] Select "Production"
   - [ ] Review rollout percentage (start with 100%)
   - [ ] Click "Start rollout to Production"

2. **Complete Store Listing:**
   - [ ] Verify all required content ratings
   - [ ] Verify privacy policy link
   - [ ] Verify target audience set correctly
   - [ ] Verify data safety section complete

3. **Submit:**
   - [ ] Click "Send X changes for review"
   - [ ] Status changes to "In review"

⏰ **Review Time:** Typically 1-7 days

**Deliverables:**
- ✅ iOS submitted to App Review
- ✅ Android submitted to Play Review
- ✅ Monitoring review status

---

### Day 13-20: Monitor & Respond to Reviews

#### Daily Tasks (10-15 minutes)

**Check Review Status:**

iOS:
- [ ] App Store Connect → App Store → Version Status
- [ ] Check for messages from App Review
- [ ] Respond within 24 hours if requested

Android:
- [ ] Play Console → Dashboard → Release status
- [ ] Check for messages from Play Review
- [ ] Respond within 24 hours if requested

**Possible Outcomes:**

**✅ Approved:**
- Status changes to "Ready for Sale" (iOS) or "Available" (Android)
- App goes live automatically or on scheduled date
- Users can download with subscriptions

**❌ Rejected:**

Common rejection reasons:
1. **"Cannot locate in-app purchases"**
   - Fix: Verify product IDs match exactly
   - Fix: Verify subscriptions linked to version
   - Response: See template below

2. **"In-app purchase not functional"**
   - Fix: Test again in sandbox/internal testing
   - Fix: Check RevenueCat configuration
   - Response: Provide testing steps

3. **"Missing information about subscriptions"**
   - Fix: Update app description
   - Fix: Add subscription details to review notes

**Rejection Response Template:**

```
Hello App Review Team,

Thank you for your feedback regarding the in-app purchase issue.

ISSUE IDENTIFIED:
[Describe what was wrong]

RESOLUTION COMPLETED:
• Fixed product IDs to match exactly (monthly_30, yearly_365)
• Verified subscriptions are linked to this app version
• Re-tested subscription flow in [TestFlight/Sandbox]
• Uploaded new build X with corrections

TESTING NOTES:
The subscription flow works as follows:
1. Free trial starts automatically on first launch
2. Trial countdown banner appears at top of app
3. After 7 days, subscription paywall presents both plans
4. Users can subscribe using sandbox account: [email]
5. Purchase can be completed and access is granted

The in-app purchases are now properly configured and functional.

Thank you,
[Your Name]
```

**If Rejected:**
- [ ] Read rejection reason carefully
- [ ] Identify root cause
- [ ] Fix issue
- [ ] Create new build if needed
- [ ] Re-submit
- [ ] Respond to reviewer with explanation

---

### Day 21: Launch Day! 🚀

#### When Both Apps are Approved

**Task 21.1: Verify Apps are Live**

iOS:
- [ ] Search "Daily Bread" in App Store
- [ ] Verify version 6.0.2 is live
- [ ] Download on clean device
- [ ] Verify trial starts
- [ ] Verify subscriptions work (real purchase - will charge!)

Android:
- [ ] Search "Daily Bread" in Play Store
- [ ] Verify version 6.0.2 is live
- [ ] Download on clean device
- [ ] Verify trial starts
- [ ] Verify subscriptions work (real purchase - will charge!)

**Task 21.2: Monitor Initial Performance**

First 24 hours:
- [ ] Check RevenueCat dashboard for purchases
- [ ] Monitor crash reports (Expo dashboard or Sentry)
- [ ] Check user reviews in App Store
- [ ] Check user reviews in Play Store
- [ ] Respond to negative reviews promptly

**Task 21.3: Marketing Announcement (Optional)**

- [ ] Post on social media
- [ ] Send email to existing users
- [ ] Update website
- [ ] Create launch blog post

**Task 21.4: Post-Launch Monitoring**

Week 1 Metrics to Track:
- [ ] Number of new installs
- [ ] Trial start rate (should be ~100%)
- [ ] Trial completion rate (target: 60-70%)
- [ ] Trial-to-paid conversion (target: 15-25%)
- [ ] Crashes or errors
- [ ] User reviews and ratings
- [ ] Support tickets about subscriptions

---

## 🎯 Success Metrics

### Week 1 Goals
- **Trial Start Rate:** 95%+ (almost all users start trial)
- **App Stability:** < 0.1% crash rate
- **Purchase Completion:** 100% of purchases succeed
- **User Satisfaction:** 4+ star average rating

### Month 1 Goals
- **Trial-to-Paid Conversion:** 15-25%
- **Subscription Retention:** 80%+ (users don't cancel immediately)
- **Family Sharing:** 10%+ of subscribers use Family Sharing
- **Revenue:** Track in RevenueCat dashboard

---

## 🚨 Risk Mitigation

### Potential Risks & Solutions

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| Paid Apps Agreement not approved in time | HIGH | Start Day 1, wait 48hrs | You |
| iOS rejection: Product ID mismatch | HIGH | Triple-check IDs match | You + Me |
| Android billing issues | MEDIUM | Thorough testing in internal track | You + Me |
| Trial reset on reinstall | LOW | Expected behavior, document in FAQ | You |
| RevenueCat quota exceeded | LOW | Free tier covers first $10k revenue | You |
| Subscription price too high | LOW | Research shows $1.99 is reasonable | You |
| Low trial-to-paid conversion | MEDIUM | Optimize paywall messaging | You |

---

## 📞 Support & Escalation

### If You Get Stuck

**Code Issues:**
- Check implementation guide
- Review working macOS implementation
- Debug with React Native Debugger
- Check RevenueCat logs

**Store Issues:**
- App Store Connect Help: [help.apple.com/app-store-connect](https://help.apple.com/app-store-connect/)
- Play Console Help: [support.google.com/googleplay/android-developer](https://support.google.com/googleplay/android-developer/)

**RevenueCat Issues:**
- Documentation: [docs.revenuecat.com](https://docs.revenuecat.com)
- Support: support@revenuecat.com
- Community: [community.revenuecat.com](https://community.revenuecat.com)

---

## 📝 Final Checklist

### Before Starting Implementation
- [ ] Read entire implementation plan
- [ ] Read SUBSCRIPTION-IMPLEMENTATION-GUIDE.md
- [ ] Review macOS implementation (you did this successfully!)
- [ ] Verify all prerequisites met
- [ ] Block out time for 2-3 weeks
- [ ] Back up current codebase

### Before Submission
- [ ] All code tested on both platforms
- [ ] Trial duration is 7 days (not shortened)
- [ ] Product IDs match exactly everywhere
- [ ] Subscriptions linked to app versions
- [ ] Paid Apps Agreement is Active
- [ ] Production builds created
- [ ] Version numbers incremented
- [ ] Code committed to Git

### After Launch
- [ ] Monitor RevenueCat dashboard daily
- [ ] Check app reviews daily
- [ ] Track metrics (trial starts, conversions)
- [ ] Respond to user feedback
- [ ] Plan optimizations based on data

---

## 🎉 Conclusion

This plan gives you a clear roadmap to implement subscriptions in your Daily Bread mobile app. 

**Key Takeaways:**
1. Start with Paid Apps Agreement immediately (48hr wait)
2. Code implementation takes 5 days
3. Store configuration takes 2 days
4. Testing thoroughly prevents rejections
5. Product ID consistency is critical
6. RevenueCat simplifies cross-platform complexity

**You've got this!** You already successfully implemented this on macOS. This is the same system, just in React Native instead of Swift.

---

**Questions? Let's review this plan together before starting.**

**Ready to begin? Start with Phase 1, Day 1, Task 1.1!** 🚀
