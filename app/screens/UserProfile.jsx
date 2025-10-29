import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export default function UserProfile({ navigation }) {
  const { user = {}, logout = () => {} } = useAuth() || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const { favorites } = useFavorites();

  const [profile, setProfile] = useState({
    name: user?.name || 'Guest User',
    mobile: user?.mobile || 'xxxxxxxxxx',
    image: user?.profileImage || null,
    orderHistory: user?.orderHistory || [],
    Userfavorites: user?.Userfavorites || [],
    rewards: user?.rewards || { points: 0 },
    dietaryTags: user?.dietaryTags || [],
  });

  const loadProfile = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name ?? prev.name,
          mobile: parsed.mobile ?? prev.mobile,
          image: parsed.image ?? prev.image,
          address: parsed.address ?? prev.address,
          // keep other arrays if you also persist them later
        }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const {
    name,
    mobile,
    image,
    orderHistory = [],
    Userfavorites = [],
    rewards = { points: 0 },
    dietaryTags = [],
  } = profile;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Gradient Header */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}>
          {/* Close Button */}
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            onPress={() => navigation?.goBack()}>
            <Ionicons name='close' size={24} color='#1f2937' />
          </Pressable>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image
                source={image ? { uri: image } : require('../assets/logo.png')}
                style={styles.avatar}
              />
            </View>
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.mobile}>{mobile}</Text>

          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && styles.editBtnPressed]}
            onPress={() => navigation.navigate('EditProfile', { profile })}>
            <Ionicons name='create-outline' size={18} color='#fff' />
            <Text style={styles.editText}>Edit Profile</Text>
          </Pressable>
        </LinearGradient>
      </Animated.View>

      {/* Content with Animation */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Rewards Card */}
        {rewards && rewards.points > 0 && (
          <View style={styles.rewardsCard}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.rewardsGradient}>
              <Ionicons name='gift' size={24} color='#92400e' />
              <View style={styles.rewardsTextContainer}>
                <Text style={styles.rewardsLabel}>Reward Points</Text>
                <Text style={styles.rewardsPoints}>{rewards.points}</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#92400e' />
            </LinearGradient>
          </View>
        )}

        {/* Dietary Tags */}
        {dietaryTags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsTitle}>Dietary Preferences</Text>
            <View style={styles.tags}>
              {dietaryTags.map((tag, idx) => (
                <View key={idx} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Favorites */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name='heart' size={20} color='#ef4444' />
            <Text style={styles.sectionTitle}>Favorites</Text>
          </View>
          <View style={styles.favoritesList}>
            {Userfavorites.length > 0 ? (
              Userfavorites.map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.favoriteItem} activeOpacity={0.7}>
                  <View style={styles.foodImgWrapper}>
                    <Image
                      source={{ uri: item.img || 'https://via.placeholder.com/60' }}
                      style={styles.foodImg}
                    />
                  </View>
                  <Text style={styles.foodName} numberOfLines={2}>
                    {item.name || 'Unknown'}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name='heart-outline' size={40} color='#d1d5db' />
                <Text style={styles.emptyText}>No favorites yet</Text>
                <Text style={styles.emptySubtext}>Start adding your favorite dishes</Text>
              </View>
            )}
          </View>
        </View> */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name='heart' size={20} color='#ef4444' />
            <Text style={styles.sectionTitle}>Favorite Kitchens</Text>
          </View>

          <View style={styles.favoritesList}>
            {favorites.length > 0 ? (
              favorites.map((kitchen, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.favoriteItem}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('KitchenScreen', { kitchen })}>
                  <View style={styles.foodImgWrapper}>
                    <Image
                      source={kitchen?.img || require('../assets/logo.png')}
                      style={styles.foodImg}
                    />
                  </View>
                  <Text style={styles.foodName} numberOfLines={2}>
                    {kitchen.name || 'Unknown Kitchen'}
                  </Text>
                  <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                    {kitchen.location || 'Location unavailable'}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name='heart-outline' size={40} color='#d1d5db' />
                <Text style={styles.emptyText}>No favorites yet</Text>
                <Text style={styles.emptySubtext}>Start adding your favorite dishes</Text>
              </View>
            )}
          </View>
        </View>

        {/* Order History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name='receipt' size={20} color='#f97316' />
            <Text style={styles.sectionTitle}>Order History</Text>
          </View>
          {orderHistory.length > 0 ? (
            orderHistory.map((order, idx) => (
              <TouchableOpacity key={idx} style={styles.orderItem} activeOpacity={0.7}>
                <View style={styles.orderLeft}>
                  <View style={styles.orderIconWrapper}>
                    <Ionicons name='fast-food' size={20} color='#f97316' />
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle}>
                      #{order.id || idx} {order.dish || 'Dish'}
                    </Text>
                    <Text style={styles.orderSub}>
                      {order.restaurant || 'Restaurant'} • {order.date || 'Date'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.orderStatus, getStatusStyle(order.status)]}>
                  <Text style={styles.orderStatusText}>{order.status || 'Pending'}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name='receipt-outline' size={40} color='#d1d5db' />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>Your order history will appear here</Text>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View className='sectionHeader' style={styles.sectionHeader}>
            <Ionicons name='settings' size={20} color='#f97316' />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PaymentMethod')}>
            <View style={styles.settingsIconWrapper}>
              <Ionicons name='card-outline' size={20} color='#6366f1' />
            </View>
            <Text style={styles.settingsText}>Payment Methods</Text>
            <Ionicons name='chevron-forward' size={20} color='#9ca3af' />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ManageAddresses')}>
            <View style={styles.settingsIconWrapper}>
              <Ionicons name='home-outline' size={20} color='#6366f1' />
            </View>
            <Text style={styles.settingsText}>Saved Addresses</Text>
            <Ionicons name='chevron-forward' size={20} color='#9ca3af' />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Notification')}>
            <View style={styles.settingsIconWrapper}>
              <Ionicons name='notifications-outline' size={20} color='#6366f1' />
            </View>
            <Text style={styles.settingsText}>Notifications</Text>
            <Ionicons name='chevron-forward' size={20} color='#9ca3af' />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PrivacySecurity')}>
            <View style={styles.settingsIconWrapper}>
              <Ionicons name='shield-checkmark-outline' size={20} color='#6366f1' />
            </View>
            <Text style={styles.settingsText}>Privacy & Security</Text>
            <Ionicons name='chevron-forward' size={20} color='#9ca3af' />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}>
            <Ionicons name='log-out-outline' size={20} color='#fff' />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

// status pill color
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return { backgroundColor: '#d1fae5' };
    case 'pending':
      return { backgroundColor: '#fef3c7' };
    case 'cancelled':
      return { backgroundColor: '#fee2e2' };
    default:
      return { backgroundColor: '#e5e7eb' };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { paddingBottom: 40 },
  headerBackground: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 10,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeBtnPressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  avatarWrapper: { marginBottom: 16 },
  avatarBorder: {
    padding: 5,
    borderRadius: 64,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f3f4f6' },
  name: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 },
  mobile: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 16 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 6,
  },
  editBtnPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  editText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  rewardsCard: {
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  rewardsGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  rewardsTextContainer: { flex: 1 },
  rewardsLabel: { fontSize: 12, color: '#92400e', fontWeight: '600', marginBottom: 2 },
  rewardsPoints: { fontSize: 24, fontWeight: '800', color: '#92400e' },

  tagsSection: { paddingHorizontal: 16, marginBottom: 16 },
  tagsTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tagText: { fontSize: 13, color: '#374151', fontWeight: '500' },

  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },

  // favoritesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  favoriteItem: { width: 90, alignItems: 'center' },
  foodImgWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImg: { width: 80, height: 80, backgroundColor: '#f3f4f6' },
  foodName: {
    marginTop: 8,
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
    fontWeight: '500',
  },

  emptyContainer: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { color: '#6b7280', fontSize: 16, fontWeight: '600' },
  emptySubtext: { color: '#9ca3af', fontSize: 14 },

  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  orderIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: { flex: 1 },
  orderTitle: { fontWeight: '600', color: '#1f2937', fontSize: 14, marginBottom: 4 },
  orderSub: { color: '#6b7280', fontSize: 12 },
  orderStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  orderStatusText: { fontSize: 11, fontWeight: '600', color: '#374151' },

  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingsIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsText: { flex: 1, color: '#1f2937', fontSize: 15, fontWeight: '500' },

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
