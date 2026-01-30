# RevenueCat Product Configuration Guide

**Goal:** Configure `monthly_30` and `yearly_365` subscription products in RevenueCat dashboard

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

## Part 1: Create Products in App Store Connect (iOS)

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

### Step 3: Create Monthly Subscription

1. Inside the subscription group, click **"Create Subscription"** (the + button)
2. Fill in the details:

**Product Details:**
- **Reference Name:** `Monthly Premium`
- **Product ID:** `monthly_30` ⚠️ **MUST match exactly!**

3. Click **"Create"**

4. Fill in **Subscription Prices:**
   - Click **"Add Subscription Price"**
   - Select **United States**
   - Enter price: **$1.99**
   - Start Date: Today
   - Click **"Next"** and **"Add"**

5. Fill in **Localization (at least one required):**
   - Click **"Create in Default Localization"** or **"Add Localization"**
   - **Subscription Display Name:** `Monthly Premium`
   - **Description:** `Access all premium features with monthly billing. Cancel anytime.`

6. Fill in **Subscription Duration:**
   - Select **"1 month"**

7. Fill in **Free Trial:**
   - Select **"7 days"**
   - Check **"Only for first subscription"** (optional, recommended)

8. Click **"Save"** in the top right

### Step 4: Create Annual Subscription

1. Click **"Create Subscription"** again (the + button)
2. Fill in the details:

**Product Details:**
- **Reference Name:** `Annual Premium`
- **Product ID:** `yearly_365` ⚠️ **MUST match exactly!**

3. Click **"Create"**

4. Fill in **Subscription Prices:**
   - Click **"Add Subscription Price"**
   - Select **United States**
   - Enter price: **$9.99**
   - Start Date: Today
   - Click **"Next"** and **"Add"**

5. Fill in **Localization:**
   - Click **"Create in Default Localization"** or **"Add Localization"**
   - **Subscription Display Name:** `Annual Premium`
   - **Description:** `Access all premium features with annual billing. Best value - save 58%! Cancel anytime.`

6. Fill in **Subscription Duration:**
   - Select **"1 year"**

7. Fill in **Free Trial:**
   - Select **"7 days"**
   - Check **"Only for first subscription"** (optional, recommended)

8. Click **"Save"** in the top right

### Step 5: Submit for Review (Later)

For now, products are in "Missing Metadata" or "Ready to Submit" status. That's OK for testing!

⚠️ **Note:** You'll need to submit these with your app when ready for production. For sandbox testing, they work as-is.

---

## Part 2: Create Products in Google Play Console (Android)

### Step 1: Go to Google Play Console

1. Visit: https://play.google.com/console
2. Sign in with your Google account
3. Select your app: **"Christian Daily Bread"**

### Step 2: Set Up Subscriptions

1. In the left sidebar, click **"Monetize"** → **"Subscriptions"**
2. Click **"Create subscription"**

### Step 3: Create Monthly Subscription

1. Fill in the details:

**Product details:**
- **Product ID:** `monthly_30` ⚠️ **MUST match exactly!**
- **Name:** `Monthly Premium`
- **Description:** `Access all premium features with monthly billing. Cancel anytime.`

2. Fill in **Pricing:**
   - Click **"Set pricing"**
   - Select **United States**
   - Enter price: **$1.99**
   - Click **"Apply"**

3. Fill in **Subscription benefits** (optional but recommended):
   - Add benefits like "Daily devotionals", "AI therapy", etc.

4. Fill in **Billing period:**
   - Select **"Every 1 month"**

5. Fill in **Free trial:**
   - Check **"Offer free trial"**
   - Select **"7 days"**

6. Click **"Save"** and then **"Activate"**

### Step 4: Create Annual Subscription

1. Click **"Create subscription"** again
2. Fill in the details:

**Product details:**
- **Product ID:** `yearly_365` ⚠️ **MUST match exactly!**
- **Name:** `Annual Premium`
- **Description:** `Access all premium features with annual billing. Best value - save 58%! Cancel anytime.`

3. Fill in **Pricing:**
   - Click **"Set pricing"**
   - Select **United States**
   - Enter price: **$9.99**
   - Click **"Apply"**

4. Fill in **Billing period:**
   - Select **"Every 1 year"**

5. Fill in **Free trial:**
   - Check **"Offer free trial"**
   - Select **"7 days"**

6. Click **"Save"** and then **"Activate"**

---

## Part 3: Configure Products in RevenueCat Dashboard

Now that products exist in App Store Connect and Google Play Console, let's link them in RevenueCat.

### Step 1: Go to RevenueCat Dashboard

1. Visit: https://app.revenuecat.com
2. Sign in with your RevenueCat account
3. Select your project (or create one if you haven't)

### Step 2: Add iOS Products

1. In the left sidebar, click **"Products"**
2. Click **"+ New"** (top right)

**Add Monthly Product:**
3. Fill in the form:
   - **Identifier:** `monthly_30` ⚠️ **MUST match exactly!**
   - **Store:** Select **"App Store"**
   - **Type:** Select **"Subscription"**
   - **Product ID (App Store):** `monthly_30`
   - **Display Name:** `Monthly Premium` (optional)
   - **Description:** `Monthly subscription - $1.99/month` (optional)

4. Click **"Create"** or **"Save"**

**Add Annual Product:**
5. Click **"+ New"** again
6. Fill in the form:
   - **Identifier:** `yearly_365` ⚠️ **MUST match exactly!**
   - **Store:** Select **"App Store"**
   - **Type:** Select **"Subscription"**
   - **Product ID (App Store):** `yearly_365`
   - **Display Name:** `Annual Premium` (optional)
   - **Description:** `Annual subscription - $9.99/year` (optional)

7. Click **"Create"** or **"Save"**

### Step 3: Add Android Products

1. Still in **"Products"**, click **"+ New"** again

**Add Monthly Product (Android):**
2. Fill in the form:
   - **Identifier:** `monthly_30` (same as iOS!)
   - **Store:** Select **"Google Play"**
   - **Type:** Select **"Subscription"**
   - **Product ID (Google Play):** `monthly_30`

3. Click **"Create"** or **"Save"**

**Add Annual Product (Android):**
4. Click **"+ New"** again
5. Fill in the form:
   - **Identifier:** `yearly_365` (same as iOS!)
   - **Store:** Select **"Google Play"**
   - **Type:** Select **"Subscription"**
   - **Product ID (Google Play):** `yearly_365`

6. Click **"Create"** or **"Save"**

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
3. Select both products:
   - ✅ `monthly_30` (both iOS and Android versions)
   - ✅ `yearly_365` (both iOS and Android versions)

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

**Add Annual Package:**
6. Fill in:
   - **Identifier:** `annual`
   - **Product:** Select `yearly_365`
   - Make this the **default package** (toggle or checkbox)

7. Click **"Add"** or **"Save"**

**Add Monthly Package:**
8. Click **"Add Package"** again
9. Fill in:
   - **Identifier:** `monthly`
   - **Product:** Select `monthly_30`

10. Click **"Add"** or **"Save"**

11. Set this offering as **"Current"** (there should be a toggle or button)

---

## ✅ Verification Checklist

After completing all steps above, verify:

### App Store Connect:
- [ ] Subscription group created
- [ ] `monthly_30` product exists with $1.99 price
- [ ] `yearly_365` product exists with $9.99 price
- [ ] Both products have 7-day free trial
- [ ] Both products have at least one localization

### Google Play Console:
- [ ] `monthly_30` subscription exists with $1.99 price
- [ ] `yearly_365` subscription exists with $9.99 price
- [ ] Both subscriptions are **Active**

### RevenueCat Dashboard:
- [ ] 4 products total:
  - [ ] `monthly_30` (App Store)
  - [ ] `monthly_30` (Google Play)
  - [ ] `yearly_365` (App Store)
  - [ ] `yearly_365` (Google Play)
- [ ] Entitlement `pro` exists
- [ ] Both products attached to `pro` entitlement
- [ ] Offering `default` exists with both packages
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
  { identifier: 'annual', product: { identifier: 'yearly_365', ... } },
  { identifier: 'monthly', product: { identifier: 'monthly_30', ... } }
]
```

---

## 🐛 Troubleshooting

### "Product not found" error
**Cause:** Product IDs don't match between App Store Connect and RevenueCat  
**Fix:** Double-check all IDs are exactly `monthly_30` and `yearly_365`

### "No offerings found"
**Cause:** Offering not set as "Current" or products not attached to offering  
**Fix:** Make sure your `default` offering is marked as "Current"

### "Entitlement not found" error
**Cause:** Entitlement identifier isn't exactly `pro`  
**Fix:** Check your code in `SubscriptionContext.tsx` - it checks for `entitlements.active['pro']`

### Products show in iOS but not Android
**Cause:** Forgot to add Google Play products separately  
**Fix:** Add both `monthly_30` and `yearly_365` with Store: "Google Play"

---

## 📸 What You Should See

### RevenueCat Products Page:
```
Products (4)
├── monthly_30 [App Store] → Subscription
├── monthly_30 [Google Play] → Subscription
├── yearly_365 [App Store] → Subscription
└── yearly_365 [Google Play] → Subscription
```

### RevenueCat Entitlements Page:
```
Entitlements (1)
└── pro
    ├── monthly_30 [App Store]
    ├── monthly_30 [Google Play]
    ├── yearly_365 [App Store]
    └── yearly_365 [Google Play]
```

### RevenueCat Offerings Page:
```
Offerings (1)
└── default [CURRENT]
    ├── annual → yearly_365 [DEFAULT PACKAGE]
    └── monthly → monthly_30
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
