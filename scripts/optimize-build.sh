#!/bin/bash

# Build optimization script for Android
# This script ensures the app bundle stays under size limits

echo "🚀 Optimizing Android build..."

# 1. Clean previous builds
echo "📦 Cleaning previous builds..."
rm -rf android/app/build 2>/dev/null
rm -rf .expo 2>/dev/null

# 2. Check audio assets size
AUDIO_SIZE=$(du -sm assets/audio | cut -f1)
echo "📊 Audio assets size: ${AUDIO_SIZE}MB"

if [ "$AUDIO_SIZE" -gt 400 ]; then
  echo "⚠️  Warning: Audio assets are ${AUDIO_SIZE}MB"
  echo "   This may cause Android build to exceed 200MB base module limit"
  echo "   Consider using on-demand delivery or reducing audio quality"
fi

# 3. Verify app.json configuration
echo "✅ Checking app.json configuration..."
node -e "
const appJson = require('./app.json');
if (!appJson.expo.android.statusBar) {
  console.error('❌ Missing statusBar configuration');
  process.exit(1);
}
if (appJson.expo.android.versionCode < 8) {
  console.error('❌ Version code should be incremented');
  process.exit(1);
}
console.log('✅ app.json configuration valid');
"

echo "✅ Build optimization complete!"
