import colors from "@/constants/colors";
import { Tabs } from "expo-router";
import { BookOpen, BookMarked, Brain, HandHeart, Book, Settings } from "lucide-react-native";
import React, { useEffect } from "react";
import { useContent } from "@/contexts/ContentContext";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useRouter } from "expo-router";
import { t } from "@/utils/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TRIAL_EXPIRED_PAYWALL_SHOWN_KEY = "@trial_expired_paywall_shown";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { userPreferences } = useContent();
  const { isPremiumLocked } = usePremiumAccess();
  const router = useRouter();
  const lang = userPreferences.appLanguage;
  
  // Auto-open paywall ONCE when trial expires (paid regions only).
  useEffect(() => {
    const run = async () => {
      if (!isPremiumLocked) return;
      const alreadyShown = await AsyncStorage.getItem(TRIAL_EXPIRED_PAYWALL_SHOWN_KEY);
      if (alreadyShown === "1") return;
      await AsyncStorage.setItem(TRIAL_EXPIRED_PAYWALL_SHOWN_KEY, "1");
      router.push("/paywall");
    };
    void run();
  }, [isPremiumLocked, router]);
  
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.light.primary,
          tabBarInactiveTintColor: colors.light.tabIconDefault,
          headerShown: false, // Remove all headers
          tabBarStyle: {
            backgroundColor: colors.light.background,
            borderTopColor: colors.light.border,
            borderTopWidth: 1,
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom, 6),
            height: 60 + Math.max(insets.bottom, 0),
          },
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: "600" as const,
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}
      >
      <Tabs.Screen
        name="home"
        options={{
          title: t(lang, "tabs.home"),
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: t(lang, "tabs.prayer"),
          tabBarIcon: ({ color }) => <HandHeart size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: t(lang, "tabs.study"),
          tabBarIcon: ({ color }) => <BookMarked size={22} color={color} />,
          listeners: {
            tabPress: (e) => {
              if (isPremiumLocked) {
                e.preventDefault();
                router.push("/paywall");
              }
            },
          },
        }}
      />
      <Tabs.Screen
        name="therapy"
        options={{
          title: t(lang, "tabs.therapy"),
          tabBarIcon: ({ color }) => <Brain size={22} color={color} />,
          listeners: {
            tabPress: (e) => {
              if (isPremiumLocked) {
                e.preventDefault();
                router.push("/paywall");
              }
            },
          },
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: t(lang, "tabs.bible"),
          tabBarIcon: ({ color }) => <Book size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t(lang, "tabs.settings"),
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
    </View>
  );
}
