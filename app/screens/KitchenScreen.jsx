import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
} from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { fetchMenuItems, fetchKitchenDetails } from '../utils/apiHelpers';
import Loader from '../components/Loader';

export default function KitchenScreen({ route, navigation }) {
  const { kitchen } = route.params;
  const { addToCart, removeFromCart, cart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const menuTabs = ['Lunch', 'Dinner', 'Breakfast', 'Snacks'];
  const [activeTab, setActiveTab] = useState('Lunch');
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kitchenData, setKitchenData] = useState(kitchen);

  // Fetch kitchen details and menu items
  const loadKitchenData = useCallback(async () => {
    try {
      setLoading(true);
      const kitchenId = kitchen?._id || kitchen?.id;
      if (!kitchenId) {
        setLoading(false);
        return;
      }

      // Fetch kitchen details and menu items
      const [kitchenDetails, menuItems] = await Promise.all([
        fetchKitchenDetails(kitchenId),
        fetchMenuItems({ kitchenId }),
      ]);

      // Update kitchen data
      if (kitchenDetails.kitchen) {
        setKitchenData({
          ...kitchen,
          ...kitchenDetails.kitchen,
          id: kitchenDetails.kitchen._id,
        });
      }

      // Transform menu items
      const transformedItems = (menuItems || kitchenDetails.menuItems || []).map((item) => ({
        id: item._id,
        _id: item._id,
        name: item.name,
        price: item.price,
        desc: item.description || '',
        img: item.image ? { uri: item.image } : require('../assets/Dosa.jpg'),
        image: item.image,
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        isBestseller: item.isBestseller || false,
        category: item.category || 'Lunch',
      }));

      setAllMenuItems(transformedItems);
    } catch (error) {
      console.error('Error loading kitchen data:', error);
      setAllMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [kitchen?._id || kitchen?.id]);

  useFocusEffect(
    useCallback(() => {
      loadKitchenData();
    }, [loadKitchenData])
  );

  // Filter menu items based on active tab
  const filteredMenuItems = useMemo(() => {
    return allMenuItems.filter((item) => item.category === activeTab);
  }, [activeTab, allMenuItems]);

  const getQty = (id) => {
    const item = cart.find((c) => c.id === id || c._id === id);
    return item ? item.qty : 0;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Premium Header with Gradient Effect */}
          <Box style={styles.headerContainer}>
            <HStack style={styles.headerRow}>
              <HStack style={styles.headerLeft}>
                <IconButton
                  icon={<Icon as={Ionicons} name='arrow-back' color='white' size='md' />}
                  onPress={() => navigation.goBack()}
                  borderRadius='full'
                  style={styles.iconButton}
                />
                <Text style={styles.headerTitle}>{kitchenData?.name || kitchen?.name || 'Kitchen'}</Text>
              </HStack>
              <HStack style={styles.headerRight}>
                <IconButton
                  icon={<Icon as={Ionicons} name='search' color='white' size='md' />}
                  borderRadius='full'
                  style={styles.iconButton}
                />
                {/* <IconButton
                  icon={<Icon as={Ionicons} name='heart-outline' color='white' size='md' />}
                  borderRadius='full'
                  style={styles.iconButton}
                /> */}

                <IconButton
                  onPress={async () => {
                    const kitchenId = kitchenData?._id || kitchenData?.id || kitchen?.id || kitchen?._id;
                    if (isFavorite(kitchenId)) {
                      await removeFavorite(kitchenId);
                    } else {
                      await addFavorite({ id: kitchenId, ...kitchenData });
                    }
                  }}
                  icon={
                    <Icon
                      as={Ionicons}
                      name={isFavorite(kitchenData?._id || kitchenData?.id || kitchen?.id || kitchen?._id) ? 'heart' : 'heart-outline'}
                      color={isFavorite(kitchenData?._id || kitchenData?.id || kitchen?.id || kitchen?._id) ? 'red.400' : 'white'}
                      size='md'
                    />
                  }
                  borderRadius='full'
                  style={styles.iconButton}
                />

                {/* <IconButton
                  onPress={() =>
                    isFavorite(kitchen.id) ? removeFavorite(kitchen.id) : addFavorite(kitchen)
                  }
                  icon={
                    <Icon
                      as={Ionicons}
                      name={isFavorite(kitchen.id) ? 'heart' : 'heart-outline'}
                      color={isFavorite(kitchen.id) ? 'red.400' : 'white'}
                      size='md'
                    />
                  }
                  borderRadius='full'
                  style={styles.iconButton}
                /> */}
              </HStack>
            </HStack>
          </Box>

          {/* Premium Kitchen Info Card */}
          <Box style={styles.infoCard}>
            <HStack style={styles.infoHeader}>
              <VStack style={styles.infoHeaderLeft}>
                <Text style={styles.infoName}>
                  {kitchenData?.name || kitchen?.name || 'Taste of India Tiffin Services'}
                </Text>
                <HStack style={styles.locationRow}>
                  <Icon as={MaterialIcons} name='place' size='xs' color='gray.500' />
                  <Text style={styles.infoSub}>
                    {kitchenData?.location || kitchenData?.address || kitchen?.location || 'Gotala Nagar'}
                  </Text>
                </HStack>
              </VStack>
              <Badge style={styles.openBadge}>
                {kitchenData?.isActive !== false ? 'OPEN' : 'CLOSED'}
              </Badge>
            </HStack>

            <HStack style={styles.infoMetaRow}>
              <HStack style={styles.metaItem}>
                <Box style={styles.ratingBadge}>
                  <Icon as={Ionicons} name='star' color='white' size='xs' />
                  <Text style={styles.ratingText}>
                    {kitchenData?.rating || kitchen?.rating || '4.0'}
                  </Text>
                </Box>
              </HStack>
              <HStack style={styles.metaItem}>
                <Icon as={Ionicons} name='time-outline' color='orange.600' size='sm' />
                <Text style={styles.metaText}>
                  {kitchenData?.deliveryTime || kitchen?.time || '30 min'}
                </Text>
              </HStack>
              <HStack style={styles.metaItem}>
                <Icon as={MaterialIcons} name='delivery-dining' color='orange.600' size='sm' />
                <Text style={styles.metaText}>Free</Text>
              </HStack>
            </HStack>

            <Divider style={styles.divider} />

            <Text style={styles.infoDesc}>
              {kitchenData?.description || kitchenData?.desc || kitchen?.desc || 'American, Fast Food • Inner Circle, Connaught Place'}
            </Text>
          </Box>

          {/* Premium Food Gallery with Multiple Images */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryScroll}
            contentContainerStyle={styles.galleryContent}>
            <Pressable>
              {({ isPressed }) => (
                <View
                  style={[styles.galleryItem, { transform: [{ scale: isPressed ? 0.95 : 1 }] }]}>
                  <Image
                    source={require('../assets/food.jpeg')}
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
                    source={require('../assets/Dosa.jpg')}
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
                    source={require('../assets/Gujarati.jpeg')}
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
            <HStack style={styles.offerContent}>
              <Box style={styles.offerIconBox}>
                <Icon as={MaterialIcons} name='local-offer' color='white' size='lg' />
              </Box>
              <VStack style={styles.offerTextContainer}>
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
            contentContainerStyle={styles.tabsContent}>
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
          <Box style={styles.menuSection}>
            <HStack style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{activeTab} Menu</Text>
              <Text style={styles.itemCount}>{filteredMenuItems.length} Items</Text>
            </HStack>

            {loading ? (
              <Box style={styles.emptyState}>
                <Loader size="large" color="orange" text="Loading menu..." />
              </Box>
            ) : filteredMenuItems.length === 0 ? (
              <Box style={styles.emptyState}>
                <Icon as={Ionicons} name='restaurant-outline' size='4xl' color='gray.300' />
                <Text style={styles.emptyText}>No items available in {activeTab}</Text>
              </Box>
            ) : (
              filteredMenuItems.map((item) => {
                const qty = getQty(item.id);

                return (
                  <Box key={item.id} style={styles.menuItemCard}>
                    <HStack style={styles.menuItemRow}>
                      {/* Item Details */}
                      <VStack style={styles.menuItemDetails}>
                        {/* Veg/Non-veg indicator and Bestseller */}
                        <HStack style={styles.itemBadges}>
                          <Box
                            style={[
                              styles.vegIndicator,
                              { borderColor: item.isVeg ? '#22c55e' : '#ef4444' },
                            ]}>
                            <Box
                              style={[
                                styles.vegDot,
                                { backgroundColor: item.isVeg ? '#22c55e' : '#ef4444' },
                              ]}
                            />
                          </Box>
                          {item.isBestseller && (
                            <Badge style={styles.bestsellerBadge}>⭐ BESTSELLER</Badge>
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
                        <Image
                          source={typeof item.img === 'string' || item.image ? { uri: item.image || item.img } : item.img}
                          alt={item.name}
                          style={styles.itemImage}
                        />

                        {/* Add/Quantity Control Overlay */}
                        <Box style={styles.controlOverlay}>
                          {qty > 0 ? (
                            <HStack style={styles.qtyControl}>
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
                              <Icon as={Ionicons} name='add' size='xs' color='white' />
                            </Pressable>
                          )}
                        </Box>
                      </Box>
                    </HStack>

                    {/* Customization option */}
                    <Pressable style={styles.customizeButton}>
                      <Text style={styles.customizeText}>
                        Customizable • Tap to add special instructions
                      </Text>
                    </Pressable>
                  </Box>
                );
              })
            )}
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}

const ORANGE = '#f97316';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Poppins',
  },

  /* Premium Info Card */
  infoCard: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    marginTop: 16,
  },
  infoHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoHeaderLeft: {
    flex: 1,
  },
  infoName: {
    fontWeight: '700',
    fontSize: 20,
    color: '#1f2937',
    fontFamily: 'Poppins',
  },
  locationRow: {
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  infoSub: {
    color: '#6b7280',
    fontSize: 13,
    fontFamily: 'OpenSans',
  },
  openBadge: {
    backgroundColor: '#22c55e',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  infoMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBadge: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  metaText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '600',
    fontFamily: 'OpenSans',
  },
  divider: {
    marginVertical: 12,
  },
  infoDesc: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'OpenSans',
  },

  /* Premium Gallery */
  galleryScroll: {
    paddingLeft: 16,
    paddingVertical: 16,
  },
  galleryContent: {
    paddingRight: 16,
  },
  galleryItem: {
    width: 240,
    height: 150,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },

  /* Premium Offer Card */
  offerCard: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#fff7ed',
    borderWidth: 2,
    borderColor: '#fed7aa',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 12,
  },
  offerContent: {
    alignItems: 'center',
    gap: 12,
  },
  offerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ORANGE,
    fontFamily: 'Poppins',
  },
  offerSub: {
    fontSize: 12,
    color: '#9a6b3f',
    marginTop: 2,
    fontFamily: 'OpenSans',
  },

  /* Premium Tabs */
  tabsScroll: {
    marginVertical: 12,
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
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
    color: '#6b7280',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  /* Premium Menu Items */
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  sectionHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1f2937',
    fontFamily: 'Poppins',
  },
  itemCount: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
    fontFamily: 'OpenSans',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
    marginTop: 16,
    fontFamily: 'OpenSans',
  },
  menuItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemRow: {
    alignItems: 'flex-start',
    gap: 12,
  },
  menuItemDetails: {
    flex: 1,
  },
  itemBadges: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  vegIndicator: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bestsellerBadge: {
    backgroundColor: '#fff7ed',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    color: '#ea580c',
    fontSize: 10,
    fontWeight: '700',
  },
  itemName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  itemPrice: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  itemDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    fontFamily: 'OpenSans',
  },
  customizeButton: {
    marginTop: 8,
  },
  customizeText: {
    fontSize: 12,
    color: ORANGE,
    fontWeight: '600',
    fontFamily: 'OpenSans',
  },

  /* Image with Controls */
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  controlOverlay: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  qtyControl: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  qtyButtonActive: {
    backgroundColor: ORANGE,
  },
  qtyNumber: {
    fontWeight: '700',
    fontSize: 14,
    minWidth: 20,
    textAlign: 'center',
    color: '#1f2937',
    fontFamily: 'Poppins',
  },
});
