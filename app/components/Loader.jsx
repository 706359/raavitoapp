import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';

/**
 * Premium Loader Component
 * @param {Object} props
 * @param {string} props.size - Size: 'small' | 'medium' | 'large'
 * @param {string} props.color - Color theme: 'orange' | 'green' | 'blue' | 'purple'
 * @param {string} props.text - Optional loading text
 * @param {boolean} props.fullScreen - Show as full screen overlay
 * @param {string} props.variant - Variant: 'circular' | 'spinner' | 'dots' | 'pulse' | 'wave' | 'cube'
 */
export default function Loader({
  size = 'medium',
  color = 'orange',
  text,
  fullScreen = false,
  variant = 'sliding',
}) {
  const sizeMap = {
    small: 28,
    medium: 40,
    large: 56,
  };

  const loaderSize = sizeMap[size] || sizeMap.medium;

  // Rotating dots animation (circular variant)
  const rotatingDotsAnim = useRef(new Animated.Value(0)).current;
  // New sliding loader animation
  const slideRotateAnim = useRef(new Animated.Value(0)).current;
  const slideTranslateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === 'circular') {
      Animated.loop(
        Animated.timing(rotatingDotsAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    }

    if (variant === 'sliding' || variant === 'default') {
      // Container rotation animation (2s infinite alternate)
      // 0-40%: 0deg, 80-100%: 180deg
      Animated.loop(
        Animated.sequence([
          // 0-40%: stay at 0deg
          Animated.timing(slideRotateAnim, {
            toValue: 0.4,
            duration: 800, // 40% of 2000ms
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // 40-80%: transition to 180deg
          Animated.timing(slideRotateAnim, {
            toValue: 0.8,
            duration: 800, // 40% of 2000ms
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // 80-100%: stay at 180deg
          Animated.timing(slideRotateAnim, {
            toValue: 1,
            duration: 400, // 20% of 2000ms
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Reset and reverse
          Animated.timing(slideRotateAnim, {
            toValue: 0.8,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(slideRotateAnim, {
            toValue: 0.4,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(slideRotateAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Element translation animation (1s infinite alternate)
      // 0-80%: 0px, 80-100%: translate
      Animated.loop(
        Animated.sequence([
          // 0-80%: stay at 0
          Animated.timing(slideTranslateAnim, {
            toValue: 0.8,
            duration: 800, // 80% of 1000ms
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // 80-100%: translate
          Animated.timing(slideTranslateAnim, {
            toValue: 1,
            duration: 200, // 20% of 1000ms
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Reverse
          Animated.timing(slideTranslateAnim, {
            toValue: 0.8,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(slideTranslateAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [variant, rotatingDotsAnim, slideRotateAnim, slideTranslateAnim]);

  // Rotating dots loader (matching CSS animation)
  const renderCircular = () => {
    const centerSize = loaderSize;
    const dotSize = loaderSize * 0.35;
    const radius = loaderSize * 0.57;
    const sqrt2 = 0.707;

    // 8 positions around the circle
    const positions = [
      { x: 0, y: -radius }, // Top (0°)
      { x: radius * sqrt2, y: -radius * sqrt2 }, // Top-right (45°)
      { x: radius, y: 0 }, // Right (90°)
      { x: radius * sqrt2, y: radius * sqrt2 }, // Bottom-right (135°)
      { x: 0, y: radius }, // Bottom (180°)
      { x: -radius * sqrt2, y: radius * sqrt2 }, // Bottom-left (225°)
      { x: -radius, y: 0 }, // Left (270°)
      { x: -radius * sqrt2, y: -radius * sqrt2 }, // Top-left (315°)
    ];

    // Colors matching brand theme
    const dotColor1 = theme.colors.brand.orange; // Orange
    const dotColor2 = theme.colors.brand.green; // Green
    const centerColor = theme.colors.brand.orange; // Orange center

    // Animation phases
    const phases = [
      [0, 1], // 0%: dots 0,1
      [1, 2], // 12.5%: dots 1,2
      [2, 3], // 25%: dots 2,3
      [3, 4], // 37.5%: dots 3,4
      [4, 5], // 50%: dots 4,5
      [5, 6], // 62.5%: dots 5,6
      [6, 7], // 75%: dots 6,7
      [7, 0], // 87.5%: dots 7,0
      [0, 1], // 100%: back to dots 0,1
    ];

    const getDotOpacity = (positionIndex) => {
      const visibility = phases.map((phase) => (phase.includes(positionIndex) ? 1 : 0));
      return rotatingDotsAnim.interpolate({
        inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        outputRange: visibility,
      });
    };

    return (
      <View style={[styles.loaderWrapper, { width: loaderSize * 2.5, height: loaderSize * 2.5 }]}>
        {/* 8 rotating dots around the circle */}
        {positions.map((pos, index) => {
          const isYellow = index % 2 === 0;
          const dotColor = isYellow ? dotColor1 : dotColor2;

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.rotatingDot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: dotColor,
                  left: loaderSize * 1.25 + pos.x - dotSize / 2,
                  top: loaderSize * 1.25 + pos.y - dotSize / 2,
                  opacity: getDotOpacity(index),
                },
              ]}
            />
          );
        })}

        {/* Center circle */}
        <View
          style={[
            styles.rotatingCenter,
            {
              width: centerSize,
              height: centerSize,
              borderRadius: centerSize / 2,
              backgroundColor: centerColor,
              left: loaderSize * 1.25 - centerSize / 2,
              top: loaderSize * 1.25 - centerSize / 2,
            },
          ]}
        />
      </View>
    );
  };

  // Sliding loader (new CSS animation)
  const renderSliding = () => {
    const containerWidth = loaderSize * 1.5; // 60px equivalent
    const elementSize = loaderSize * 0.4; // 16px equivalent
    const translateDistance = loaderSize * 0.35; // 14px equivalent

    // Container rotation: 0deg at 0-40%, 180deg at 80-100%
    const containerRotation = slideRotateAnim.interpolate({
      inputRange: [0, 0.4, 0.8, 1],
      outputRange: ['0deg', '0deg', '180deg', '180deg'],
    });

    // Element translation: 0px at 0-80%, translate at 80-100%
    // First element: +14px (--s: 1)
    const translate1 = slideTranslateAnim.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, translateDistance],
    });

    // Second element: -14px (--s: -1)
    const translate2 = slideTranslateAnim.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, -translateDistance],
    });

    return (
      <Animated.View
        style={[
          styles.slidingContainer,
          {
            width: containerWidth,
            height: elementSize,
            transform: [{ rotate: containerRotation }],
          },
        ]}
      >
        {/* First element (before) - orange */}
        <Animated.View
          style={[
            styles.slidingElement,
            {
              width: elementSize,
              height: elementSize,
              backgroundColor: theme.colors.brand.orange,
              transform: [{ translateX: translate1 }],
            },
          ]}
        />
        {/* Second element (after) - green */}
        <Animated.View
          style={[
            styles.slidingElement,
            {
              width: elementSize,
              height: elementSize,
              backgroundColor: theme.colors.brand.green,
              transform: [{ translateX: translate2 }],
            },
          ]}
        />
      </Animated.View>
    );
  };

  const renderLoader = () => {
    switch (variant) {
      case 'circular':
        return renderCircular();
      case 'sliding':
      case 'default':
      default:
        return renderSliding();
    }
  };

  const content = (
    <View style={styles.container}>
      {renderLoader()}
      {text && (
        <View style={styles.textContainer}>
          <Text style={[styles.text, { color: theme.colors.brand.gray }]}>{text}</Text>
        </View>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View style={styles.fullScreenOverlay}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']}
          style={styles.fullScreenGradient}
        >
          <View style={styles.fullScreenContent}>{content}</View>
        </LinearGradient>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotatingDot: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  rotatingCenter: {
    position: 'absolute',
    shadowColor: '#f97316',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'OpenSans',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slidingElement: {
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
