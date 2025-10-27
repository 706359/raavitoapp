import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddress } from '../context/AddressContext';
import { useCart } from '../context/CartContext';

export default function HeaderBar({ showBack = false, showCart = true }) {
  const navigation = useNavigation();
  const { cart } = useCart();
  const { selectedAddress } = useAddress();

  const totalQty = cart.reduce((s, it) => s + (it.qty || 0), 0);

  // Handle address object or string
  const getAddressText = () => {
    if (!selectedAddress) return 'Select location';
    if (typeof selectedAddress === 'string') return selectedAddress;
    // If it's an object, extract the address field
    return selectedAddress.address || selectedAddress.type || 'Select location';
  };

  // Animation values
  const badgeScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Badge pulse animation when cart updates
  useEffect(() => {
    if (totalQty > 0) {
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.2,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [badgeScale, totalQty]);

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <View style={styles.header}>
          {/* Left Side: Back OR Location */}
          {showBack ? (
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
              <Ionicons name='arrow-back' size={26} color='#1f2937' />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.navigate('ProfileTab', { screen: 'ManageAddresses' })}
              style={({ pressed }) => [
                styles.locationContainer,
                pressed && styles.locationPressed,
              ]}>
              <View style={styles.locationContent}>
                <View style={styles.deliverToRow}>
                  <Text style={styles.deliverToText}>DELIVER TO</Text>
                  <Ionicons name='chevron-down' size={14} color='#10b981' />
                </View>
                <View style={styles.addressRow}>
                  <Ionicons name='location' size={18} color='#10b981' />
                  <Text style={styles.addressText} numberOfLines={1} ellipsizeMode='tail'>
                    {getAddressText()}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Right Side: Cart & Profile */}
          <View style={styles.rightContainer}>
            {showCart && (
              <Pressable
                onPress={() => navigation.navigate('Cart')}
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
                <View style={styles.cartIconContainer}>
                  <Ionicons name='cart-outline' size={26} color='#374151' />
                  {totalQty > 0 && (
                    <Animated.View
                      style={[
                        styles.badge,
                        {
                          transform: [{ scale: badgeScale }],
                        },
                      ]}>
                      <Text style={styles.badgeText}>{totalQty > 99 ? '99+' : totalQty}</Text>
                    </Animated.View>
                  )}
                </View>
              </Pressable>
            )}

            <Pressable
              onPress={() => navigation.navigate('ExtraStack', { screen: 'UserProfile' })}
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
              <View style={styles.profileButton}>
                <Ionicons name='person' size={20} color='#fff' />
              </View>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  // Back Button Styles
  backButton: {
    padding: 8,
    borderRadius: 50,
  },
  backButtonPressed: {
    backgroundColor: '#f3f4f6',
    opacity: 0.8,
  },
  // Location Styles
  locationContainer: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 4,
  },
  locationPressed: {
    opacity: 0.7,
  },
  locationContent: {
    gap: 4,
  },
  deliverToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliverToText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  // Right Container Styles
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  // Cart Icon Styles
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  // Profile Button Styles
  profileButton: {
    backgroundColor: '#f97316',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
