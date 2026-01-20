import colors from "@/constants/colors";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ContentProvider, useContent } from "@/contexts/ContentContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ScheduledSessionsProvider } from "@/contexts/ScheduledSessionsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, Component, ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StyleSheet, Platform } from "react-native";
import { t } from "@/utils/i18n";
import { preCachePopularChapters } from "@/utils/bibleAPI";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Configure notification handler to show therapy notifications prominently
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isTherapySession = notification.request.content.data?.type === 'therapy_session';
    
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: isTherapySession ? true : false,
      shouldShowBanner: true,
      shouldShowList: true,
      // Make therapy sessions more prominent
      priority: isTherapySession 
        ? Notifications.AndroidNotificationPriority.MAX 
        : Notifications.AndroidNotificationPriority.HIGH,
    };
  },
});

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{this.state.error?.message}</Text>
          <Text style={styles.errorStack}>{this.state.error?.stack}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function RootLayoutNav() {
  const { userPreferences } = useContent();
  const lang = userPreferences.appLanguage;
  return (
    <>
      <StatusBar style="light" translucent={true} />
      <OfflineIndicator />
      <Stack
        screenOptions={{
          headerBackTitle: t(lang, "common.back"),
          headerStyle: {
            backgroundColor: colors.light.background,
          },
          headerTintColor: colors.light.primary,
          headerTitleStyle: {
            fontWeight: "700" as const,
            color: colors.light.text,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ title: t(lang, "headers.terms") }} />
        <Stack.Screen name="privacy" options={{ title: t(lang, "headers.privacy") }} />
        <Stack.Screen name="support" options={{ title: t(lang, "headers.support") }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    console.log('RootLayout mounted');
    SplashScreen.hideAsync();
    
    // Pre-cache popular Bible chapters for offline use
    // This runs in the background without blocking the app
    preCachePopularChapters('kjv').catch(err => 
      console.warn('Bible pre-caching failed (will work once user has internet):', err)
    );
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <ScheduledSessionsProvider>
            <ContentProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </ContentProvider>
          </ScheduledSessionsProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.light.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.light.error,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorStack: {
    fontSize: 10,
    color: colors.light.textTertiary,
    textAlign: 'left',
  },
});
