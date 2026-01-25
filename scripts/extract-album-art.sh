#!/bin/bash
# Auto-extract album art from all MP3 files in assets/audio/

cd "$(dirname "$0")/../assets/audio"

echo "🎨 Extracting album art from MP3 files..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found. Installing..."
    brew install ffmpeg
fi

# Extract album art from all MP3 files
for file in *.mp3; do
    if [ -f "$file" ]; then
        base="${file%.mp3}"
        jpg="${base}.jpg"
        
        # Skip if jpg already exists
        if [ -f "$jpg" ]; then
            echo "✓ $jpg already exists, skipping"
            continue
        fi
        
        echo "📸 Extracting: $base.jpg"
        ffmpeg -i "$file" -an -vcodec copy "$jpg" -y 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Created: $jpg"
        else
            echo "⚠️  No album art found in: $file"
        fi
    fi
done

echo ""
echo "✨ Done! Rebuild your app to see the album art."
