import { Audio } from 'expo-av';

// OpenAI TTS Voices - All sound incredibly human and natural
export const OPENAI_VOICES = [
  {
    id: 'alloy',
    name: 'Alloy',
    description: 'Neutral, balanced, versatile voice',
    gender: 'neutral',
  },
  {
    id: 'echo',
    name: 'Echo',
    description: 'Male, clear, warm voice',
    gender: 'male',
  },
  {
    id: 'fable',
    name: 'Fable',
    description: 'Male, expressive, storytelling voice',
    gender: 'male',
  },
  {
    id: 'onyx',
    name: 'Onyx',
    description: 'Male, deep, authoritative voice',
    gender: 'male',
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'Female, warm, engaging voice',
    gender: 'female',
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    description: 'Female, soft, gentle voice',
    gender: 'female',
  },
];

const TOOLKIT_URL = process.env.EXPO_PUBLIC_TOOLKIT_URL || 'https://toolkit.rork.com';

/**
 * Generate speech audio using OpenAI's TTS API via Rork Toolkit
 * @param text - The text to convert to speech
 * @param voiceId - The OpenAI voice ID (alloy, echo, fable, onyx, nova, shimmer)
 * @param speed - Speed of speech (0.25 to 4.0, default 1.0)
 * @returns Audio Sound object ready to play
 */
export async function generateSpeech(
  text: string,
  voiceId: string = 'nova',
  speed: number = 1.0
): Promise<Audio.Sound> {
  try {
    // Call Rork Toolkit to generate speech
    const response = await fetch(`${TOOLKIT_URL}/v1/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd', // High-quality model
        input: text,
        voice: voiceId,
        speed: speed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
    }

    // Get audio data as blob
    const audioBlob = await response.blob();
    
    // Convert blob to base64 for Expo Audio
    const reader = new FileReader();
    const base64Audio = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    // Load audio into Expo Audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: base64Audio },
      { shouldPlay: false }
    );

    return sound;
  } catch (error) {
    console.error('OpenAI TTS Error:', error);
    throw error;
  }
}

/**
 * Text-to-Speech Manager for handling playback state
 */
export class TTSManager {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  async speak(text: string, voiceId: string, speed: number = 1.0): Promise<void> {
    try {
      // Stop any existing playback
      await this.stop();

      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Generate and load audio
      this.sound = await generateSpeech(text, voiceId, speed);
      
      // Set up completion callback
      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.isPlaying = false;
          this.cleanup();
        }
      });

      // Play audio
      await this.sound.playAsync();
      this.isPlaying = true;
    } catch (error) {
      console.error('TTSManager speak error:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
      this.sound = null;
      this.isPlaying = false;
    }
  }

  async pause(): Promise<void> {
    if (this.sound && this.isPlaying) {
      try {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      } catch (error) {
        console.error('Error pausing audio:', error);
      }
    }
  }

  async resume(): Promise<void> {
    if (this.sound && !this.isPlaying) {
      try {
        await this.sound.playAsync();
        this.isPlaying = true;
      } catch (error) {
        console.error('Error resuming audio:', error);
      }
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private cleanup(): void {
    if (this.sound) {
      this.sound.unloadAsync().catch(() => {});
      this.sound = null;
    }
  }
}

export default TTSManager;
