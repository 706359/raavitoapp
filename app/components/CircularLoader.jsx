import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import theme from "../../theme";

const CircularLoader = ({ size = 40, segmentCount = 12, marginTop = 40, color = "orange" }) => {
  const animations = useRef([...Array(segmentCount)].map(() => new Animated.Value(0))).current;
  const brandColor = theme.colors.brand[color] || theme.colors.brand.orange;

  useEffect(() => {
    const animate = (i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[i], {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(animations[i], {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animations.forEach((_, i) => {
      setTimeout(() => animate(i), i * 80); // Staggered start for smoother effect
    });
  }, [animations]);

  return (
    <View style={[styles.container, { marginTop, width: size, height: size }]}>
      {[...Array(segmentCount)].map((_, i) => {
        const rotate = `${(360 / segmentCount) * i}deg`;
        const opacity = animations[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0.15, 1],
        });
        const scale = animations[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        });

        // Create gradient effect with brand colors
        const segmentColor =
          i % 3 === 0
            ? brandColor
            : i % 3 === 1
            ? theme.colors.brand.green
            : theme.colors.brand.orangeLight || brandColor;

        return (
          <Animated.View
            key={i}
            style={[
              styles.segment,
              {
                transform: [{ rotate }, { scale }],
              opacity,
              },
            ]}>
            <View
              style={[
                styles.segmentBar,
                {
                  width: size / 20,
                  height: size / 2.5,
                  borderRadius: size / 40,
                  backgroundColor: segmentColor,
                },
              ]}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  segment: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  segmentBar: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default CircularLoader;
