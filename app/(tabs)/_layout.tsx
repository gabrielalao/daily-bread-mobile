import colors from "@/constants/colors";
import { Tabs } from "expo-router";
import { BookOpen, BookMarked, Brain, HandHeart, Book, Settings } from "lucide-react-native";
import React, { useState, useCallback, useMemo } from "react";
import { Platform, TouchableOpacity, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContent } from "@/contexts/ContentContext";
import { t } from "@/utils/i18n";
import { SettingsModal } from "@/components/SettingsModal";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { userPreferences } = useContent();
  const lang = userPreferences.appLanguage;
  const [showSettings, setShowSettings] = useState(false);
  
  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);
  
  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);
  
  const appLogo = useMemo(() => (
    <View style={{
      marginLeft: 16,
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: colors.light.primary,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <BookOpen size={22} color="#FFFFFF" strokeWidth={2.5} />
    </View>
  ), []);
  
  const settingsButton = useMemo(() => (
    <TouchableOpacity
      onPress={handleOpenSettings}
      style={{
        marginRight: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: `${colors.light.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Settings size={20} color={colors.light.primary} />
    </TouchableOpacity>
  ), [handleOpenSettings]);
  
  return (
    <>
      {showSettings && (
        <SettingsModal visible={showSettings} onClose={handleCloseSettings} />
      )}
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.light.primary,
        tabBarInactiveTintColor: colors.light.tabIconDefault,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors.light.cardBackground,
          borderTopColor: colors.light.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
          height: 60 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600" as const,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: colors.light.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.light.border,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "700" as const,
          color: colors.light.text,
        },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t(lang, "tabs.home"),
          headerTitle: t(lang, "headers.dailyBread"),
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
          headerLeft: () => appLogo,
          headerRight: () => settingsButton,
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: t(lang, "tabs.prayer"),
          headerTitle: t(lang, "headers.prayerGuides"),
          tabBarIcon: ({ color }) => <HandHeart size={22} color={color} />,
          headerLeft: () => appLogo,
          headerRight: () => settingsButton,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: t(lang, "tabs.study"),
          headerTitle: t(lang, "headers.bibleStudy"),
          tabBarIcon: ({ color }) => <BookMarked size={22} color={color} />,
          headerLeft: () => appLogo,
          headerRight: () => settingsButton,
        }}
      />
      <Tabs.Screen
        name="therapy"
        options={{
          title: t(lang, "tabs.therapy"),
          headerTitle: t(lang, "headers.christianTherapy"),
          tabBarIcon: ({ color }) => <Brain size={22} color={color} />,
          headerLeft: () => appLogo,
          headerRight: () => settingsButton,
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: t(lang, "tabs.bible"),
          headerTitle: t(lang, "headers.holyBible"),
          tabBarIcon: ({ color }) => <Book size={22} color={color} />,
          headerLeft: () => appLogo,
          headerRight: () => settingsButton,
        }}
      />
    </Tabs>
    </>
  );
}
