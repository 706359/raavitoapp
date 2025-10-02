import { Box, Image } from "native-base";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const segments = Array.from({ length: 12 }, (_, i) => i);
  const animations = useRef(segments.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animations.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 100), // staggered delay for rotation effect
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.2,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [animations]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Box flex={1} alignItems='center' justifyContent='center'>
        {/* Logo */}
        <Image
          source={require("@/assets/logo.png")}
          alt='Raavito Logo'
          size='2xl'
          resizeMode='contain'
        />

        {/* Circular Loader */}
        <View style={{ marginTop: 40, width: 60, height: 60 }}>
          {segments.map((_, i) => {
            const rotate = i * 30 + "deg"; // 12 segments = 30° apart
            const opacity = animations[i].interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 1],
            });

            return (
              <Animated.View
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  transform: [{ rotate }],
                  opacity,
                }}>
                <View
                  style={{
                    width: 6,
                    height: 14,
                    borderRadius: 3,
                    backgroundColor:
                      i % 3 === 0
                        ? "#FF7A00" // orange
                        : i % 3 === 1
                          ? "rgb(9,202,57)" // green
                          : "#FFD700", // yellow
                  }}
                />
              </Animated.View>
            );
          })}
        </View>
      </Box>
    </SafeAreaView>
  );
}
