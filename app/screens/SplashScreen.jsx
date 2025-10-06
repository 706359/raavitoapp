import { Box, Image } from "native-base";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularLoader from "../components/CircularLoader";

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

        <CircularLoader />
      </Box>
    </SafeAreaView>
  );
}
