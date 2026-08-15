import { useRef, useState } from 'react';
import { Alert, Platform, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { APP_DISPLAY_NAME } from '@/constants/appName';

const APP_DOWNLOAD_URL = 'https://daily-bread.app/';

/**
 * Adds watermark to web canvas
 */
const addWatermark = async (canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Very small watermark text at the bottom center
  const text = APP_DISPLAY_NAME;
  const fontSize = 11;
  const padding = 8;
  
  // Position at bottom center
  const textX = canvas.width / 2;
  const textY = canvas.height - padding;
  
  // Set font and measure
  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  
  // Draw text with slight shadow for visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(text, textX, textY);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  return canvas;
};

/**
 * Hook for sharing individual cards
 * Returns a ref to attach to the card and a function to share it
 */
export const useCardShare = () => {
  const cardRef = useRef<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const shareCard = async (customMessage?: string) => {
    if (!cardRef.current) {
      Alert.alert('Error', 'Unable to capture card. Please try again.');
      return;
    }

    if (isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      let uri: string;
      const baseMessage = (customMessage ?? `Shared from ${APP_DISPLAY_NAME}`).trim();
      const message = `${baseMessage}\n\nDownload the app: ${APP_DOWNLOAD_URL}`;

      if (Platform.OS === 'web') {
        // Web-specific capture using html2canvas
        const html2canvas = (await import('html2canvas')).default;
        
        const element = cardRef.current;
        if (!element) {
          throw new Error('Element not found');
        }

        // Capture the card
        let canvas = await html2canvas(element, {
          backgroundColor: null, // Preserve card's background
          scale: 2,
          logging: false,
          useCORS: true,
        });

        // Add watermark
        canvas = await addWatermark(canvas);
        
        // Convert to data URL
        uri = canvas.toDataURL('image/png');
        
        // Download the file
        const link = document.createElement('a');
        link.href = uri;
        link.download = `daily-bread-card-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert(
          'Card Saved! 📸',
          `Your card has been saved with © ${APP_DISPLAY_NAME} branding.\n\nShare the app: ${APP_DOWNLOAD_URL}`,
          [{ text: 'Great!' }]
        );
      } else {
        // Mobile: Capture and share
        console.log('Starting mobile capture...');
        
        // Capture the card
        uri = await captureRef(cardRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        console.log('Card captured:', uri);
        console.log('Platform:', Platform.OS);
        console.log('Attempting to share...');

        // Share image + text (download link) together
        await Share.share({
          title: APP_DISPLAY_NAME,
          message,
          url: uri,
        });
        
        console.log('Share completed successfully!');
      }
    } catch (error) {
      console.error('Error capturing/sharing card:', error);
      Alert.alert(
        'Share Failed',
        'Unable to share card. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    cardRef,
    shareCard,
    isCapturing,
  };
};
