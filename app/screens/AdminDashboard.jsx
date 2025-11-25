// AdminDashboard.jsx - Premium Modern Design
import React, { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import {
  fetchAdminDashboard,
  fetchAdminKitchens,
  fetchAdminOrders,
  fetchAdminUsers,
  fetchAdminMenuItems,
} from "../utils/apiHelpers";
import Loader from "../components/Loader";
import theme from "../../theme";

const { width } = Dimensions.get("window");

const AdminDashboard = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  const [formData, setFormData] = useState({});

  // Data states
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeKitchens: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    todayOrders: 0,
    totalUsers: 0,
    totalMenuItems: 0,
  });
  const [kitchens, setKitchens] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dashboard, kitchensData, ordersData, usersData, menuItemsData] = await Promise.all([
        fetchAdminDashboard().catch(() => null),
        fetchAdminKitchens().catch(() => []),
        fetchAdminOrders().catch(() => []),
        fetchAdminUsers().catch(() => []),
        fetchAdminMenuItems().catch(() => []),
      ]);

      if (dashboard) {
        setDashboardStats({
          totalRevenue: dashboard.totalRevenue || 0,
          totalOrders: dashboard.totalOrders || 0,
          activeKitchens: dashboard.activeKitchens || 0,
          pendingOrders: dashboard.pendingOrders || 0,
          todayRevenue: dashboard.todayRevenue || 0,
          todayOrders: dashboard.todayOrders || 0,
          totalUsers: dashboard.totalUsers || 0,
          totalMenuItems: dashboard.totalMenuItems || 0,
        });
      }

      if (kitchensData && kitchensData.length > 0) setKitchens(kitchensData);
      if (ordersData && ordersData.length > 0) setOrders(ordersData);
      if (usersData && usersData.length > 0) setUsers(usersData);
      if (menuItemsData && menuItemsData.length > 0) setMenuItems(menuItemsData);
    } catch (error) {
      console.error("Error loading admin data:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  // Stat Card Component
  const StatCard = ({ label, value, icon, gradient, subtitle, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.statCardContainer}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCard}>
        <View style={styles.statCardHeader}>
          <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={24} color="#fff" />
          </View>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );

  // Tab Button Component
  const TabButton = ({ label, icon, tab, badge, onPress }) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        activeOpacity={0.7}>
        <Ionicons
          name={icon}
          size={20}
          color={isActive ? theme.colors.brand.orange : theme.colors.brand.gray}
        />
        <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
          {label}
        </Text>
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.adminName}>{user?.firstName || "Admin"} 👋</Text>
          <Text style={styles.headerSubtext}>Here's your business overview</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color={theme.colors.brand.orange} />
        </TouchableOpacity>
      </View>

      {/* Primary Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Total Revenue"
          value={`₹${(dashboardStats.totalRevenue || 0).toLocaleString()}`}
          icon="cash-outline"
          gradient={[theme.colors.brand.green, theme.colors.brand.greenDark]}
          subtitle={`₹${(dashboardStats.todayRevenue || 0).toLocaleString()} today`}
        />
        <StatCard
          label="Total Orders"
          value={(dashboardStats.totalOrders || 0).toLocaleString()}
          icon="receipt-outline"
          gradient={[theme.colors.brand.orange, theme.colors.brand.orangeDark]}
          subtitle={`${dashboardStats.todayOrders || 0} today`}
        />
      </View>

      {/* Secondary Stats */}
      <View style={styles.statsRow}>
        <StatCard
          label="Active Kitchens"
          value={(dashboardStats.activeKitchens || 0).toString()}
          icon="storefront-outline"
          gradient={[theme.colors.brand.orangeLight, theme.colors.brand.orange]}
          subtitle={`${kitchens.length} total`}
        />
        <StatCard
          label="Pending Orders"
          value={(dashboardStats.pendingOrders || 0).toString()}
          icon="time-outline"
          gradient={["#f59e0b", "#d97706"]}
          subtitle="Needs attention"
        />
        <StatCard
          label="Menu Items"
          value={(dashboardStats.totalMenuItems || 0).toString()}
          icon="restaurant-outline"
          gradient={[theme.colors.brand.greenLight, theme.colors.brand.green]}
          subtitle={`${menuItems.filter((m) => m.available).length} active`}
        />
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsSection}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <Ionicons name="people-outline" size={24} color={theme.colors.brand.orange} />
            <Text style={styles.quickStatValue}>{dashboardStats.totalUsers || 0}</Text>
            <Text style={styles.quickStatLabel}>Total Users</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.brand.green} />
            <Text style={styles.quickStatValue}>
              {orders.filter((o) => o.status === "delivered").length}
            </Text>
            <Text style={styles.quickStatLabel}>Delivered</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Ionicons name="close-circle-outline" size={24} color={theme.colors.brand.red} />
            <Text style={styles.quickStatValue}>
              {orders.filter((o) => o.status === "cancelled").length}
            </Text>
            <Text style={styles.quickStatLabel}>Cancelled</Text>
          </View>
        </View>
      </View>

      {/* Recent Orders Preview */}
      {orders.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => setActiveTab("orders")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {orders.slice(0, 3).map((order) => (
            <View key={order._id || order.id} style={styles.orderPreviewCard}>
              <View style={styles.orderPreviewInfo}>
                <Text style={styles.orderPreviewId}>
                  #{order.orderNumber || order._id?.slice(-6) || "N/A"}
                </Text>
                <Text style={styles.orderPreviewCustomer}>
                  {order.user?.firstName || order.customer || "Customer"}
                </Text>
              </View>
              <View style={styles.orderPreviewRight}>
                <Text style={styles.orderPreviewAmount}>₹{order.total?.toFixed(2) || "0.00"}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        order.status === "delivered"
                          ? theme.colors.brand.green + "20"
                          : order.status === "cancelled"
                          ? theme.colors.brand.red + "20"
                          : theme.colors.brand.orange + "20",
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          order.status === "delivered"
                            ? theme.colors.brand.green
                            : order.status === "cancelled"
                            ? theme.colors.brand.red
                            : theme.colors.brand.orange,
                      },
                    ]}>
                    {order.status || "pending"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  // Render Kitchens Tab
  const renderKitchens = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Kitchens ({kitchens.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setModalType("kitchen");
            setFormData({});
            setModalVisible(true);
          }}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Kitchen</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={kitchens}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <View style={styles.kitchenCard}>
            <View style={styles.kitchenCardHeader}>
              <View style={styles.kitchenInfo}>
                <Text style={styles.kitchenName}>{item.name || "Kitchen"}</Text>
                <Text style={styles.kitchenCuisine}>{item.cuisineType || "Multi Cuisine"}</Text>
              </View>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: item.isActive
                      ? theme.colors.brand.green
                      : theme.colors.brand.gray,
                  },
                ]}
              />
            </View>
            <View style={styles.kitchenStats}>
              <View style={styles.kitchenStat}>
                <Ionicons name="star" size={16} color={theme.colors.brand.orange} />
                <Text style={styles.kitchenStatText}>
                  {item.rating?.toFixed(1) || "0.0"}
                </Text>
              </View>
              <View style={styles.kitchenStat}>
                <Ionicons name="location-outline" size={16} color={theme.colors.brand.gray} />
                <Text style={styles.kitchenStatText}>{item.location || "N/A"}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={64} color={theme.colors.brand.gray} />
            <Text style={styles.emptyStateText}>No kitchens found</Text>
            <Text style={styles.emptyStateSubtext}>Add your first kitchen to get started</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );

  // Render Orders Tab
  const renderOrders = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Orders ({orders.length})</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderCardHeader}>
              <View>
                <Text style={styles.orderId}>
                  Order #{item.orderNumber || item._id?.slice(-6) || "N/A"}
                </Text>
                <Text style={styles.orderCustomer}>
                  {item.user?.firstName || item.customer || "Customer"}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === "delivered"
                        ? theme.colors.brand.green + "20"
                        : item.status === "cancelled"
                        ? theme.colors.brand.red + "20"
                        : theme.colors.brand.orange + "20",
                  },
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === "delivered"
                          ? theme.colors.brand.green
                          : item.status === "cancelled"
                          ? theme.colors.brand.red
                          : theme.colors.brand.orange,
                    },
                  ]}>
                  {item.status || "pending"}
                </Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <View style={styles.orderDetailItem}>
                <Ionicons name="storefront-outline" size={16} color={theme.colors.brand.gray} />
                <Text style={styles.orderDetailText}>
                  {item.kitchen?.name || item.kitchenName || "Kitchen"}
                </Text>
              </View>
              <View style={styles.orderDetailItem}>
                <Ionicons name="receipt-outline" size={16} color={theme.colors.brand.gray} />
                <Text style={styles.orderDetailText}>
                  {item.items?.length || item.itemsCount || 0} items
                </Text>
              </View>
              <View style={styles.orderDetailItem}>
                <Ionicons name="cash-outline" size={16} color={theme.colors.brand.green} />
                <Text style={[styles.orderDetailText, styles.orderAmount]}>
                  ₹{item.total?.toFixed(2) || "0.00"}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.brand.gray} />
            <Text style={styles.emptyStateText}>No orders found</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );

  // Render Users Tab
  const renderUsers = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Users ({users.length})</Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {(item.firstName?.[0] || item.mobile?.[0] || "U").toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {item.firstName && item.lastName
                  ? `${item.firstName} ${item.lastName}`
                  : item.firstName || item.mobile || "User"}
              </Text>
              <Text style={styles.userMobile}>{item.mobile || "N/A"}</Text>
            </View>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    item.role === "admin"
                      ? theme.colors.brand.orange + "20"
                      : item.role === "partner"
                      ? theme.colors.brand.green + "20"
                      : theme.colors.brand.gray + "20",
                },
              ]}>
              <Text
                style={[
                  styles.roleText,
                  {
                    color:
                      item.role === "admin"
                        ? theme.colors.brand.orange
                        : item.role === "partner"
                        ? theme.colors.brand.green
                        : theme.colors.brand.gray,
                  },
                ]}>
                {item.role || "user"}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={theme.colors.brand.gray} />
            <Text style={styles.emptyStateText}>No users found</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );

  // Render Menu Items Tab
  const renderMenuItems = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Menu Items ({menuItems.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (kitchens.length === 0) {
              Alert.alert("No Kitchens", "Please add a kitchen first");
              return;
            }
            setModalType("menu");
            setFormData({});
            setModalVisible(true);
          }}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItemCard}>
            <View style={styles.menuItemHeader}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name || "Menu Item"}</Text>
                <Text style={styles.menuItemCategory}>{item.category || "Uncategorized"}</Text>
              </View>
              <View
                style={[
                  styles.availabilityBadge,
                  {
                    backgroundColor: item.available
                      ? theme.colors.brand.green + "20"
                      : theme.colors.brand.gray + "20",
                  },
                ]}>
                <Text
                  style={[
                    styles.availabilityText,
                    {
                      color: item.available ? theme.colors.brand.green : theme.colors.brand.gray,
                    },
                  ]}>
                  {item.available ? "Available" : "Unavailable"}
                </Text>
              </View>
            </View>
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemPrice}>₹{item.price?.toFixed(2) || "0.00"}</Text>
              <Text style={styles.menuItemKitchen}>
                {kitchens.find((k) => (k._id || k.id) === (item.kitchenId || item.kitchen?._id))
                  ?.name || "Kitchen"}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={64} color={theme.colors.brand.gray} />
            <Text style={styles.emptyStateText}>No menu items found</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader size="large" color="orange" text="Loading dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Tabs Navigation */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <TabButton
            label="Dashboard"
            icon="grid-outline"
            tab="dashboard"
            onPress={() => setActiveTab("dashboard")}
          />
          <TabButton
            label="Kitchens"
            icon="storefront-outline"
            tab="kitchens"
            badge={kitchens.length}
            onPress={() => setActiveTab("kitchens")}
          />
          <TabButton
            label="Orders"
            icon="receipt-outline"
            tab="orders"
            badge={dashboardStats.pendingOrders}
            onPress={() => setActiveTab("orders")}
          />
          <TabButton
            label="Users"
            icon="people-outline"
            tab="users"
            badge={users.length}
            onPress={() => setActiveTab("users")}
          />
          <TabButton
            label="Menu"
            icon="restaurant-outline"
            tab="menu"
            badge={menuItems.length}
            onPress={() => setActiveTab("menu")}
          />
        </ScrollView>
      </View>

      {/* Tab Content */}
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "kitchens" && renderKitchens()}
      {activeTab === "orders" && renderOrders()}
      {activeTab === "users" && renderUsers()}
      {activeTab === "menu" && renderMenuItems()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.brand.light,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.brand.softGray,
  },
  greetingText: {
    fontSize: 14,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
  },
  adminName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
    marginTop: 4,
  },
  headerSubtext: {
    fontSize: 13,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.brand.orange + "10",
  },
  statsGrid: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCardContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statCard: {
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "OpenSans",
    fontWeight: "600",
  },
  statSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "OpenSans",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  quickStatsSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
    marginBottom: 16,
  },
  quickStatsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: theme.colors.brand.light,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.brand.softGray,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
    marginTop: 4,
  },
  recentSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.brand.orange,
    fontFamily: "OpenSans",
    fontWeight: "600",
  },
  orderPreviewCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.brand.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.brand.softGray,
  },
  orderPreviewInfo: {
    flex: 1,
  },
  orderPreviewId: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
  },
  orderPreviewCustomer: {
    fontSize: 12,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
    marginTop: 4,
  },
  orderPreviewRight: {
    alignItems: "flex-end",
  },
  orderPreviewAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.brand.green,
    fontFamily: "Poppins",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "OpenSans",
    textTransform: "capitalize",
  },
  tabsContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.brand.softGray,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 12,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.brand.orange + "10",
  },
  tabButtonText: {
    fontSize: 14,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
    fontWeight: "500",
  },
  tabButtonTextActive: {
    color: theme.colors.brand.orange,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: theme.colors.brand.orange,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "OpenSans",
  },
  tabContent: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.brand.softGray,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.brand.orange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "OpenSans",
  },
  kitchenCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.brand.softGray,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  kitchenCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  kitchenInfo: {
    flex: 1,
  },
  kitchenName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  kitchenCuisine: {
    fontSize: 13,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  kitchenStats: {
    flexDirection: "row",
    gap: 16,
  },
  kitchenStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  kitchenStatText: {
    fontSize: 13,
    color: theme.colors.brand.dark,
    fontFamily: "OpenSans",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.brand.softGray,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
  },
  orderCustomer: {
    fontSize: 12,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
    marginTop: 4,
  },
  orderDetails: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  orderDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderDetailText: {
    fontSize: 13,
    color: theme.colors.brand.dark,
    fontFamily: "OpenSans",
  },
  orderAmount: {
    fontWeight: "700",
    color: theme.colors.brand.green,
    fontFamily: "Poppins",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.brand.softGray,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.brand.orange + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.brand.orange,
    fontFamily: "Poppins",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 13,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "OpenSans",
    textTransform: "capitalize",
  },
  menuItemCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.brand.softGray,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
    marginBottom: 4,
  },
  menuItemCategory: {
    fontSize: 13,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "OpenSans",
  },
  menuItemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.brand.green,
    fontFamily: "Poppins",
  },
  menuItemKitchen: {
    fontSize: 12,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.brand.dark,
    fontFamily: "Poppins",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.brand.gray,
    fontFamily: "OpenSans",
    marginTop: 8,
  },
});

export default AdminDashboard;

