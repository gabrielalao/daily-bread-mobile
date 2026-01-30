# 🚀 iOS Build Command - Run This Manually

The EAS build needs to be run **interactively** in your terminal (not through the AI) so it can ask you questions about Apple credentials.

---

## ⚠️ Important Note: Build Credits

You've used 100% of your free build credits for this month. EAS will charge pay-as-you-go rates for additional builds.

**Cost:** ~$1-2 per iOS development build

If you want to avoid charges, you can wait until next month or set up a local build (more complex).

---

## 🎯 Run This Command Now

Open your terminal and run:

```bash
cd /Users/gabbysoftwarepro/Documents/daily-bread-mobile

npx eas build --profile development --platform ios
```

---

## 📋 Questions It Will Ask

### 1. Do you want to log in to your Apple account?

**Answer:** `Yes` (recommended)

This lets EAS automatically manage your iOS certificates and provisioning profiles.

**Then provide:**
- Your Apple ID email
- Your Apple ID password
- (If you have 2FA enabled, enter the code when prompted)

**OR**

**Answer:** `No`

You'll need to provide certificates manually (more complex).

---

### 2. Build Type

It will automatically use the **"development"** profile from your `eas.json`.

---

### 3. Confirmation

- Review the build summary
- Press **Enter** to confirm and start the build

---

## ⏱️ Build Time

The build will take **15-20 minutes**. You'll see:

```
✔ Build submitted
✔ Build queued
⠙ Build in progress...
```

You can:
- **Wait:** Watch the progress in terminal
- **Go away:** Build continues in cloud, check status at https://expo.dev/accounts/the-web-gurus/projects/daily-bread-app-mp9wlbr/builds
- **Close terminal:** Build still continues

---

## 📱 When Build Completes

You'll get:
1. A **QR code** in the terminal
2. A **URL** to the build

**To install on your iPhone:**
1. Open **Camera app** on iPhone
2. Scan the QR code
3. Tap the notification to download
4. Install the development build
5. Launch app from home screen

---

## 🧪 Testing Subscriptions

Once installed:

1. **Set up sandbox account:**
   - iPhone Settings → App Store → Sandbox Account
   - Add a test Apple ID

2. **Test trial:**
   - Open app
   - Trial should start automatically
   - Banner shows "🎁 Free Trial: 7 days remaining"

3. **Test purchase:**
   - Tap banner to open paywall
   - Select Annual plan
   - Tap "Subscribe Now"
   - Complete purchase with sandbox account
   - Subscription should activate!

---

## ✅ What to Check

After subscribing:
- [ ] Paywall dismisses
- [ ] Banner disappears
- [ ] All features are accessible
- [ ] RevenueCat Dashboard shows the purchase

Go to: https://app.revenuecat.com → Customers
Search for your test user to see subscription status.

---

## 🐛 If Build Fails

Common issues:

**"Agreement not signed"**
- Go to App Store Connect
- Sign any pending agreements

**"Invalid provisioning profile"**
- Let EAS manage credentials automatically (say "Yes" to Apple login)

**"Bundle ID mismatch"**
- Check app.json has: `"bundleIdentifier": "app.rork.daily-bread-app-mp9wlbr"`

---

## 🎯 Ready!

Run this command now:

```bash
npx eas build --profile development --platform ios
```

Let me know when the build completes and I'll help you test! 🚀
