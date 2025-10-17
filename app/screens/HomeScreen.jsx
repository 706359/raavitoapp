import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

// CategoryCard component - Outside main component to prevent recreation
const CategoryCard = React.memo(({ item, shadowColor, textColor }) => {
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
        <View style={[styles.categoryImageContainer, { shadowColor }]}>
          <Image source={item.image} style={styles.categoryImage} />
        </View>
        <Text style={[styles.categoryText, { color: textColor }]} numberOfLines={2}>
          {item.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

CategoryCard.displayName = "CategoryCard";

export default function HomeScreen() {
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
  const bannerScrollRef = useRef(null);
  const topKitchensScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Banner autoplay with proper cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        if (bannerScrollRef.current && typeof bannerScrollRef.current.scrollTo === "function") {
          bannerScrollRef.current.scrollTo({
            x: nextIndex * width,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const CARD_WIDTH = width * 0.45;
  const CARD_HEIGHT = 210;

  // Handle scroll for Top Rated section
  const handleTopKitchensScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    setCanScrollLeft(scrollX > 10);
    setCanScrollRight(scrollX < contentWidth - layoutWidth - 10);
  };

  const scrollTopKitchens = (direction) => {
    if (topKitchensScrollRef.current) {
      const scrollAmount = CARD_WIDTH + 12; // card width + gap
      topKitchensScrollRef.current.scrollTo({
        x:
          direction === "left"
            ? Math.max(0, topKitchensScrollRef.current.contentOffset?.x - scrollAmount || 0)
            : (topKitchensScrollRef.current.contentOffset?.x || 0) + scrollAmount,
        animated: true,
      });
    }
  };

  // Memoized filtered kitchens
  const filteredKitchens = useMemo(() => {
    if (!searchQuery.trim()) return kitchens;
    return kitchens.filter((kitchen) =>
      kitchen.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
              <View style={styles.kitchenMetaRow}>
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
                placeholder='Search Kitchen, Food Items...'
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
          style={[
            styles.animatedContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}>
          {/* ================= Main FlatList With Banner ================= */}
          <FlatList
            data={filteredKitchens.slice(0, 6)}
            keyExtractor={(item) => `kitchen-${item.id}`}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                {/* ================= Modern Horizontal Banner Section ================= */}
                <View style={styles.bannerSectionWrapper}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                      Exclusive Deals
                    </Text>
                    <Pressable>
                      <Text style={[styles.viewAllText, { color: theme.colors.brand.orange }]}>
                        View All
                      </Text>
                    </Pressable>
                  </View>

                  <ScrollView
                    ref={bannerScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.bannerScrollContent}>
                    {banners.map((item) => (
                      <Pressable
                        key={item.id}
                        style={styles.bannerItem}
                        accessible
                        accessibilityLabel={item.title}>
                        <LinearGradient
                          colors={item.gradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.bannerGradient}>
                          <View>
                            <Text style={styles.bannerTitle}>{item.title}</Text>
                            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                          </View>

                          <View style={styles.bannerBottom}>
                            <Pressable style={styles.claimButton}>
                              <Text style={styles.claimText}>Claim</Text>
                              <Ionicons
                                name='arrow-forward'
                                size={13}
                                color='white'
                                style={styles.claimArrow}
                              />
                            </Pressable>

                            <Image
                              source={item.image}
                              style={styles.bannerImage}
                              resizeMode='cover'
                            />
                          </View>
                        </LinearGradient>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* ================= Categories Section ================= */}
                <View style={styles.section}>
                  <View style={styles.sectionHeaderWithSubtitle}>
                    <View>
                      <Text style={styles.sectionTitle}>Explore Cuisines</Text>
                      <Text style={styles.sectionSubtitle}>Authentic regional flavors</Text>
                    </View>
                  </View>
                  <View style={styles.categoriesRow}>
                    {categories.map((cat) => (
                      <CategoryCard
                        key={cat.id}
                        item={cat}
                        shadowColor={theme.colors.brand.orange}
                        textColor={theme.colors.brand.dark}
                      />
                    ))}
                  </View>
                </View>

                {/* ================= Premium Offers ================= */}
                <View style={styles.bannerSection}>
                  <View style={styles.sectionHeaderWithSubtitle}>
                    <View>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Today&apos;s Offers
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Don&apos;t miss out
                      </Text>
                    </View>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.offersScrollContent}
                    scrollEventThrottle={16}>
                    <View style={styles.offersRow}>
                      {offers.map((offer) => (
                        <Pressable key={offer.id} accessible>
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
                  </ScrollView>
                </View>

                {/* ================= Top Kitchens ================= */}
                <View style={styles.section}>
                  <View style={styles.sectionHeaderWithSubtitle}>
                    <View>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Top Rated
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Most loved by customers
                      </Text>
                    </View>
                    <View style={styles.scrollArrows}>
                      <Pressable
                        onPress={() => scrollTopKitchens("left")}
                        disabled={!canScrollLeft}
                        style={[
                          styles.scrollArrow,
                          { backgroundColor: theme.colors.brand.orange },
                          !canScrollLeft && styles.scrollArrowDisabled,
                        ]}>
                        <Ionicons
                          name='chevron-back'
                          size={18}
                          color={canScrollLeft ? "white" : "rgba(255,255,255,0.4)"}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => scrollTopKitchens("right")}
                        disabled={!canScrollRight}
                        style={[
                          styles.scrollArrow,
                          { backgroundColor: theme.colors.brand.orange },
                          !canScrollRight && styles.scrollArrowDisabled,
                        ]}>
                        <Ionicons
                          name='chevron-forward'
                          size={18}
                          color={canScrollRight ? "white" : "rgba(255,255,255,0.4)"}
                        />
                      </Pressable>
                    </View>
                  </View>
                  <ScrollView
                    ref={topKitchensScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.kitchensScrollContent}
                    scrollEventThrottle={16}
                    onScroll={handleTopKitchensScroll}>
                    <View style={styles.kitchensRow}>
                      {kitchens.slice(6, 11).map((kitchen) => (
                        <KitchenCard key={`top-${kitchen.id}`} item={kitchen} />
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* ================= All Kitchens ================= */}
                <View style={styles.section}>
                  <View style={styles.allKitchensHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                      All Kitchens
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                      {filteredKitchens.length} Kitchens available
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
  safeArea: {
    flex: 1,
    backgroundColor: "#fcf8ec",
  },
  container: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 140,
  },

  // Search styles
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
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

  // Animated container
  animatedContainer: {
    flex: 1,
  },

  // List header
  listHeader: {
    gap: 20,
    marginBottom: 20,
  },

  // Banner section
  bannerSection: {
    marginTop: 4,
  },
  bannerSectionWrapper: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  scrollArrows: {
    flexDirection: "row",
    gap: 8,
  },
  scrollArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollArrowDisabled: {
    opacity: 0.4,
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: "Poppins",
    fontWeight: "600",
  },
  bannerScrollContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  bannerItem: {
    width: 240,
  },
  bannerGradient: {
    borderRadius: 18,
    padding: 16,
    height: 130,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerTitle: {
    fontSize: 17,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
  },
  bannerSubtitle: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  bannerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  claimButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  claimText: {
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
  },
  claimArrow: {
    marginLeft: 5,
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },

  // Section styles
  section: {
    paddingHorizontal: 16,
  },
  sectionHeaderWithSubtitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  sectionSubtitle: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "600",
    marginTop: 2,
    lineHeight: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  // Categories
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryWrapper: {
    flex: 1,
    alignItems: "center",
    borderRadius: 16,
    paddingInline: 10,
    paddingVertical: 8,
  },
  categoryPressable: {
    alignItems: "center",
    width: "100%",
  },
  categoryImageContainer: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderRadius: 36,
    marginBottom: 8,
    backgroundColor: "white",
  },
  categoryImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Poppins",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 14,
    paddingHorizontal: 2,
  },

  // Offers
  offersScrollContent: {
    paddingHorizontal: 16,
  },
  offersRow: {
    flexDirection: "row",
    gap: 12,
  },
  offerCard: {
    width: 140,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
  },
  offerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  offerTitle: {
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  offerSubtitle: {
    fontSize: 11,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    marginTop: 2,
    textAlign: "center",
  },

  // Kitchens
  kitchensScrollContent: {
    paddingRight: 16,
  },
  kitchensRow: {
    flexDirection: "row",
    gap: 12,
  },
  kitchenCard: {
    borderRadius: 20,
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
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
    backgroundColor: "transparent",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
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
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  kitchenMetaRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
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

  // All kitchens header
  allKitchensHeader: {
    gap: 6,
    marginBottom: 12,
  },
});
