import { LinearGradient } from "expo-linear-gradient";
import { Box, Image, Text } from "native-base";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation - fade + scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous loader rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for loader
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer effect
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Delayed tagline fade-in
    setTimeout(() => {
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 500);
  }, [fadeAnim, scaleAnim, rotateAnim, pulseAnim, shimmerAnim, taglineFade]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#fff8f1", "#fff3e0", "#ffedd5", "#fed7aa"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}>
        {/* Decorative circles - top */}
        <Box position='absolute' top={-50} right={-50} opacity={0.1}>
          <Box w='200' h='200' borderRadius='full' bg='orange.400' />
        </Box>
        <Box position='absolute' top={100} left={-30} opacity={0.08}>
          <Box w='150' h='150' borderRadius='full' bg='amber.500' />
        </Box>

        {/* Decorative circles - bottom */}
        <Box position='absolute' bottom={-40} left={-60} opacity={0.1}>
          <Box w='180' h='180' borderRadius='full' bg='orange.500' />
        </Box>
        <Box position='absolute' bottom={120} right={-40} opacity={0.08}>
          <Box w='140' h='140' borderRadius='full' bg='amber.400' />
        </Box>

        <Box flex={1} alignItems='center' justifyContent='center'>
          {/* Outer glow circle */}
          <Animated.View
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: "#fb923c",
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.15],
                    outputRange: [1, 1.3],
                  }),
                },
              ],
            }}
          />

          {/* Middle glow circle */}
          <Animated.View
            style={{
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "#f59e0b",
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.15],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            }}
          />

          {/* Logo container with shadow */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              shadowColor: "#fb923c",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.3,
              shadowRadius: 30,
              elevation: 15,
            }}>
            <Box
              bg='white'
              p={6}
              borderRadius='2xl'
              shadow={9}
              borderWidth={1}
              borderColor='orange.100'>
              <Image
                source={require("@/assets/logo.png")}
                alt='Raavito Logo'
                size='xl'
                resizeMode='contain'
              />
            </Box>

            {/* Shimmer overlay */}
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                borderRadius: 24,
              }}>
              <Animated.View
                style={{
                  width: 100,
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: [{ translateX: shimmerTranslate }, { skewX: "-20deg" }],
                }}
              />
            </Animated.View>
          </Animated.View>

          {/* Premium circular loader with gradient effect */}
          <Box mt={12} alignItems='center' justifyContent='center'>
            <Animated.View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                transform: [{ scale: pulseAnim }, { rotate: spin }],
              }}>
              <Box
                w='full'
                h='full'
                borderRadius='full'
                borderWidth={5}
                borderColor='transparent'
                borderTopColor='#f97316'
                borderRightColor='#fb923c'
                borderBottomColor='transparent'
                borderLeftColor='transparent'
              />
            </Animated.View>

            {/* Inner rotating circle */}
            <Animated.View
              style={{
                position: "absolute",
                width: 50,
                height: 50,
                borderRadius: 25,
                transform: [
                  {
                    rotate: spin,
                  },
                  { scaleX: -1 },
                ],
              }}>
              <Box
                w='full'
                h='full'
                borderRadius='full'
                borderWidth={4}
                borderColor='transparent'
                borderTopColor='#fcd34d'
                borderRightColor='transparent'
                borderBottomColor='transparent'
                borderLeftColor='#fbbf24'
              />
            </Animated.View>

            {/* Center dot */}
            <Animated.View
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#f97316",
                transform: [{ scale: pulseAnim }],
              }}
            />
          </Box>

          {/* Loading text */}

          <Animated.View
            style={{
              marginTop: 24,
              opacity: fadeAnim,
            }}>
            <Text fontSize='sm' color='orange.600' fontWeight='500' letterSpacing='lg'>
              Loading your favorites...
            </Text>
          </Animated.View>
        </Box>

        {/* Premium tagline with gradient background */}
        <Box position='absolute' bottom={45} w='full' alignItems='center' px={6}>
          <Animated.View
            style={{
              opacity: taglineFade,
              transform: [
                {
                  translateY: taglineFade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}>
            <Box
              bg={{
                linearGradient: {
                  colors: ["rgba(251, 146, 60, 0.15)", "rgba(245, 158, 11, 0.15)"],
                  start: [0, 0],
                  end: [1, 0],
                },
              }}
              px={8}
              py={3}
              borderRadius='full'
              borderWidth={1}
              borderColor='orange.200'>
              <Text
                color='orange.600'
                fontSize='md'
                letterSpacing='xl'
                fontWeight='700'
                textAlign='center'>
                Fresh • Fast • Flavorful
              </Text>
            </Box>
          </Animated.View>

          {/* Dots indicator */}
          <Animated.View
            style={{
              marginTop: 16,
              flexDirection: "row",
              gap: 8,
              opacity: taglineFade,
            }}>
            {[0, 0.2, 0.4].map((delay, index) => (
              <Animated.View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#fb923c",
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.15],
                    outputRange: [0.3, 1],
                  }),
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.15],
                        outputRange: [0.8, 1.2],
                      }),
                    },
                  ],
                }}
              />
            ))}
          </Animated.View>
        </Box>
      </LinearGradient>
    </SafeAreaView>
  );
}
