# iOS-First Testing Plan (RECOMMENDED)

**Status:** App Store Connect ✅ Done | Google Play ⏸️ Skip for now

---

## Phase 1: iOS Setup & Testing (Do This Now)

### Step 1: Configure RevenueCat (iOS Products Only)

1. Go to https://app.revenuecat.com
2. Navigate to **"Products"** in left sidebar
3. Click **"+ New"** to add products

**Add Product 1: Monthly (iOS)**
- Identifier: `monthly_30`
- Store: **App Store** (NOT Google Play yet)
- Type: Subscription
- Product ID: `monthly_30`
- Click **Save**

**Add Product 2: Annual (iOS)**
- Identifier: `yearly_365`
- Store: **App Store**
- Type: Subscription
- Product ID: `yearly_365`
- Click **Save**

### Step 2: Create Entitlement

1. Go to **"Entitlements"** in left sidebar
2. Click **"+ New"**
3. Fill in:
   - Identifier: `pro` (exactly this!)
   - Display Name: `Premium Access`
4. Click **Save**
5. Click on the **"pro"** entitlement
6. Click **"Attach Products"**
7. Select BOTH iOS products:
   - ✅ `monthly_30` [App Store]
   - ✅ `yearly_365` [App Store]
8. Click **Save**

### Step 3: Create Offering

1. Go to **"Offerings"** in left sidebar
2. Click **"+ New"**
3. Fill in:
   - Identifier: `default`
   - Description: `Default subscription offering`
4. Click **Save**

5. Inside the offering, click **"Add Package"**

**Add Package 1: Annual (Default)**
- Identifier: `annual`
- Product: `yearly_365`
- **Make this the default package** (toggle on)
- Click **Save**

**Add Package 2: Monthly**
- Click **"Add Package"** again
- Identifier: `monthly`
- Product: `monthly_30`
- Click **Save**

6. Set offering as **"Current"** (there should be a toggle/button at the top)

### Step 4: Build iOS Development Build

```bash
cd /Users/gabbysoftwarepro/Documents/daily-bread-mobile

# Build for iOS
npx eas build --profile development --platform ios
```

This will take 15-20 minutes. Once done:
- Scan QR code with iPhone Camera
- Install development build
- Launch app

### Step 5: Test on iPhone

**Trial Flow:**
- [ ] App launches, trial starts automatically
- [ ] Banner shows "🎁 Free Trial: 7 days remaining"
- [ ] Click banner opens paywall
- [ ] Paywall shows both subscription options

**Purchase Flow (Use Sandbox Account):**
1. Settings → App Store → Sandbox Account (add test Apple ID)
2. In your app, select Annual plan
3. Click "Subscribe Now"
4. Complete with sandbox account
5. Should work! 🎉

**Verify in App:**
```typescript
// Check in console
console.log('Subscribed:', isSubscribed); // Should be true
console.log('Has Access:', hasAccess); // Should be true
```

---

## Phase 2: Android Setup (Do This Later)

When you're ready for Android testing:

### Step 1: Upload First APK to Play Console

```bash
# Build production Android bundle
npx eas build --profile production --platform android
```

Then:
1. Download the `.aab` file when build completes
2. Go to Google Play Console
3. Upload to Internal Testing or Production (draft)
4. This unlocks subscriptions feature!

### Step 2: Create Android Subscriptions

Now you can access the Subscriptions page:
1. **Monetize with Play** → **Subscriptions**
2. Create `monthly_30` ($1.99/month, 7-day trial)
3. Create `yearly_365` ($9.99/year, 7-day trial)
4. Activate both

### Step 3: Add Android Products to RevenueCat

1. Go to RevenueCat → **Products** → **"+ New"**
2. Add `monthly_30` [Google Play]
3. Add `yearly_365` [Google Play]
4. Go to **Entitlements** → **"pro"** → **Attach Products**
5. Add both Android products
6. Done!

### Step 4: Build & Test Android

```bash
# Build Android development build
npx eas build --profile development --platform android
```

Install APK on Android device and test same flow.

---

## ✅ Current Status

| Platform | App Store | Products in RC | Ready to Build |
|----------|-----------|----------------|----------------|
| **iOS** | ✅ Done | ⏳ Do now | ⏳ After RC setup |
| **Android** | ⏸️ Skip | ⏸️ Skip | ⏸️ Do in Phase 2 |

---

## 🎯 Next Action

**Right now:** Configure RevenueCat with iOS products only (Step 1-3 above)

Then I'll help you with the iOS build!

---

## Why This Approach Works

✅ **No blockers** - Can proceed immediately  
✅ **Faster** - Test iOS first, validate everything works  
✅ **Less risk** - Don't rush Android setup  
✅ **Better testing** - iOS sandbox is more reliable  
✅ **Incremental** - Add Android when ready  

The Android products can be added to RevenueCat later without any code changes!
