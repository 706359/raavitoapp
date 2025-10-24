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

const CategoryCard = React.memo(({ item, shadowColor, textColor }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
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
          <View style={styles.categoryOverlay} />
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
      gradient: ["#f97316", "#fb923c"],
      image: require("../assets/Rajasthani.jpg"),
    },
    {
      id: "2",
      title: "Fresh & Healthy",
      subtitle: "Farm to table daily specials",
      gradient: ["#10b981", "#34d399"],
      image: require("../assets/Gujarati.jpeg"),
    },
    {
      id: "3",
      title: "Weekend Feast",
      subtitle: "20% off on family combos",
      gradient: ["#0ea5e9", "#38bdf8"],
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
      colors: ["#f97316", "#ea580c"],
    },
    {
      id: "offer-2",
      icon: "nutrition",
      title: "Combo Deal",
      sub: "Thali + Drink",
      colors: ["#10b981", "#059669"],
    },
    {
      id: "offer-3",
      icon: "people",
      title: "Family Pack",
      sub: "20% Discount",
      colors: ["#8b5cf6", "#7c3aed"],
    },
    {
      id: "offer-4",
      icon: "flash",
      title: "Flash Sale",
      sub: "2 Hours Left",
      colors: ["#ef4444", "#dc2626"],
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        if (bannerScrollRef.current && typeof bannerScrollRef.current.scrollTo === "function") {
          bannerScrollRef.current.scrollTo({
            x: nextIndex * (width - 32),
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const CARD_WIDTH = width * 0.45;
  const CARD_HEIGHT = 220;

  const handleTopKitchensScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    setCanScrollLeft(scrollX > 10);
    setCanScrollRight(scrollX < contentWidth - layoutWidth - 10);
  };

  const scrollTopKitchens = (direction) => {
    if (topKitchensScrollRef.current) {
      const scrollAmount = CARD_WIDTH + 12;
      topKitchensScrollRef.current.scrollTo({
        x:
          direction === "left"
            ? Math.max(0, topKitchensScrollRef.current.contentOffset?.x - scrollAmount || 0)
            : (topKitchensScrollRef.current.contentOffset?.x || 0) + scrollAmount,
        animated: true,
      });
    }
  };

  const filteredKitchens = useMemo(() => {
    if (!searchQuery.trim()) return kitchens;
    return kitchens.filter((kitchen) =>
      kitchen.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const KitchenCard = ({ item }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.97,
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
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={styles.kitchenGradient}
            />
            {item.discount && (
              <View style={styles.discountBadge}>
                <LinearGradient
                  colors={["#f97316", "#fb923c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.discountGradient}>
                  <Ionicons name='flash' size={12} color='white' />
                  <Text style={styles.discountText}>{item.discount}</Text>
                </LinearGradient>
              </View>
            )}
            <View style={styles.kitchenInfo}>
              <Text style={styles.kitchenName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.kitchenMetaRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name='star' size={11} color='#fff' />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <Text style={styles.kitchenDot}>•</Text>
                <Text style={styles.kitchenMeta}>{item.time}</Text>
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

        <View style={styles.searchWrapper}>
          <View style={[styles.searchContainer, { shadowColor: theme.colors.brand.orange }]}>
            <Ionicons name='search' size={20} color={theme.colors.brand.gray} />
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

        <Animated.View
          style={[
            styles.animatedContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}>
          <FlatList
            data={filteredKitchens.slice(0, 6)}
            keyExtractor={(item) => `kitchen-${item.id}`}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <View style={styles.bannerSectionWrapper}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Exclusive Deals
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Limited time offers
                      </Text>
                    </View>
                    <Pressable>
                      <Text style={[styles.viewAllText, { color: theme.colors.brand.orange }]}>
                        View All
                      </Text>
                    </Pressable>
                  </View>

                  <ScrollView
                    ref={bannerScrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.bannerScrollContent}
                    snapToInterval={width - 32}
                    decelerationRate='fast'>
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
                          <View style={styles.bannerContent}>
                            <View style={styles.bannerTextSection}>
                              <Text style={styles.bannerTitle}>{item.title}</Text>
                              <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>

                              <Pressable style={styles.claimButton}>
                                <Text style={styles.claimText}>Claim Now</Text>
                                <Ionicons name='arrow-forward' size={14} color='white' />
                              </Pressable>
                            </View>

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

                  <View style={styles.paginationDots}>
                    {banners.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              index === activeIndex
                                ? theme.colors.brand.orange
                                : theme.colors.brand.gray,
                            width: index === activeIndex ? 24 : 8,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeaderSimple}>
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

                <View style={styles.section}>
                  <View style={styles.sectionHeaderSimple}>
                    <View>
                      <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                        Today&apos;s Offers
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                        Don&apos;t miss out on savings
                      </Text>
                    </View>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.offersScrollContent}
                    scrollEventThrottle={16}>
                    {offers.map((offer) => (
                      <Pressable key={offer.id} accessible>
                        <LinearGradient colors={offer.colors} style={styles.offerCard}>
                          <View style={styles.offerIcon}>
                            <Ionicons name={offer.icon} size={26} color='white' />
                          </View>
                          <Text style={styles.offerTitle}>{offer.title}</Text>
                          <Text style={styles.offerSubtitle}>{offer.sub}</Text>
                        </LinearGradient>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeaderWithArrows}>
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
                          color={canScrollLeft ? "white" : "rgba(255,255,255,0.5)"}
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
                          color={canScrollRight ? "white" : "rgba(255,255,255,0.5)"}
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
                    {kitchens.slice(6, 11).map((kitchen) => (
                      <KitchenCard key={`top-${kitchen.id}`} item={kitchen} />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.section}>
                  <View style={styles.allKitchensHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.brand.dark }]}>
                      All Kitchens
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.colors.brand.gray }]}>
                      {filteredKitchens.length} kitchen{filteredKitchens.length !== 1 ? "s" : ""}{" "}
                      available
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
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "white",
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  input: {
    flex: 1,
    fontFamily: "OpenSans",
    fontSize: 15,
    paddingVertical: 0,
  },
  animatedContainer: {
    flex: 1,
  },
  listHeader: {
    gap: 28,
    marginBottom: 24,
  },
  bannerSectionWrapper: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionHeaderSimple: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  sectionHeaderWithArrows: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  scrollArrows: {
    flexDirection: "row",
    gap: 8,
  },
  scrollArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  scrollArrowDisabled: {
    opacity: 0.4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  bannerScrollContent: {
    paddingHorizontal: 16,
  },
  bannerItem: {
    width: width - 32,
    marginRight: 0,
  },
  bannerGradient: {
    borderRadius: 20,
    padding: 20,
    height: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  bannerTextSection: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    lineHeight: 20,
    marginBottom: 16,
  },
  claimButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  claimText: {
    fontSize: 13,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.2,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: "all 0.3s ease",
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "500",
    marginTop: 4,
    opacity: 0.8,
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
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
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "white",
    position: "relative",
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: -0.2,
    lineHeight: 16,
  },
  offersScrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  offerCard: {
    width: 150,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  offerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  offerSubtitle: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    textAlign: "center",
  },
  kitchensScrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  kitchenCard: {
    borderRadius: 18,
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#f3f4f6",
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
    height: "60%",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  discountGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  discountText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
    fontFamily: "Poppins",
  },
  kitchenInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  kitchenName: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.3,
    fontFamily: "Poppins",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  kitchenMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(249, 115, 22, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  ratingText: {
    fontSize: 11,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.1,
  },
  kitchenMeta: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  kitchenDot: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  allKitchensHeader: {
    gap: 6,
    marginBottom: 16,
  },
});
