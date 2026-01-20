import colors from "@/constants/colors";
import { Tabs } from "expo-router";
import { BookOpen, BookMarked, Brain, HandHeart, Book, Settings } from "lucide-react-native";
import React from "react";
import { useContent } from "@/contexts/ContentContext";
import { t } from "@/utils/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { userPreferences } = useContent();
  const lang = userPreferences.appLanguage;
  
  return (
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
        }}
      />
      <Tabs.Screen
        name="therapy"
        options={{
          title: t(lang, "tabs.therapy"),
          tabBarIcon: ({ color }) => <Brain size={22} color={color} />,
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
  );
}
