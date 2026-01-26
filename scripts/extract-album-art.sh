#!/bin/bash
# Auto-extract album art from all MP3 files in assets/audio/
# Runs silently in background

cd "$(dirname "$0")/../assets/audio"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    exit 0  # Skip silently if ffmpeg not installed
fi

# Extract album art from all MP3 files (quietly)
for file in *.mp3; do
    if [ -f "$file" ]; then
        base="${file%.mp3}"
        jpg="${base}.jpg"
        
        # Skip if jpg already exists
        if [ ! -f "$jpg" ]; then
            ffmpeg -i "$file" -an -vcodec copy "$jpg" -y 2>/dev/null
        fi
    fi
done
