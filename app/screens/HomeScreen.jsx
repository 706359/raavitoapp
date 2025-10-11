import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBar from "../components/HeaderBar";
import { kitchens } from "../data/menu";

const { width } = Dimensions.get("window");

/*
  Converted to pure Expo / React Native JSX.
  Replaced native-base components and carousel with native equivalents.
  Kept all content and styles intact (only adapted to RN components).
*/

export default function HomeScreen() {
  // Simple theme replacement for original useTheme usage
  const theme = {
    colors: {
      brand: {
        orange: "#f97316",
        green: "#10b981",
        dark: "#111827",
        light: "#fcf8ec",
        gray: "#9CA3AF",
      },
    },
  };

  const [location, setLocation] = useState("Fetching...");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scrollRef = useRef(null);
  const autoPlayRef = useRef(null);

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
          <View style={[styles.categoryImageContainer, { shadowColor: theme.colors.brand.orange }]}>
            <Image source={item.image} style={styles.categoryImage} />
          </View>
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
          <View style={[styles.kitchenCard, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
            <Image source={item.image} style={styles.kitchenImage} resizeMode='cover' />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              style={styles.kitchenGradient}
            />
            {item.discount && (
              <LinearGradient
                colors={[theme.colors.brand.orange, "#f5b144"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.discountBadge}>
                <View style={styles.discountInner}>
                  <Ionicons name='flash' size={14} color='white' />
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              </LinearGradient>
            )}
            <View style={styles.kitchenInfo}>
              <Text style={styles.kitchenName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center" }}>
                <Ionicons name='star' size={12} color={theme.colors.brand.orange} />
                <Text style={styles.kitchenMeta}> {item.rating}</Text>
                <Text style={styles.kitchenDot}> •</Text>
                <Text style={styles.kitchenMeta}> {item.time}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  // Banner autoplay & pagination handlers (manual carousel with ScrollView)
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      const next = (activeIndex + 1) % banners.length;
      setActiveIndex(next);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: next * width, animated: true });
      }
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const onBannerScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / width);
    setActiveIndex(idx);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: theme.colors.brand.light }]}>
        <HeaderBar title='Home' showCart location={location} />

        {/* Premium Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchGradient, { shadowColor: theme.colors.brand.orange }]}>
            <View style={styles.searchContainer}>
              <Ionicons name='search' size={18} color={theme.colors.brand.gray} />
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
            </View>
          </View>
        </View>

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
              <View style={{ gap: 24, marginBottom: 20 }}>
                {/* Premium Banners */}
                <View style={styles.bannerSection}>
                  <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onBannerScrollEnd}
                    style={{ width }}>
                    {banners.map((item) => (
                      <View key={item.id} style={{ width }}>
                        <Pressable style={styles.bannerPressable}>
                          <LinearGradient
                            colors={item.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.bannerCard}>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                              <View style={{ flex: 1, paddingRight: 8 }}>
                                <View>
                                  <Text style={styles.bannerTitle}>{item.title}</Text>
                                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                                </View>
                                <Pressable style={styles.ctaButton}>
                                  <Text style={styles.ctaText}>Claim Offer</Text>
                                  <Ionicons
                                    name='arrow-forward'
                                    size={14}
                                    color='white'
                                    style={{ marginLeft: 6 }}
                                  />
                                </Pressable>
                              </View>
                              <View style={styles.bannerImageWrapper}>
                                <Image
                                  source={item.image}
                                  style={styles.bannerImage}
                                  resizeMode='cover'
                                />
                              </View>
                            </View>
                          </LinearGradient>
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>

                  {/* Pagination Dots */}
                  <View
                    style={{
                      marginTop: 12,
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                    }}>
                    {banners.map((banner, idx) => (
                      <Pressable
                        key={`dot-${banner.id}`}
                        onPress={() => {
                          if (scrollRef.current) {
                            scrollRef.current.scrollTo({ x: idx * width, animated: true });
                            setActiveIndex(idx);
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
                  </View>
                </View>

                {/* Categories Section */}
                <View style={{ paddingHorizontal: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}>
                    <View>
                      <Text style={styles.sectionTitle}>Explore Cuisines</Text>
                      <Text style={styles.sectionSubtitle}>Authentic regional flavors</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                    {categories.map((cat) => (
                      <CategoryCard key={cat.id} item={cat} />
                    ))}
                  </View>
                </View>

                {/* Premium Offers */}
                <View style={styles.section}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}>
                    <View>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Today&apos;s Offers
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Don&apos;t miss out
                      </Text>
                    </View>
                  </View>
                  <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.offersScrollContent}>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      {offers.map((offer) => (
                        <Pressable key={offer.id}>
                          <LinearGradient colors={offer.colors} style={styles.offerCard}>
                            <View style={styles.offerIcon}>
                              <Ionicons name={offer.icon} size={24} color='white' />
                            </View>
                            <Text style={styles.offerTitle}>{offer.title}</Text>
                            <Text style={styles.offerSubtitle}>{offer.sub}</Text>
                          </LinearGradient>
                        </Pressable>
                      ))}
                    </View>
                  </Animated.ScrollView>
                </View>

                {/* Top Kitchens */}
                <View style={styles.section}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}>
                    <View>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Top Rated
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Most loved by customers
                      </Text>
                    </View>
                  </View>
                  <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.kitchensScrollContent}>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      {kitchens.slice(6, 11).map((kitchen) => (
                        <KitchenCard key={`top-${kitchen.id}`} item={kitchen} />
                      ))}
                    </View>
                  </Animated.ScrollView>
                </View>

                {/* All Restaurants */}
                <View style={styles.section}>
                  <View style={{ gap: 6, marginBottom: 8 }}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                      All Restaurants
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                      {filteredKitchens.length} restaurants available
                    </Text>
                  </View>
                </View>
              </View>
            }
            renderItem={({ item }) => <KitchenCard item={item} />}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fcf8ec" },
  container: { flex: 1 },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
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
    paddingVertical: 5,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontFamily: "OpenSans",
    fontSize: 14,
    paddingVertical: 8,
    minHeight: 35,
  },

  bannerSection: { marginTop: 4 },
  bannerSlide: {
    width: "auto",
    paddingHorizontal: 16,
  },
  bannerPressable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  bannerCard: {
    borderRadius: 20,
    padding: 20,
    height: 160,
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
    letterSpacing: 0.1,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    lineHeight: 18,
    marginTop: 6,
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
    borderRadius: 17,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 17,
  },

  paginationDot: {
    marginTop: 0,
    height: 8,
    borderRadius: 4,
  },
  section: { paddingHorizontal: 16 },

  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },

  categoryWrapper: {
    flex: 1,
    alignItems: "center",
    borderRadius: 17,
    backgroundColor: "#fff7f0",
    borderColor: "#ffffff",
    borderWidth: 2,
    marginRight: 6,
    marginLeft: 6,
    paddingVertical: 10,
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
    borderRadius: 25,
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
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
  },
  offerIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
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
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "transparent", // gradient handles color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  discountInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  discountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
    marginLeft: 6,
    textAlignVertical: "center",
  },

  kitchenInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  kitchenName: {
    fontSize: 16,
    fontWeight: "700",
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
