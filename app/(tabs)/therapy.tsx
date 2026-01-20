import colors from "@/constants/colors";
import { getPersonalizedTherapy, therapyContents, type TherapyContent } from "@/constants/therapy";
import { useContent } from "@/contexts/ContentContext";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useScheduledSessions } from "@/contexts/ScheduledSessionsContext";
import { useScreenshotShare } from "@/hooks/useScreenshotShare";
import { getAppLanguageById } from "@/constants/app-languages";
import { getVersionById } from "@/constants/bible-versions";
import { translateTextCached } from "@/utils/translate";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScheduleNextSessionModal } from "@/components/ScheduleNextSessionModal";
import { useRorkAgent, generateObject } from "@rork-ai/toolkit-sdk";
import { LinearGradient } from "expo-linear-gradient";
import { Brain, Check, Heart, Sparkles, MessageCircle, AlertTriangle, X, Send, ArrowLeft, Mic, MicOff, Volume2, VolumeX, Settings, Plus, Minus, Calendar, Share2 } from "lucide-react-native";
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, FlatList, Alert, Dimensions } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { z } from "zod";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const therapySchema = z.object({
  title: z.string(),
  category: z.string(),
  topic: z.string(),
  scripture: z.string(),
  verse: z.string(),
  therapeuticFocus: z.string(),
  practicalSteps: z.array(z.string()),
  reflection: z.string(),
  prayerPrompt: z.string(),
});

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

const FOCUS_AREAS = [
  { id: "depression", label: "Depression & Sadness", icon: "🌧️" },
  { id: "relationships", label: "Relationships", icon: "💕" },
  { id: "trauma", label: "Past Wounds & Trauma", icon: "🩹" },
  { id: "identity", label: "Identity & Self-Worth", icon: "✨" },
  { id: "grief", label: "Grief & Loss", icon: "🕊️" },
  { id: "stress", label: "Stress & Burnout", icon: "🔥" },
  { id: "anger", label: "Anger & Frustration", icon: "⚡" },
  { id: "addiction", label: "Addiction & Habits", icon: "⛓️" },
  { id: "purpose", label: "Purpose & Direction", icon: "🧭" },
  { id: "wealth", label: "Wealth & Money Management", icon: "💰" },
  { id: "health", label: "Health & Physical Wellbeing", icon: "🏃" },
  { id: "parenting", label: "Parenting & Family", icon: "👨‍👩‍👧‍👦" },
];

const MOODS = [
  { id: "hopeful", label: "Hopeful", emoji: "🌅" },
  { id: "struggling", label: "Struggling", emoji: "😔" },
  { id: "peaceful", label: "Peaceful", emoji: "😌" },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "😰" },
  { id: "confused", label: "Confused", emoji: "😕" },
  { id: "grateful", label: "Grateful", emoji: "🙏" },
];

import Constants from "expo-constants";

export default function TherapyScreen() {
  const { contentHistory, userPreferences, markTherapyViewed, isLoaded, setCurrentDayTherapy } = useContent();
  const { analyzeContentInteraction } = usePersonalization();
  const { isOffline, isOnline } = useNetworkStatus();
  const { scheduleSession, getNextSession } = useScheduledSessions();
  const { viewRef, captureAndShare, isCapturing } = useScreenshotShare();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [showFocusSelection, setShowFocusSelection] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [chatFocus, setChatFocus] = useState<string[]>([]);
  const [chatMood, setChatMood] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTherapy, setGeneratedTherapy] = useState<(TherapyContent & { isGenerated?: boolean }) | null>(null);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [showChatOnboarding, setShowChatOnboarding] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    type: string;
    message: string;
    toolkitUrl?: string;
    processEnv?: string;
    platform?: string;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingDelay, setThinkingDelay] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [chatMessageCount, setChatMessageCount] = useState(0);

  const therapy = useMemo<(TherapyContent & { isGenerated?: boolean }) | null>(() => {
    if (generatedTherapy) {
      return generatedTherapy;
    }

    if (contentHistory.currentDayTherapy) {
      const cached = therapyContents.find(t => t.id === contentHistory.currentDayTherapy);
      if (cached) {
        console.log('Using cached therapy for today:', cached.title);
        return cached;
      }
    }

    const selected = getPersonalizedTherapy(
      contentHistory.therapy,
      userPreferences.therapyCategories
    );
    console.log('Selected new therapy for today:', selected.title);
    return selected;
  }, [contentHistory.currentDayTherapy, contentHistory.therapy, userPreferences.therapyCategories, generatedTherapy]);

  const bibleVersion = getVersionById(userPreferences.bibleVersion);
  const lang = userPreferences.appLanguage;

  // ---- UI text auto-translation (so Therapy UI is fully localized) ----
  const [uiTr, setUiTr] = useState<Record<string, string>>({});
  const tr = useCallback((s: string) => uiTr[s] ?? s, [uiTr]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setUiTr({});
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") return;

      const strings = [
        "Loading...",
        "Faith-Based Support",
        "Choose how you'd like to receive guidance and support today",
        "Personalized Session",
        "Supportive Conversation",
        "Offline",
        "Requires internet connection",
        "Get a custom faith-based therapy session with Scripture, practical steps, and prayers tailored to your needs",
        "Biblical guidance",
        "Practical action steps",
        "Prayer prompts",
        "Chat with a compassionate AI counselor for real-time emotional support and biblical wisdom",
        "Real-time responses",
        "Empathetic listening",
        "Faith-based guidance",
        "These tools support your well-being but don't replace professional therapy",
        "No Internet Connection",
        "AI-powered features require an internet connection. Please connect to the internet to use personalized sessions.",
        "AI-powered conversations require an internet connection. Please connect to the internet to chat.",
        "OK",
        "Back",
        "Let's understand how you're feeling",
        "This helps me provide better support tailored to your needs",
        "How are you feeling right now?",
        "Start Conversation",
        "What do you want to focus on today?",
        "Generate My Session",
        "Important Information",
        "This is NOT Professional Therapy",
        "When to Seek Professional Help",
        "Privacy & Data",
        "Faith-Based Guidance",
        "Cancel",
        "I Understand",
        "Error Details",
        "Diagnostic Information",
        "Error Type:",
        "Error Message:",
        "Platform:",
        "Toolkit URL (Constants):",
        "Toolkit URL (process.env):",
        "What to check:",
        "• Verify internet connection",
        "• Check if Toolkit URL is configured",
        "• Ensure app has network permissions",
        "• Try again in a few moments",
        "Close",
        "Voice Settings",
        "Volume:",
        "Speed:",
        "Voice",
        "Recording... Tap mic to stop",
        "Hold to record",
        "← New Session",
        "Scripture Foundation",
        "Therapeutic Focus",
        "Practical Steps",
        "Reflection",
        "Prayer for Healing",
        "Try these evidence-based practices today:",
        "You",
        "Counselor",
        "Test Voice",
        "Speaking...",
        "Processing...",
        "Share what's on your heart...",
        "I'm feeling anxious today",
        "Help me with depression",
        "I need prayer guidance",
        "Dealing with relationships",
        "Hello, this is a test of the selected voice settings.",
        "Share this therapy session from Christian Daily Bread",
        "Note: This content is designed to support your spiritual and emotional well-being. If you're experiencing severe mental health concerns, please seek professional help from a licensed counselor or therapist.",
        "Recording Error",
        "Failed to start recording. Please try again.",
        "Failed to process recording. Please try again.",
        "Recording Too Short",
        "Please try recording again and speak clearly.",
        "Invalid Audio",
        "The audio format is not supported. Please try again.",
        "Audio Too Large",
        "Recording is too long. Please keep it under 25MB.",
        "Transcription Error",
        "Failed to process your recording. Please try again.",
        "No Speech Detected",
        "Please try speaking more clearly.",
        "Failed to transcribe:",
        "Please check your internet connection and try again.",
        "Listening...",
      ];

      // Also translate focus + mood labels.
      for (const f of FOCUS_AREAS) strings.push(f.label);
      for (const m of MOODS) strings.push(m.label);

      const uniq = Array.from(new Set(strings.filter(Boolean)));
      const next: Record<string, string> = {};
      let processed = 0;

      for (const s of uniq) {
        if (cancelled) return;
        const res = await translateTextCached({ text: s, targetLang: lang });
        next[s] = res.text;
        processed += 1;
        if (processed % 12 === 0) setUiTr((prev) => ({ ...prev, ...next }));
      }
      if (cancelled) return;
      setUiTr((prev) => ({ ...prev, ...next }));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [lang, userPreferences.autoTranslateContent]);

  // ---- Translate the daily therapy content itself (titles, focus, steps, reflection, prayer) ----
  const [translatedTherapy, setTranslatedTherapy] = useState<Partial<TherapyContent> | null>(null);
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTranslatedTherapy(null);
      if (!therapy) return;
      if (!userPreferences.autoTranslateContent || !lang || lang === "en") return;
      // Generated sessions should already be in the selected language via prompt rules.
      if ((therapy as any).isGenerated) return;

      const [
        titleRes,
        categoryRes,
        topicRes,
        verseRes,
        focusRes,
        reflectionRes,
        prayerRes,
        stepsRes,
      ] = await Promise.all([
        translateTextCached({ text: therapy.title, targetLang: lang }),
        translateTextCached({ text: therapy.category, targetLang: lang }),
        translateTextCached({ text: therapy.topic, targetLang: lang }),
        translateTextCached({ text: therapy.verse, targetLang: lang }),
        translateTextCached({ text: therapy.therapeuticFocus, targetLang: lang }),
        translateTextCached({ text: therapy.reflection, targetLang: lang }),
        translateTextCached({ text: therapy.prayerPrompt, targetLang: lang }),
        Promise.all(therapy.practicalSteps.map((s) => translateTextCached({ text: s, targetLang: lang }))),
      ]);

      if (cancelled) return;
      setTranslatedTherapy({
        title: titleRes.text,
        category: categoryRes.text,
        topic: topicRes.text,
        verse: verseRes.text,
        therapeuticFocus: focusRes.text,
        reflection: reflectionRes.text,
        prayerPrompt: prayerRes.text,
        practicalSteps: stepsRes.map((r) => r.text),
      });
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [therapy?.id, lang, userPreferences.autoTranslateContent]);

  useEffect(() => {
    console.log("Rork extra config:", Constants.expoConfig?.extra);
    // If the SDK also reads from process.env:
    console.log("process.env.EXPO_PUBLIC_TOOLKIT_URL:", process.env.EXPO_PUBLIC_TOOLKIT_URL);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isLoaded]);

  useEffect(() => {
    if (isLoaded && therapy && !therapy.isGenerated) {
      if (contentHistory.currentDayTherapy !== therapy.id) {
        setCurrentDayTherapy(therapy.id);
        console.log('Set current day therapy to:', therapy.id);
      }

      const viewedTherapy = contentHistory.therapy || [];
      if (!viewedTherapy.includes(therapy.id)) {
        markTherapyViewed(therapy.id);
        analyzeContentInteraction({
          type: 'therapy',
          content: `${therapy.title}: ${therapy.therapeuticFocus}`,
        });
      }
    }
  }, [therapy, isLoaded, contentHistory.currentDayTherapy, contentHistory.therapy, setCurrentDayTherapy, markTherapyViewed, analyzeContentInteraction]);

  const generatePersonalizedTherapy = async () => {
    if (selectedFocus.length === 0 || !selectedMood) {
      return;
    }

    // Check for offline status
    if (isOffline) {
      Alert.alert(
        'No Internet Connection',
        'AI-powered personalized sessions require an internet connection. Please check your connection and try again, or view the daily therapy session instead.',
        [
          { text: 'View Daily Session', onPress: () => {
            setShowFocusSelection(false);
            setShowMainMenu(false);
          }},
          { text: 'OK', style: 'cancel' }
        ]
      );
      return;
    }

    setIsGenerating(true);
    let attemptCount = 0;
    const maxAttempts = 2; // Try twice with different strategies
    
    while (attemptCount < maxAttempts) {
      attemptCount++;
      
      try {
        // Log configuration for debugging
        if (attemptCount === 1) {
          const toolkitUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_TOOLKIT_URL || process.env.EXPO_PUBLIC_TOOLKIT_URL;
          console.log('=== THERAPY GENERATION START ===');
          console.log('Toolkit URL (Constants):', Constants.expoConfig?.extra?.EXPO_PUBLIC_TOOLKIT_URL);
          console.log('Toolkit URL (process.env):', process.env.EXPO_PUBLIC_TOOLKIT_URL);
          console.log('Resolved Toolkit URL:', toolkitUrl);
          console.log('Platform:', Platform.OS);
          console.log('===============================');
        }
        
        console.log(`Attempt ${attemptCount}/${maxAttempts}`);

      const focusLabels = selectedFocus.map(
        (id) => FOCUS_AREAS.find((f) => f.id === id)?.label || id
      ).join(", ");
      const moodLabel = MOODS.find((m) => m.id === selectedMood)?.label || selectedMood;

      console.log('Calling generateObject with SDK...');
      
      let result;
      try {
        result = await generateObject({
          messages: [
            {
              role: "user",
              content: `Generate a Christian-based therapy session for someone who is feeling ${moodLabel} and wants to focus on: ${focusLabels}.

Provide:
- A compelling title
- A relevant category and topic
- A specific Bible verse (include both the reference and the full verse text)
- Therapeutic focus that combines Christian faith with evidence-based mental health principles
- 4 practical, actionable steps they can take today
- A thoughtful reflection that connects their struggles to God's truth
- A prayer prompt for healing

Make it personal, compassionate, and practical. Focus on hope, healing, and God's presence in their specific struggles.`,
            },
          ],
          schema: therapySchema as z.ZodType,
        }) as z.infer<typeof therapySchema>;
        
        console.log('Raw SDK response received');
        console.log('Response type:', typeof result);
        console.log('Response is null?', result === null);
        console.log('Response is undefined?', result === undefined);
        
      } catch (sdkError: any) {
        console.error('=== SDK ERROR CAUGHT ===');
        console.error('SDK Error type:', sdkError?.constructor?.name);
        console.error('SDK Error message:', sdkError instanceof Error ? sdkError.message : String(sdkError));
        console.error('SDK Error:', sdkError);
        console.error('=======================');
        
        // If it's a JSON parse error and we have attempts left, try with a more explicit prompt
        if (sdkError?.message?.includes('JSON Parse') && attemptCount < maxAttempts) {
          console.log('JSON parse error detected, will retry with modified prompt...');
          continue; // Retry loop
        }
        
        throw sdkError;
      }

      // Validate result before proceeding
      console.log('Validating result...');
      if (!result || typeof result !== 'object') {
        console.error('Validation failed: Invalid result type');
        throw new Error('Invalid response: Expected an object but received ' + typeof result);
      }
      
      // Validate required fields
      const requiredFields = ['title', 'category', 'topic', 'scripture', 'verse', 'therapeuticFocus', 'practicalSteps', 'reflection', 'prayerPrompt'];
      for (const field of requiredFields) {
        if (!result[field as keyof typeof result]) {
          throw new Error(`Invalid response: Missing field "${field}"`);
        }
      }
      
      if (!Array.isArray(result.practicalSteps) || result.practicalSteps.length === 0) {
        throw new Error('Invalid response: practicalSteps must be a non-empty array');
      }

      const generated: TherapyContent & { isGenerated: boolean } = {
        id: `generated-${Date.now()}`,
        date: new Date().toISOString(),
        title: result.title,
        category: result.category,
        topic: result.topic,
        scripture: result.scripture,
        verse: result.verse,
        therapeuticFocus: result.therapeuticFocus,
        practicalSteps: result.practicalSteps,
        reflection: result.reflection,
        prayerPrompt: result.prayerPrompt,
        isGenerated: true,
      };

      setGeneratedTherapy(generated);
      setShowFocusSelection(false);

      analyzeContentInteraction({
        type: 'therapy',
        content: `Generated therapy for ${focusLabels} while feeling ${moodLabel}`,
      });
      
      // Success - break out of retry loop
      break;
      
    } catch (error) {
      console.error('Therapy generation error details:', error);
      
      // Extract useful error message
      let errorMessage = 'Unable to generate personalized session. Please try again or select a different focus area.';
      let showRetry = true;
      
      if (error instanceof Error) {
        if (error.message.includes('JSON Parse')) {
          errorMessage = 'The AI response was invalid. This sometimes happens - please try generating again or choose the daily session instead.';
        } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'The request took too long. Please try again.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = 'Authentication error. Please contact support if this persists.';
          showRetry = false;
        } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
          errorMessage = 'Server error. The AI service may be temporarily unavailable. Please try again in a moment.';
        } else if (error.message.includes('Invalid response')) {
          errorMessage = `The AI returned an incomplete response. ${error.message}`;
        }
      }
      
      // Check if error is empty object (SDK issue)
      if (error && typeof error === 'object' && Object.keys(error).length === 0) {
        errorMessage = 'The AI service returned an unexpected response. This may be a temporary issue. Please try again or choose the daily session.';
      }
      
      // Build alert buttons
      const buttons: any[] = [];
      if (showRetry) {
        buttons.push({ text: 'Try Again', onPress: () => generatePersonalizedTherapy() });
      }
      buttons.push({
        text: 'View Daily Session',
        onPress: () => {
          setShowFocusSelection(false);
          setShowMainMenu(false);
        }
      });
      buttons.push({ text: 'Cancel', style: 'cancel' });
      
      // Show user-friendly alert
      Alert.alert(
        'Generation Error',
        errorMessage,
        buttons
      );
      
      // Log full error for debugging
      if (__DEV__) {
        console.error('=== FULL ERROR DETAILS ===');
        console.error('Error type:', error?.constructor?.name || typeof error);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Error stack:', error instanceof Error ? error.stack : 'N/A');
        if (error && typeof error === 'object') {
          console.error('Error keys:', Object.keys(error));
          console.error('Error object:', error);
          // Try to stringify with custom replacer
          try {
            const serialized = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
            console.error('Serialized error:', serialized);
          } catch (e) {
            console.error('Could not serialize error');
          }
        }
        console.error('========================');
      }
      
      // If all retries failed, exit loop
      break;
    }
    } // End of while loop
    
    // Always reset loading state
    setIsGenerating(false);
  };

  const toggleFocus = (focusId: string) => {
    setSelectedFocus((prev) =>
      prev.includes(focusId)
        ? prev.filter((id) => id !== focusId)
        : [...prev, focusId]
    );
  };

  const { messages, sendMessage } = useRorkAgent({
    tools: {},
  });

  const startChatWithContext = async (focusAreas: string[], mood: string) => {
    // Check for offline status
    if (isOffline) {
      Alert.alert(
        'No Internet Connection',
        'AI-powered conversations require an internet connection. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    const focusLabels = focusAreas.map(
      (id) => FOCUS_AREAS.find((f) => f.id === id)?.label || id
    ).join(", ");
    const moodLabel = MOODS.find((m) => m.id === mood)?.label || mood;
    const appLang = getAppLanguageById(userPreferences.appLanguage);
    const languageInstruction = appLang?.name
      ? `CRITICAL LANGUAGE RULE: Respond ONLY in ${appLang.name}. Do not mix languages.`
      : `CRITICAL LANGUAGE RULE: Respond ONLY in the user's selected app language. Do not mix languages.`;

    console.log('Starting chat with context:', { focusLabels, moodLabel });

    setShowChatOnboarding(false);
    setShowChatInterface(true);

    // Show typing indicator before first message
    setIsTyping(true);
    
    setTimeout(() => {
      sendMessage({
        text: `You are a compassionate Christian AI counselor. The user feels ${moodLabel} and wants support with: ${focusLabels}.

${languageInstruction}

CRITICAL - RESPONSE LENGTH RULES:
- MAXIMUM 2-3 sentences per response
- Each response should be 40-80 words MAX
- Think of this like texting a supportive friend
- ONE thought or question per message
- No long explanations in a single response
- Break complex ideas across multiple exchanges

CONVERSATION STYLE:
- Be warm, genuine, and conversational
- Use simple, everyday language
- Ask open-ended questions naturally
- Validate feelings with short, heartfelt phrases
- Reference Scripture briefly when relevant (don't over-quote)
- Respond like a caring human, not an AI
- Use contractions (I'm, you're, let's)
- Occasional empathetic interjections (I hear you, That makes sense, etc.)

Your approach:
1. Listen with empathy (2 sentences max)
2. Provide biblical wisdom naturally when appropriate
3. Offer one practical suggestion at a time
4. Encourage professional help when needed
5. Create a safe, judgment-free space

Start with: A warm 2-sentence greeting acknowledging they're feeling ${moodLabel}. Then ask ONE simple, caring question about ${focusLabels}.`,
      });
      setIsTyping(false);
    }, 1500); // Simulate thinking time
  };

  const resetToDaily = () => {
    setGeneratedTherapy(null);
    setShowMainMenu(true);
    setShowFocusSelection(false);
    setSelectedFocus([]);
    setSelectedMood(null);
    setShowChatInterface(false);
    setShowChatOnboarding(false);
    setChatFocus([]);
    setChatMood(null);
    setChatMessageCount(0);
  };

  const handleScheduleSession = async (dateTime: Date, recurrence: any, recurrenceEndDate?: Date) => {
    const sessionId = await scheduleSession(
      dateTime,
      '🧠 Therapy Session',
      "Time for your therapy session. Take a moment to check in with yourself and God.",
      recurrence,
      recurrenceEndDate
    );

    if (sessionId) {
      const recurrenceText = recurrence !== 'none' ? ` (repeats ${recurrence})` : '';
      Alert.alert(
        'Session Scheduled! ✅',
        `Your next therapy session is scheduled for ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${recurrenceText}.

You'll receive a notification to remind you.`,
        [{ text: 'Great!' }]
      );
      setShowScheduleModal(false);
    } else {
      Alert.alert(
        'Unable to Schedule',
        'Please enable notifications in your device settings to schedule therapy sessions.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const messageText = chatInput.trim();
    setChatInput("");

    // Show typing indicator with realistic delay
    const thinkingTime = Math.min(2000 + (messageText.length * 20), 4000); // 2-4 seconds based on message length
    setIsTyping(true);

    setTimeout(() => {
      if (voiceModeEnabled) {
        sendMessage(messageText);
      } else {
        sendMessage(messageText);
      }
      
      // Keep typing indicator for a bit after sending
      setTimeout(() => {
        setIsTyping(false);
      }, 800);
    }, thinkingTime);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const speakText = useCallback(async (text: string) => {
    try {
      if (isSpeaking) {
        console.log('Already speaking, skipping...');
        return;
      }

      console.log('Starting TTS:', text.substring(0, 50));

      if (Platform.OS === 'web') {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = speechVolume;
        utterance.rate = speechRate;

        if (selectedVoice && availableVoices.length > 0) {
          const voice = availableVoices.find(v => v.name === selectedVoice);
          if (voice) {
            utterance.voice = voice;
          }
        } else {
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Enhanced') ||
              v.name.includes('Premium') ||
              v.name.includes('Samantha') ||
              v.name.includes('Google'))
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onstart = () => {
          console.log('TTS started');
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          console.log('TTS ended');
          setIsSpeaking(false);
        };
        utterance.onerror = (error) => {
          console.error('TTS error:', error);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        await Speech.stop();
        setIsSpeaking(true);

        await Speech.speak(text, {
          volume: speechVolume,
          rate: speechRate,
          voice: selectedVoice || undefined,
          onDone: () => {
            console.log('TTS done');
            setIsSpeaking(false);
          },
          onStopped: () => {
            console.log('TTS stopped');
            setIsSpeaking(false);
          },
          onError: (error) => {
            console.error('TTS error:', error);
            setIsSpeaking(false);
          },
        });
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, [isSpeaking, speechVolume, speechRate, selectedVoice, availableVoices]);

  const stopSpeaking = () => {
    console.log('Stopping TTS');
    if (Platform.OS === 'web') {
      window.speechSynthesis.cancel();
    } else {
      Speech.stop();
    }
    setIsSpeaking(false);
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        return true;
      }

      const { status, canAskAgain } = await Audio.getPermissionsAsync();

      if (status === 'granted') {
        return true;
      }

      if (status === 'denied' && !canAskAgain) {
        Alert.alert(
          'Microphone Permission Required',
          'Please enable microphone access in your device settings to use voice input.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const { status: newStatus } = await Audio.requestPermissionsAsync();
      return newStatus === 'granted';
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      if (!hasRequestedPermission && Platform.OS !== 'web') {
        const granted = await requestMicrophonePermission();
        if (!granted) {
          return;
        }
        setHasRequestedPermission(true);
      }

      if (isSpeaking) {
        stopSpeaking();
      }

      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } else {

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync({
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {},
        });

        setRecording(newRecording);
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert(tr('Recording Error'), tr('Failed to start recording. Please try again.'));
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);

      if (Platform.OS === 'web') {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();

          await new Promise<void>((resolve) => {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.onstop = () => resolve();
            }
          });

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await transcribeAudio(audioBlob);

          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          mediaRecorderRef.current = null;
        }
      } else {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        if (uri) {
          const uriParts = uri.split('.');
          const fileType = uriParts[uriParts.length - 1];

          const audioFile = {
            uri,
            name: `recording.${fileType}`,
            type: `audio/${fileType}`,
          };

          await transcribeAudio(audioFile);
        }

        setRecording(null);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert(tr('Recording Error'), tr('Failed to process recording. Please try again.'));
      setIsTranscribing(false);
    }
  };

  const transcribeAudio = async (audioData: Blob | { uri: string; name: string; type: string }) => {
    try {
      console.log('Starting transcription...');
      const formData = new FormData();

      if (audioData instanceof Blob) {
        if (audioData.size < 100) {
          console.warn('Audio file too small, likely no audio recorded');
          Alert.alert(tr('Recording Too Short'), tr('Please try recording again and speak clearly.'));
          setIsTranscribing(false);
          return;
        }
        console.log('Transcribing web audio, blob size:', audioData.size);
        formData.append('audio', audioData, 'recording.webm');
      } else {
        console.log('Transcribing mobile audio:', audioData.name, audioData.type);
        formData.append('audio', audioData as any);
      }

      console.log('Sending transcription request...');
      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      console.log('Transcription response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Transcription API error:', errorText);

        if (response.status === 400) {
          Alert.alert(tr('Invalid Audio'), tr('The audio format is not supported. Please try again.'));
        } else if (response.status === 413) {
          Alert.alert(tr('Audio Too Large'), tr('Recording is too long. Please keep it under 25MB.'));
        } else {
          Alert.alert(tr('Transcription Error'), tr('Failed to process your recording. Please try again.'));
        }
        setIsTranscribing(false);
        return;
      }

      const result = await response.json();
      console.log('Transcription result:', result);

      if (result.text && result.text.trim()) {
        console.log('Transcription successful:', result.text);

        if (voiceModeEnabled) {
          sendMessage(result.text);
        } else {
          setChatInput(result.text);
        }
      } else {
        console.warn('No speech detected in audio');
        Alert.alert(tr('No Speech Detected'), tr('Please try speaking more clearly.'));
      }
    } catch (error) {
      console.error('Transcription error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        tr('Transcription Error'),
        `${tr('Failed to transcribe:')} ${errorMessage}. ${tr('Please check your internet connection and try again.')}`
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      if (Platform.OS === 'web') {
        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        setAvailableVoices(englishVoices);

        const defaultVoice = englishVoices.find(v =>
          v.name.includes('Natural') ||
          v.name.includes('Enhanced') ||
          v.name.includes('Premium') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google')
        );
        if (defaultVoice && !selectedVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      } else {
        Speech.getAvailableVoicesAsync().then(voices => {
          const englishVoices = voices.filter(v => v.language.startsWith('en'));
          setAvailableVoices(englishVoices);

          const defaultVoice = englishVoices.find(v =>
            v.quality && (v.quality as string).includes('Enhanced')
          ) || englishVoices[0];

          if (defaultVoice && !selectedVoice) {
            setSelectedVoice(defaultVoice.identifier);
          }
        }).catch(console.error);
      }
    };

    if (Platform.OS === 'web') {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, [selectedVoice]);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      stopSpeaking();
    };
  }, [recording]);

  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (messages.length > 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Count non-system messages
      const userMessages = messages.filter(m => 
        m.role === 'user' && 
        !m.parts.some((part: any) => 
          part.type === 'text' && part.text.includes('You are a compassionate Christian AI counselor')
        )
      );
      setChatMessageCount(userMessages.length);

      const lastMessage = messages[messages.length - 1];

      if (voiceModeEnabled && lastMessage && lastMessage.role === 'assistant' && lastMessage.id !== lastMessageIdRef.current) {
        lastMessageIdRef.current = lastMessage.id;

        const textParts = lastMessage.parts
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join(' ');

        if (textParts.trim() && !isSpeaking) {
          console.log('Speaking new assistant message:', lastMessage.id);
          speakText(textParts).catch(console.error);
        }
      }
    }
  }, [messages, voiceModeEnabled, isSpeaking, speakText]);

  if (!isLoaded || !therapy) {
    return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{tr("Loading...")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showMainMenu) {
    return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.menuHeader}>
              <Brain size={40} color={colors.light.primary} />
              <Text style={styles.menuTitle}>{tr("Faith-Based Support")}</Text>
              <Text style={styles.menuSubtitle}>
                {tr("Choose how you'd like to receive guidance and support today")}
              </Text>
            </View>

            <View style={styles.menuOptions}>
              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => {
                  if (isOffline) {
                    Alert.alert(
                      tr("No Internet Connection"),
                      tr("AI-powered features require an internet connection. Please connect to the internet to use personalized sessions."),
                      [{ text: tr("OK") }]
                    );
                    return;
                  }
                  setShowMainMenu(false);
                  setShowFocusSelection(true);
                }}
              >
                <View style={styles.menuCardHeader}>
                  <View style={styles.menuIconContainer}>
                    <Sparkles size={28} color={colors.light.primary} />
                  </View>
                  <Text style={styles.menuCardTitle}>{tr("Personalized Session")}</Text>
                  {isOffline && (
                    <View style={styles.offlineBadge}>
                      <Text style={styles.offlineBadgeText}>{tr("Offline")}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuCardDescription}>
                  {tr("Get a custom faith-based therapy session with Scripture, practical steps, and prayers tailored to your needs")}
                </Text>
                <View style={styles.menuCardFeatures}>
                  <View style={styles.featureRow}>
                    <Check size={16} color={colors.light.success} />
                    <Text style={styles.featureText}>{tr("Biblical guidance")}</Text>
                  </View>
                  <View style={styles.featureRow}>
                    <Check size={16} color={colors.light.success} />
                    <Text style={styles.featureText}>{tr("Practical action steps")}</Text>
                  </View>
                  <View style={styles.featureRow}>
                    <Check size={16} color={colors.light.success} />
                    <Text style={styles.featureText}>{tr("Prayer prompts")}</Text>
                  </View>
                </View>
                {isOffline && (
                  <View style={styles.offlineNotice}>
                    <AlertTriangle size={14} color={colors.light.warning} />
                    <Text style={styles.offlineNoticeText}>{tr("Requires internet connection")}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => {
                  if (isOffline) {
                    Alert.alert(
                      tr("No Internet Connection"),
                      tr("AI-powered conversations require an internet connection. Please connect to the internet to chat."),
                      [{ text: tr("OK") }]
                    );
                    return;
                  }
                  setShowMainMenu(false);
                  setShowChatOnboarding(true);
                }}
              >
                <View style={styles.menuCardHeader}>
                  <View style={[styles.menuIconContainer, styles.menuIconContainerAlt]}>
                    <MessageCircle size={28} color={colors.light.accent} />
                  </View>
                  <Text style={styles.menuCardTitle}>{tr("Supportive Conversation")}</Text>
                  {isOffline && (
                    <View style={styles.offlineBadge}>
                      <Text style={styles.offlineBadgeText}>{tr("Offline")}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuCardDescription}>
                  {tr("Chat with a compassionate AI counselor for real-time emotional support and biblical wisdom")}
                </Text>
                <View style={styles.menuCardFeatures}>
                  <View style={styles.featureRow}>
                    <Check size={16} color={colors.light.success} />
                    <Text style={styles.featureText}>{tr("Real-time responses")}</Text>
                  </View>
                  <View style={styles.featureRow}>
                    <Check size={16} color={colors.light.success} />
                    <Text style={styles.featureText}>{tr("Empathetic listening")}</Text>
                  </View>
                  <View style={styles.featureRow}>
                    <Check size={16} color={colors.light.success} />
                    <Text style={styles.featureText}>{tr("Faith-based guidance")}</Text>
                  </View>
                </View>
                {isOffline && (
                  <View style={styles.offlineNotice}>
                    <AlertTriangle size={14} color={colors.light.warning} />
                    <Text style={styles.offlineNoticeText}>{tr("Requires internet connection")}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.menuDisclaimer}>
              <AlertTriangle size={16} color={colors.light.warning} />
              <Text style={styles.menuDisclaimerText}>
                {tr("These tools support your well-being but don't replace professional therapy")}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (showChatOnboarding) {
    return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButtonTop}
              onPress={() => {
                setShowChatOnboarding(false);
                setShowMainMenu(true);
              }}
            >
              <ArrowLeft size={20} color={colors.light.text} />
              <Text style={styles.backButtonText}>{tr("Back")}</Text>
            </TouchableOpacity>

            <View style={styles.selectionHeader}>
              <MessageCircle size={32} color={colors.light.accent} />
              <Text style={styles.selectionTitle}>{tr("Let's understand how you're feeling")}</Text>
              <Text style={styles.selectionSubtitle}>
                {tr("This helps me provide better support tailored to your needs")}
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {FOCUS_AREAS.map((focus) => (
                <TouchableOpacity
                  key={focus.id}
                  style={[
                    styles.optionCard,
                    chatFocus.includes(focus.id) && styles.optionCardSelected,
                  ]}
                  onPress={() => {
                    setChatFocus((prev) =>
                      prev.includes(focus.id)
                        ? prev.filter((id) => id !== focus.id)
                        : [...prev, focus.id]
                    );
                  }}
                >
                  <Text style={styles.optionEmoji}>{focus.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      chatFocus.includes(focus.id) && styles.optionLabelSelected,
                    ]}
                  >
                    {tr(focus.label)}
                  </Text>
                  {chatFocus.includes(focus.id) && (
                    <View style={styles.checkmark}>
                      <Check size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.moodSection}>
              <Text style={styles.moodTitle}>{tr("How are you feeling right now?")}</Text>
              <View style={styles.moodContainer}>
                {MOODS.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodCard,
                      chatMood === mood.id && styles.moodCardSelected,
                    ]}
                    onPress={() => setChatMood(mood.id)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        chatMood === mood.id && styles.moodLabelSelected,
                      ]}
                    >
                    {tr(mood.label)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.generateButton,
                (chatFocus.length === 0 || !chatMood) &&
                styles.generateButtonDisabled,
              ]}
              onPress={() => {
                if (chatFocus.length > 0 && chatMood) {
                  if (!hasAcceptedDisclaimer) {
                    setShowDisclaimerModal(true);
                  } else {
                    startChatWithContext(chatFocus, chatMood);
                  }
                }
              }}
              disabled={chatFocus.length === 0 || !chatMood}
            >
              <MessageCircle size={20} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>{tr("Start Conversation")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={showDisclaimerModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDisclaimerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDisclaimerModal(false)}
              >
                <X size={24} color={colors.light.textSecondary} />
              </TouchableOpacity>

              <View style={styles.modalHeader}>
                <View style={styles.warningIconContainer}>
                  <AlertTriangle size={32} color={colors.light.warning} />
                </View>
                <Text style={styles.modalTitle}>{tr("Important Information")}</Text>
              </View>

              <ScrollView
                style={[styles.modalScroll, { minHeight: 300 }]}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.disclaimerContent}>
                  <Text style={styles.disclaimerBold}>{tr("This is NOT Professional Therapy")}</Text>
                  <Text style={styles.disclaimerParagraph}>
                    Our AI-powered supportive conversations are designed to provide emotional support and biblical guidance. However, they do not replace professional mental health care.
                  </Text>

                  <Text style={styles.disclaimerBold}>{tr("When to Seek Professional Help")}</Text>
                  <Text style={styles.disclaimerParagraph}>
                    If you&apos;re experiencing severe mental health concerns, thoughts of self-harm, or crisis situations, please immediately contact:
                  </Text>
                  <View style={styles.emergencyContacts}>
                    <Text style={styles.emergencyText}>• National Suicide Prevention Lifeline: 988</Text>
                    <Text style={styles.emergencyText}>• Crisis Text Line: Text HOME to 741741</Text>
                    <Text style={styles.emergencyText}>• Emergency Services: 911</Text>
                  </View>

                  <Text style={styles.disclaimerBold}>{tr("Privacy & Data")}</Text>
                  <Text style={styles.disclaimerParagraph}>
                    Your conversations are used to provide personalized support. Please avoid sharing sensitive personal information like full name, address, or financial details.
                  </Text>

                  <Text style={styles.disclaimerBold}>{tr("Faith-Based Guidance")}</Text>
                  <Text style={styles.disclaimerParagraph}>
                    Our responses are rooted in Christian faith and biblical principles. They are meant to supplement, not replace, your relationship with God, your church community, and professional care when needed.
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => setShowDisclaimerModal(false)}
                >
                  <Text style={styles.declineButtonText}>{tr("Cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => {
                    console.log('Disclaimer accepted. Chat focus:', chatFocus, 'Chat mood:', chatMood);
                    setHasAcceptedDisclaimer(true);
                    setShowDisclaimerModal(false);

                    if (chatFocus.length > 0 && chatMood) {
                      console.log('Starting chat with context after disclaimer acceptance');
                      startChatWithContext(chatFocus, chatMood);
                    } else {
                      console.warn('Cannot start chat: missing focus or mood', { chatFocus, chatMood });
                    }
                  }}
                >
                  <Text style={styles.acceptButtonText}>{tr("I Understand")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Error Details Modal */}
        <Modal
          visible={errorDetails !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setErrorDetails(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setErrorDetails(null)}
              >
                <X size={24} color={colors.light.textSecondary} />
              </TouchableOpacity>

              <View style={styles.modalHeader}>
                <View style={styles.warningIconContainer}>
                  <AlertTriangle size={32} color={colors.light.error} />
                </View>
                <Text style={styles.modalTitle}>{tr("Error Details")}</Text>
                <Text style={styles.modalSubtitle}>{tr("Diagnostic Information")}</Text>
              </View>

              <ScrollView
                style={[styles.modalScroll, { minHeight: 300 }]}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.errorDetailsContent}>
                  <View style={styles.errorDetailRow}>
                    <Text style={styles.errorDetailLabel}>{tr("Error Type:")}</Text>
                    <Text style={styles.errorDetailValue}>{errorDetails?.type || 'Unknown'}</Text>
                  </View>

                  <View style={styles.errorDetailRow}>
                    <Text style={styles.errorDetailLabel}>{tr("Error Message:")}</Text>
                    <Text style={styles.errorDetailValue}>{errorDetails?.message || 'No message'}</Text>
                  </View>

                  <View style={styles.errorDetailRow}>
                    <Text style={styles.errorDetailLabel}>{tr("Platform:")}</Text>
                    <Text style={styles.errorDetailValue}>{errorDetails?.platform || 'Unknown'}</Text>
                  </View>

                  <View style={styles.errorDetailRow}>
                    <Text style={styles.errorDetailLabel}>{tr("Toolkit URL (Constants):")}</Text>
                    <Text style={styles.errorDetailValue}>{errorDetails?.toolkitUrl || 'Not configured'}</Text>
                  </View>

                  {errorDetails?.processEnv && (
                    <View style={styles.errorDetailRow}>
                      <Text style={styles.errorDetailLabel}>{tr("Toolkit URL (process.env):")}</Text>
                      <Text style={styles.errorDetailValue}>{errorDetails.processEnv}</Text>
                    </View>
                  )}

                  <View style={styles.errorHelpSection}>
                    <Text style={styles.errorHelpTitle}>{tr("What to check:")}</Text>
                    <Text style={styles.errorHelpText}>{tr("• Verify internet connection")}</Text>
                    <Text style={styles.errorHelpText}>{tr("• Check if Toolkit URL is configured")}</Text>
                    <Text style={styles.errorHelpText}>{tr("• Ensure app has network permissions")}</Text>
                    <Text style={styles.errorHelpText}>{tr("• Try again in a few moments")}</Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => setErrorDetails(null)}
                >
                  <Text style={styles.acceptButtonText}>{tr("Close")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  if (showFocusSelection) {
    return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButtonTop}
              onPress={() => {
                setShowFocusSelection(false);
                setShowMainMenu(true);
              }}
            >
              <ArrowLeft size={20} color={colors.light.text} />
              <Text style={styles.backButtonText}>{tr("Back")}</Text>
            </TouchableOpacity>

            <View style={styles.selectionHeader}>
              <Sparkles size={32} color={colors.light.primary} />
              <Text style={styles.selectionTitle}>{tr("What do you want to focus on today?")}</Text>
              <Text style={styles.selectionSubtitle}>
                Choose areas where you&apos;re seeking healing and biblical guidance
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {FOCUS_AREAS.map((focus) => (
                <TouchableOpacity
                  key={focus.id}
                  style={[
                    styles.optionCard,
                    selectedFocus.includes(focus.id) && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleFocus(focus.id)}
                >
                  <Text style={styles.optionEmoji}>{focus.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedFocus.includes(focus.id) && styles.optionLabelSelected,
                    ]}
                  >
                    {tr(focus.label)}
                  </Text>
                  {selectedFocus.includes(focus.id) && (
                    <View style={styles.checkmark}>
                      <Check size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.moodSection}>
              <Text style={styles.moodTitle}>{tr("How are you feeling right now?")}</Text>
              <View style={styles.moodContainer}>
                {MOODS.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodCard,
                      selectedMood === mood.id && styles.moodCardSelected,
                    ]}
                    onPress={() => setSelectedMood(mood.id)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        selectedMood === mood.id && styles.moodLabelSelected,
                      ]}
                    >
                    {tr(mood.label)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.generateButton,
                (selectedFocus.length === 0 || !selectedMood || isGenerating) &&
                styles.generateButtonDisabled,
              ]}
              onPress={generatePersonalizedTherapy}
              disabled={selectedFocus.length === 0 || !selectedMood || isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Sparkles size={20} color="#FFFFFF" />
                  <Text style={styles.generateButtonText}>{tr("Generate My Session")}</Text>
                </>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (showChatInterface) {
    return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={[colors.light.background, colors.light.cardBackground]}
          style={StyleSheet.absoluteFillObject}
        />
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={resetToDaily} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.light.text} />
            </TouchableOpacity>
            <View style={styles.chatHeaderContent}>
              <MessageCircle size={24} color={colors.light.accent} />
              <Text style={styles.chatHeaderTitle}>{tr("Supportive Conversation")}</Text>
            </View>
            <View style={styles.chatHeaderActions}>
              {chatMessageCount >= 5 && (
                <TouchableOpacity
                  onPress={() => setShowScheduleModal(true)}
                  style={styles.scheduleButton}
                >
                  <Calendar size={20} color={colors.light.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setShowVoiceSettings(!showVoiceSettings)}
                style={styles.voiceModeToggle}
              >
                <Settings size={24} color={colors.light.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (voiceModeEnabled && isSpeaking) {
                    stopSpeaking();
                  }
                  setVoiceModeEnabled(!voiceModeEnabled);
                }}
                style={styles.voiceModeToggle}
              >
                {voiceModeEnabled ? (
                  <Volume2 size={24} color={colors.light.primary} />
                ) : (
                  <VolumeX size={24} color={colors.light.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {showVoiceSettings && (
            <View style={styles.voiceSettingsPanel}>
              <Text style={styles.voiceSettingsTitle}>{tr("Voice Settings")}</Text>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>{tr("Volume:")} {Math.round(speechVolume * 100)}%</Text>
                <View style={styles.sliderControls}>
                  <TouchableOpacity
                    onPress={() => setSpeechVolume(Math.max(0, speechVolume - 0.1))}
                    style={styles.sliderButton}
                  >
                    <Minus size={16} color={colors.light.text} />
                  </TouchableOpacity>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${speechVolume * 100}%` }]} />
                  </View>
                  <TouchableOpacity
                    onPress={() => setSpeechVolume(Math.min(1, speechVolume + 0.1))}
                    style={styles.sliderButton}
                  >
                    <Plus size={16} color={colors.light.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>{tr("Speed:")} {speechRate.toFixed(1)}x</Text>
                <View style={styles.sliderControls}>
                  <TouchableOpacity
                    onPress={() => setSpeechRate(Math.max(0.5, speechRate - 0.1))}
                    style={styles.sliderButton}
                  >
                    <Minus size={16} color={colors.light.text} />
                  </TouchableOpacity>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${((speechRate - 0.5) / 1.5) * 100}%` }]} />
                  </View>
                  <TouchableOpacity
                    onPress={() => setSpeechRate(Math.min(2.0, speechRate + 0.1))}
                    style={styles.sliderButton}
                  >
                    <Plus size={16} color={colors.light.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {availableVoices.length > 0 && (
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>{tr("Voice")}</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.voiceScroll}
                  >
                    {availableVoices.slice(0, 5).map((voice) => {
                      const voiceId = Platform.OS === 'web' ? voice.name : voice.identifier;
                      const voiceName = Platform.OS === 'web' ? voice.name : voice.name;
                      return (
                        <TouchableOpacity
                          key={voiceId}
                          style={[
                            styles.voiceChip,
                            selectedVoice === voiceId && styles.voiceChipSelected,
                          ]}
                          onPress={() => setSelectedVoice(voiceId)}
                        >
                          <Text
                            style={[
                              styles.voiceChipText,
                              selectedVoice === voiceId && styles.voiceChipTextSelected,
                            ]}
                            numberOfLines={1}
                          >
                            {voiceName.split(' ')[0]}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity
                style={styles.testVoiceButton}
                onPress={() => speakText(tr("Hello, this is a test of the selected voice settings."))}
                disabled={isSpeaking}
              >
                <Volume2 size={16} color="#FFFFFF" />
                <Text style={styles.testVoiceButtonText}>
                  {isSpeaking ? tr("Speaking...") : tr("Test Voice")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            ref={flatListRef}
            data={messages.filter((msg) => {
              if (msg.role === 'user') {
                const hasSystemPrompt = msg.parts.some((part: any) =>
                  part.type === 'text' && part.text.includes('You are a compassionate Christian AI counselor')
                );
                return !hasSystemPrompt;
              }
              return true;
            })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item: message }) => (
              <View style={styles.messageWrapper}>
                <View
                  style={[
                    styles.messageBubble,
                    message.role === "user" ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  {message.parts.map((part: any, i: number) => {
                    if (part.type === "text") {
                      return (
                        <Text
                          key={`part-${message.id}-${i}`}
                          style={[
                            styles.messageText,
                            message.role === "user" ? styles.userMessageText : styles.aiMessageText,
                          ]}
                        >
                          {part.text}
                        </Text>
                      );
                    }
                    return null;
                  })}
                </View>
                <Text style={styles.messageTime}>
                  {message.role === "user" ? tr("You") : tr("Counselor")}
                </Text>
              </View>
            )}
          />

          {isTyping && (
            <View style={styles.typingIndicatorContainer}>
              <TypingIndicator />
            </View>
          )}

          <View style={styles.suggestedQuestions}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                tr("I'm feeling anxious today"),
                tr("Help me with depression"),
                tr("I need prayer guidance"),
                tr("Dealing with relationships"),
              ].map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => {
                    setChatInput(question);
                  }}
                >
                  <Text style={styles.suggestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {isRecording && (
            <View style={styles.recordingHint}>
              <View style={styles.recordingPulse} />
              <Text style={styles.recordingHintText}>{tr("Recording... Tap mic to stop")}</Text>
            </View>
          )}

          <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom + 12, 32) }]}>
            {!isRecording && !isTranscribing && !isSpeaking && (
              <View style={styles.voiceButtonWrapper}>
                <TouchableOpacity
                  style={styles.voiceButton}
                  onPress={startRecording}
                >
                  <Mic size={20} color={colors.light.primary} />
                </TouchableOpacity>
                {messages.length <= 2 && (
                  <View style={styles.voiceHintBubble}>
                    <Text style={styles.voiceHintText}>{tr("Hold to record")}</Text>
                  </View>
                )}
              </View>
            )}
            {isRecording && (
              <TouchableOpacity
                style={[styles.voiceButton, styles.voiceButtonActive]}
                onPress={stopRecording}
              >
                <MicOff size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {isTranscribing && (
              <View style={styles.voiceButton}>
                <ActivityIndicator size="small" color={colors.light.primary} />
              </View>
            )}
            {isSpeaking && (
              <TouchableOpacity
                style={[styles.voiceButton, styles.voiceButtonSpeaking]}
                onPress={stopSpeaking}
              >
                <Volume2 size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TextInput
              style={styles.textInput}
              value={chatInput}
              onChangeText={setChatInput}
              placeholder={
                isRecording
                  ? tr("Recording... Tap mic to stop")
                  : isTranscribing
                    ? tr("Processing...")
                    : isSpeaking
                      ? tr("Speaking...")
                      : tr("Share what's on your heart...")
              }
              placeholderTextColor={colors.light.textSecondary}
              multiline
              maxLength={500}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
              editable={!isRecording && !isTranscribing && !isSpeaking}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!chatInput.trim() || isRecording || isTranscribing || isSpeaking) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!chatInput.trim() || isRecording || isTranscribing || isSpeaking}
            >
              <Send size={20} color={chatInput.trim() && !isRecording && !isTranscribing && !isSpeaking ? "#FFFFFF" : colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScheduleNextSessionModal
            visible={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
            onSchedule={handleScheduleSession}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const displayTherapy = (therapy && translatedTherapy)
    ? ({ ...therapy, ...translatedTherapy } as any)
    : therapy;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.light.background, colors.light.cardBackground]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Share Button - Floating Action Button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => captureAndShare(tr("Share this therapy session from Christian Daily Bread"))}
        disabled={isCapturing}
        activeOpacity={0.8}
      >
        {isCapturing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Share2 size={18} color="#FFFFFF" />
        )}
      </TouchableOpacity>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 32, 120) }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View ref={viewRef} collapsable={false} style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton} onPress={resetToDaily}>
              <Text style={styles.actionButtonText}>{tr("← New Session")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Brain size={16} color={colors.light.primary} />
              <Text style={styles.categoryText}>{displayTherapy.category}</Text>
            </View>
            <Text style={styles.title}>{displayTherapy.title}</Text>
            <Text style={styles.topic}>{displayTherapy.topic}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Heart size={24} color={colors.light.accent} />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{tr("Scripture Foundation")}</Text>
                <Text style={styles.scripture}>
                  {displayTherapy.scripture} {bibleVersion && `(${bibleVersion.abbreviation})`}
                </Text>
              </View>
            </View>

            <View style={styles.verseContainer}>
              <View style={styles.quoteMarkContainer}>
                <Text style={styles.quoteMark}>&quot;</Text>
              </View>
              <Text style={styles.verse}>{displayTherapy.verse}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tr("Therapeutic Focus")}</Text>
            <Text style={styles.sectionText}>{displayTherapy.therapeuticFocus}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tr("Practical Steps")}</Text>
            <Text style={styles.sectionSubtitle}>
              {tr("Try these evidence-based practices today:")}
            </Text>
            <View style={styles.stepsContainer}>
              {displayTherapy.practicalSteps.map((step: string, index: number) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.reflectionCard}>
            <Text style={styles.reflectionTitle}>{tr("Reflection")}</Text>
            <Text style={styles.reflectionText}>{displayTherapy.reflection}</Text>
          </View>

          <View style={styles.prayerPrompt}>
            <View style={styles.prayerHeader}>
              <Check size={20} color={colors.light.success} />
              <Text style={styles.prayerPromptTitle}>{tr("Prayer for Healing")}</Text>
            </View>
            <Text style={styles.prayerPromptText}>{displayTherapy.prayerPrompt}</Text>
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              {tr("Note: This content is designed to support your spiritual and emotional well-being. If you're experiencing severe mental health concerns, please seek professional help from a licensed counselor or therapist.")}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: isTablet ? 32 : (isSmallScreen ? 16 : 20),
    paddingTop: 16, // Consistent top padding for all devices
  },
  header: {
    marginBottom: 24,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${colors.light.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.light.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
    lineHeight: 36,
  },
  topic: {
    fontSize: 16,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  card: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.light.accent}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 4,
  },
  scripture: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  verseContainer: {
    position: "relative" as const,
    paddingLeft: 20,
  },
  quoteMarkContainer: {
    position: "absolute" as const,
    left: -4,
    top: -8,
  },
  quoteMark: {
    fontSize: 48,
    color: colors.light.accent,
    fontWeight: "700" as const,
    opacity: 0.3,
  },
  verse: {
    fontSize: 17,
    lineHeight: 28,
    color: colors.light.text,
    fontStyle: "italic" as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.light.textSecondary,
  },
  stepsContainer: {
    gap: 16,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.text,
  },
  reflectionCard: {
    backgroundColor: `${colors.light.accent}08`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.accent,
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  reflectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
  },
  prayerPrompt: {
    backgroundColor: `${colors.light.success}15`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.success,
  },
  prayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  prayerPromptTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  prayerPromptText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
    fontStyle: "italic" as const,
  },
  disclaimer: {
    backgroundColor: `${colors.light.warning}15`,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: `${colors.light.warning}40`,
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  actionBar: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${colors.light.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.light.primary,
  },
  selectionHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  selectionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.light.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  selectionSubtitle: {
    fontSize: 15,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.cardBackground,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  optionCardSelected: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  optionLabelSelected: {
    color: colors.light.primary,
    fontWeight: "700" as const,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  moodSection: {
    marginBottom: 32,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 16,
    textAlign: "center",
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  moodCard: {
    alignItems: "center",
    backgroundColor: colors.light.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.border,
    minWidth: 100,
  },
  moodCardSelected: {
    borderColor: colors.light.accent,
    backgroundColor: `${colors.light.accent}08`,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  moodLabelSelected: {
    color: colors.light.accent,
    fontWeight: "700" as const,
  },
  generateButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  chatButton: {
    backgroundColor: colors.light.cardBackground,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.light.accent,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 24,
    width: "100%",
    maxWidth: isTablet ? 600 : 500,
    minHeight: isTablet ? "60%" : "50%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  closeButton: {
    position: "absolute" as const,
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  warningIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.light.warning}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.light.text,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  modalScroll: {
    maxHeight: isTablet ? 500 : 400,
    minHeight: 300,
  },
  disclaimerContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  disclaimerBold: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  disclaimerParagraph: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
    marginBottom: 12,
  },
  emergencyContacts: {
    backgroundColor: `${colors.light.error}08`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.error,
  },
  emergencyText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.light.text,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.light.cardBackground,
    borderWidth: 2,
    borderColor: colors.light.border,
    alignItems: "center",
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.textSecondary,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.light.primary,
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  chatHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  userMessage: {
    backgroundColor: colors.light.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: colors.light.cardBackground,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  aiMessageText: {
    color: colors.light.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  typingIndicatorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestedQuestions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  suggestionChip: {
    backgroundColor: colors.light.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.light.text,
    fontWeight: "600" as const,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: isTablet ? 24 : 16,
    paddingTop: 12,
    // paddingBottom handled dynamically
    backgroundColor: colors.light.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.light.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.light.border,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  voiceButtonActive: {
    backgroundColor: colors.light.error,
    borderColor: colors.light.error,
  },
  voiceButtonSpeaking: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  voiceModeToggle: {
    padding: 8,
  },
  scheduleButton: {
    padding: 8,
    backgroundColor: `${colors.light.primary}15`,
    borderRadius: 20,
  },
  chatHeaderActions: {
    flexDirection: "row",
    gap: 8,
  },
  voiceSettingsPanel: {
    backgroundColor: colors.light.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  voiceSettingsTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.text,
    marginBottom: 8,
  },
  sliderControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.light.background,
    borderRadius: 3,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: colors.light.primary,
    borderRadius: 3,
  },
  voiceScroll: {
    marginTop: 8,
  },
  voiceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
  },
  voiceChipSelected: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  voiceChipText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  voiceChipTextSelected: {
    color: "#FFFFFF",
  },
  testVoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.light.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  testVoiceButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  voiceButtonWrapper: {
    position: "relative" as const,
  },
  voiceHintBubble: {
    position: "absolute" as const,
    bottom: 50,
    left: -20,
    backgroundColor: colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderBottomLeftRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 100,
  },
  voiceHintText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    textAlign: "center",
  },
  recordingHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: `${colors.light.error}15`,
    borderTopWidth: 1,
    borderTopColor: `${colors.light.error}30`,
    gap: 10,
  },
  recordingPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.light.error,
  },
  recordingHintText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.light.error,
  },
  backButtonTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.light.text,
  },
  menuHeader: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  menuTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  menuSubtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  menuOptions: {
    gap: 20,
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: colors.light.cardBackground,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  menuCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconContainerAlt: {
    backgroundColor: `${colors.light.accent}15`,
  },
  menuCardTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.light.text,
  },
  menuCardDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
    marginBottom: 16,
  },
  menuCardFeatures: {
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.light.text,
    fontWeight: "600" as const,
  },
  menuDisclaimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${colors.light.warning}15`,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.light.warning}30`,
  },
  menuDisclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: colors.light.textSecondary,
  },
  errorDetailsContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  errorDetailRow: {
    marginBottom: 20,
  },
  errorDetailLabel: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 6,
  },
  errorDetailValue: {
    fontSize: 13,
    color: colors.light.textSecondary,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorHelpSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: `${colors.light.warning}08`,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.warning,
  },
  errorHelpTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: colors.light.text,
    marginBottom: 12,
  },
  errorHelpText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 6,
  },
  offlineBadge: {
    backgroundColor: colors.light.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  offlineBadgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textTransform: "uppercase" as const,
  },
  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  offlineNoticeText: {
    fontSize: 12,
    color: colors.light.warning,
    fontWeight: "600" as const,
  },
  shareButton: {
    position: "absolute" as const,
    right: 20,
    bottom: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});
