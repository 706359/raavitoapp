import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

const CircularLoader = ({ size = 40, segmentCount = 12, marginTop = 40 }) => {
  const animations = useRef([...Array(segmentCount)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animate = (i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[i], {
            toValue: 1,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animations[i], {
            toValue: 0,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animations.forEach((_, i) => {
      setTimeout(() => animate(i), i * 100); // stagger start
    });
  }, [animations]);

  return (
    <View style={{ marginTop, width: size, height: size }}>
      {[...Array(segmentCount)].map((_, i) => {
        const rotate = `${(360 / segmentCount) * i}deg`;
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
  );
};

export default CircularLoader;
