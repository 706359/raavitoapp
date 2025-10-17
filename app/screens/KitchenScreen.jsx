import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Badge,
  Box,
  Divider,
  HStack,
  Icon,
  IconButton,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

export default function KitchenScreen({ route, navigation }) {
  const { kitchen } = route.params;
  const { addToCart, removeFromCart, cart } = useCart();

  const menuTabs = ["Lunch", "Dinner", "Breakfast", "Snacks"];
  const [activeTab, setActiveTab] = useState("Lunch");

  const menuItems = [
    {
      id: "1",
      name: "Small Lunch",
      price: 50,
      desc: "Max veg 3, Chapati",
      img: require("../assets/Dosa.jpg"),
      isVeg: true,
      isBestseller: true,
    },
    {
      id: "2",
      name: "Medium Lunch",
      price: 90,
      desc: "Veg thali with rice, chapati",
      img: require("../assets/Gujarati.jpeg"),
      isVeg: true,
      isBestseller: false,
    },
  ];

  const getQty = (id) => {
    const item = cart.find((c) => c.id === id);
    return item ? item.qty : 0;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Premium Header with Gradient Effect */}
          <Box style={styles.headerContainer}>
            <HStack style={styles.headerRow}>
              <HStack alignItems='center' space={3}>
                <IconButton
                  icon={<Icon as={Ionicons} name='arrow-back' color='white' size='md' />}
                  onPress={() => navigation.goBack()}
                  borderRadius='full'
                  _pressed={{ bg: "rgba(255,255,255,0.2)" }}
                />
                <Text style={styles.headerTitle}>{kitchen?.name || "Kitchen"}</Text>
              </HStack>
              <HStack space={2} alignItems='center'>
                <IconButton
                  icon={<Icon as={Ionicons} name='search' color='white' size='md' />}
                  borderRadius='full'
                  _pressed={{ bg: "rgba(255,255,255,0.2)" }}
                />
                <IconButton
                  icon={<Icon as={Ionicons} name='heart-outline' color='white' size='md' />}
                  borderRadius='full'
                  _pressed={{ bg: "rgba(255,255,255,0.2)" }}
                />
              </HStack>
            </HStack>
          </Box>

          {/* Premium Kitchen Info Card */}
          <Box style={styles.infoCard}>
            <HStack justifyContent='space-between' alignItems='flex-start' mb={2}>
              <VStack flex={1}>
                <Text style={styles.infoName}>
                  {kitchen?.name || "Taste of India Tiffin Services"}
                </Text>
                <HStack alignItems='center' space={1} mt={1}>
                  <Icon as={MaterialIcons} name='place' size='xs' color='gray.500' />
                  <Text style={styles.infoSub}>{kitchen?.location || "Gotala Nagar"}</Text>
                </HStack>
              </VStack>
              <Badge
                bg='green.500'
                borderRadius='full'
                px={3}
                py={1}
                _text={{ color: "white", fontSize: "xs", fontWeight: "700" }}>
                OPEN
              </Badge>
            </HStack>

            <HStack style={styles.infoMetaRow} space={4}>
              <HStack style={styles.metaItem}>
                <Box style={styles.ratingBadge}>
                  <Icon as={Ionicons} name='star' color='white' size='xs' />
                  <Text style={styles.ratingText}>{kitchen?.rating || "4.0"}</Text>
                </Box>
              </HStack>
              <HStack style={styles.metaItem}>
                <Icon as={Ionicons} name='time-outline' color='orange.600' size='sm' />
                <Text style={styles.metaText}>{kitchen?.time || "30 min"}</Text>
              </HStack>
              <HStack style={styles.metaItem}>
                <Icon as={MaterialIcons} name='delivery-dining' color='orange.600' size='sm' />
                <Text style={styles.metaText}>Free</Text>
              </HStack>
            </HStack>

            <Divider my={3} />

            <Text style={styles.infoDesc}>
              {kitchen?.desc || "American, Fast Food • Inner Circle, Connaught Place"}
            </Text>
          </Box>

          {/* Premium Food Gallery with Multiple Images */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryScroll}
            contentContainerStyle={{ paddingRight: 16 }}>
            <Pressable>
              {({ isPressed }) => (
                <View
                  style={[styles.galleryItem, { transform: [{ scale: isPressed ? 0.95 : 1 }] }]}>
                  <Image
                    source={require("../assets/food.jpeg")}
                    alt='Food'
                    style={styles.galleryImage}
                  />
                </View>
              )}
            </Pressable>
            <Pressable>
              {({ isPressed }) => (
                <View
                  style={[styles.galleryItem, { transform: [{ scale: isPressed ? 0.95 : 1 }] }]}>
                  <Image
                    source={require("../assets/Dosa.jpg")}
                    alt='Food'
                    style={styles.galleryImage}
                  />
                </View>
              )}
            </Pressable>
            <Pressable>
              {({ isPressed }) => (
                <View
                  style={[styles.galleryItem, { transform: [{ scale: isPressed ? 0.95 : 1 }] }]}>
                  <Image
                    source={require("../assets/Gujarati.jpeg")}
                    alt='Food'
                    style={styles.galleryImage}
                  />
                  <View style={styles.galleryOverlay}>
                    <Text style={styles.galleryText}>+7 More</Text>
                  </View>
                </View>
              )}
            </Pressable>
          </ScrollView>

          {/* Premium Offer Card with Icon */}
          <Box style={styles.offerCard}>
            <HStack alignItems='center' space={3}>
              <Box style={styles.offerIconBox}>
                <Icon as={MaterialIcons} name='local-offer' color='white' size='lg' />
              </Box>
              <VStack flex={1}>
                <Text style={styles.offerTitle}>30% off up to ₹75</Text>
                <Text style={styles.offerSub}>USE KITCHENWALA | ABOVE ₹100</Text>
              </VStack>
              <Icon as={Ionicons} name='chevron-forward' color='orange.600' size='sm' />
            </HStack>
          </Box>

          {/* Premium Menu Tabs with Active Indicator */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={{ paddingHorizontal: 16 }}>
            {menuTabs.map((tab) => (
              <Pressable key={tab} onPress={() => setActiveTab(tab)}>
                {({ isPressed }) => (
                  <Box
                    style={[
                      styles.tabItem,
                      activeTab === tab && styles.tabItemActive,
                      { opacity: isPressed ? 0.7 : 1 },
                    ]}>
                    <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                      {tab}
                    </Text>
                  </Box>
                )}
              </Pressable>
            ))}
          </ScrollView>

          {/* Premium Menu Section */}
          <Box px={4} mb={32}>
            <HStack justifyContent='space-between' alignItems='center' mb={3} mt={2}>
              <Text style={styles.sectionTitle}>Maharashtrian Specials</Text>
              <Text style={styles.itemCount}>{menuItems.length} Items</Text>
            </HStack>

            {menuItems.map((item) => {
              const qty = getQty(item.id);

              return (
                <Box key={item.id} style={styles.menuItemCard}>
                  <HStack alignItems='flex-start' space={3}>
                    {/* Item Details */}
                    <VStack flex={1}>
                      {/* Veg/Non-veg indicator and Bestseller */}
                      <HStack alignItems='center' space={2} mb={2}>
                        <Box
                          style={[
                            styles.vegIndicator,
                            { borderColor: item.isVeg ? "#22c55e" : "#ef4444" },
                          ]}>
                          <Box
                            style={[
                              styles.vegDot,
                              { backgroundColor: item.isVeg ? "#22c55e" : "#ef4444" },
                            ]}
                          />
                        </Box>
                        {item.isBestseller && (
                          <Badge
                            bg='orange.100'
                            borderRadius='sm'
                            _text={{
                              color: "orange.700",
                              fontSize: "2xs",
                              fontWeight: "700",
                            }}
                            px={2}
                            py={0.5}>
                            ⭐ BESTSELLER
                          </Badge>
                        )}
                      </HStack>

                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>₹{item.price.toFixed(0)}</Text>
                      <Text style={styles.itemDesc} numberOfLines={2}>
                        {item.desc}
                      </Text>
                    </VStack>

                    {/* Image with Add Button Overlay */}
                    <Box style={styles.imageContainer}>
                      <Image source={item.img} alt={item.name} style={styles.itemImage} />

                      {/* Add/Quantity Control Overlay */}
                      <Box style={styles.controlOverlay}>
                        {qty > 0 ? (
                          <HStack style={styles.qtyControl} alignItems='center' space={2}>
                            <Pressable
                              onPress={() => removeFromCart(item.id)}
                              hitSlop={8}
                              style={styles.qtyButton}>
                              <Icon as={Ionicons} name='remove' size='sm' color='orange.600' />
                            </Pressable>

                            <Text style={styles.qtyNumber}>{qty}</Text>

                            <Pressable
                              onPress={() => addToCart(item)}
                              hitSlop={8}
                              style={[styles.qtyButton, styles.qtyButtonActive]}>
                              <Icon as={Ionicons} name='add' size='sm' color='white' />
                            </Pressable>
                          </HStack>
                        ) : (
                          <Pressable
                            onPress={() => addToCart(item)}
                            hitSlop={8}
                            style={styles.addButton}>
                            <Text style={styles.addButtonText}>ADD</Text>
                            <Icon as={Ionicons} name='add' size='xs' color='white' ml={1} />
                          </Pressable>
                        )}
                      </Box>
                    </Box>
                  </HStack>

                  {/* Customization option */}
                  <Pressable mt={2}>
                    <Text style={styles.customizeText}>
                      Customizable • Tap to add special instructions
                    </Text>
                  </Pressable>
                </Box>
              );
            })}
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}

const ORANGE = "#b95a01ff";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fafafa" },
  container: { flex: 1, backgroundColor: "#fafafa" },

  /* Premium Header */
  headerContainer: {
    backgroundColor: ORANGE,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  /* Premium Info Card */
  infoCard: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    marginTop: 16,
  },
  infoName: {
    fontWeight: "700",
    fontSize: 20,
    color: "#1f2937",
  },
  infoSub: {
    color: "#6b7280",
    fontSize: 13,
  },
  infoMetaRow: {
    marginTop: 12,
    flexDirection: "row",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingBadge: {
    backgroundColor: "#22c55e",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  metaText: {
    fontSize: 13,
    color: "#4b5563",
    fontWeight: "600",
  },
  infoDesc: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 18,
  },

  /* Premium Gallery */
  galleryScroll: {
    paddingLeft: 16,
    paddingVertical: 16,
  },
  galleryItem: {
    width: 240,
    height: 150,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  galleryOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Premium Offer Card */
  offerCard: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff7ed",
    borderWidth: 2,
    borderColor: "#fed7aa",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 12,
  },
  offerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: ORANGE,
  },
  offerSub: {
    fontSize: 12,
    color: "#9a6b3f",
    marginTop: 2,
  },

  /* Premium Tabs */
  tabsScroll: {
    marginVertical: 12,
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f3f4f6",
  },
  tabItemActive: {
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  /* Premium Menu Items */
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1f2937",
  },
  itemCount: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "600",
  },
  menuItemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  vegIndicator: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "700",
    marginBottom: 6,
  },
  itemDesc: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  customizeText: {
    fontSize: 12,
    color: ORANGE,
    fontWeight: "600",
  },

  /* Image with Controls */
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  controlOverlay: {
    position: "absolute",
    bottom: -8,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  qtyControl: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  qtyButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  qtyButtonActive: {
    backgroundColor: ORANGE,
  },
  qtyNumber: {
    fontWeight: "700",
    fontSize: 14,
    minWidth: 20,
    textAlign: "center",
    color: "#1f2937",
  },
});
