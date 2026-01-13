/**
 * Split long AI responses into shorter, more conversational chunks
 * Makes the chat feel more human and natural
 */

export type MessageChunk = {
  text: string;
  delay: number; // milliseconds to wait before showing this chunk
};

/**
 * Break a long response into shorter, natural chunks
 * @param text The full AI response text
 * @returns Array of chunks with delays
 */
export function chunkResponse(text: string): MessageChunk[] {
  const chunks: MessageChunk[] = [];
  
  // First, split by paragraphs (double newlines or single newlines)
  const paragraphs = text.split(/\n\n+|\n/).filter(p => p.trim().length > 0);
  
  let cumulativeDelay = 0;
  
  paragraphs.forEach((paragraph, index) => {
    const trimmed = paragraph.trim();
    
    // Skip empty paragraphs
    if (!trimmed) return;
    
    // If paragraph is short enough (under 150 chars), keep it as one chunk
    if (trimmed.length <= 150) {
      chunks.push({
        text: trimmed,
        delay: cumulativeDelay,
      });
      // Shorter delay for short messages (1-2 seconds)
      cumulativeDelay += 1200 + (trimmed.length * 5);
      return;
    }
    
    // For longer paragraphs, split by sentences
    const sentences = trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed];
    
    let currentChunk = '';
    
    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      
      // If adding this sentence would make chunk too long, save current and start new
      if (currentChunk && (currentChunk + ' ' + trimmedSentence).length > 150) {
        chunks.push({
          text: currentChunk.trim(),
          delay: cumulativeDelay,
        });
        // Add delay between chunks (1.5-2.5 seconds)
        cumulativeDelay += 1500 + (currentChunk.length * 5);
        currentChunk = trimmedSentence;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + trimmedSentence : trimmedSentence;
      }
    });
    
    // Add remaining chunk
    if (currentChunk) {
      chunks.push({
        text: currentChunk.trim(),
        delay: cumulativeDelay,
      });
      cumulativeDelay += 1500 + (currentChunk.length * 5);
    }
  });
  
  // If no chunks were created, return the original text
  if (chunks.length === 0) {
    return [{ text: text.trim(), delay: 0 }];
  }
  
  return chunks;
}

/**
 * Calculate realistic typing time based on message length
 * @param text Message text
 * @returns Delay in milliseconds
 */
export function calculateTypingDelay(text: string): number {
  // Base delay (thinking time): 800-1500ms
  const baseDelay = 800 + Math.random() * 700;
  
  // Typing speed: ~40-60 chars per second (realistic human typing)
  const typingSpeed = 45 + Math.random() * 15; // chars per second
  const typingTime = (text.length / typingSpeed) * 1000;
  
  // Total delay: thinking + typing, capped at 4 seconds max
  return Math.min(baseDelay + typingTime, 4000);
}

/**
 * Add natural variation to delay times
 * @param delay Base delay
 * @returns Delay with added randomness
 */
export function addNaturalVariation(delay: number): number {
  // Add ±15% random variation
  const variation = delay * 0.15;
  return delay + (Math.random() * variation * 2 - variation);
}
