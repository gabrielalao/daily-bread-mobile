import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, SkipBack, SkipForward, Repeat1 } from 'lucide-react-native';
import { documentDirectory, makeDirectoryAsync, getInfoAsync, downloadAsync } from "expo-file-system";
import { getAudioFileForDevotion } from "@/utils/audioHelper";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useContent } from "@/contexts/ContentContext";
import { requireOnlineOrPrompt } from "@/utils/networkPolicy";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useRouter } from "expo-router";

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
  const router = useRouter();
  const { isPremiumLocked } = usePremiumAccess();
  const { width: windowWidth } = useWindowDimensions();
  const isTablet = windowWidth >= 768;
  const isSmallPhone = windowWidth < 375;
  const { isOnline, isOffline } = useNetworkStatus();
  const { userPreferences, setOfflineModeEnabled } = useContent();

  if (isPremiumLocked) {
    return (
      <View style={styles.premiumLockCard}>
        <View style={styles.premiumLockHeader}>
          <Text style={styles.premiumLockTitle}>Worship Music</Text>
          <Text style={styles.premiumLockBadge}>Premium</Text>
        </View>
        <Text style={styles.premiumLockBody}>
          Your free trial has ended. Subscribe to keep listening to daily worship music.
        </Text>
        <TouchableOpacity
          style={styles.premiumLockCta}
          onPress={() => router.push("/paywall")}
          activeOpacity={0.85}
        >
          <Text style={styles.premiumLockCtaText}>Subscribe to Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [resolvedAudioSource, setResolvedAudioSource] = useState<any | null>(audioSource);
  const [resolvedAlbumArt, setResolvedAlbumArt] = useState<any | null>(albumArt ?? null);
  const [offlineAudioBlocked, setOfflineAudioBlocked] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  const getCachePaths = useCallback(() => {
    const fileName = getAudioFileForDevotion(title);
    const baseDir = `${documentDirectory ?? ""}devotional-audio/`;
    return {
      baseDir,
      audioPath: `${baseDir}${fileName}.mp3`,
      artPath: `${baseDir}${fileName}.jpg`,
      fileName,
    };
  }, [title]);

  const isRemoteHttpAudio = useCallback((): boolean => {
    if (!resolvedAudioSource) return false;
    if (typeof resolvedAudioSource === "number") return false;
    const uri: string | undefined = resolvedAudioSource?.uri;
    return Boolean(uri && /^https?:\/\//i.test(uri));
  }, [resolvedAudioSource]);

  const isAudioCached = useCallback(async (): Promise<boolean> => {
    const { audioPath } = getCachePaths();
    try {
      const info = await getInfoAsync(audioPath);
      return Boolean(info.exists);
    } catch {
      return false;
    }
  }, [getCachePaths]);

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
    const run = async () => {
      if (!shouldAutoPlay || !resolvedAudioSource || sound || isLoading || hasError) return;

      // Avoid popping alerts for auto-play. Only auto-play if it can play now.
      if (isRemoteHttpAudio()) {
        const cached = await isAudioCached();
        if (!cached && (isOffline || userPreferences.offlineModeEnabled)) {
          setOfflineAudioBlocked(true);
          return;
        }
      }

      console.log('🎵 Auto-playing daily audio...');
      await loadAndPlaySound();
    };

    void run();
  }, [
    shouldAutoPlay,
    resolvedAudioSource,
    sound,
    isLoading,
    hasError,
    loadAndPlaySound,
    isAudioCached,
    isOffline,
    isRemoteHttpAudio,
    userPreferences.offlineModeEnabled,
  ]);

  // Notify parent of play state changes
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  // Cleanup when devotionId changes
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [devotionId]);

  const onPlaybackStatusUpdate = useCallback((status: any) => {
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
  }, []);

  // Resolve and cache remote audio/art on demand (Android AAB size optimization)
  const ensureCachedRemoteMedia = useCallback(async (): Promise<{ audio: any; art: any | null } | null> => {
    // If audioSource is a local require (number), just use it.
    if (typeof resolvedAudioSource === "number") {
      return { audio: resolvedAudioSource, art: resolvedAlbumArt ?? null };
    }

    const uri: string | undefined = resolvedAudioSource?.uri;
    if (!uri) return null;

    // Only cache http(s) URIs
    if (!/^https?:\/\//i.test(uri)) {
      return { audio: resolvedAudioSource, art: resolvedAlbumArt ?? null };
    }

    const { baseDir, audioPath, artPath } = getCachePaths();

    try {
      await makeDirectoryAsync(baseDir, { intermediates: true });
    } catch {
      // ignore (may already exist)
    }

    // Audio
    let audioUriToUse = uri;
    const audioInfo = await getInfoAsync(audioPath);
    if (audioInfo.exists) {
      audioUriToUse = audioPath;
    } else {
      // Download then play locally (gives offline after first play)
      await downloadAsync(uri, audioPath);
      audioUriToUse = audioPath;
    }

    // Album art (optional)
    let artToUse: any | null = resolvedAlbumArt ?? null;
    const artUri = resolvedAlbumArt?.uri;
    const guessArtRemote = uri.replace(/\.mp3(\?.*)?$/i, ".jpg");
    const remoteArt = typeof artUri === "string" && /^https?:\/\//i.test(artUri) ? artUri : guessArtRemote;

    try {
      const artInfo = await getInfoAsync(artPath);
      if (artInfo.exists) {
        artToUse = { uri: artPath };
      } else if (/^https?:\/\//i.test(remoteArt)) {
        await downloadAsync(remoteArt, artPath);
        artToUse = { uri: artPath };
      }
    } catch {
      // ignore art failures
    }

    return { audio: { uri: audioUriToUse }, art: artToUse };
  }, [getCachePaths, resolvedAudioSource, resolvedAlbumArt]);

  const loadAndPlaySound = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setHasError(false);
      setOfflineAudioBlocked(false);

      // Unload existing sound if any
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // If this is a remote URI, cache it first (Android app size optimization)
      const cached = await ensureCachedRemoteMedia();
      if (!cached) {
        throw new Error("No playable audio source");
      }
      if (isMountedRef.current) {
        setResolvedAlbumArt(cached.art);
        setResolvedAudioSource(cached.audio);
      }

      console.log('🎵 Loading audio...');
      const { sound: newSound } = await Audio.Sound.createAsync(
        cached.audio,
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
  }, [ensureCachedRemoteMedia, isLoading, onPlaybackStatusUpdate]);

  const handlePlayPress = useCallback(async () => {
    setHasError(false);
    setOfflineAudioBlocked(false);

    // Only gate remote streaming audio (Android).
    if (isRemoteHttpAudio()) {
      const cached = await isAudioCached();
      if (!cached) {
        // If device has no internet, switching modes won't help — prompt to connect.
        if (isOffline) {
          setOfflineAudioBlocked(true);
          Alert.alert(
            "Audio needs internet",
            "To listen to devotional audio, connect to the internet to download it the first time. After that, it works offline.",
            [{ text: "OK", style: "default" }]
          );
          return;
        }

        // Device is online, but user may have Offline Mode enabled.
        await requireOnlineOrPrompt({
          feature: "other",
          offlineModeEnabled: userPreferences.offlineModeEnabled,
          isOnline,
          setOfflineModeEnabled,
          onContinue: async () => {
            await loadAndPlaySound();
          },
        });
        return;
      }
    }

    await loadAndPlaySound();
  }, [isAudioCached, isOffline, isOnline, isRemoteHttpAudio, loadAndPlaySound, setOfflineModeEnabled, userPreferences.offlineModeEnabled]);

  const togglePlayPause = async () => {
    try {
      if (!sound || !soundRef.current) {
        // First time - load and play
        await handlePlayPress();
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      
      if (!status.isLoaded) {
        // Sound was unloaded, reload it
        await handlePlayPress();
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
      await handlePlayPress();
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

  if (!resolvedAudioSource) {
    return null;
  }

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
        {resolvedAlbumArt ? (
          <Image
            source={resolvedAlbumArt}
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

      {(offlineAudioBlocked || hasError) && (
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>
            {offlineAudioBlocked
              ? "Go online to download audio"
              : "Audio couldn’t load"}
          </Text>
          <Text style={styles.noticeText}>
            {offlineAudioBlocked
              ? "Connect to the internet to download this devotional audio once. After that, it works offline."
              : "Please try again. If you’re offline, go online once to download the audio."}
          </Text>
          <TouchableOpacity
            style={styles.noticeButton}
            onPress={() => {
              setHasError(false);
              setOfflineAudioBlocked(false);
              void handlePlayPress();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.noticeButtonText}>
              {offlineAudioBlocked && userPreferences.offlineModeEnabled && isOnline
                ? "Enable Online Mode & Download"
                : "Try Again"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
  premiumLockCard: {
    backgroundColor: "#1F1F1F",
    borderRadius: 16,
    marginTop: 16,
    alignSelf: "center",
    width: "100%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  premiumLockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  premiumLockTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  premiumLockBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: "#264653",
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  premiumLockBody: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 12,
  },
  premiumLockCta: {
    backgroundColor: "#4ECDC4",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  premiumLockCtaText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#264653",
  },
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
  noticeContainer: {
    marginTop: 10,
    marginBottom: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  noticeTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  noticeText: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 12,
    lineHeight: 16,
  },
  noticeButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  noticeButtonText: {
    color: "#1F1F1F",
    fontSize: 12,
    fontWeight: "800" as const,
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
