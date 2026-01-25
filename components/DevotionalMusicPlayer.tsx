import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import colors from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface DevotionalMusicPlayerProps {
  title: string;
  audioSource: any; // require() result for the audio file, or null if not available
  devotionId: string;
  albumArt?: any; // Optional album art image source
}

export function DevotionalMusicPlayer({ title, audioSource, devotionId, albumArt }: DevotionalMusicPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // All hooks must be called before any early returns
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Early returns must come AFTER all hooks
  if (!audioSource || hasError) {
    return null;
  }

  // If no audio source or error, don't render the player
  // This must come AFTER all hooks are called
  if (!audioSource || hasError) {
    return null;
  }

  const loadSound = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true }, // Auto-play after loading
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (error) {
      console.error('Error loading sound:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      // First time - load and play
      await loadSound();
      // After loading, the sound will auto-play
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const skipForward = async () => {
    if (sound) {
      const newPosition = Math.min(position + 15000, duration);
      await sound.setPositionAsync(newPosition);
    }
  };

  const skipBackward = async () => {
    if (sound) {
      const newPosition = Math.max(position - 15000, 0);
      await sound.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Horizontal Layout like Spotify */}
      <View style={styles.playerContent}>
        {/* Album Art */}
        {albumArt ? (
          <Image
            source={albumArt}
            style={styles.albumArt}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.albumArtPlaceholder}>
            <Text style={styles.albumArtIcon}>🕊️</Text>
          </View>
        )}

        {/* Song Info & Controls Combined */}
        <View style={styles.infoAndControls}>
          {/* Song Title and Artist */}
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              Christian Daily Bread
            </Text>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.loadingDot}>...</Text>
            ) : isPlaying ? (
              <Pause size={24} color='#1F1F1F' fill='#1F1F1F' />
            ) : (
              <Play size={24} color='#1F1F1F' fill='#1F1F1F' />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar - Full Width Below */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* Skip Controls */}
      <View style={styles.skipControls}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipBackward}
          disabled={!sound || isLoading}
        >
          <SkipBack size={20} color={!sound || isLoading ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.7)'} />
          <Text style={styles.skipText}>15s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipForward}
          disabled={!sound || isLoading}
        >
          <SkipForward size={20} color={!sound || isLoading ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.7)'} />
          <Text style={styles.skipText}>15s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  albumArt: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 12,
  },
  albumArtPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumArtIcon: {
    fontSize: 28,
  },
  infoAndControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songInfo: {
    flex: 1,
    marginRight: 12,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500' as const,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingDot: {
    color: '#1F1F1F',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500' as const,
    width: 35,
    textAlign: 'center',
  },
  skipControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skipText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600' as const,
  },
});
