import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
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

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("@/assets/download.jpeg"),
    title: "Order Tiffin Meals",
    description: "Get fresh and healthy tiffins delivered right at your doorstep.",
  },
  {
    id: "2",
    image: require("@/assets/download (1).jpeg"),
    title: "Track Your Progress",
    description:
      "Easily monitor your orders and stay updated anytime. You can track your orders, payments, and more in real-time.",
  },
  {
    id: "3",
    image: require("@/assets/food.jpeg"),
    title: "Stay Motivated",
    description: "Eat well, live well and keep yourself energized every day.",
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuth();
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleDotPress = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleContinue = () => {
    navigation.replace("AuthStack"); // or "MainTabs"
  };
  if (user) return null;
  return (
    <SafeAreaView style={styles.container}>
      {/* Slider */}
      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} resizeMode='cover' />
            </View>

            {/* Text Section */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <CustomButton title='Continue' onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    width,
    flex: 1,
    justifyContent: "flex-start",
  },
  imageContainer: {
    height: height * 0.5,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 6,
    marginBottom: 30,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  buttonContainer: {
    paddingBottom: 30,
    alignItems: "center",
  },
});
