import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Box, FlatList, HStack, Icon, Image, Text, VStack } from "native-base";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBar from "../components/HeaderBar";
import { kitchens } from "../data/menu";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    title: "Subscription Packages",
    subtitle: "Up to 60% OFF | 6 months+",
    gradient: ["#FF6B35", "#F7931E"],
    image: require("../assets/Rajasthani.jpg"),
    icon: "pricetag",
  },
  {
    id: "2",
    title: "Today's Special",
    subtitle: "Get free dessert with every thali",
    gradient: ["#11998e", "#38ef7d"],
    image: require("../assets/Gujarati.jpeg"),
    icon: "cafe",
  },
  {
    id: "3",
    title: "Weekend Offer",
    subtitle: "Flat 20% OFF on family packs",
    gradient: ["#F093FB", "#F5576C"],
    image: require("../assets/Dosa.jpg"),
    icon: "gift",
  },
];
const createPendulumBanners = (banners) => {
  // Clone banners and add a unique uid per position to avoid duplicate object references
  // which can cause flicker when the carousel reuses items.
  if (banners.length === 3) {
    // Create sequence indices: 0,1,2,1,0,1,2,1
    const sequence = [0, 1, 2, 1, 0, 1, 2, 1];
    return sequence.map((idx, pos) => ({ ...banners[idx], uid: `${banners[idx].id}-${pos}` }));
  }
  return banners.map((b, pos) => ({ ...b, uid: `${b.id}-${pos}` }));
};
const categories = [
  { id: "1", name: "Dosa Thali", image: require("../assets/Dosa.jpg") },
  { id: "2", name: "Gujarati Thali", image: require("../assets/Gujarati.jpeg") },
  { id: "3", name: "Rajasthani Thali", image: require("../assets/Rajasthani.jpg") },
  { id: "4", name: "Punjabi Thali", image: require("../assets/Punjabi.webp") },
];
const getOriginalIndex = (pendulumIndex) => {
  const sequence = [0, 1, 2, 1, 0, 1, 2, 1]; // Maps to banner indices
  return sequence[pendulumIndex % sequence.length];
};

export default function HomeScreen() {
  const [location, setLocation] = useState("Fetching...");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pendulumBanners = createPendulumBanners(banners);

  // Entrance animation
  useEffect(() => {
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
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Location fetch
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Permission denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        let geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geo.length > 0) {
          const place = geo[0];
          const city = place.city || place.subregion || place.district || "";
          const region = place.region || place.country || "";
          setLocation(city && region ? `${city}, ${region}` : city || region || "Unknown");
        } else {
          setLocation("Location not found");
        }
      } catch (err) {
        console.error("Location error:", err);
        setLocation("Error fetching location");
      }
    })();
  }, []);

  const CARD_WIDTH = width * 0.44;
  const CARD_HEIGHT = 200;

  // Memoized filtered kitchens based on searchQuery
  const filteredKitchens = useMemo(() => {
    if (!searchQuery.trim()) return kitchens;
    return kitchens.filter((kitchen) =>
      kitchen.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // CategoryCard component
  const CategoryCard = ({ item }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.92,
        useNativeDriver: true,
      }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    };
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessible
          accessibilityLabel={`${item.name} category`}>
          <VStack style={styles.categoryItem}>
            <Box style={styles.categoryImageContainer}>
              <Image source={item.image} alt={item.name} style={styles.categoryImage} />
            </Box>
            <Text style={styles.categoryText}>{item.name}</Text>
          </VStack>
        </Pressable>
      </Animated.View>
    );
  };

  // KitchenCard component
  const KitchenCard = ({ item }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };
    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    };
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("KitchenScreen", { kitchen: item })}
          accessible
          accessibilityLabel={`Open details for ${item.name}`}>
          <Box style={[styles.kitchenCard, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
            <Image
              source={item.image}
              alt={item.name}
              style={styles.kitchenImage}
              resizeMode='cover'
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.kitchenGradient}
            />
            {item.discount && (
              <Box style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </Box>
            )}
            <VStack style={styles.kitchenInfo}>
              <Text style={styles.kitchenName} numberOfLines={1}>
                {item.name}
              </Text>
              <HStack mt={1} alignItems='center' space={1}>
                <Icon as={Ionicons} name='star' size='xs' color='#FFD700' />
                <Text style={styles.kitchenMeta}>
                  {item.rating} • {item.time}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Box style={styles.container}>
        <HeaderBar title='Home' showCart location={location} />
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], flex: 1 }}>
          <FlatList
            data={filteredKitchens.slice(0, 6)}
            keyExtractor={(item) => `kitchen-${item.id}`}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <VStack space={6} mb={4}>
                {/* Search Bar */}
                <Box style={styles.searchWrapper}>
                  <LinearGradient
                    colors={["#f8f9fa", "#ffffff"]}
                    style={styles.searchGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <View style={styles.searchContainer}>
                      <Ionicons name='search' size={22} color='#FF6B35' style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder='Search for delicious kitchens...'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor='#9ca3af'
                        accessibilityLabel='Search kitchens'
                      />
                      <Ionicons name='options-outline' size={22} color='#6b7280' />
                    </View>
                  </LinearGradient>
                </Box>

                {/* Banners - Carousel */}
                <Box style={{ paddingHorizontal: 16, marginTop: 8 }}>
                  <Carousel
                    width={width - 32}
                    height={180}
                    data={pendulumBanners}
                    loop
                    autoPlay
                    autoPlayInterval={3000} // Slightly faster for better pendulum effect
                    onSnapToItem={(index) => setActiveIndex(getOriginalIndex(index))}
                    scrollAnimationDuration={800}
                    renderItem={({ item }) => (
                      <LinearGradient
                        key={item.uid || item.id}
                        colors={item.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: 20,
                          overflow: "hidden",
                          width: width - 32,
                          height: 180,
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 24,
                        }}>
                        <VStack flex={1} pr={4}>
                          <Text style={styles.bannerTitle}>{item.title}</Text>
                          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                          <Pressable style={[styles.bannerButton, { marginTop: 16 }]}>
                            <Text style={styles.bannerButtonText}>Explore Now</Text>
                            <Icon
                              as={Ionicons}
                              name='arrow-forward'
                              size='sm'
                              color='white'
                              ml={2}
                            />
                          </Pressable>
                        </VStack>
                        <Box
                          style={{
                            width: 110,
                            height: 110,
                            borderRadius: 20,
                            overflow: "hidden",
                            borderWidth: 3,
                            borderColor: "rgba(255,255,255,0.3)",
                            backgroundColor: "white",
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                          <Image
                            source={item.image}
                            alt='Banner'
                            resizeMode='cover'
                            style={{ width: "100%", height: "100%", borderRadius: 20 }}
                          />
                        </Box>
                      </LinearGradient>
                    )}
                  />
                  {/* Pagination dots for original banners */}
                  <HStack mt={8} justifyContent='center' space={2}>
                    {banners.map((_, idx) => (
                      <Box
                        key={`dot-${idx}`}
                        style={[
                          styles.dot,
                          activeIndex === idx ? styles.activeDot : styles.inactiveDot,
                        ]}
                      />
                    ))}
                  </HStack>
                </Box>

                {/* Categories */}
                <Box style={styles.categoriesWrapper}>
                  <Text style={styles.sectionTitle}>What&#39;s on your mind?</Text>
                  <HStack style={styles.categoriesRow}>
                    {categories.map((cat) => (
                      <CategoryCard key={cat.id} item={cat} />
                    ))}
                  </HStack>
                </Box>

                {/* Offers */}
                <Box style={styles.offersWrapper}>
                  <HStack justifyContent='space-between' alignItems='center' mb={4}>
                    <Text style={styles.sectionTitle}>Deals for You</Text>
                    <Pressable>
                      <Text style={styles.seeAllText}>See All →</Text>
                    </Pressable>
                  </HStack>
                  <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 16 }}>
                    <HStack space={3}>
                      {/* Hardcoded offers for illustration */}
                      <Pressable key='offer1'>
                        <LinearGradient
                          colors={["#fce7f3", "#fbcfe8"]}
                          style={styles.offerBox}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}>
                          <Box style={styles.offerIconCircle}>
                            <Icon as={Ionicons} name='pricetag' size='md' color='#ec4899' />
                          </Box>
                          <Text style={styles.offerTitle}>₹50 OFF</Text>
                          <Text style={styles.offerSubtitle}>on Mini Thali</Text>
                        </LinearGradient>
                      </Pressable>
                      <Pressable key='offer2'>
                        <LinearGradient
                          colors={["#fef3c7", "#fef08a"]}
                          style={styles.offerBox}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}>
                          <Box style={styles.offerIconCircle}>
                            <Icon as={Ionicons} name='restaurant' size='md' color='#f59e0b' />
                          </Box>
                          <Text style={styles.offerTitle}>Combo Saver</Text>
                          <Text style={styles.offerSubtitle}>Thali + Drink</Text>
                        </LinearGradient>
                      </Pressable>
                      <Pressable key='offer3'>
                        <LinearGradient
                          colors={["#d1fae5", "#bbf7d0"]}
                          style={styles.offerBox}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}>
                          <Box style={styles.offerIconCircle}>
                            <Icon as={Ionicons} name='people' size='md' color='#10b981' />
                          </Box>
                          <Text style={styles.offerTitle}>Family Pack</Text>
                          <Text style={styles.offerSubtitle}>Up to 20% OFF</Text>
                        </LinearGradient>
                      </Pressable>
                      <Pressable key='offer4'>
                        <LinearGradient
                          colors={["#e0e7ff", "#c7d2fe"]}
                          style={styles.offerBox}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}>
                          <Box style={styles.offerIconCircle}>
                            <Icon as={Ionicons} name='flash' size='md' color='#6366f1' />
                          </Box>
                          <Text style={styles.offerTitle}>Flash Sale</Text>
                          <Text style={styles.offerSubtitle}>Limited Time</Text>
                        </LinearGradient>
                      </Pressable>
                    </HStack>
                  </Animated.ScrollView>
                </Box>

                {/* Top Kitchens */}
                <Box style={styles.topKitchensWrapper}>
                  <HStack justifyContent='space-between' alignItems='center' mb={4}>
                    <Text style={styles.sectionTitle}>Top kitchens near you</Text>
                    <Pressable>
                      <Text style={styles.seeAllText}>See All →</Text>
                    </Pressable>
                  </HStack>
                  <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={3}>
                      {kitchens.slice(6, 11).map((kitchen) => (
                        <KitchenCard key={`top-${kitchen.id}`} item={kitchen} />
                      ))}
                    </HStack>
                  </Animated.ScrollView>
                </Box>

                {/* All Restaurants Header */}
                <Box style={styles.allRestaurantsHeader}>
                  <Text style={styles.sectionTitle}>All Restaurants</Text>
                  <Text style={styles.sectionSubtitle}>
                    Discover amazing food experiences near you
                  </Text>
                </Box>
              </VStack>
            }
            renderItem={({ item }) => <KitchenCard item={item} />}
          />
        </Animated.View>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // (All your styles, unchanged)
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, backgroundColor: "#fafafa" },
  columnWrapper: { justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },
  listContent: { paddingBottom: 140 },
  searchWrapper: { paddingHorizontal: 16, marginTop: 12 },
  searchGradient: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: { marginRight: 12 },
  input: {
    flex: 1,
    fontFamily: "OpenSans",
    fontSize: 15,
    color: "#1f2937",
    paddingVertical: 2,
  },
  bannerWrapper: { paddingTop: 8 },
  bannerBox: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 20,
    height: 180,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: "white",
    fontFamily: "Poppins",
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.95)",
    marginTop: 6,
    fontFamily: "OpenSans",
    lineHeight: 20,
  },
  bannerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
    fontFamily: "OpenSans",
  },
  bannerImageBox: {
    width: 110,
    height: 110,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  bannerImage: { width: "100%", height: "100%" },
  dot: { height: 8, borderRadius: 4 },
  activeDot: { width: 24, backgroundColor: "#FF6B35" },
  inactiveDot: { width: 8, backgroundColor: "#d1d5db" },
  categoriesWrapper: { paddingHorizontal: 16 },
  categoriesRow: { justifyContent: "space-between" },
  categoryItem: { alignItems: "center", flex: 1 },
  categoryImageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 40,
    marginBottom: 10,
  },
  categoryImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  categoryText: {
    fontSize: 13,
    fontFamily: "OpenSans",
    textAlign: "center",
    color: "#374151",
    fontWeight: "600",
  },
  offersWrapper: { paddingHorizontal: 16 },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
    color: "#111827",
    fontFamily: "Poppins",
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily: "OpenSans",
    marginTop: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "600",
    fontFamily: "OpenSans",
  },
  offerBox: {
    width: 140,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 140,
    justifyContent: "center",
  },
  offerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  offerTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1f2937",
    fontFamily: "Poppins",
    textAlign: "center",
  },
  offerSubtitle: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 4,
    fontFamily: "OpenSans",
    textAlign: "center",
  },
  topKitchensWrapper: { paddingHorizontal: 16 },
  allRestaurantsHeader: { paddingHorizontal: 16, marginTop: 8 },
  kitchenCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  kitchenImage: {
    width: "100%",
    height: "100%",
  },
  kitchenGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    fontSize: 12,
    color: "white",
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  kitchenInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  kitchenName: {
    fontWeight: "700",
    fontSize: 15,
    color: "white",
    fontFamily: "Poppins",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  kitchenMeta: {
    fontSize: 12,
    color: "rgba(255,255,255,0.95)",
    fontFamily: "OpenSans",
    fontWeight: "500",
  },
});
