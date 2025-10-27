// screens/ProfileScreen.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user = {}, logout = () => {} } = useAuth() || {};
  const { width } = useWindowDimensions();
  const isPremium = !!user?.isPremium;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const isSmallScreen = width < 380;

  const [profile, setProfile] = useState({
    name: user?.name || "Your Name",
    email: user?.email || "",
    mobile: user?.mobile || "+91 0000000000",
    address: user?.address || "",
    image: user?.profileImage || null,
  });

  const menuItems = [
    { icon: "restaurant-outline", label: "Meal Subscription", route: "Subscription" },
    { icon: "receipt-outline", label: "Past Orders", route: "Orders" },
    { icon: "heart-outline", label: "Favorites", route: "Favorites" },
    { icon: "fast-food-outline", label: "Meal Plans", route: "MealPlans" },
    { icon: "ticket-outline", label: "Coupons & Offers", route: "Coupons" },
    { icon: "location-outline", label: "Saved Addresses", route: "ManageAddresses" },
    { icon: "wallet-outline", label: "Wallet", route: "Wallet" },
    { icon: "help-circle-outline", label: "Help & Support", route: "Help" },
    { icon: "alert-circle-outline", label: "FAQ's", route: "FAQ" },
    { icon: "star-outline", label: "Chef's Specials", route: "ChefsSpecials", premium: true },
    { icon: "time-outline", label: "Early Menu Access", route: "EarlyAccess", premium: true },
  ];

  const loadProfile = useCallback(async () => {
    try {
      const val = await AsyncStorage.getItem("userProfile");
      if (val) {
        const saved = JSON.parse(val);
        setProfile((prev) => ({ ...prev, ...saved }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <Image
                source={profile.image ? { uri: profile.image } : require("../assets/logo.png")}
                style={[
                  styles.avatar,
                  { width: isSmallScreen ? 60 : 70, height: isSmallScreen ? 60 : 70 },
                ]}
              />
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.nameText, isSmallScreen && styles.nameTextSmall]}>
                    {profile.name}
                  </Text>
                  {isPremium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeText}>FOODIE+</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.mobileText}>{profile.mobile}</Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate("EditProfile", { profile })}
                style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}>
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item, idx) => {
                const locked = item.premium && !isPremium;
                return (
                  <Pressable
                    key={idx}
                    onPress={() =>
                      locked ? navigation.navigate("Subscription") : navigation.navigate(item.route)
                    }
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && styles.menuItemPressed,
                      locked && styles.menuItemLocked,
                    ]}>
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemLeft}>
                        <Ionicons name={item.icon} size={20} color='#4b5563' />
                        <Text
                          style={[styles.menuItemText, isSmallScreen && styles.menuItemTextSmall]}>
                          {item.label}
                        </Text>
                        {item.premium && (
                          <View style={styles.premiumTag}>
                            <Text style={styles.premiumTagText}>Premium</Text>
                          </View>
                        )}
                      </View>
                      {locked ? (
                        <Ionicons name='lock-closed' size={16} color='#9ca3af' />
                      ) : (
                        <Ionicons name='chevron-forward' size={20} color='#9ca3af' />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Logout */}
            <View style={styles.logoutContainer}>
              <TouchableOpacity
                onPress={logout}
                style={[
                  styles.logoutButton,
                  isPremium ? styles.logoutButtonPremium : styles.logoutButtonDefault,
                ]}
                activeOpacity={0.8}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              <Text style={styles.versionText}>App version 1.02</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20, flexGrow: 1 },
  profileCard: {
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: { borderRadius: 999, marginRight: 16 },
  profileInfo: { flex: 1, gap: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  nameText: { fontSize: 18, fontWeight: "700", color: "#1f2937" },
  nameTextSmall: { fontSize: 16 },
  premiumBadge: {
    backgroundColor: "#f97316",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  mobileText: { fontSize: 14, color: "#6b7280" },
  editButton: { paddingVertical: 4, paddingHorizontal: 8 },
  editButtonPressed: { opacity: 0.6 },
  editButtonText: { color: "#f97316", fontWeight: "700", fontSize: 14 },
  menuContainer: { gap: 12 },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemPressed: { backgroundColor: "#e5e7eb", transform: [{ scale: 0.98 }] },
  menuItemLocked: { opacity: 0.6 },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  menuItemText: { fontSize: 15, color: "#374151", fontWeight: "500" },
  menuItemTextSmall: { fontSize: 14 },
  premiumTag: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
  },
  premiumTagText: { fontSize: 11, color: "#92400e", fontWeight: "600" },
  logoutContainer: { marginTop: 40, alignItems: "center", gap: 16 },
  logoutButton: {
    width: "60%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonPremium: { backgroundColor: "#f97316" },
  logoutButtonDefault: { backgroundColor: "#ef4444" },
  logoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  versionText: { fontSize: 12, color: "#9ca3af" },
});
