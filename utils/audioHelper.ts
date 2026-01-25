/**
 * Maps devotion titles to audio file names.
 * Audio files should be named using kebab-case (lowercase with hyphens).
 * 
 * Example: "Finding Peace in the Storm" -> "finding-peace-in-the-storm.mp3"
 */

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

/**
 * Dynamically require audio file for a devotion.
 * Returns null if file doesn't exist.
 */
export function getDynamicAudioSource(devotionTitle: string): any | null {
  const fileName = getAudioFileForDevotion(devotionTitle);
  
  try {
    // Try to require the audio file
    // Note: This uses a dynamic require which needs the file to exist at build time
    switch (fileName) {
      // Day 1 - Jan 25 (starting date)
      case 'finding-peace-in-the-storm':
        return require('@/assets/audio/finding-peace-in-the-storm.mp3');
      
      // Day 2
      case 'strength-for-today':
        return require('@/assets/audio/strength-for-today.mp3');
      
      // Day 3
      case 'love-in-action':
        return require('@/assets/audio/love-in-action.mp3');
      
      // Day 4
      case 'the-heart-of-stewardship':
        return require('@/assets/audio/the-heart-of-stewardship.mp3');
      
      // Day 5
      case 'first-fruits-not-leftovers':
        return require('@/assets/audio/first-fruits-not-leftovers.mp3');
      
      // Day 6
      case 'the-measure-of-generosity':
        return require('@/assets/audio/the-measure-of-generosity.mp3');
      
      // Day 7
      case 'hope-in-hard-times':
        return require('@/assets/audio/hope-in-hard-times.mp3');
      
      // Day 8
      case 'walking-by-faith':
        return require('@/assets/audio/walking-by-faith.mp3');
      
      // Day 9
      case 'the-gift-of-forgiveness':
        return require('@/assets/audio/the-gift-of-forgiveness.mp3');
      
      // Day 10
      case 'gratitude-changes-everything':
        return require('@/assets/audio/gratitude-changes-everything.mp3');
      
      // Add more cases as you add more audio files...
      // Continue for all 365 devotions
      
      default:
        return null;
    }
  } catch (error) {
    console.warn(`Audio file not found for: ${fileName}.mp3`);
    return null;
  }
}

/**
 * Get audio source by day of year (1-365)
 */
export function getAudioSourceByDay(dayOfYear: number): any | null {
  // Import devotionals to get the title for the day
  const { devotionals } = require('@/constants/devotionals');
  const index = (dayOfYear - 1) % 365;
  const devotion = devotionals[index];
  
  if (!devotion) return null;
  
  return getDynamicAudioSource(devotion.title);
}
