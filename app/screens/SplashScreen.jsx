import { Box, HStack, Image, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Animated } from "react-native";

export default function SplashScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Box flex={1} alignItems='center' justifyContent='center' bg='white'>
      <VStack space={8} alignItems='center'>
        <Image
          source={require("@/assets/logo.png")}
          alt='Raavito Logo'
          size='2xl'
          resizeMode='contain'
        />
        <HStack space={2}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: i % 2 === 0 ? "#FF7A00" : "#0F8C2E",
                opacity: fadeAnim,
              }}
            />
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
