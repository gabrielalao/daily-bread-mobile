import { Audio } from 'expo-av';

// ElevenLabs Premium Voices - Sound completely human and natural
export const ELEVENLABS_VOICES = [
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    description: 'Warm, compassionate female voice - Perfect for prayers',
    gender: 'female',
    category: 'conversational',
  },
  {
    id: 'cgSgspJ2msm6clMCkdW9',
    name: 'Jessica',
    description: 'Gentle, soothing female voice - Ideal for devotionals',
    gender: 'female',
    category: 'conversational',
  },
  {
    id: 'FGY2WhTYpPnrIDTdsKH5',
    name: 'Laura',
    description: 'Clear, engaging female voice - Great for Bible study',
    gender: 'female',
    category: 'conversational',
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'Deep, authoritative male voice - Strong and reassuring',
    gender: 'male',
    category: 'narrative',
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    description: 'Warm, friendly male voice - Engaging and natural',
    gender: 'male',
    category: 'narrative',
  },
  {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    description: 'Rich, resonant male voice - Perfect for scripture reading',
    gender: 'male',
    category: 'narrative',
  },
];

const TOOLKIT_URL = process.env.EXPO_PUBLIC_TOOLKIT_URL || 'https://toolkit.rork.com';

/**
 * Generate speech audio using ElevenLabs TTS API via Rork Toolkit
 * @param text - The text to convert to speech
 * @param voiceId - The ElevenLabs voice ID
 * @param stability - Voice stability (0-1, default 0.5) - Higher = more consistent
 * @param similarityBoost - Voice clarity (0-1, default 0.75) - Higher = more similar to original
 * @returns Audio Sound object ready to play
 */
export async function generateSpeech(
  text: string,
  voiceId: string = 'EXAVITQu4vr4xnSDxMaL', // Default to Sarah
  stability: number = 0.5,
  similarityBoost: number = 0.75
): Promise<Audio.Sound> {
  try {
    // Call Rork Toolkit to generate speech with ElevenLabs
    const response = await fetch(`${TOOLKIT_URL}/v1/audio/elevenlabs/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice_id: voiceId,
        model_id: 'eleven_multilingual_v2', // Most natural, supports multiple languages
        voice_settings: {
          stability: stability,
          similarity_boost: similarityBoost,
          style: 0.0, // Natural speaking style
          use_speaker_boost: true, // Enhance clarity
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
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
    console.error('ElevenLabs TTS Error:', error);
    throw error;
  }
}

/**
 * Text-to-Speech Manager for handling playback state
 */
export class TTSManager {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  async speak(text: string, voiceId: string, stability: number = 0.5, similarityBoost: number = 0.75): Promise<void> {
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
      this.sound = await generateSpeech(text, voiceId, stability, similarityBoost);
      
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
