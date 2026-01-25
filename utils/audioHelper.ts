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
 * 
 * IMPORTANT: To add a new audio file:
 * 1. Add the MP3 file to /assets/audio/ with the kebab-case name
 * 2. Add a case below with the exact file name
 * 3. Rebuild the app
 */
export function getDynamicAudioSource(devotionTitle: string): any | null {
  const fileName = getAudioFileForDevotion(devotionTitle);
  
  try {
    // Map each devotion title to its audio file
    // Files are loaded at build time, so we need explicit require() statements
    switch (fileName) {
      // Days 1-10 (Jan 1-10 or starting from Jan 25 based on your calendar)
      case 'finding-peace-in-the-storm':
        return require('@/assets/audio/finding-peace-in-the-storm.mp3');
      
      case 'strength-for-today':
        return require('@/assets/audio/strength-for-today.mp3');
      
      case 'love-in-action':
        return require('@/assets/audio/love-in-action.mp3');
      
      case 'the-heart-of-stewardship':
        return require('@/assets/audio/the-heart-of-stewardship.mp3');
      
      case 'first-fruits-not-leftovers':
        return require('@/assets/audio/first-fruits-not-leftovers.mp3');
      
      case 'contentment-is-wealth':
        return require('@/assets/audio/contentment-is-wealth.mp3');
      
      case 'generosity-opens-heavens-windows':
        return require('@/assets/audio/generosity-opens-heavens-windows.mp3');
      
      case 'your-business-is-your-ministry':
        return require('@/assets/audio/your-business-is-your-ministry.mp3');
      
      case 'integrity-over-profit':
        return require('@/assets/audio/integrity-over-profit.mp3');
      
      case 'faithful-with-little-trusted-with-much':
        return require('@/assets/audio/faithful-with-little-trusted-with-much.mp3');
      
      // Add more cases here as you add more audio files
      // Days 11-20
      case 'god-sized-vision':
        return require('@/assets/audio/god-sized-vision.mp3');
      
      case 'servant-leadership':
        return require('@/assets/audio/servant-leadership.mp3');
      
      case 'excellence-as-worship':
        return require('@/assets/audio/excellence-as-worship.mp3');
      
      case 'building-wealth-gods-way':
        return require('@/assets/audio/building-wealth-gods-way.mp3');
      
      case 'your-body-gods-temple':
        return require('@/assets/audio/your-body-gods-temple.mp3');
      
      case 'parenting-as-discipleship':
        return require('@/assets/audio/parenting-as-discipleship.mp3');
      
      case 'the-patient-investor':
        return require('@/assets/audio/the-patient-investor.mp3');
      
      case 'the-debt-free-dream':
        return require('@/assets/audio/the-debt-free-dream.mp3');
      
      case 'your-career-gods-calling':
        return require('@/assets/audio/your-career-gods-calling.mp3');
      
      case 'the-freedom-of-a-budget':
        return require('@/assets/audio/the-freedom-of-a-budget.mp3');
      
      // Days 21-30
      case 'words-that-heal':
        return require('@/assets/audio/words-that-heal.mp3');
      
      case 'increasing-your-income-gods-way':
        return require('@/assets/audio/increasing-your-income-gods-way.mp3');
      
      case 'true-financial-freedom':
        return require('@/assets/audio/true-financial-freedom.mp3');
      
      case 'move-your-body-honor-your-god':
        return require('@/assets/audio/move-your-body-honor-your-god.mp3');
      
      case 'the-power-of-spoken-blessings':
        return require('@/assets/audio/the-power-of-spoken-blessings.mp3');
      
      // Continue adding cases for all 365 days...
      // When you add a new MP3 file, add its case here
      
      default:
        // Audio file not found - player won't show
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
export function getAudioSourceByDayOfYear(dayOfYear: number): any | null {
  // Import devotionals to get the title for the day
  const { devotionals } = require('@/constants/devotionals');
  const index = (dayOfYear - 1) % 365;
  const devotion = devotionals[index];
  
  if (!devotion) return null;
  
  return getDynamicAudioSource(devotion.title);
}
