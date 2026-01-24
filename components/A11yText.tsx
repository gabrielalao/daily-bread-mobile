import React from "react";
import { StyleSheet, Text as RNText, type TextProps, type TextStyle } from "react-native";
import { useContent } from "@/contexts/ContentContext";

function scaleStyle(style: TextStyle | undefined, factor: number): TextStyle | undefined {
  if (!style) return style;
  const next: TextStyle = { ...style };
  if (typeof next.fontSize === "number") next.fontSize = Math.round(next.fontSize * factor);
  if (typeof next.lineHeight === "number") next.lineHeight = Math.round(next.lineHeight * factor);
  return next;
}

export function A11yText(props: TextProps) {
  const { userPreferences } = useContent();
  const factor = userPreferences.accessibilityLargeTextEnabled ? 1.15 : 1.0;

  const flattened = StyleSheet.flatten(props.style) as TextStyle | undefined;
  const scaled = factor !== 1.0 ? scaleStyle(flattened, factor) : flattened;

  const wantsBold = userPreferences.accessibilityBoldTextEnabled;
  const wantsDyslexiaFont = userPreferences.accessibilityDyslexiaFontEnabled;

  // If the font isn't loaded yet, RN will fall back safely.
  const boldRequestedByStyle =
    typeof scaled?.fontWeight === "string" && ["600", "700", "800", "900", "bold"].includes(scaled.fontWeight);

  const useBoldFace = wantsBold || boldRequestedByStyle;
  const fontFamily =
    wantsDyslexiaFont ? (useBoldFace ? "AtkinsonHyperlegible-Bold" : "AtkinsonHyperlegible-Regular") : undefined;

  return (
    <RNText
      {...props}
      allowFontScaling={true}
      // We intentionally override at the end so it wins over local styles.
      style={[
        scaled,
        wantsBold ? { fontWeight: "700" } : null,
        fontFamily ? { fontFamily } : null,
      ]}
    />
  );
}

