import { Box, Image } from "native-base";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade + pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.8,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Box
      flex={1}
      alignItems='center'
      justifyContent='center'
      bg={{
        linearGradient: {
          colors: ["#FF7A00", "#0F8C2E"],
          start: [0, 0],
          end: [1, 1],
        },
      }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}>
        <Image
          source={require("@/assets/logo.png")}
          alt='Raavito Logo'
          size='2xl'
          resizeMode='contain'
        />
      </Animated.View>
    </Box>
  );
}
