import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import colors from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface DevotionalMusicPlayerProps {
  title: string;
  audioSource: any; // require() result for the audio file, or null if not available
  devotionId: string;
}

export function DevotionalMusicPlayer({ title, audioSource, devotionId }: DevotionalMusicPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Don't render if no audio source
  if (!audioSource) {
    return null;
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadSound = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: false },
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
      await loadSound();
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

  if (hasError) {
    return null; // Hide player if there's an error
  }

  return (
    <View style={styles.container}>
      {/* Album Art / Thumbnail */}
      <View style={styles.albumArtContainer}>
        <View style={styles.albumArt}>
          <Text style={styles.albumArtIcon}>🕊️</Text>
        </View>
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.artistName}>Christian Daily Bread</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={skipBackward}
          disabled={!sound || isLoading}
        >
          <SkipBack size={24} color={!sound || isLoading ? colors.light.textLight : '#FFFFFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.loadingDot}>...</Text>
          ) : isPlaying ? (
            <Pause size={32} color='#FFFFFF' fill='#FFFFFF' />
          ) : (
            <Play size={32} color='#FFFFFF' fill='#FFFFFF' />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={skipForward}
          disabled={!sound || isLoading}
        >
          <SkipForward size={24} color={!sound || isLoading ? colors.light.textLight : '#FFFFFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F1F1F', // Dark background like Spotify
    borderRadius: 16,
    padding: isTablet ? 24 : 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  albumArtContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  albumArt: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumArtIcon: {
    fontSize: 32,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500' as const,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500' as const,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingDot: {
    color: '#1F1F1F',
    fontSize: 20,
    fontWeight: '700' as const,
  },
});
