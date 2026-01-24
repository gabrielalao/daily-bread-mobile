import { useRef, useState } from 'react';
import { Alert, Platform, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const APP_DOWNLOAD_URL = 'https://daily-bread.app/';

const addWatermark = async (canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Watermark configuration
  const padding = 20;
  const fontSize = 14;
  const logoSize = 24; // Size of the logo
  const spacing = 8; // Space between logo and text
  const watermarkText = 'dailybread.app';
  
  // Load the logo image
  const logo = new Image();
  logo.crossOrigin = 'anonymous';
  
  // Use the icon from assets - this will be bundled with the app
  // For now, we'll draw a simple book icon using canvas if image fails
  const logoPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    logo.onload = () => resolve(logo);
    logo.onerror = () => reject();
    // Try to load the app icon
    logo.src = '/assets/images/icon.png';
    
    // Fallback timeout
    setTimeout(() => reject(), 2000);
  });

  // Set font for measurement
  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const textMetrics = ctx.measureText(watermarkText);
  const textWidth = textMetrics.width;
  
  // Background rectangle dimensions (logo + text + padding)
  const rectPadding = 10;
  const contentWidth = logoSize + spacing + textWidth;
  const rectWidth = contentWidth + (rectPadding * 2);
  const rectHeight = Math.max(logoSize, fontSize) + (rectPadding * 2);
  
  // Position at bottom-right, slightly away from edge to avoid covering content
  const rectX = canvas.width - rectWidth - padding;
  const rectY = canvas.height - rectHeight - padding;
  
  // Draw semi-transparent background with subtle shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // White background for better contrast
  
  // Draw rounded rectangle manually for better browser compatibility
  const radius = 8;
  ctx.beginPath();
  ctx.moveTo(rectX + radius, rectY);
  ctx.lineTo(rectX + rectWidth - radius, rectY);
  ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius);
  ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
  ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight);
  ctx.lineTo(rectX + radius, rectY + rectHeight);
  ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
  ctx.lineTo(rectX, rectY + radius);
  ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
  ctx.closePath();
  ctx.fill();
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Try to draw the logo
  try {
    const loadedLogo = await logoPromise;
    const logoX = rectX + rectPadding;
    const logoY = rectY + (rectHeight - logoSize) / 2;
    ctx.drawImage(loadedLogo, logoX, logoY, logoSize, logoSize);
  } catch {
    // Fallback: Draw a simple book icon using canvas
    const logoX = rectX + rectPadding;
    const logoY = rectY + (rectHeight - logoSize) / 2;
    
    // Draw book icon
    ctx.fillStyle = '#6366f1'; // Primary color
    ctx.fillRect(logoX + 2, logoY + 2, logoSize - 4, logoSize - 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(logoX + 6, logoY + 8, logoSize - 12, 2);
    ctx.fillRect(logoX + 6, logoY + 14, logoSize - 12, 2);
  }
  
  // Draw text with primary color
  ctx.fillStyle = '#6366f1'; // Primary color for text
  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  
  const textX = rectX + rectPadding + logoSize + spacing;
  const textY = rectY + rectHeight / 2;
  ctx.fillText(watermarkText, textX, textY);
  
  return canvas;
};

export const useScreenshotShare = () => {
  const viewRef = useRef<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureAndShare = async (customMessage?: string) => {
    if (!viewRef.current) {
      Alert.alert('Error', 'Unable to capture screenshot. Please try again.');
      return;
    }

    if (isCapturing) {
      return; // Prevent multiple simultaneous captures
    }

    setIsCapturing(true);

    try {
      let uri: string;
      const baseMessage = (customMessage ?? 'Shared from Christian Daily Bread').trim();
      const message = `${baseMessage}\n\nDownload the app: ${APP_DOWNLOAD_URL}`;

      if (Platform.OS === 'web') {
        // Web-specific screenshot capture using html2canvas
        const html2canvas = (await import('html2canvas')).default;
        
        // Get the DOM element from the ref
        const element = viewRef.current;
        if (!element) {
          throw new Error('Element not found');
        }

        // Capture the element as canvas
        let canvas = await html2canvas(element, {
          backgroundColor: '#f5f5f5',
          scale: 2, // Higher quality
          logging: false,
          useCORS: true,
        });

        // Add watermark to canvas (async now)
        canvas = await addWatermark(canvas);
        
        // Convert canvas to blob and create download URL
        uri = canvas.toDataURL('image/png');
        
        // Download the file
        const link = document.createElement('a');
        link.href = uri;
        link.download = `daily-bread-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert(
          'Screenshot Saved! 📸',
          `Your screenshot has been saved with dailybread.app branding.\n\nShare the app: ${APP_DOWNLOAD_URL}`,
          [{ text: 'Great!' }]
        );
      } else {
        // Mobile: Capture screenshot then share with text
        uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        console.log('Screenshot captured:', uri);

        await Share.share({
          title: 'Christian Daily Bread',
          message,
          url: uri,
        });
      }
    } catch (error) {
      console.error('Error capturing/sharing screenshot:', error);
      Alert.alert(
        'Screenshot Failed',
        'Unable to capture and share screenshot. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    viewRef,
    captureAndShare,
    isCapturing,
  };
};
