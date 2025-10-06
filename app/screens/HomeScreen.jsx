import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Box, FlatList, HStack, Icon, Image, Text, VStack, useTheme } from "native-base";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBar from "../components/HeaderBar";
import { kitchens } from "../data/menu";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [location, setLocation] = useState("Fetching...");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const carouselRef = useRef(null);
  const theme = useTheme();

  const banners = [
    {
      id: "1",
      title: "Premium Subscription",
      subtitle: "Save up to 60% for 6 months",
      gradient: [theme.colors.brand.orange, "#f5c18d"],
      image: require("../assets/Rajasthani.jpg"),
    },
    {
      id: "2",
      title: "Fresh & Healthy",
      subtitle: "Farm to table daily specials",
      gradient: [theme.colors.brand.green, "#baf7c9"],
      image: require("../assets/Gujarati.jpeg"),
    },
    {
      id: "3",
      title: "Weekend Feast",
      subtitle: "20% off on family combos",
      gradient: ["#12c6d6", "#c3f7f4"],
      image: require("../assets/Dosa.jpg"),
    },
  ];

  const categories = [
    { id: "1", name: "Dosa Thali", image: require("../assets/Dosa.jpg") },
    { id: "2", name: "Gujarati Thali", image: require("../assets/Gujarati.jpeg") },
    { id: "3", name: "Rajasthani Thali", image: require("../assets/Rajasthani.jpg") },
    { id: "4", name: "Punjabi Thali", image: require("../assets/Punjabi.webp") },
  ];

  const offers = [
    {
      id: "offer-1",
      icon: "pricetag",
      title: "₹50 OFF",
      sub: "First Order",
      colors: [theme.colors.brand.orange, "#d67412"],
    },
    {
      id: "offer-2",
      icon: "nutrition",
      title: "Combo Deal",
      sub: "Thali + Drink",
      colors: [theme.colors.brand.green, "#0a9e30"],
    },
    {
      id: "offer-3",
      icon: "people",
      title: "Family Pack",
      sub: "20% Discount",
      colors: ["#d67412", theme.colors.brand.orange],
    },
    {
      id: "offer-4",
      icon: "flash",
      title: "Flash Sale",
      sub: "2 Hours Left",
      colors: [theme.colors.brand.green, "#0a9e30"],
    },
  ];

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

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

  const CARD_WIDTH = width * 0.45;
  const CARD_HEIGHT = 210;

  // Memoized filtered kitchens
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
        friction: 5,
        useNativeDriver: true,
      }).start();
    };
    return (
      <Animated.View style={[styles.categoryWrapper, { transform: [{ scale: scaleValue }] }]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessible
          accessibilityLabel={`${item.name} category`}
          style={styles.categoryPressable}>
          <Box style={[styles.categoryImageContainer, { shadowColor: theme.colors.brand.orange }]}>
            <Image source={item.image} alt={item.name} style={styles.categoryImage} />
          </Box>
          <Text style={[styles.categoryText, { color: theme.colors.brand.dark }]} numberOfLines={2}>
            {item.name}
          </Text>
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
        friction: 5,
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
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              style={styles.kitchenGradient}
            />
            {item.discount && (
              <LinearGradient
                colors={[theme.colors.brand.orange, "#d67412"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.discountBadge}>
                <Icon as={Ionicons} name='flash' size='xs' color='white' />
                <Text style={styles.discountText}>{item.discount}</Text>
              </LinearGradient>
            )}
            <VStack style={styles.kitchenInfo}>
              <Text style={styles.kitchenName} numberOfLines={1}>
                {item.name}
              </Text>
              <HStack mt={1.5} alignItems='center' space={1}>
                <Icon as={Ionicons} name='star' size='xs' color={theme.colors.brand.orange} />
                <Text style={styles.kitchenMeta}>{item.rating}</Text>
                <Text style={styles.kitchenDot}>•</Text>
                <Text style={styles.kitchenMeta}>{item.time}</Text>
              </HStack>
            </VStack>
          </Box>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Box style={[styles.container, { backgroundColor: theme.colors.brand.light }]}>
        <HeaderBar title='Home' showCart location={location} />

        {/* Premium Search Bar */}
        <Box style={styles.searchWrapper}>
          <View style={[styles.searchGradient, { shadowColor: theme.colors.brand.orange }]}>
            <View style={styles.searchContainer}>
              <Icon as={Ionicons} name='search' size='sm' color={theme.colors.brand.gray} />
              <TextInput
                style={[styles.input, { color: theme.colors.brand.dark }]}
                placeholder='Search restaurants, cuisines...'
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.brand.gray}
                accessibilityLabel='Search kitchens'
                autoCorrect={false}
                autoCapitalize='none'
              />
              <Pressable>
                <LinearGradient
                  colors={[theme.colors.brand.orange, "#d67412"]}
                  style={styles.filterButton}>
                  <Icon as={Ionicons} name='options' size='xs' color='white' />
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Box>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            flex: 1,
          }}>
          <FlatList
            data={filteredKitchens.slice(0, 6)}
            keyExtractor={(item) => `kitchen-${item.id}`}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <VStack space={6} mb={5}>
                {/* Premium Banners */}
                <Box style={styles.bannerSection}>
                  <Carousel
                    ref={carouselRef}
                    width={width}
                    height={180}
                    data={banners}
                    loop
                    autoPlay
                    autoPlayInterval={5000}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    scrollAnimationDuration={800}
                    renderItem={({ item }) => (
                      <View style={styles.bannerSlide}>
                        <Pressable style={styles.bannerPressable}>
                          <LinearGradient
                            colors={item.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.bannerCard}>
                            <HStack flex={1} alignItems='center' space={4}>
                              <VStack flex={1} space={2}>
                                <VStack space={1}>
                                  <Text style={styles.bannerTitle}>{item.title}</Text>
                                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                                </VStack>
                                <Pressable style={styles.ctaButton}>
                                  <Text style={styles.ctaText}>Claim Offer</Text>
                                  <Icon
                                    as={Ionicons}
                                    name='arrow-forward'
                                    size='xs'
                                    color='white'
                                    ml={1}
                                  />
                                </Pressable>
                              </VStack>
                              <Box style={styles.bannerImageWrapper}>
                                <Image
                                  source={item.image}
                                  alt={item.title}
                                  style={styles.bannerImage}
                                  resizeMode='cover'
                                />
                              </Box>
                            </HStack>
                          </LinearGradient>
                        </Pressable>
                      </View>
                    )}
                  />

                  {/* Pagination Dots */}
                  <HStack mt={4} justifyContent='center' space={2}>
                    {banners.map((banner, idx) => (
                      <Pressable
                        key={`dot-${banner.id}`}
                        onPress={() => {
                          if (carouselRef.current) {
                            carouselRef.current.scrollTo({ index: idx, animated: true });
                          }
                        }}>
                        <View
                          style={[
                            styles.paginationDot,
                            {
                              backgroundColor:
                                activeIndex === idx
                                  ? theme.colors.brand.orange
                                  : theme.colors.brand.gray,
                              width: activeIndex === idx ? 24 : 8,
                            },
                          ]}
                        />
                      </Pressable>
                    ))}
                  </HStack>
                </Box>

                {/* Categories Section */}
                <Box style={styles.section}>
                  <HStack justifyContent='space-between' alignItems='center' mb={4}>
                    <VStack>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Explore Cuisines
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Discover authentic flavors
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack justifyContent='space-between' space={2}>
                    {categories.map((cat) => (
                      <CategoryCard key={cat.id} item={cat} />
                    ))}
                  </HStack>
                </Box>

                {/* Premium Offers */}
                <Box style={styles.section}>
                  <HStack justifyContent='space-between' alignItems='center' mb={4}>
                    <VStack>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Today&apos;s Offers
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Don&apos;t miss out
                      </Text>
                    </VStack>
                    <Pressable style={styles.viewAllButton}>
                      <Text style={[styles.viewAllText, { color: theme.colors.brand.orange }]}>
                        View All
                      </Text>
                      <Icon
                        as={Ionicons}
                        name='arrow-forward'
                        size='xs'
                        color={theme.colors.brand.orange}
                        ml={1}
                      />
                    </Pressable>
                  </HStack>
                  <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.offersScrollContent}>
                    <HStack space={3}>
                      {offers.map((offer) => (
                        <Pressable key={offer.id}>
                          <LinearGradient colors={offer.colors} style={styles.offerCard}>
                            <Box style={styles.offerIcon}>
                              <Icon as={Ionicons} name={offer.icon} size='lg' color='white' />
                            </Box>
                            <Text style={styles.offerTitle}>{offer.title}</Text>
                            <Text style={styles.offerSubtitle}>{offer.sub}</Text>
                          </LinearGradient>
                        </Pressable>
                      ))}
                    </HStack>
                  </Animated.ScrollView>
                </Box>

                {/* Top Kitchens */}
                <Box style={styles.section}>
                  <HStack justifyContent='space-between' alignItems='center' mb={4}>
                    <VStack>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Top Rated
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Most loved by customers
                      </Text>
                    </VStack>
                    <Pressable style={styles.viewAllButton}>
                      <Text style={[styles.viewAllText, { color: theme.colors.brand.orange }]}>
                        View All
                      </Text>
                      <Icon
                        as={Ionicons}
                        name='arrow-forward'
                        size='xs'
                        color={theme.colors.brand.orange}
                        ml={1}
                      />
                    </Pressable>
                  </HStack>
                  <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.kitchensScrollContent}>
                    <HStack space={3}>
                      {kitchens.slice(6, 11).map((kitchen) => (
                        <KitchenCard key={`top-${kitchen.id}`} item={kitchen} />
                      ))}
                    </HStack>
                  </Animated.ScrollView>
                </Box>

                {/* All Restaurants */}
                <Box style={styles.section}>
                  <VStack space={2} mb={4}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                      All Restaurants
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                      {filteredKitchens.length} restaurants available
                    </Text>
                  </VStack>
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
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1 },
  columnWrapper: { justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 14 },
  listContent: { paddingBottom: 140 },

  searchWrapper: { paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
  searchGradient: {
    borderRadius: 16,
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "white",
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontFamily: "OpenSans",
    fontSize: 14,
    paddingVertical: 8,
    minHeight: 40,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  bannerSection: { marginTop: 4 },
  bannerSlide: {
    width: width,
    paddingHorizontal: 16,
  },
  bannerPressable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  bannerCard: {
    borderRadius: 20,
    padding: 20,
    height: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    lineHeight: 18,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    marginTop: 8,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.3,
  },
  bannerImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },

  paginationDot: {
    height: 8,
    borderRadius: 4,
  },

  section: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "500",
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  categoryWrapper: {
    flex: 1,
    alignItems: "center",
  },
  categoryPressable: {
    alignItems: "center",
    width: "100%",
  },
  categoryImageContainer: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: "white",
  },
  categoryImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Poppins",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.2,
    lineHeight: 14,
    paddingHorizontal: 2,
  },

  offersScrollContent: {
    paddingRight: 16,
  },
  offerCard: {
    width: 150,
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  offerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  offerTitle: {
    fontSize: 17,
    fontFamily: "Poppins",
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  offerSubtitle: {
    fontSize: 11,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    marginTop: 4,
    textAlign: "center",
  },

  kitchensScrollContent: {
    paddingRight: 16,
  },

  kitchenCard: {
    borderRadius: 20,
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
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
    height: "55%",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 3,
  },
  discountText: {
    fontSize: 11,
    fontFamily: "Poppins",
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.3,
  },
  kitchenInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  kitchenName: {
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  kitchenMeta: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
  },
  kitchenDot: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
});
