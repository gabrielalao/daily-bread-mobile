# 🚀 Build & Run with Xcode

✅ **Native iOS project created successfully!**  
✅ **CocoaPods installed!**  
✅ **RevenueCat SDK included!**  
✅ **Xcode workspace opened!**

---

## 📱 How to Build & Run

### Step 1: Select Your Device/Simulator

In Xcode (top toolbar):
1. Click the device dropdown (next to "ChristianDailyBread")
2. Select either:
   - **Your iPhone** (if connected via USB)
   - **iPhone Simulator** (e.g., "iPhone 15 Pro")

### Step 2: Start Metro Bundler (JavaScript Server)

**In a new terminal window**, run:

```bash
cd /Users/gabbysoftwarepro/Documents/daily-bread-mobile
npx expo start --dev-client
```

Keep this terminal running! You'll see:
```
Metro waiting on exp://192.168.1.x:8081
```

### Step 3: Build & Run in Xcode

1. In Xcode, click the **Play button** (▶️) or press `Cmd + R`
2. Xcode will:
   - Build the native code (2-5 minutes first time)
   - Install app on device/simulator
   - Launch the app
3. The app will connect to Metro bundler automatically

---

## ✅ First Launch

When the app launches:

1. **Trial starts automatically** 🎁
   - Check for banner: "🎁 Free Trial: 7 days remaining"

2. **Test subscriptions:**
   - Tap banner to open paywall
   - See both subscription options
   - Try purchasing (see testing instructions below)

---

## 🧪 Testing Subscriptions on Simulator

### ⚠️ Important: Simulator Limitations

The **iOS Simulator does NOT support actual in-app purchases**. You can:
- ✅ See the paywall UI
- ✅ See subscription options
- ✅ Click "Subscribe Now"
- ❌ Cannot complete purchase (will fail with StoreKit error)

### To Test Real Purchases:

You MUST use a **real iPhone device** with:
1. Device connected via USB
2. Added to your Apple Developer account
3. Using a sandbox test account

---

## 📱 Testing on Real iPhone

### Step 1: Connect iPhone

1. Connect iPhone via USB
2. Trust your Mac if prompted
3. In Xcode, select your iPhone from device dropdown

### Step 2: Code Signing

When you first build, Xcode may ask about signing:

1. Click "ChristianDailyBread" project (blue icon) in left sidebar
2. Select "ChristianDailyBread" target
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select your Team (Apple Developer account)

### Step 3: Set Up Sandbox Account

On your iPhone:
1. Settings → App Store
2. Scroll down to **"Sandbox Account"**
3. Sign in with a **test Apple ID** (NOT your real Apple ID)
   - Create one at: https://appleid.apple.com
   - Must NOT have an active App Store account

### Step 4: Build & Test

1. Build & run in Xcode (Cmd + R)
2. App installs on your iPhone
3. Open app → Trial starts
4. Tap banner → Opens paywall
5. Select Annual plan
6. Tap "Subscribe Now"
7. **StoreKit purchase sheet appears**
8. Authenticate with sandbox account
9. **Purchase completes!** ✅

Check RevenueCat Dashboard to see the purchase:
https://app.revenuecat.com → Customers

---

## 🔍 Debugging

### Check Metro Bundler

If app shows blank/loading screen:
1. Check Metro terminal - should show no errors
2. In simulator, press `Cmd + D` to open dev menu
3. Select "Reload"

### Check Logs

In Xcode bottom panel (View → Debug Area → Show Debug Area):
- Look for `[RevenueCat]` logs
- Look for trial/subscription logs

Example:
```
✅ RevenueCat configured for ios
✅ Loaded subscription offerings: 1 package
🎁 Trial active: 7 days, 0 hours remaining
```

### Common Issues

**"Failed to load offerings"**
- Check internet connection
- Verify RevenueCat API keys in `.env`
- Check RevenueCat dashboard for products

**"Purchase failed: Product not found"**
- Products must exist in App Store Connect
- Product ID must match exactly: `cdb_premium`

**"Team not found"**
- Go to Xcode → Settings → Accounts
- Add your Apple ID
- Download manual profiles if needed

---

## 🚀 Development Workflow

### Making Changes

1. **Edit code** in your editor (Cursor)
2. **Save file**
3. Metro auto-reloads (or press `R` in Metro terminal)
4. No need to rebuild in Xcode!

### When to Rebuild in Xcode

Only rebuild if you:
- Changed native code
- Added new native dependencies
- Modified iOS configuration

### Fast Refresh

React Native has Fast Refresh:
- Edit React components
- Save
- Changes appear instantly in app!

---

## 📊 RevenueCat Integration Status

✅ **`react-native-purchases` installed**  
✅ **Pod installed: `RNPurchases (9.7.5)`**  
✅ **Pod installed: `RevenueCat (5.56.0)`**  
✅ **StoreKit 2 ready**  

Your subscription code will work automatically!

---

## 🎯 Next Steps

1. ✅ Build & run in Xcode
2. ✅ Verify trial banner appears
3. ✅ Test paywall UI (simulator OK)
4. ⏳ Connect real iPhone for purchase testing
5. ⏳ Set up sandbox account
6. ⏳ Complete test purchase
7. ⏳ Verify in RevenueCat dashboard

---

## 💡 Pro Tips

### Speed Up Builds

First build is slow (5-10 mins). Subsequent builds are faster (30 seconds).

**To speed up:**
1. Xcode → Product → Scheme → Edit Scheme
2. Build → Debug → Change "Debug" to "Release" for faster performance
3. Build → Parallelize Build (enable)

### Clean Build (if needed)

If you get weird errors:
1. Xcode → Product → Clean Build Folder (Shift + Cmd + K)
2. In terminal: `cd ios && rm -rf build && cd ..`
3. Rebuild

### Xcode Shortcuts

- **Build:** `Cmd + B`
- **Run:** `Cmd + R`
- **Stop:** `Cmd + .`
- **Clean:** `Shift + Cmd + K`
- **Show console:** `Cmd + Shift + Y`

---

**Your app is ready to build!** Click the Play button in Xcode! ▶️
