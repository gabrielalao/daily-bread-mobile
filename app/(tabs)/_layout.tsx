import colors from "@/constants/colors";
import { Tabs } from "expo-router";
import { BookOpen, BookMarked, Brain, HandHeart, Book, Settings } from "lucide-react-native";
import React, { useState, useCallback, useMemo } from "react";
import { Platform, TouchableOpacity, View, Image, Dimensions, useWindowDimensions, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContent } from "@/contexts/ContentContext";
import { t } from "@/utils/i18n";
import { SettingsModal } from "@/components/SettingsModal";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { userPreferences } = useContent();
  const lang = userPreferences.appLanguage;
  const [showSettings, setShowSettings] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  
  // Get status bar height for Android
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  
  // Responsive sizing based on screen width
  const isSmallDevice = screenWidth < 375;
  const isMediumDevice = screenWidth >= 375 && screenWidth < 768;
  const isLargeDevice = screenWidth >= 768;
  
  // Dynamic sizes - smaller for Android to fit better
  const logoSize = Platform.OS === 'android' 
    ? (isSmallDevice ? 32 : 36) 
    : (isSmallDevice ? 38 : isMediumDevice ? 44 : 48);
  const logoRadius = Platform.OS === 'android'
    ? (isSmallDevice ? 7 : 8)
    : (isSmallDevice ? 9 : isMediumDevice ? 10 : 12);
  const logoMargin = Platform.OS === 'android' ? 6 : (isSmallDevice ? 12 : 16);
  const settingsSize = Platform.OS === 'android' ? 32 : (isSmallDevice ? 34 : 36);
  const settingsMargin = Platform.OS === 'android' ? 6 : (isSmallDevice ? 12 : 16);
  const settingsIconSize = Platform.OS === 'android' ? 18 : (isSmallDevice ? 18 : 20);
  const headerFontSize = Platform.OS === 'android'
    ? (isSmallDevice ? 15 : 17)
    : (isSmallDevice ? 16 : isMediumDevice ? 18 : 20);
  
  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);
  
  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);
  
  const appLogo = useMemo(() => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: logoMargin,
      height: Platform.OS === 'android' ? 56 : undefined,
    }}>
      <View style={{
        width: logoSize,
        height: logoSize,
        borderRadius: logoRadius,
        overflow: 'hidden',
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: Platform.OS === 'android' ? 0.15 : 0.1,
        shadowRadius: 4,
        elevation: Platform.OS === 'android' ? 4 : 3,
      }}>
        <Image 
          source={require('@/assets/images/icon.png')}
          style={{
            width: logoSize,
            height: logoSize,
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  ), [logoSize, logoRadius, logoMargin]);
  
  const settingsButton = useMemo(() => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: settingsMargin,
      height: Platform.OS === 'android' ? 56 : undefined,
    }}>
      <TouchableOpacity
        onPress={handleOpenSettings}
        style={{
          width: settingsSize,
          height: settingsSize,
          borderRadius: settingsSize / 2,
          backgroundColor: `${colors.light.primary}10`,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.light.primary,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: Platform.OS === 'android' ? 0.12 : 0.08,
          shadowRadius: 2,
          elevation: Platform.OS === 'android' ? 3 : 2,
        }}
      >
        <Settings size={settingsIconSize} color={colors.light.primary} />
      </TouchableOpacity>
    </View>
  ), [handleOpenSettings, settingsSize, settingsMargin, settingsIconSize]);
  
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
          fontSize: isSmallDevice ? 9 : 10,
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
          height: Platform.select({
            ios: 44 + insets.top,
            android: 56,
            default: 56,
          }),
        },
        headerLeftContainerStyle: {
          paddingLeft: 0,
          alignItems: 'center',
          justifyContent: 'center',
          height: Platform.OS === 'android' ? 56 : undefined,
        },
        headerRightContainerStyle: {
          paddingRight: 0,
          alignItems: 'center',
          justifyContent: 'center',
          height: Platform.OS === 'android' ? 56 : undefined,
        },
        headerTitleContainerStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: Platform.OS === 'android' ? 56 : undefined,
          left: Platform.OS === 'android' ? 0 : undefined,
          right: Platform.OS === 'android' ? 0 : undefined,
        },
        headerTitleStyle: {
          fontSize: headerFontSize,
          fontWeight: "700" as const,
          color: colors.light.text,
          maxWidth: screenWidth - (logoSize + logoMargin * 3) - (settingsSize + settingsMargin * 3) - (Platform.OS === 'android' ? 60 : 40),
          textAlign: 'center',
          paddingHorizontal: Platform.OS === 'android' ? 8 : 0,
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
