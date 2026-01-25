/**
 * Maps devotion titles to their album art images.
 * Album art images should be placed in /assets/audio/ with the same base name as the audio file.
 * 
 * Example: 
 * - Audio: finding-peace-in-the-storm.mp3
 * - Album Art: finding-peace-in-the-storm.jpg
 */

export function getAlbumArtForDevotion(devotionTitle: string): any | null {
  const fileName = getAudioFileForDevotion(devotionTitle);
  
  try {
    // Try to load the corresponding album art image
    // We'll use a switch statement for explicit imports (required by Metro bundler)
    switch (fileName) {
      case 'finding-peace-in-the-storm':
        return require('@/assets/audio/finding-peace-in-the-storm.jpg');
      
      case 'strength-for-today':
        return require('@/assets/audio/strength-for-today.jpg');
      
      // Add more album art mappings here as needed
      // For now, other devotions will use a default placeholder
      
      default:
        return null; // Will use default placeholder in component
    }
  } catch (error) {
    return null;
  }
}

export function getAudioFileForDevotion(devotionTitle: string): string {
  // Convert title to kebab-case for file name
  const fileName = devotionTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
  
  return fileName;
}
