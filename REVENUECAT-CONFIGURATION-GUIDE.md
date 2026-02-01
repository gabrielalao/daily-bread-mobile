# RevenueCat Product Configuration Guide

**Goal:** Configure `cdb_premium` subscription product in RevenueCat dashboard

**Time Required:** 10-15 minutes

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ RevenueCat account created
- ✅ iOS app configured with bundle ID: `app.rork.daily-bread-app-mp9wlbr`
- ✅ Android app configured with package: `app.rork.daily_bread_app_mp9wlbr`
- ✅ API keys generated (you already have these)
- ⏳ Products created in App Store Connect (we'll set this up)
- ⏳ Products created in Google Play Console (we'll set this up)

---

## Part 1: Create Product in App Store Connect (iOS)

### Step 1: Go to App Store Connect

1. Visit: https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click on **"My Apps"**
4. Select your app: **"Christian Daily Bread"**

### Step 2: Set Up Subscriptions

1. In the left sidebar, click **"Subscriptions"** (or go to Features → In-App Purchases → Subscriptions)
2. If this is your first subscription group, click **"Create"** to create a subscription group
3. Name the group: `Premium Subscription` (or whatever you prefer)
4. Click **"Create"**

### Step 3: Create Premium Subscription (Yearly)

1. Inside the subscription group, click **"Create Subscription"** (the + button)
2. Fill in the details:

**Product Details:**
- **Reference Name:** `Premium`
- **Product ID:** `cdb_premium` ⚠️ **MUST match exactly!**

3. Click **"Create"**

4. Fill in **Subscription Prices:**
   - Click **"Add Subscription Price"**
   - Select **United States**
   - Enter price: **$9.99**
   - Start Date: Today
   - Click **"Next"** and **"Add"**

5. Fill in **Localization (at least one required):**
   - Click **"Create in Default Localization"** or **"Add Localization"**
   - **Subscription Display Name:** `Premium`
   - **Description:** `Access all premium features. Cancel anytime.`

6. Fill in **Subscription Duration:**
   - Select **"1 year"**

7. Fill in **Free Trial:**
   - Select **"7 days"**
   - Check **"Only for first subscription"** (optional, recommended)

8. Click **"Save"** in the top right

### Step 4: Submit for Review (Later)

For now, products are in "Missing Metadata" or "Ready to Submit" status. That's OK for testing!

⚠️ **Note:** You'll need to submit these with your app when ready for production. For sandbox testing, they work as-is.

---

## Part 2: Create Product in Google Play Console (Android)

### Step 1: Go to Google Play Console

1. Visit: https://play.google.com/console
2. Sign in with your Google account
3. Select your app: **"Christian Daily Bread"**

### Step 2: Set Up Subscriptions

1. In the left sidebar, click **"Monetize"** → **"Subscriptions"**
2. Click **"Create subscription"**

### Step 3: Create Premium Subscription (Yearly)

1. Fill in the details:

**Product details:**
- **Product ID:** `cdb_premium` ⚠️ **MUST match exactly!**
- **Name:** `Premium`
- **Description:** `Access all premium features. Cancel anytime.`

2. Fill in **Pricing:**
   - Click **"Set pricing"**
   - Select **United States**
   - Enter price: **$9.99**
   - Click **"Apply"**

3. Fill in **Subscription benefits** (optional but recommended):
   - Add benefits like "Daily devotionals", "AI therapy", etc.

4. Fill in **Billing period:**
   - Select **"Every 1 year"**

5. Fill in **Free trial:**
   - Check **"Offer free trial"**
   - Select **"7 days"**

6. Click **"Save"** and then **"Activate"**

---

## Part 3: Configure Product in RevenueCat Dashboard

Now that products exist in App Store Connect and Google Play Console, let's link them in RevenueCat.

### Step 1: Go to RevenueCat Dashboard

1. Visit: https://app.revenuecat.com
2. Sign in with your RevenueCat account
3. Select your project (or create one if you haven't)

### Step 2: Add iOS Products

1. In the left sidebar, click **"Products"**
2. Click **"+ New"** (top right)

**Add Premium Product (iOS):**
3. Fill in the form:
   - **Identifier:** `cdb_premium` ⚠️ **MUST match exactly!**
   - **Store:** Select **"App Store"**
   - **Type:** Select **"Subscription"**
   - **Product ID (App Store):** `cdb_premium`
   - **Display Name:** `Premium` (optional)
   - **Description:** `Yearly Premium - $9.99/year` (optional)

4. Click **"Create"** or **"Save"**

### Step 3: Add Android Products

1. Still in **"Products"**, click **"+ New"** again

**Add Premium Product (Android):**
2. Fill in the form:
   - **Identifier:** `cdb_premium` (same as iOS!)
   - **Store:** Select **"Google Play"**
   - **Type:** Select **"Subscription"**
   - **Product ID (Google Play):** `cdb_premium`

3. Click **"Create"** or **"Save"**

### Step 4: Create Entitlement

Entitlements represent what users get access to. You need at least one.

1. In the left sidebar, click **"Entitlements"**
2. Click **"+ New"** (top right)
3. Fill in the form:
   - **Identifier:** `pro` ⚠️ **MUST be exactly "pro"** (your code checks for this!)
   - **Display Name:** `Premium Access`
   - **Description:** `Full access to all premium features`

4. Click **"Create"** or **"Save"**

### Step 5: Link Products to Entitlement

Now link your subscription products to the `pro` entitlement.

1. Click on the **"pro"** entitlement you just created
2. In the **"Products"** section, click **"Attach"** or **"Add Products"**
3. Select your Premium product(s):
   - ✅ `cdb_premium` (App Store and/or Google Play)

4. Click **"Save"** or **"Attach"**

### Step 6: Create Offering (Recommended)

Offerings control what products users see in your paywall.

1. In the left sidebar, click **"Offerings"**
2. Click **"+ New"** (top right)
3. Fill in the form:
   - **Identifier:** `default` (recommended)
   - **Description:** `Default premium subscription offering`

4. Click **"Create"**

5. In the offering page, click **"Add Package"**

**Add Premium Package:**
6. Fill in:
   - **Identifier:** `premium` (recommended)
   - **Product:** Select `cdb_premium`
   - Make this the **default package** (toggle or checkbox)

7. Click **"Add"** or **"Save"**

8. Set this offering as **"Current"** (there should be a toggle or button)

---

## ✅ Verification Checklist

After completing all steps above, verify:

### App Store Connect:
- [ ] Subscription group created
- [ ] `cdb_premium` product exists with $9.99 price
- [ ] Product has 7-day free trial
- [ ] Product has at least one localization

### Google Play Console:
- [ ] `cdb_premium` subscription exists with $9.99 price
- [ ] Subscription is **Active**

### RevenueCat Dashboard:
- [ ] Products:
  - [ ] `cdb_premium` (App Store)
  - [ ] `cdb_premium` (Google Play) (if supporting Android)
- [ ] Entitlement `pro` exists
- [ ] Premium product attached to `pro` entitlement
- [ ] Offering `default` exists with Premium package
- [ ] Offering is set as "Current"

---

## 🧪 Test Your Configuration

Once everything is configured, test in your app:

```typescript
// This should log your offerings
import { useSubscription } from '@/contexts/SubscriptionContext';

const { offerings } = useSubscription();
console.log('Offerings:', offerings);
console.log('Packages:', offerings?.current?.availablePackages);
```

You should see:
```
Offerings: { current: { ... } }
Packages: [
  { identifier: 'premium', product: { identifier: 'cdb_premium', ... } }
]
```

---

## 🐛 Troubleshooting

### "Product not found" error
**Cause:** Product IDs don't match between App Store Connect and RevenueCat  
**Fix:** Double-check the ID is exactly `cdb_premium`

### "No offerings found"
**Cause:** Offering not set as "Current" or products not attached to offering  
**Fix:** Make sure your `default` offering is marked as "Current"

### "Entitlement not found" error
**Cause:** Entitlement identifier isn't exactly `pro`  
**Fix:** Check your code in `SubscriptionContext.tsx` - it checks for `entitlements.active['pro']`

### Products show in iOS but not Android
**Cause:** Forgot to add Google Play products separately  
**Fix:** Add `cdb_premium` with Store: "Google Play"

---

## 📸 What You Should See

### RevenueCat Products Page:
```
Products (2)
├── cdb_premium [App Store] → Subscription
└── cdb_premium [Google Play] → Subscription
```

### RevenueCat Entitlements Page:
```
Entitlements (1)
└── pro
    ├── cdb_premium [App Store]
    └── cdb_premium [Google Play]
```

### RevenueCat Offerings Page:
```
Offerings (1)
└── default [CURRENT]
    └── premium → cdb_premium [DEFAULT PACKAGE]
```

---

## ⏭️ What's Next?

After configuration:

1. ✅ Products configured in App Store Connect
2. ✅ Products configured in Google Play Console
3. ✅ Products configured in RevenueCat
4. ✅ Entitlement created and linked
5. ✅ Offering created
6. ⏳ **Next:** Create EAS development build
7. ⏳ **Next:** Test subscriptions on device

---

**Need help?** If you get stuck on any step, let me know which section and I'll provide more guidance!
