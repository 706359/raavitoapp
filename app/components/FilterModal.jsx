import { Ionicons } from '@expo/vector-icons';
import { Box, Button, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');
const SHEET_HEIGHT = Math.round(height * 0.88);
const RED = '#E23744';

const CATEGORIES = [
  { key: 'sort', label: 'Sort By', icon: 'swap-vertical' },
  { key: 'time', label: 'Time', icon: 'time' },
  { key: 'rating', label: 'Rating', icon: 'star' },
  { key: 'offers', label: 'Offers', icon: 'pricetag' },
  { key: 'price', label: 'Dish Price', icon: 'cash' },
  { key: 'trust', label: 'Trust Markers', icon: 'shield-checkmark' },
  { key: 'collections', label: 'Collections', icon: 'layers' },
];

export default function FilterModal({ open = false, onClose = () => {}, onApply = () => {} }) {
  // animation state
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [visible, setVisible] = useState(open);

  // UI state
  const [activeKey, setActiveKey] = useState('sort');
  const [sortBy, setSortBy] = useState('relevance');
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [minRating, setMinRating] = useState(null);
  const [offers, setOffers] = useState([]);
  const [price, setPrice] = useState(null);
  const [trustMarkers, setTrustMarkers] = useState([]);
  const [collections, setCollections] = useState([]);

  const scrollRef = useRef(null);
  const positionsRef = useRef({});
  const [sortExpanded, setSortExpanded] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 140) {
          closeSheet();
        } else {
          Animated.timing(translateY, { toValue: 0, duration: 150, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  // open/close animation
  useEffect(() => {
    if (open) {
      setVisible(true);
      translateY.setValue(SHEET_HEIGHT);
      Animated.timing(translateY, { toValue: 0, duration: 320, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [open]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose();
    });
  };

  // helper: toggle array-selection
  const toggleArray = (setter, arr, val) => {
    if (arr.includes(val)) setter(arr.filter((x) => x !== val));
    else setter([...arr, val]);
  };

  const clearAll = () => {
    setSortBy('relevance');
    setDeliveryTime(null);
    setMinRating(null);
    setOffers([]);
    setPrice(null);
    setTrustMarkers([]);
    setCollections([]);
  };

  const handleApply = () => {
    const payload = { sortBy, deliveryTime, minRating, offers, price, trustMarkers, collections };
    onApply(payload);
    closeSheet();
  };

  // when left menu item clicked, scroll right ScrollView to that section
  const scrollToSection = (key) => {
    setActiveKey(key);
    const y = positionsRef.current[key] ?? 0;
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, y - 8), animated: true }); // slight offset
    }
  };

  // each section will call this onLayout to register its y offset
  const onSectionLayout = (key, e) => {
    positionsRef.current[key] = e.nativeEvent.layout.y;
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType='none' statusBarTranslucent>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}>
          {/* Handle */}
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <HStack style={styles.header}>
            <Text fontSize='lg' bold color='#111827'>
              Filters & sorting
            </Text>
            <Pressable onPress={clearAll}>
              <Text color='#6B7280'>Clear All</Text>
            </Pressable>
          </HStack>

          {/* Body: Left menu fixed, Right ScrollView with stacked sections */}
          <HStack style={styles.body}>
            {/* Left menu */}
            <VStack style={styles.leftMenu}>
              {CATEGORIES.map((c) => {
                const active = c.key === activeKey;
                return (
                  <Pressable key={c.key} onPress={() => scrollToSection(c.key)}>
                    <HStack
                      alignItems='center'
                      style={[styles.leftItem, active && styles.leftItemActive]}>
                      <Icon
                        as={Ionicons}
                        name={c.icon}
                        size='sm'
                        color={active ? '#b95a01ff' : '#9CA3AF'}
                        mr={2}
                      />
                      <Text style={[styles.leftLabel, active && styles.leftLabelActive]}>
                        {c.label}
                      </Text>
                    </HStack>
                  </Pressable>
                );
              })}
            </VStack>

            {/* Right content: single ScrollView with all sections stacked */}
            <ScrollView
              style={styles.rightScroll}
              ref={scrollRef}
              showsVerticalScrollIndicator={false}>
              {/* Sort By section */}
              {/* <Box onLayout={(e) => onSectionLayout('sort', e)} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Sort By</Text>
                {[
                  { key: 'relevance', label: 'Relevance' },
                  { key: 'distance', label: 'Distance: Low to High' },
                  { key: 'delivery_time', label: 'Delivery Time: Low to High' },
                  { key: 'rating', label: 'Rating: High to Low' },
                  { key: 'price_low', label: 'Cost for one: Low to High' },
                ].map((opt) => (
                  <Pressable
                    key={opt.key}
                    onPress={() => setSortBy(opt.key)}
                    style={styles.rowPress}>
                    <HStack style={styles.row}>
                      <Text style={styles.rowLabel}>{opt.label}</Text>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: sortBy === opt.key ? RED : '#D1D5DB' },
                        ]}>
                        {sortBy === opt.key && <View style={styles.radioInner} />}
                      </View>
                    </HStack>
                  </Pressable>
                ))}
              </Box> */}

              <Box onLayout={(e) => onSectionLayout('sort', e)} style={styles.sectionCard}>
                <Pressable onPress={() => setSortExpanded(!sortExpanded)} style={styles.sortHeader}>
                  <HStack justifyContent='space-between' alignItems='center'>
                    <Text style={styles.sectionTitle}>Sort By</Text>
                    <Icon
                      as={Ionicons}
                      name={sortExpanded ? 'chevron-up' : 'chevron-down'}
                      size='md'
                      color={'#b95a01ff'}
                    />
                  </HStack>
                </Pressable>

                {sortExpanded && (
                  <>
                    {[
                      { key: 'relevance', label: 'Relevance' },
                      { key: 'distance', label: 'Distance: Low to High' },
                      { key: 'delivery_time', label: 'Delivery Time: Low to High' },
                      { key: 'rating', label: 'Rating: High to Low' },
                      { key: 'price_low', label: 'Cost for one: Low to High' },
                    ].map((opt) => (
                      <Pressable
                        key={opt.key}
                        onPress={() => setSortBy(opt.key)}
                        style={styles.rowPress}>
                        <HStack style={styles.row}>
                          <Text style={styles.rowLabel}>{opt.label}</Text>
                          <View
                            style={[
                              styles.radioOuter,
                              { borderColor: sortBy === opt.key ? '#b95a01ff' : '#D1D5DB' },
                            ]}>
                            {sortBy === opt.key && <View style={styles.radioInner} />}
                          </View>
                        </HStack>
                      </Pressable>
                    ))}
                  </>
                )}
              </Box>

              {/* Delivery Time section */}
              <Box onLayout={(e) => onSectionLayout('time', e)} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Delivery Time</Text>
                <View style={styles.chipsRow}>
                  {['15 mins', '30 mins', '45 mins', '60+ mins'].map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setDeliveryTime(deliveryTime === t ? null : t)}
                      style={[styles.chip, deliveryTime === t && styles.chipActive]}>
                      <Text style={[styles.chipText, deliveryTime === t && styles.chipTextActive]}>
                        {t}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Box>

              {/* Rating section */}
              <Box onLayout={(e) => onSectionLayout('rating', e)} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Minimum Rating</Text>
                <View style={styles.chipsRow}>
                  {[4.5, 4.0, 3.5, 3.0].map((r) => (
                    <Pressable
                      key={r}
                      onPress={() => setMinRating(minRating === r ? null : r)}
                      style={[styles.chip, minRating === r && styles.chipActive]}>
                      <Text style={[styles.chipText, minRating === r && styles.chipTextActive]}>
                        {r}+
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Box>

              {/* Offers */}
              <Box onLayout={(e) => onSectionLayout('offers', e)} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Offers</Text>
                <View style={styles.chipsWrap}>
                  {['Buy 1 Get 1', 'Deals of the Day', 'Gold offers'].map((o) => (
                    <Pressable
                      key={o}
                      onPress={() => toggleArray(setOffers, offers, o)}
                      style={[styles.chip, offers.includes(o) && styles.chipActive]}>
                      <Text style={[styles.chipText, offers.includes(o) && styles.chipTextActive]}>
                        {o}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Box>

              {/* Price */}
              <Box onLayout={(e) => onSectionLayout('price', e)} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Dish Price</Text>
                <View style={styles.chipsRow}>
                  {['₹', '₹₹', '₹₹₹', '₹₹₹₹'].map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => setPrice(price === p ? null : p)}
                      style={[styles.chip, price === p && styles.chipActive]}>
                      <Text style={[styles.chipText, price === p && styles.chipTextActive]}>
                        {p}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Box>

              {/* Trust Markers */}
              <Box onLayout={(e) => onSectionLayout('trust', e)} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Trust Markers</Text>
                <View style={styles.chipsWrap}>
                  {[
                    'Pure Veg',
                    'No Packaging charges',
                    'On-time preparation',
                    'Frequently reordered',
                  ].map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => toggleArray(setTrustMarkers, trustMarkers, t)}
                      style={[styles.chip, trustMarkers.includes(t) && styles.chipActive]}>
                      <Text
                        style={[
                          styles.chipText,
                          trustMarkers.includes(t) && styles.chipTextActive,
                        ]}>
                        {t}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Box>

              {/* Collections */}
              <Box onLayout={(e) => onSectionLayout('collections', e)} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Collections</Text>
                <View style={styles.chipsRow}>
                  {['Previously ordered', 'New to you', 'Recommended'].map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => toggleArray(setCollections, collections, c)}
                      style={[styles.chip, collections.includes(c) && styles.chipActive]}>
                      <Text
                        style={[styles.chipText, collections.includes(c) && styles.chipTextActive]}>
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Box>

              <View style={{ height: 28 }} />
            </ScrollView>
          </HStack>

          {/* Footer */}
          <HStack style={styles.footer}>
            <Button variant='ghost' style={styles.clearBtn} onPress={clearAll}>
              <Text color={'#b95a01ff'} bold>
                Clear All
              </Text>
            </Button>
            <Button style={styles.applyBtn} onPress={handleApply}>
              <Text color='white' bold>
                Show results
              </Text>
            </Button>
          </HStack>
        </Animated.View>
      </View>
    </Modal>
  );
}

// helper toggler outside to avoid redeclaration inside render
function toggleArray(setter, arr, val) {
  if (arr.includes(val)) setter(arr.filter((x) => x !== val));
  else setter([...arr, val]);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.38)' },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  handleWrap: { alignItems: 'center', paddingVertical: 8 },
  handle: { width: 56, height: 5, backgroundColor: '#E5E7EB', borderRadius: 3 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },

  body: { flex: 1, flexDirection: 'row' },
  leftMenu: {
    width: '28%',
    borderRightWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  leftItemActive: { backgroundColor: '#FFF5F5', borderLeftWidth: 3, borderLeftColor: '#b95a01ff' },
  leftLabel: { fontSize: 13, color: '#6B7280' },
  leftLabelActive: { color: '#b95a01ff', fontWeight: '600' },

  rightScroll: { flex: 1, paddingHorizontal: 0 },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: { color: '#b95a01ff', fontSize: 15, fontWeight: '700', marginBottom: 8 },

  rowPress: { borderRadius: 6 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  rowLabel: { fontSize: 14, color: '#111827' },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 6, backgroundColor: '#b95a01ff' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: '#FEEAEA', borderColor: '#b95a01ff' },
  chipText: { fontSize: 13, color: '#111827' },
  chipTextActive: { color: '#b95a01ff', fontWeight: '600' },

  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  clearBtn: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#b95a01ff',
    backgroundColor: '#fff',
  },
  applyBtn: { flex: 1, backgroundColor: '#b95a01ff' },
});
