import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1 } from 'lucide-react-native';

interface DevotionalMusicPlayerProps {
  title: string;
  audioSource: any;
  devotionId: string;
  albumArt?: any;
  shouldAutoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function DevotionalMusicPlayer({ 
  title, 
  audioSource, 
  devotionId, 
  albumArt, 
  shouldAutoPlay = false, 
  onPlayStateChange 
}: DevotionalMusicPlayerProps) {
  const { width: windowWidth } = useWindowDimensions();
  const isTablet = windowWidth >= 768;
  const isSmallPhone = windowWidth < 375;

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  // Configure audio mode on mount
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.log('Error configuring audio mode:', error);
      }
    };
    
    configureAudio();

    return () => {
      isMountedRef.current = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (shouldAutoPlay && audioSource && !sound && !isLoading && !hasError) {
      console.log('🎵 Auto-playing daily audio...');
      loadAndPlaySound();
    }
  }, [shouldAutoPlay, audioSource]);

  // Notify parent of play state changes
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying]);

  // Cleanup when devotionId changes
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [devotionId]);

  if (!audioSource || hasError) {
    return null;
  }

  const onPlaybackStatusUpdate = (status: any) => {
    if (!isMountedRef.current) return;
    
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        setPosition(0);
      }
    } else if (status.error) {
      console.error('Playback error:', status.error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const loadAndPlaySound = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setHasError(false);

      // Unload existing sound if any
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      console.log('🎵 Loading audio...');
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { 
          shouldPlay: true,
          progressUpdateIntervalMillis: 500,
        },
        onPlaybackStatusUpdate
      );

      if (!isMountedRef.current) {
        await newSound.unloadAsync();
        return;
      }

      soundRef.current = newSound;
      setSound(newSound);
      
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);
        console.log('✅ Audio loaded successfully');
      }
    } catch (error) {
      console.error('❌ Error loading sound:', error);
      setHasError(true);
      setIsPlaying(false);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const togglePlayPause = async () => {
    try {
      if (!sound || !soundRef.current) {
        // First time - load and play
        await loadAndPlaySound();
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      
      if (!status.isLoaded) {
        // Sound was unloaded, reload it
        await loadAndPlaySound();
        return;
      }

      if (isPlaying) {
        await soundRef.current.pauseAsync();
        console.log('⏸️ Paused');
      } else {
        await soundRef.current.playAsync();
        console.log('▶️ Playing');
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      // Try to reload on error
      await loadAndPlaySound();
    }
  };

  const skipForward = async () => {
    if (!soundRef.current) return;
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.min(position + 15000, duration);
        await soundRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  };

  const skipBackward = async () => {
    if (!soundRef.current) return;
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(position - 15000, 0);
        await soundRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
    console.log(isRepeating ? '🔁 Repeat off' : '🔁 Repeat on');
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  // Responsive sizes
  const albumArtSize = isTablet ? 96 : isSmallPhone ? 56 : 64;
  const playButtonSize = isTablet ? 64 : isSmallPhone ? 44 : 48;
  const playIconSize = isTablet ? 32 : isSmallPhone ? 22 : 24;
  const skipIconSize = isTablet ? 24 : isSmallPhone ? 16 : 20;
  const containerPadding = isTablet ? 24 : isSmallPhone ? 12 : 16;
  const titleFontSize = isTablet ? 20 : isSmallPhone ? 14 : 16;
  const artistFontSize = isTablet ? 16 : isSmallPhone ? 12 : 14;
  const timeFontSize = isTablet ? 14 : isSmallPhone ? 10 : 12;
  const skipTextSize = isTablet ? 14 : isSmallPhone ? 10 : 12;

  return (
    <View style={[
      styles.container,
      {
        padding: containerPadding,
        maxWidth: isTablet ? 800 : '100%',
        marginHorizontal: isTablet ? 20 : 0,
      }
    ]}>
      <View style={[styles.playerContent, { marginBottom: isSmallPhone ? 8 : 12 }]}>
        {albumArt ? (
          <Image
            source={albumArt}
            style={[
              styles.albumArt,
              {
                width: albumArtSize,
                height: albumArtSize,
                marginRight: isSmallPhone ? 8 : 12,
              }
            ]}
            resizeMode="cover"
          />
        ) : (
          <View style={[
            styles.albumArtPlaceholder,
            {
              width: albumArtSize,
              height: albumArtSize,
              marginRight: isSmallPhone ? 8 : 12,
            }
          ]}>
            <Text style={{ fontSize: isTablet ? 48 : isSmallPhone ? 28 : 32 }}>🕊️</Text>
          </View>
        )}

        <View style={styles.infoAndControls}>
          <View style={styles.songInfo}>
            <Text style={[styles.songTitle, { fontSize: titleFontSize, marginBottom: isSmallPhone ? 2 : 4 }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.artistName, { fontSize: artistFontSize }]} numberOfLines={1}>
              Christian Daily Bread
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.playButton,
              {
                width: playButtonSize,
                height: playButtonSize,
                borderRadius: playButtonSize / 2,
              }
            ]}
            onPress={togglePlayPause}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#1F1F1F" />
            ) : isPlaying ? (
              <Pause size={playIconSize} color='#1F1F1F' fill='#1F1F1F' />
            ) : (
              <Play size={playIconSize} color='#1F1F1F' fill='#1F1F1F' />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.progressContainer, { marginBottom: isSmallPhone ? 6 : 8 }]}>
        <Text style={[styles.timeText, { fontSize: timeFontSize, width: isTablet ? 50 : isSmallPhone ? 40 : 45 }]}>
          {formatTime(position)}
        </Text>
        <View style={[
          styles.progressBar,
          {
            height: isTablet ? 6 : isSmallPhone ? 3 : 4,
            marginHorizontal: isSmallPhone ? 6 : 8,
          }
        ]}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={[styles.timeText, { fontSize: timeFontSize, width: isTablet ? 50 : isSmallPhone ? 40 : 45 }]}>
          {formatTime(duration)}
        </Text>
      </View>

      <View style={[styles.skipControls, { gap: isTablet ? 32 : isSmallPhone ? 16 : 24 }]}>
        <TouchableOpacity
          style={[styles.skipButton, { padding: isSmallPhone ? 6 : 8, gap: isSmallPhone ? 2 : 4 }]}
          onPress={skipBackward}
          disabled={!sound || isLoading}
          activeOpacity={0.7}
        >
          <SkipBack
            size={skipIconSize}
            color={!sound || isLoading ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.7)'}
          />
          <Text style={[styles.skipText, { fontSize: skipTextSize }]}>15s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.repeatButton, { padding: isSmallPhone ? 6 : 8 }]}
          onPress={toggleRepeat}
          activeOpacity={0.7}
        >
          <Repeat1
            size={skipIconSize}
            color={isRepeating ? '#1DB954' : 'rgba(255, 255, 255, 0.4)'}
            fill={isRepeating ? '#1DB954' : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.skipButton, { padding: isSmallPhone ? 6 : 8, gap: isSmallPhone ? 2 : 4 }]}
          onPress={skipForward}
          disabled={!sound || isLoading}
          activeOpacity={0.7}
        >
          <SkipForward
            size={skipIconSize}
            color={!sound || isLoading ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.7)'}
          />
          <Text style={[styles.skipText, { fontSize: skipTextSize }]}>15s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    marginTop: 16,
    alignSelf: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumArt: {
    borderRadius: 8,
  },
  albumArtPlaceholder: {
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoAndControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songInfo: {
    flex: 1,
    marginRight: 8,
  },
  songTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  artistName: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  skipControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
