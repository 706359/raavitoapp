import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("@/assets/download.jpeg"),
    title: "Order Homemade Food",
    description: "Get fresh and healthy tiffins delivered right at your doorstep.",
    gradient: ["#FF6B6B", "#FF8E53"],
  },
  {
    id: "2",
    image: require("@/assets/download (1).jpeg"),
    title: "Track Your Progress",
    description:
      "Easily monitor your orders and stay updated anytime. You can track your orders, payments, and more in real-time.",
    gradient: ["#4FACFE", "#00F2FE"],
  },
  {
    id: "3",
    image: require("@/assets/food.jpeg"),
    title: "Stay Motivated",
    description: "Eat well, live well and keep yourself energized every day.",
    gradient: ["#43E97B", "#38F9D7"],
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  // Reset animations on slide change
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex, fadeAnim, slideAnim]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleDotPress = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleContinue = () => {
    navigation.replace("AuthStack");
  };

  if (user) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient Overlay */}
      <View style={styles.gradientOverlay}>
        <LinearGradient
          colors={slides[currentIndex].gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* Slider */}
      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            {/* Image Section with Animation */}
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  opacity: currentIndex === index ? scaleAnim : 1,
                  transform: [{ scale: currentIndex === index ? scaleAnim : 1 }],
                },
              ]}>
              <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.image} resizeMode='cover' />
                {/* Image Overlay */}
                <View style={styles.imageOverlay} />
              </View>
            </Animated.View>

            {/* Text Section with Animation */}
            <Animated.View
              style={[
                styles.textContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              <View style={styles.textContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </Animated.View>
          </View>
        )}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dotWrapper]}
            onPress={() => handleDotPress(index)}
            activeOpacity={0.7}>
            <Animated.View
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
                {
                  transform: [
                    {
                      scale: currentIndex === index ? 1 : 0.8,
                    },
                  ],
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Button with Animation */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <CustomButton title='Get Started' onPress={handleContinue} />
        <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    zIndex: -1,
  },
  gradient: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: "flex-start",
  },
  imageContainer: {
    height: height * 0.55,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    justifyContent: "flex-start",
  },
  textContent: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  dotWrapper: {
    padding: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
  },
  activeDot: {
    width: 24,
    backgroundColor: "#1f2937",
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: "center",
    gap: 12,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "600",
  },
});
