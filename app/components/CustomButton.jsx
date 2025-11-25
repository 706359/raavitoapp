import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../theme";

export default function CustomButton({
  title,
  onPress,
  variant = "solid", // solid | outline | ghost
  color = "orange", // orange | green | dark | light
  pressedColor, // ✅ new prop to set color when pressed
  isDisabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) {
  const brandColor = theme.colors.brand[color] || theme.colors.brand.orange;
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={isDisabled || loading}
      style={[
        styles.base,
        variant === "solid" && {
          backgroundColor: isPressed ? pressedColor || brandColor : brandColor,
        },
        variant === "outline" && {
          borderColor: brandColor,
          borderWidth: 2,
          backgroundColor: "transparent",
        },
        variant === "ghost" && { backgroundColor: "transparent" },
        (isDisabled || loading) && { backgroundColor: "#ccc", borderColor: "#ccc" },
        style,
      ]}
      {...props}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === "solid" ? "#fff" : brandColor} 
          />
        </View>
      ) : (
        <Text
          style={[
            styles.text,
            variant === "solid" && { color: "#fff" },
            variant !== "solid" && { color: brandColor },
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  loaderContainer: {
    minWidth: 20,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
