import { Box, Image } from 'native-base';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native'; // ✅ import Animated + Easing
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const rotate1 = useRef(new Animated.Value(0)).current;
  const rotate2 = useRef(new Animated.Value(0)).current;
  const rotate3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnim = (anim, duration) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    spinAnim(rotate1, 1500);
    spinAnim(rotate2, 1000);
    spinAnim(rotate3, 1100);
  }, [rotate1, rotate2, rotate3]);

  const spin1 = rotate1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spin2 = rotate2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'], // opposite direction
  });
  const spin3 = rotate3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} alignItems='center' justifyContent='center'>
        {/* Logo */}
        <Image
          source={require('@/assets/logo.png')}
          alt='Raavito Logo'
          size='2xl'
          resizeMode='contain'
        />

        {/* Loader below logo */}
        <Box mt={10} alignItems='center' justifyContent='center'>
          {/* Outer Arc */}
          <Animated.View
            style={{
              width: 30,
              height: 30,
              borderWidth: 6,
              borderRadius: 40,
              borderTopColor: '#FF7A00', // Raavito orange
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              transform: [{ rotate: spin1 }],
              position: 'absolute',
            }}
          />

          {/* Middle Arc */}
          <Animated.View
            style={{
              width: 60,
              height: 60,
              borderWidth: 6,
              borderRadius: 30,
              borderTopColor: 'rgb(9,202,57)', // Raavito green
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              transform: [{ rotate: spin2 }],
              position: 'absolute',
            }}
          />

          {/* Inner Arc */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              borderWidth: 6,
              borderRadius: 20,
              borderTopColor: '#FFD700', // yellow
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              transform: [{ rotate: spin3 }],
              position: 'absolute',
            }}
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
}
