# App Store Screenshots (No Device Frames)

These are **raw simulator captures** — app UI only, **no iPhone bezel or device frame**.

## Recommended for App Store Connect (6.7" display)

| File | Size | Screen |
|------|------|--------|
| `home-no-frame-1290x2796.png` | 1290×2796 | Home / devotional |
| `prayers-no-frame-1290x2796.png` | 1290×2796 | Prayer |
| `bible-no-frame-1290x2796.png` | 1290×2796 | Bible reader |

## Original simulator size

| File | Size |
|------|------|
| `home-no-frame.png` | 1206×2622 |
| `prayers-no-frame.png` | 1206×2622 |
| `bible-no-frame.png` | 1206×2622 |
| `settings-no-frame.png` | 1206×2622 |
| `therapy-no-frame.png` | 1206×2622 (premium paywall) |
| `study-no-frame.png` | 1206×2622 (premium paywall) |

## Upload in App Store Connect

1. **App Store Connect** → your app → **iOS App** → **Screenshots**
2. Choose **6.7" Display** (or the size that matches your upload)
3. Drag in `*-1290x2796.png` files (Home, Prayer, Bible recommended)

**Tip:** Use Home, Prayer, and Bible for marketing. Therapy/Study currently show the premium paywall in the simulator.

## Capture more yourself (no frames)

With the app running in Simulator:

```bash
xcrun simctl io booted screenshot ~/Desktop/my-screenshot.png
```

Or **⌘S** in Simulator — saves a frameless PNG to Desktop.
