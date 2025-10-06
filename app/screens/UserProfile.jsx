import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'native-base';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const UserProfile = ({ profile = {}, onEdit, onLogout, navigation }) => {
  const {
    name = 'Guest User',
    email = 'guest@example.com',
    profileImage,
    orderHistory = [],
    favorites = [],
    rewards = { points: 0 },
    dietaryTags = [],
  } = profile;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}>
        {/* Close Button */}
        <Pressable style={styles.closeBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name='close' size={22} color='#111' />
        </Pressable>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.avatarBorder}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../assets/logo.png')}
              style={styles.avatar}
            />
          </LinearGradient>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>

        <Pressable style={styles.editBtn} onPress={onEdit || (() => {})}>
          <Ionicons name='create-outline' size={16} color='#fff' />
          <Text style={styles.editText}>Edit Profile</Text>
        </Pressable>
      </LinearGradient>

      {/* Rewards */}
      {rewards && (
        <View style={styles.rewardsCard}>
          <Ionicons name='gift-outline' size={18} color='#b45309' />
          <Text style={styles.rewardsText}>🎉 {rewards.points} Reward Points</Text>
        </View>
      )}

      {/* Dietary Tags */}
      {dietaryTags.length > 0 && (
        <View style={styles.tags}>
          {dietaryTags.map((tag, idx) => (
            <Text key={idx} style={styles.tagChip}>
              {tag}
            </Text>
          ))}
        </View>
      )}

      {/* Favorites */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        <View style={styles.favoritesList}>
          {favorites.length > 0 ? (
            favorites.map((item, idx) => (
              <View key={idx} style={styles.favoriteItem}>
                <Image
                  source={{ uri: item.img || 'https://via.placeholder.com/60' }}
                  style={styles.foodImg}
                />
                <Text style={styles.foodName}>{item.name || 'Unknown'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No favorites yet.</Text>
          )}
        </View>
      </View>

      {/* Order History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order History</Text>
        {orderHistory.length > 0 ? (
          orderHistory.map((order, idx) => (
            <View key={idx} style={styles.orderItem}>
              <Text style={styles.orderTitle}>
                #{order.id || idx} {order.dish || 'Dish'}
              </Text>
              <Text style={styles.orderSub}>
                {order.restaurant || 'Restaurant'} • {order.status || 'Status'} •{' '}
                {order.date || 'Date'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No orders yet.</Text>
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Pressable style={styles.settingsBtn}>
          <Ionicons name='card-outline' size={18} color='#0b8457' />
          <Text style={styles.settingsText}>Payment Methods</Text>
          <Ionicons name='chevron-forward' size={18} color='#999' style={{ marginLeft: 'auto' }} />
        </Pressable>
        <Pressable style={styles.settingsBtn}>
          <Ionicons name='home-outline' size={18} color='#0b8457' />
          <Text style={styles.settingsText}>Addresses</Text>
          <Ionicons name='chevron-forward' size={18} color='#999' style={{ marginLeft: 'auto' }} />
        </Pressable>
        <Pressable style={styles.settingsBtn}>
          <Ionicons name='notifications-outline' size={18} color='#0b8457' />
          <Text style={styles.settingsText}>Notifications</Text>
          <Ionicons name='chevron-forward' size={18} color='#999' style={{ marginLeft: 'auto' }} />
        </Pressable>
      </View>

      {/* Logout */}
      {/* <Pressable style={styles.logoutBtn} onPress={onLogout || (() => {})}>
        <LinearGradient
          colors={['#ee5253', '#d63031']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoutGradient}>
          <Ionicons name='log-out-outline' size={18} color='#fff' />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </Pressable> */}
      <Button style={styles.logoutBtn} onPress={onLogout || (() => {})}>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name='log-out-outline' size={18} color='#fff' />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  headerBackground: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
    zIndex: 99,
  },
  avatarWrapper: { marginBottom: 12 },
  avatarBorder: { padding: 4, borderRadius: 60 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
  },
  name: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  email: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  editText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 13,
  },
  rewardsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  rewardsText: {
    marginLeft: 8,
    color: '#92400e',
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  tagChip: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
    color: '#374151',
  },
  section: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  favoriteItem: {
    width: 80,
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  foodImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  foodName: {
    marginTop: 6,
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 13,
    paddingVertical: 8,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  orderTitle: {
    fontWeight: '600',
    color: '#111',
  },
  orderSub: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
  },
  settingsText: {
    marginLeft: 12,
    color: '#111',
    fontSize: 14,
  },
  logoutBtn: {
    padding: 16,
    margin: 16,
    marginTop: 24,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});
export default UserProfile;
