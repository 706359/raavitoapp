import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import {
  fetchPartnerDashboard,
  fetchPartnerOrders,
  updateOrderStatus,
  updateKitchenStatus,
} from "../utils/apiHelpers";

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    pendingOrders: 0,
    rating: 0,
  });
  const { logout = () => {} } = useAuth() || {};

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, ordersData] = await Promise.all([
        fetchPartnerDashboard().catch(() => null),
        fetchPartnerOrders().catch(() => []),
      ]);

      if (stats) {
        setDashboardStats({
          todaySales: stats.todaySales || 0,
          todayOrders: stats.todayOrders || 0,
          pendingOrders: stats.pendingOrders || 0,
          rating: stats.rating || 0,
        });
        setIsKitchenOpen(stats.kitchenStatus === "open");
      }

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error loading partner dashboard:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  const toggleKitchenStatus = async () => {
    const newStatus = !isKitchenOpen;
    Alert.alert(
      newStatus ? "Open Kitchen?" : "Close Kitchen?",
      newStatus
        ? "Your kitchen will start accepting new orders"
        : "Your kitchen will stop accepting new orders. Current orders will continue.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: newStatus ? "Open" : "Close",
          style: newStatus ? "default" : "destructive",
          onPress: async () => {
            try {
              await updateKitchenStatus(newStatus);
              setIsKitchenOpen(newStatus);
              Alert.alert("Success", `Kitchen ${newStatus ? "opened" : "closed"} successfully`);
            } catch (error) {
              console.error("Error updating kitchen status:", error);
              Alert.alert("Error", "Failed to update kitchen status");
            }
          },
        },
      ]
    );
  };

  const [orders, setOrders] = useState([]);

  const stats = [
    {
      id: "1",
      label: "Today's Sales",
      value: `₹${dashboardStats.todaySales.toLocaleString()}`,
      change: "+12.5%",
      icon: "trending-up",
      positive: true,
    },
    { id: "2", label: "Orders", value: dashboardStats.todayOrders.toString(), change: "+8", icon: "receipt", positive: true },
    {
      id: "3",
      label: "Pending",
      value: dashboardStats.pendingOrders.toString(),
      change: "Urgent",
      icon: "time-outline",
      positive: false,
    },
    { id: "4", label: "Rating", value: dashboardStats.rating.toFixed(1), change: "156 reviews", icon: "star", positive: true },
  ];

  const dummyOrders = [
    {
      id: "1",
      orderId: "2451",
      customer: "Rahul Sharma",
      items: 3,
      amount: 280,
      status: "new",
      time: "2m",
      phone: "+91 98765 43210",
    },
    {
      id: "2",
      orderId: "2450",
      customer: "Priya Patel",
      items: 2,
      amount: 420,
      status: "preparing",
      time: "15m",
      phone: "+91 98765 43211",
    },
    {
      id: "3",
      orderId: "2449",
      customer: "Amit Kumar",
      items: 1,
      amount: 650,
      status: "ready",
      time: "25m",
      phone: "+91 98765 43212",
    },
  ];

  const insights = [
    {
      id: "1",
      label: "Peak Hours",
      value: "12-2 PM, 7-9 PM",
      icon: "time-outline",
      color: "#f97316",
    },
    {
      id: "2",
      label: "Best Seller",
      value: "Lunch Thali",
      icon: "trophy-outline",
      color: "#10b981",
    },
    {
      id: "3",
      label: "Avg Prep Time",
      value: "18 minutes",
      icon: "timer-outline",
      color: "#3b82f6",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      text: "Order #2451 received",
      time: "2 min ago",
      icon: "bag-outline",
      color: "#f97316",
    },
    {
      id: "2",
      text: "Payment received ₹420",
      time: "15 min ago",
      icon: "checkmark-circle",
      color: "#10b981",
    },
    { id: "3", text: "New review (5★)", time: "1 hour ago", icon: "star", color: "#fbbf24" },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      new: { label: "New Order", color: "#f59e0b", bg: "#fffbeb", icon: "alert-circle" },
      preparing: { label: "Preparing", color: "#3b82f6", bg: "#eff6ff", icon: "time-outline" },
      ready: { label: "Ready", color: "#10b981", bg: "#f0fdf4", icon: "checkmark-circle" },
    };
    return configs[status] || configs.new;
  };

  const renderStatCard = ({ item }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{item.label}</Text>
        <Ionicons name={item.icon} size={20} color={item.positive ? "#10b981" : "#f59e0b"} />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <View style={[styles.statChange, { backgroundColor: item.positive ? "#f0fdf4" : "#fffbeb" }]}>
        <Text style={[styles.statChangeText, { color: item.positive ? "#10b981" : "#f59e0b" }]}>
          {item.change}
        </Text>
      </View>
    </View>
  );

  const renderOrderCard = ({ item }) => {
    const config = getStatusConfig(item.status);
    return (
      <Pressable style={styles.orderCard}>
        <View style={styles.orderTop}>
          <View style={styles.orderLeft}>
            <View style={styles.orderIdContainer}>
              <Text style={styles.orderIdLabel}>ORDER</Text>
              <Text style={styles.orderId}>#{item.orderId}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
              <Ionicons name={config.icon} size={14} color={config.color} />
              <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </View>
          </View>
          <Text style={styles.orderTime}>{item.time} ago</Text>
        </View>

        <View style={styles.orderMiddle}>
          <View style={styles.customerSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.customer.charAt(0)}</Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{item.customer}</Text>
              <Text style={styles.orderItems}>{item.items} items</Text>
            </View>
          </View>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amount}>₹{item.amount}</Text>
          </View>
        </View>

        <View style={styles.orderActions}>
          {item.status === "new" || item.status === "pending" ? (
            <>
              <Pressable
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={async () => {
                  try {
                    await updateOrderStatus(item._id || item.id, "confirmed");
                    loadDashboardData();
                    Alert.alert("Success", "Order accepted");
                  } catch (error) {
                    Alert.alert("Error", "Failed to accept order");
                  }
                }}>
                <Text style={styles.actionBtnText}>Accept</Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.declineBtn]}
                onPress={async () => {
                  try {
                    await updateOrderStatus(item._id || item.id, "cancelled");
                    loadDashboardData();
                    Alert.alert("Success", "Order cancelled");
                  } catch (error) {
                    Alert.alert("Error", "Failed to cancel order");
                  }
                }}>
                <Text style={[styles.actionBtnText, styles.declineBtnText]}>Decline</Text>
              </Pressable>
            </>
          ) : null}
          {item.status === "preparing" || item.status === "confirmed" ? (
            <Pressable
              style={[styles.actionBtn, styles.readyBtn]}
              onPress={async () => {
                try {
                  await updateOrderStatus(item._id || item.id, "ready");
                  loadDashboardData();
                  Alert.alert("Success", "Order marked as ready");
                } catch (error) {
                  Alert.alert("Error", "Failed to update order status");
                }
              }}>
              <Ionicons name='checkmark-circle' size={18} color='white' />
              <Text style={styles.actionBtnText}>Mark as Ready</Text>
            </Pressable>
          ) : null}
          {item.status === "ready" ? (
            <Pressable
              style={[styles.actionBtn, styles.deliveryBtn]}
              onPress={async () => {
                try {
                  await updateOrderStatus(item._id || item.id, "out_for_delivery");
                  loadDashboardData();
                  Alert.alert("Success", "Order out for delivery");
                } catch (error) {
                  Alert.alert("Error", "Failed to update order status");
                }
              }}>
              <Ionicons name='bicycle' size={18} color='white' />
              <Text style={styles.actionBtnText}>Out for Delivery</Text>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#f57506" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Simple Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Image source={require("../assets/logo.png")} style={styles.avatarImg} />
            </View>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.kitchenName}>Taste of India</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIcon}>
              <Ionicons name='notifications-outline' size={24} color='#1f2937' />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={handleLogout}>
              <Ionicons name='log-out-outline' size={24} color='#ef4444' />
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Status Banner */}
          <View style={[styles.statusBanner, !isKitchenOpen && styles.statusBannerClosed]}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusDot, !isKitchenOpen && styles.statusDotClosed]} />
              <View style={styles.statusTextContainer}>
                <Text style={[styles.statusTitle, !isKitchenOpen && styles.statusTitleClosed]}>
                  {isKitchenOpen ? "Kitchen Open" : "Kitchen Closed"}
                </Text>
                <Text
                  style={[styles.statusSubtitle, !isKitchenOpen && styles.statusSubtitleClosed]}>
                  {isKitchenOpen ? "Accepting orders now" : "Not accepting orders"}
                </Text>
              </View>
            </View>
            <Switch
              value={isKitchenOpen}
              onValueChange={toggleKitchenStatus}
              trackColor={{ false: "#fecaca", true: "#bbf7d0" }}
              thumbColor={isKitchenOpen ? "#10b981" : "#ef4444"}
              ios_backgroundColor='#fecaca'
              style={styles.statusSwitch}
            />
          </View>

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
            <FlatList
              data={stats}
              renderItem={renderStatCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsList}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickGrid}>
              <Pressable style={styles.quickCard}>
                <View style={[styles.quickIcon, { backgroundColor: "#fff7ed" }]}>
                  <Ionicons name='restaurant-outline' size={24} color='#f97316' />
                </View>
                <Text style={styles.quickLabel}>Menu</Text>
              </Pressable>
              <Pressable style={styles.quickCard}>
                <View style={[styles.quickIcon, { backgroundColor: "#f0fdf4" }]}>
                  <Ionicons name='stats-chart-outline' size={24} color='#10b981' />
                </View>
                <Text style={styles.quickLabel}>Analytics</Text>
              </Pressable>
              <Pressable style={styles.quickCard}>
                <View style={[styles.quickIcon, { backgroundColor: "#eff6ff" }]}>
                  <Ionicons name='wallet-outline' size={24} color='#3b82f6' />
                </View>
                <Text style={styles.quickLabel}>Earnings</Text>
              </Pressable>
              <Pressable style={styles.quickCard}>
                <View style={[styles.quickIcon, { backgroundColor: "#faf5ff" }]}>
                  <Ionicons name='people-outline' size={24} color='#8b5cf6' />
                </View>
                <Text style={styles.quickLabel}>Reviews</Text>
              </Pressable>
            </View>
          </View>

          {/* Orders */}
          <View style={styles.ordersSection}>
            <View style={styles.ordersSectionHeader}>
              <Text style={styles.sectionTitle}>Active Orders</Text>
              <Pressable>
                <Text style={styles.viewAll}>View All</Text>
              </Pressable>
            </View>
            <FlatList
              data={orders}
              renderItem={renderOrderCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Business Insights */}
          <View style={styles.insightsSection}>
            <Text style={styles.sectionTitle}>Business Insights</Text>
            <View style={styles.insightsGrid}>
              {insights.map((insight) => (
                <View key={insight.id} style={styles.insightCard}>
                  <View style={[styles.insightIcon, { backgroundColor: insight.color + "15" }]}>
                    <Ionicons name={insight.icon} size={20} color={insight.color} />
                  </View>
                  <Text style={styles.insightLabel}>{insight.label}</Text>
                  <Text style={styles.insightValue}>{insight.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {recentActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.color + "15" }]}>
                    <Ionicons name={activity.icon} size={18} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{activity.text}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Performance Summary */}
          <View style={styles.performanceSection}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.performanceCard}>
              <View style={styles.performanceRow}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>Total Orders</Text>
                  <Text style={styles.performanceValue}>187</Text>
                  <View style={styles.performanceTrend}>
                    <Ionicons name='trending-up' size={14} color='#10b981' />
                    <Text style={styles.performanceTrendText}>+23%</Text>
                  </View>
                </View>
                <View style={styles.performanceDivider} />
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>Revenue</Text>
                  <Text style={styles.performanceValue}>₹24.5K</Text>
                  <View style={styles.performanceTrend}>
                    <Ionicons name='trending-up' size={14} color='#10b981' />
                    <Text style={styles.performanceTrendText}>+18%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily: "OpenSans",
  },
  kitchenName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ef4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
    fontFamily: "Poppins",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statusBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  statusBannerClosed: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
  },
  statusDotClosed: {
    backgroundColor: "#ef4444",
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#065f46",
    fontFamily: "Poppins",
  },
  statusTitleClosed: {
    color: "#991b1b",
  },
  statusSubtitle: {
    fontSize: 12,
    color: "#059669",
    fontFamily: "OpenSans",
    marginTop: 2,
  },
  statusSubtitleClosed: {
    color: "#dc2626",
  },
  statusSwitch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  statsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 160,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily: "OpenSans",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
    marginBottom: 8,
  },
  statChange: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  quickSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  quickGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "Poppins",
  },
  ordersSection: {
    paddingHorizontal: 20,
  },
  ordersSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
    fontFamily: "Poppins",
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  orderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderIdContainer: {
    gap: 2,
  },
  orderIdLabel: {
    fontSize: 10,
    color: "#9ca3af",
    fontFamily: "Poppins",
    fontWeight: "600",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  orderTime: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "OpenSans",
  },
  orderMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  customerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    fontFamily: "Poppins",
  },
  customerDetails: {
    gap: 2,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "Poppins",
  },
  orderItems: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "OpenSans",
  },
  amountSection: {
    alignItems: "flex-end",
    gap: 2,
  },
  amountLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontFamily: "OpenSans",
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
  },
  orderActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  acceptBtn: {
    backgroundColor: "#10b981",
  },
  declineBtn: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  readyBtn: {
    backgroundColor: "#3b82f6",
  },
  deliveryBtn: {
    backgroundColor: "#8b5cf6",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    fontFamily: "Poppins",
  },
  declineBtnText: {
    color: "#ef4444",
  },
  insightsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  insightsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  insightCard: {
    flex: 1,
    padding: 14,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  insightLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "OpenSans",
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
  },
  activitySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  activityList: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "Poppins",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "OpenSans",
  },
  performanceSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  performanceCard: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 16,
  },
  performanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  performanceItem: {
    flex: 1,
    alignItems: "center",
  },
  performanceDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#f3f4f6",
  },
  performanceLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "OpenSans",
    marginBottom: 6,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
    marginBottom: 6,
  },
  performanceTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f0fdf4",
    borderRadius: 6,
  },
  performanceTrendText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#10b981",
    fontFamily: "Poppins",
  },
});
