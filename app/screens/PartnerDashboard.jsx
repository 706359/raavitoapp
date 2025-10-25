import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PartnerDashboard() {
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = React.useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
          } catch {}
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Partner", params: { screen: "PartnerLogin" } }],
            })
          );
        },
      },
    ]);
  };

  // Mock data
  const stats = {
    todayOrders: 24,
    todayRevenue: 4850,
    pendingOrders: 3,
    completedToday: 21,
    avgRating: 4.7,
    totalReviews: 156,
  };

  const recentOrders = [
    {
      id: "1",
      orderId: "#ORD2451",
      customer: "Rahul Sharma",
      items: "Lunch Thali x2, Breakfast Combo x1",
      amount: 280,
      status: "pending",
      time: "2 min ago",
      phone: "+91 98765 43210",
    },
    {
      id: "2",
      orderId: "#ORD2450",
      customer: "Priya Patel",
      items: "Dinner Special, Dosa",
      amount: 420,
      status: "preparing",
      time: "15 min ago",
      phone: "+91 98765 43211",
    },
    {
      id: "3",
      orderId: "#ORD2449",
      customer: "Amit Kumar",
      items: "Family Pack x1",
      amount: 650,
      status: "ready",
      time: "25 min ago",
      phone: "+91 98765 43212",
    },
    {
      id: "4",
      orderId: "#ORD2448",
      customer: "Sneha Singh",
      items: "Lunch Thali, Snacks",
      amount: 180,
      status: "completed",
      time: "1 hour ago",
      phone: "+91 98765 43213",
    },
  ];

  const quickActions = [
    { id: "1", icon: "restaurant", label: "Menu", color: "#f97316", screen: "MenuManagement" },
    { id: "2", icon: "notifications", label: "Orders", color: "#10b981", screen: "Orders" },
    { id: "3", icon: "analytics", label: "Analytics", color: "#8b5cf6", screen: "Analytics" },
    { id: "4", icon: "settings", label: "Settings", color: "#6366f1", screen: "Settings" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", text: "#92400e", border: "#fde68a" };
      case "preparing":
        return { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" };
      case "ready":
        return { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" };
      case "completed":
        return { bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb" };
      default:
        return { bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "preparing":
        return "restaurant-outline";
      case "ready":
        return "checkmark-circle-outline";
      case "completed":
        return "checkmark-done-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const renderOrderCard = ({ item }) => {
    const statusStyle = getStatusColor(item.status);

    return (
      <Pressable style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderId}>{item.orderId}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
              ]}>
              <Ionicons name={getStatusIcon(item.status)} size={12} color={statusStyle.text} />
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.orderTime}>{item.time}</Text>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.customerRow}>
            <View style={styles.customerIcon}>
              <Ionicons name='person' size={16} color='#f97316' />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{item.customer}</Text>
              <Text style={styles.customerPhone}>{item.phone}</Text>
            </View>
          </View>

          <View style={styles.itemsRow}>
            <Ionicons name='fast-food-outline' size={16} color='#6b7280' />
            <Text style={styles.itemsText} numberOfLines={2}>
              {item.items}
            </Text>
          </View>

          <View style={styles.amountRow}>
            <View style={styles.amountBadge}>
              <Text style={styles.amountText}>₹{item.amount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.orderActions}>
          {item.status === "pending" && (
            <>
              <Pressable style={[styles.actionButton, styles.acceptButton]}>
                <Ionicons name='checkmark-circle' size={18} color='white' />
                <Text style={styles.actionButtonText}>Accept</Text>
              </Pressable>

              <Pressable style={[styles.actionButton, styles.rejectButton]}>
                <Ionicons name='close-circle' size={18} color='#ef4444' />
                <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
              </Pressable>
            </>
          )}

          {item.status === "preparing" && (
            <Pressable style={[styles.actionButton, styles.readyButton]}>
              <Ionicons name='checkmark-done-circle' size={18} color='white' />
              <Text style={styles.actionButtonText}>Mark Ready</Text>
            </Pressable>
          )}

          {item.status === "ready" && (
            <Pressable style={[styles.actionButton, styles.completeButton]}>
              <Ionicons name='bicycle' size={18} color='white' />
              <Text style={styles.actionButtonText}>Out for Delivery</Text>
            </Pressable>
          )}

          <Pressable style={[styles.actionButton, styles.viewButton]}>
            <Ionicons name='eye-outline' size={18} color='#6b7280' />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Premium Header */}
        <LinearGradient colors={["#f97316", "#fb923c"]} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.avatar}
                  resizeMode='cover'
                />
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.kitchenName}>Taste of India Kitchen</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Pressable style={styles.notificationButton}>
                <Ionicons name='notifications' size={24} color='white' />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
                accessibilityLabel='Logout'>
                <Ionicons name='log-out-outline' size={22} color='white' />
              </Pressable>
            </View>
          </View>

          <View style={styles.onlineToggleContainer}>
            <View style={styles.onlineToggleLeft}>
              <View style={[styles.onlineDot, !isOnline && styles.offlineDot]} />
              <Text style={styles.onlineText}>{isOnline ? "Online" : "Offline"}</Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: "#fecaca", true: "#a7f3d0" }}
              thumbColor={isOnline ? "#10b981" : "#ef4444"}
              ios_backgroundColor='#fecaca'
            />
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.statCardOrange]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name='cart' size={24} color='#f97316' />
                </View>
                <Text style={styles.statValue}>{stats.todayOrders}</Text>
                <Text style={styles.statLabel}>Today Orders</Text>
              </View>

              <View style={[styles.statCard, styles.statCardGreen]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name='cash' size={24} color='#10b981' />
                </View>
                <Text style={styles.statValue}>₹{stats.todayRevenue}</Text>
                <Text style={styles.statLabel}>Today Revenue</Text>
              </View>

              <View style={[styles.statCard, styles.statCardPurple]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name='time' size={24} color='#8b5cf6' />
                </View>
                <Text style={styles.statValue}>{stats.pendingOrders}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>

              <View style={[styles.statCard, styles.statCardBlue]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name='star' size={24} color='#3b82f6' />
                </View>
                <Text style={styles.statValue}>{stats.avgRating}</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => navigation.navigate(action.screen)}>
                <LinearGradient
                  colors={[action.color, action.color + "dd"]}
                  style={styles.quickActionGradient}>
                  <MaterialIcons name={action.icon} size={28} color='white' />
                </LinearGradient>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersContainer}>
          <View style={styles.ordersHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <Pressable onPress={() => navigation.navigate("AllOrders")}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>

          <FlatList
            data={recentOrders}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ordersList}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 12 : 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 21,
  },
  welcomeText: {
    fontSize: 13,
    fontFamily: "OpenSans",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  kitchenName: {
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.3,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    position: "relative",
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  notificationBadgeText: {
    fontSize: 10,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
  },
  onlineToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  onlineToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  offlineDot: {
    backgroundColor: "#ef4444",
    shadowColor: "#ef4444",
  },
  onlineText: {
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
  },
  statsContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    width: 140,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statCardOrange: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  statCardGreen: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  statCardPurple: {
    backgroundColor: "#faf5ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  statCardBlue: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 2,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  quickActionGradient: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionLabel: {
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "600",
    color: "#4b5563",
    textAlign: "center",
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "600",
    color: "#f97316",
  },
  ordersList: {
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  orderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  orderId: {
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "#111827",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontFamily: "Poppins",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: "OpenSans",
    color: "#9ca3af",
  },
  orderBody: {
    gap: 12,
    marginBottom: 14,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  customerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "600",
    color: "#111827",
  },
  customerPhone: {
    fontSize: 12,
    fontFamily: "OpenSans",
    color: "#6b7280",
    marginTop: 2,
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 10,
  },
  itemsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "OpenSans",
    color: "#4b5563",
    lineHeight: 18,
  },
  amountRow: {
    alignItems: "flex-start",
  },
  amountBadge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  amountText: {
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "#10b981",
  },
  orderActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  acceptButton: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  rejectButton: {
    backgroundColor: "white",
    borderColor: "#fecaca",
  },
  readyButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  completeButton: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  viewButton: {
    backgroundColor: "white",
    borderColor: "#e5e7eb",
    flex: 0,
    paddingHorizontal: 14,
  },
  actionButtonText: {
    fontSize: 13,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
  },
  rejectButtonText: {
    color: "#ef4444",
  },
});
