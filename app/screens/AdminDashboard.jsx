// AdminDashboard.js - Premium Design with Enhanced UX
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const AdminDashboard = ({ navigation }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedKitchen, setSelectedKitchen] = useState(null);

  const [kitchens, setKitchens] = useState([
    {
      id: 1,
      name: "Italian Delights",
      cuisine: "Italian",
      status: "active",
      rating: 4.8,
      orders: 234,
      location: "Downtown",
      revenue: 12400,
    },
    {
      id: 2,
      name: "Spice Paradise",
      cuisine: "Indian",
      status: "active",
      rating: 4.6,
      orders: 189,
      location: "Midtown",
      revenue: 9800,
    },
    {
      id: 3,
      name: "Burger House",
      cuisine: "American",
      status: "inactive",
      rating: 4.3,
      orders: 156,
      location: "Uptown",
      revenue: 6200,
    },
  ]);

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      kitchenId: 1,
      name: "Margherita Pizza",
      price: 12.99,
      category: "Pizza",
      available: true,
      image: "🍕",
      isVeg: true,
    },
    {
      id: 2,
      kitchenId: 1,
      name: "Veg Pasta",
      price: 14.99,
      category: "Pasta",
      available: true,
      image: "🍝",
      isVeg: true,
    },
    {
      id: 3,
      kitchenId: 2,
      name: "Paneer Butter Masala",
      price: 15.99,
      category: "Main Course",
      available: true,
      image: "🍛",
      isVeg: true,
    },
    {
      id: 4,
      kitchenId: 2,
      name: "Veg Biryani",
      price: 13.99,
      category: "Rice",
      available: false,
      image: "🍚",
      isVeg: true,
    },
    {
      id: 5,
      kitchenId: 3,
      name: "Veg Burger",
      price: 9.99,
      category: "Burgers",
      available: true,
      image: "🍔",
      isVeg: true,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1001,
      customer: "John Doe",
      kitchen: "Italian Delights",
      items: 3,
      total: 42.97,
      status: "delivered",
      time: "2h ago",
      rating: 5,
    },
    {
      id: 1002,
      customer: "Jane Smith",
      kitchen: "Spice Paradise",
      items: 2,
      total: 29.98,
      status: "in-progress",
      time: "30m ago",
      rating: null,
    },
    {
      id: 1003,
      customer: "Mike Johnson",
      kitchen: "Burger House",
      items: 1,
      total: 18.99,
      status: "pending",
      time: "10m ago",
      rating: null,
    },
    {
      id: 1004,
      customer: "Sarah Williams",
      kitchen: "Italian Delights",
      items: 4,
      total: 56.5,
      status: "preparing",
      time: "5m ago",
      rating: null,
    },
  ]);

  const [formData, setFormData] = useState({});

  const stats = {
    totalRevenue: kitchens.reduce((sum, k) => sum + (k.revenue || 0), 0),
    totalOrders: orders.length,
    activeKitchens: kitchens.filter((k) => k.status === "active").length,
    avgRating:
      kitchens.length > 0
        ? (kitchens.reduce((sum, k) => sum + (k.rating || 0), 0) / kitchens.length).toFixed(1)
        : "0.0",
    todayOrders: orders.filter((o) => o.time.includes("ago")).length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    menuItems: menuItems.length,
    activeMenuItems: menuItems.filter((m) => m.available).length,
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (data) {
      setFormData(data);
      if (type === "menu") setSelectedKitchen(data.kitchenId);
    } else {
      setFormData({});
      if (type !== "menu") {
        setSelectedKitchen(null);
      }
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setFormData({});
    setSelectedKitchen(null);
  };

  const handleSaveKitchen = () => {
    if (!formData.name || !formData.cuisine || !formData.location) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (formData.id) {
      setKitchens(kitchens.map((k) => (k.id === formData.id ? { ...k, ...formData } : k)));
    } else {
      setKitchens([
        ...kitchens,
        { ...formData, id: Date.now(), status: "active", rating: 0, orders: 0, revenue: 0 },
      ]);
    }
    closeModal();
    Alert.alert("Success", "✓ Kitchen saved successfully!");
  };

  const handleSaveMenu = () => {
    if (!formData.name || !formData.price || !selectedKitchen || !formData.category) {
      Alert.alert("Error", "Please fill all required fields and select a kitchen");
      return;
    }

    const menuData = { ...formData, price: parseFloat(formData.price) };

    if (formData.id) {
      setMenuItems(
        menuItems.map((m) =>
          m.id === formData.id ? { ...m, ...menuData, kitchenId: selectedKitchen } : m
        )
      );
    } else {
      setMenuItems([
        ...menuItems,
        { ...menuData, id: Date.now(), kitchenId: selectedKitchen, available: true, image: "🍽️" },
      ]);
    }
    closeModal();
    Alert.alert("Success", "✓ Menu item saved successfully!");
  };

  const handleDelete = (type, id) => {
    Alert.alert("Confirm Delete", `Are you sure you want to delete this ${type}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (type === "kitchen") {
            setKitchens(kitchens.filter((k) => k.id !== id));
            setMenuItems(menuItems.filter((m) => m.kitchenId !== id));
          } else if (type === "menu") {
            setMenuItems(menuItems.filter((m) => m.id !== id));
          }
          Alert.alert("Success", `✓ ${type} deleted successfully!`);
        },
      },
    ]);
  };

  const toggleAvailability = (itemId) => {
    setMenuItems(menuItems.map((m) => (m.id === itemId ? { ...m, available: !m.available } : m)));
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            Alert.alert("Success", "✓ You have been logged out successfully!");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const NavItem = ({ icon, label, tab, badge }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[styles.navItem, activeTab === tab && styles.navItemActive]}>
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}>{label}</Text>
      {badge > 0 && (
        <View style={styles.navBadge}>
          <Text style={styles.navBadgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, icon, gradient, trend, subtitle }) => (
    <View style={[styles.statCard, gradient]}>
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        {trend && (
          <View style={styles.trendBadge}>
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome back, Admin! 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          Here&apos;s what&apos;s happening with your business today
        </Text>
      </View>

      {/* Primary Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          label='Total Revenue'
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon='💰'
          gradient={styles.gradientGreen}
          trend='+12.5%'
          subtitle='vs last month'
        />
        <StatCard
          label='Total Orders'
          value={stats.totalOrders}
          icon='📦'
          gradient={styles.gradientBlue}
          trend='+8.3%'
          subtitle={`${stats.todayOrders} today`}
        />
      </View>

      {/* Secondary Stats */}
      <View style={styles.statsRow}>
        <StatCard
          label='Kitchens'
          value={stats.activeKitchens}
          icon='🏪'
          gradient={styles.gradientOrange}
          subtitle={`${kitchens.length} total`}
        />
        <StatCard
          label='Avg Rating'
          value={stats.avgRating}
          icon='⭐'
          gradient={styles.gradientPurple}
          subtitle='out of 5.0'
        />
        <StatCard
          label='Menu Items'
          value={stats.menuItems}
          icon='🍽️'
          gradient={styles.gradientPink}
          subtitle={`${stats.activeMenuItems} active`}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => openModal("kitchen")}>
            <View style={[styles.actionIconBg, { backgroundColor: "#FFF7ED" }]}>
              <Text style={styles.actionIcon}>➕</Text>
            </View>
            <Text style={styles.actionText}>Add Kitchen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              if (kitchens.length === 0) {
                Alert.alert("No Kitchens", "Please add a kitchen first");
                return;
              }
              openModal("menu");
            }}>
            <View style={[styles.actionIconBg, { backgroundColor: "#ECFDF5" }]}>
              <Text style={styles.actionIcon}>🍽️</Text>
            </View>
            <Text style={styles.actionText}>Add Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab("orders")}>
            <View style={[styles.actionIconBg, { backgroundColor: "#EFF6FF" }]}>
              <Text style={styles.actionIcon}>📋</Text>
            </View>
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab("kitchens")}>
            <View style={[styles.actionIconBg, { backgroundColor: "#F5F3FF" }]}>
              <Text style={styles.actionIcon}>⚙️</Text>
            </View>
            <Text style={styles.actionText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => setActiveTab("orders")}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>

        {orders.slice(0, 3).map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderLeft}>
              <View
                style={[styles.orderStatusDot, styles[`status${order.status.replace("-", "")}`]]}
              />
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>Order #{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.orderDetails}>
                  {order.kitchen} • {order.items} items
                </Text>
              </View>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderTotal}>${order.total}</Text>
              <Text style={styles.orderTime}>{order.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top Kitchens */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performing Kitchens</Text>
        {kitchens
          .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
          .slice(0, 3)
          .map((kitchen, index) => (
            <View key={kitchen.id} style={styles.topKitchenCard}>
              <View
                style={[
                  styles.rankBadge,
                  index === 0
                    ? styles.rankGold
                    : index === 1
                      ? styles.rankSilver
                      : styles.rankBronze,
                ]}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.kitchenInfo}>
                <Text style={styles.kitchenName}>{kitchen.name}</Text>
                <Text style={styles.kitchenDetails}>
                  {kitchen.cuisine} • {kitchen.location}
                </Text>
              </View>
              <View style={styles.kitchenStats}>
                <Text style={styles.kitchenRevenue}>
                  ${(kitchen.revenue || 0).toLocaleString()}
                </Text>
                <View style={styles.kitchenRating}>
                  <Text style={styles.ratingText}>⭐ {kitchen.rating || 0}</Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );

  const renderKitchens = () => {
    const activeKitchens = kitchens.filter((k) => k.status === "active");
    const inactiveKitchens = kitchens.filter((k) => k.status === "inactive");

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Kitchens Management</Text>
            <Text style={styles.pageSubtitle}>{kitchens.length} total kitchens</Text>
          </View>
          <TouchableOpacity onPress={() => openModal("kitchen")} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>➕ Add</Text>
          </TouchableOpacity>
        </View>

        {activeKitchens.length > 0 && (
          <>
            <Text style={styles.listTitle}>Active Kitchens ({activeKitchens.length})</Text>
            {activeKitchens.map((kitchen) => renderKitchenCard(kitchen))}
          </>
        )}

        {inactiveKitchens.length > 0 && (
          <>
            <Text style={styles.listTitle}>Inactive Kitchens ({inactiveKitchens.length})</Text>
            {inactiveKitchens.map((kitchen) => renderKitchenCard(kitchen))}
          </>
        )}

        {kitchens.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyTitle}>No Kitchens Yet</Text>
            <Text style={styles.emptyText}>Start by adding your first kitchen</Text>
            <TouchableOpacity onPress={() => openModal("kitchen")} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Add Kitchen</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderKitchenCard = (kitchen) => {
    const kitchenMenuCount = menuItems.filter((m) => m.kitchenId === kitchen.id).length;

    return (
      <View key={kitchen.id} style={styles.kitchenCard}>
        <View style={styles.kitchenHeader}>
          <View style={styles.kitchenTitleRow}>
            <Text style={styles.kitchenTitle}>{kitchen.name}</Text>
            <View
              style={[
                styles.statusBadge,
                kitchen.status === "active" ? styles.statusActive : styles.statusInactive,
              ]}>
              <View
                style={[styles.statusDot, kitchen.status === "active" && styles.statusDotActive]}
              />
              <Text
                style={[styles.statusText, kitchen.status === "active" && styles.statusTextActive]}>
                {kitchen.status}
              </Text>
            </View>
          </View>
          <Text style={styles.kitchenCuisine}>{kitchen.cuisine} Cuisine</Text>
          <Text style={styles.kitchenLocation}>📍 {kitchen.location}</Text>
        </View>

        <View style={styles.kitchenMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>⭐ {kitchen.rating || 0}</Text>
            <Text style={styles.metricLabel}>Rating</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{kitchen.orders || 0}</Text>
            <Text style={styles.metricLabel}>Orders</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{kitchenMenuCount}</Text>
            <Text style={styles.metricLabel}>Menu Items</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>${(kitchen.revenue || 0).toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Revenue</Text>
          </View>
        </View>

        <View style={styles.kitchenActions}>
          <TouchableOpacity
            onPress={() => {
              setSelectedKitchen(kitchen.id);
              setActiveTab("menu");
            }}
            style={[styles.kitchenActionButton, styles.primaryAction]}>
            <Text style={styles.primaryActionText}>🍽️ Manage Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.kitchenActionsRow}>
          <TouchableOpacity
            onPress={() => openModal("kitchen", kitchen)}
            style={[styles.kitchenActionButton, styles.secondaryAction]}>
            <Text style={styles.secondaryActionText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openModal("bulkMenu", kitchen)}
            style={[styles.kitchenActionButton, styles.secondaryAction]}>
            <Text style={styles.secondaryActionText}>📋 Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete("kitchen", kitchen.id)}
            style={[styles.kitchenActionButton, styles.dangerAction]}>
            <Text style={styles.dangerActionText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMenu = () => {
    const filteredItems = selectedKitchen
      ? menuItems.filter((item) => item.kitchenId === selectedKitchen)
      : menuItems;

    const selectedKitchenData = kitchens.find((k) => k.id === selectedKitchen);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Menu Management</Text>
            <Text style={styles.pageSubtitle}>{menuItems.length} total items</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (kitchens.length === 0) {
                Alert.alert("No Kitchens", "Please add a kitchen first");
                return;
              }
              openModal("menu");
            }}
            style={styles.headerButton}>
            <Text style={styles.headerButtonText}>➕ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Kitchen Filter */}
        {kitchens.length > 0 && (
          <View style={styles.filterSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}>
              <TouchableOpacity
                onPress={() => setSelectedKitchen(null)}
                style={[styles.filterChip, !selectedKitchen && styles.filterChipActive]}>
                <Text
                  style={[styles.filterChipText, !selectedKitchen && styles.filterChipTextActive]}>
                  All ({menuItems.length})
                </Text>
              </TouchableOpacity>
              {kitchens.map((kitchen) => (
                <TouchableOpacity
                  key={kitchen.id}
                  onPress={() => setSelectedKitchen(kitchen.id)}
                  style={[
                    styles.filterChip,
                    selectedKitchen === kitchen.id && styles.filterChipActive,
                  ]}>
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedKitchen === kitchen.id && styles.filterChipTextActive,
                    ]}>
                    {kitchen.name} ({menuItems.filter((m) => m.kitchenId === kitchen.id).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {kitchens.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyTitle}>No Kitchens Yet</Text>
            <Text style={styles.emptyText}>Add a kitchen first to create menu items</Text>
            <TouchableOpacity onPress={() => setActiveTab("kitchens")} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Go to Kitchens</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No Menu Items</Text>
            <Text style={styles.emptyText}>
              {selectedKitchenData
                ? `No items for ${selectedKitchenData.name}`
                : "Start adding menu items"}
            </Text>
          </View>
        ) : (
          <View style={styles.menuGrid}>
            {filteredItems.map((item) => {
              const kitchen = kitchens.find((k) => k.id === item.kitchenId);
              return (
                <View key={item.id} style={styles.menuCard}>
                  <View style={styles.menuHeader}>
                    <Text style={styles.menuEmoji}>{item.image}</Text>
                    <TouchableOpacity
                      onPress={() => toggleAvailability(item.id)}
                      style={[
                        styles.availabilityBadge,
                        item.available ? styles.availableActive : styles.availableInactive,
                      ]}>
                      <View
                        style={[
                          styles.availabilityDot,
                          item.available && styles.availabilityDotActive,
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemKitchen}>{kitchen?.name}</Text>
                  <View style={styles.menuItemCategory}>
                    <Text style={styles.categoryTag}>{item.category}</Text>
                  </View>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.menuCardActions}>
                    <TouchableOpacity
                      onPress={() => openModal("menu", item)}
                      style={styles.menuEditButton}>
                      <Text style={styles.menuEditText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete("menu", item.id)}
                      style={styles.menuDeleteButton}>
                      <Text style={styles.menuDeleteText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderOrders = () => {
    const pendingOrders = orders.filter((o) => o.status === "pending");
    const activeOrders = orders.filter(
      (o) => o.status === "preparing" || o.status === "in-progress"
    );
    const completedOrders = orders.filter((o) => o.status === "delivered");

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Orders</Text>
            <Text style={styles.pageSubtitle}>{orders.length} total orders</Text>
          </View>
        </View>

        {pendingOrders.length > 0 && (
          <>
            <View style={styles.orderSectionHeader}>
              <Text style={styles.listTitle}>Pending Orders ({pendingOrders.length})</Text>
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>!</Text>
              </View>
            </View>
            {pendingOrders.map((order) => renderOrderCard(order))}
          </>
        )}

        {activeOrders.length > 0 && (
          <>
            <Text style={styles.listTitle}>Active Orders ({activeOrders.length})</Text>
            {activeOrders.map((order) => renderOrderCard(order))}
          </>
        )}

        {completedOrders.length > 0 && (
          <>
            <Text style={styles.listTitle}>Completed ({completedOrders.length})</Text>
            {completedOrders.map((order) => renderOrderCard(order))}
          </>
        )}
      </ScrollView>
    );
  };

  const renderOrderCard = (order) => (
    <View key={order.id} style={styles.orderDetailCard}>
      <View style={styles.orderDetailHeader}>
        <View style={styles.orderDetailLeft}>
          <Text style={styles.orderDetailNumber}>#{order.id}</Text>
          <View
            style={[
              styles.orderStatusBadge,
              styles[`orderStatus${order.status.replace("-", "")}`],
            ]}>
            <Text style={styles.orderStatusText}>{order.status}</Text>
          </View>
        </View>
        <Text style={styles.orderDetailTotal}>${order.total}</Text>
      </View>

      <View style={styles.orderDetailBody}>
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Customer:</Text>
          <Text style={styles.orderDetailValue}>{order.customer}</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Kitchen:</Text>
          <Text style={styles.orderDetailValue}>{order.kitchen}</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Items:</Text>
          <Text style={styles.orderDetailValue}>{order.items} items</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Time:</Text>
          <Text style={styles.orderDetailValue}>{order.time}</Text>
        </View>
        {order.rating && (
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Rating:</Text>
            <Text style={styles.orderDetailValue}>{"⭐".repeat(order.rating)}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderModal = () => {
    if (modalType === "kitchen") {
      return (
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {formData.id ? "Edit Kitchen" : "Add New Kitchen"}
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>Kitchen Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., Italian Delights'
                  placeholderTextColor='#9CA3AF'
                  value={formData.name || ""}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />

                <Text style={styles.inputLabel}>Cuisine Type *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., Italian, Indian, Mexican'
                  placeholderTextColor='#9CA3AF'
                  value={formData.cuisine || ""}
                  onChangeText={(text) => setFormData({ ...formData, cuisine: text })}
                />

                <Text style={styles.inputLabel}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., Downtown, Midtown'
                  placeholderTextColor='#9CA3AF'
                  value={formData.location || ""}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                />

                <TouchableOpacity onPress={handleSaveKitchen} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    {formData.id ? "Update Kitchen" : "Save Kitchen"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }

    if (modalType === "bulkMenu") {
      const kitchen = formData;
      const kitchenMenu = menuItems.filter((m) => m.kitchenId === kitchen.id);

      return (
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.flex1}>
                  <Text style={styles.modalTitle}>Menu Overview</Text>
                  <Text style={styles.modalSubtitle}>
                    {kitchen.name} • {kitchenMenu.length} items
                  </Text>
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {kitchenMenu.length > 0 ? (
                  <View style={styles.bulkMenuList}>
                    {kitchenMenu.map((item, index) => (
                      <View key={item.id} style={styles.bulkMenuItem}>
                        <Text style={styles.bulkMenuEmoji}>{item.image}</Text>
                        <View style={styles.bulkMenuInfo}>
                          <Text style={styles.bulkMenuName}>{item.name}</Text>
                          <Text style={styles.bulkMenuDetails}>
                            ${item.price} • {item.category} •{" "}
                            {item.available ? "✓ Available" : "✕ Unavailable"}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            closeModal();
                            setTimeout(() => openModal("menu", item), 300);
                          }}
                          style={styles.bulkMenuEdit}>
                          <Text style={styles.bulkMenuEditIcon}>✏️</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.bulkMenuEmpty}>
                    <Text style={styles.emptyIcon}>🍽️</Text>
                    <Text style={styles.bulkMenuEmptyText}>No menu items yet</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => {
                    setSelectedKitchen(kitchen.id);
                    closeModal();
                    setTimeout(() => openModal("menu"), 300);
                  }}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>➕ Add Menu Item</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedKitchen(kitchen.id);
                    setActiveTab("menu");
                    closeModal();
                  }}
                  style={styles.modalSecondaryButton}>
                  <Text style={styles.modalSecondaryButtonText}>View in Menu Tab</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }

    if (modalType === "menu") {
      return (
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {formData.id ? "Edit Menu Item" : "Add Menu Item"}
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>Select Kitchen *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.kitchenSelector}>
                  {kitchens.map((kitchen) => (
                    <TouchableOpacity
                      key={kitchen.id}
                      onPress={() => setSelectedKitchen(kitchen.id)}
                      style={[
                        styles.kitchenChip,
                        selectedKitchen === kitchen.id && styles.kitchenChipSelected,
                      ]}>
                      <Text
                        style={[
                          styles.kitchenChipText,
                          selectedKitchen === kitchen.id && styles.kitchenChipTextSelected,
                        ]}>
                        {kitchen.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Item Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., Margherita Pizza'
                  placeholderTextColor='#9CA3AF'
                  value={formData.name || ""}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />

                <Text style={styles.inputLabel}>Price ($) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='0.00'
                  placeholderTextColor='#9CA3AF'
                  keyboardType='numeric'
                  value={formData.price?.toString() || ""}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                />

                <Text style={styles.inputLabel}>Category *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., Pizza, Pasta, Main Course'
                  placeholderTextColor='#9CA3AF'
                  value={formData.category || ""}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                />

                <Text style={styles.inputLabel}>Emoji Icon (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder='🍕'
                  placeholderTextColor='#9CA3AF'
                  value={formData.image || ""}
                  onChangeText={(text) => setFormData({ ...formData, image: text })}
                />

                <TouchableOpacity onPress={handleSaveMenu} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    {formData.id ? "Update Item" : "Save Item"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#F97316' />

      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Food Delivery Management</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Premium Navigation */}
      <View style={styles.navigation}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navContent}>
          <NavItem icon='📊' label='Dashboard' tab='dashboard' />
          <NavItem icon='🏪' label='Kitchens' tab='kitchens' badge={stats.activeKitchens} />
          <NavItem icon='🍽️' label='Menu' tab='menu' badge={stats.menuItems} />
          <NavItem icon='📦' label='Orders' tab='orders' badge={stats.pendingOrders} />
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "kitchens" && renderKitchens()}
        {activeTab === "menu" && renderMenu()}
        {activeTab === "orders" && renderOrders()}
      </View>

      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#F97316",
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#FED7AA",
    marginTop: 2,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoutIcon: {
    fontSize: 20,
  },
  navigation: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  navContent: {
    paddingHorizontal: 16,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    position: "relative",
  },
  navItemActive: {
    backgroundColor: "#F97316",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  navIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
  },
  navLabelActive: {
    color: "#FFFFFF",
  },
  navBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  navBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  statsGrid: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 10,
  },
  statCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    flex: 1,
  },
  gradientGreen: {
    backgroundColor: "#10B981",
  },
  gradientBlue: {
    backgroundColor: "#3B82F6",
  },
  gradientOrange: {
    backgroundColor: "#F59E0B",
  },
  gradientPurple: {
    backgroundColor: "#8B5CF6",
  },
  gradientPink: {
    backgroundColor: "#EC4899",
  },
  statHeader: {
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
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    fontSize: 24,
  },
  trendBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  statSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 4,
    fontWeight: "500",
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F97316",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statuspending: {
    backgroundColor: "#FCD34D",
  },
  statuspreparing: {
    backgroundColor: "#FB923C",
  },
  statusinprogress: {
    backgroundColor: "#60A5FA",
  },
  statusdelivered: {
    backgroundColor: "#34D399",
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 2,
  },
  orderDetails: {
    fontSize: 12,
    color: "#94A3B8",
  },
  orderRight: {
    alignItems: "flex-end",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },
  topKitchenCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  rankGold: {
    backgroundColor: "#FEF3C7",
  },
  rankSilver: {
    backgroundColor: "#E5E7EB",
  },
  rankBronze: {
    backgroundColor: "#FED7AA",
  },
  rankText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1E293B",
  },
  kitchenInfo: {
    flex: 1,
  },
  kitchenName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  kitchenDetails: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  kitchenStats: {
    alignItems: "flex-end",
  },
  kitchenRevenue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10B981",
    marginBottom: 4,
  },
  kitchenRating: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  headerButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 12,
    marginTop: 8,
  },
  kitchenCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  kitchenHeader: {
    marginBottom: 16,
  },
  kitchenTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  kitchenTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  statusActive: {
    backgroundColor: "#D1FAE5",
  },
  statusInactive: {
    backgroundColor: "#FEE2E2",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "capitalize",
  },
  statusTextActive: {
    color: "#047857",
  },
  kitchenCuisine: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  kitchenLocation: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  kitchenMetrics: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  kitchenActions: {
    marginBottom: 12,
  },
  kitchenActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  kitchenActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryAction: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1.5,
    borderColor: "#FED7AA",
  },
  primaryActionText: {
    color: "#EA580C",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryAction: {
    backgroundColor: "#F1F5F9",
  },
  secondaryActionText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },
  dangerAction: {
    backgroundColor: "#FEE2E2",
    maxWidth: 60,
  },
  dangerActionText: {
    fontSize: 18,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  filterChipActive: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  menuCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  menuEmoji: {
    fontSize: 36,
  },
  availabilityBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  availableActive: {
    backgroundColor: "#10B981",
  },
  availableInactive: {
    backgroundColor: "#EF4444",
  },
  availabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  availabilityDotActive: {
    backgroundColor: "#10B981",
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  menuItemKitchen: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 8,
  },
  menuItemCategory: {
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F97316",
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  menuItemPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: "#10B981",
    marginBottom: 12,
  },
  menuCardActions: {
    flexDirection: "row",
    gap: 8,
  },
  menuEditButton: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  menuEditText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  menuDeleteButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuDeleteText: {
    fontSize: 16,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 48,
    alignItems: "center",
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  orderSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  urgentBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  urgentText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  orderDetailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  orderDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  orderDetailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderDetailNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginRight: 12,
  },
  orderStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  orderStatuspending: {
    backgroundColor: "#FEF3C7",
  },
  orderStatuspreparing: {
    backgroundColor: "#FED7AA",
  },
  orderStatusinprogress: {
    backgroundColor: "#DBEAFE",
  },
  orderStatusdelivered: {
    backgroundColor: "#D1FAE5",
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    textTransform: "capitalize",
  },
  orderDetailTotal: {
    fontSize: 24,
    fontWeight: "900",
    color: "#10B981",
  },
  orderDetailBody: {
    gap: 12,
  },
  orderDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  orderDetailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 20,
    color: "#64748B",
    fontWeight: "400",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    fontWeight: "500",
  },
  kitchenSelector: {
    marginBottom: 8,
  },
  kitchenChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  kitchenChipSelected: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  kitchenChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  kitchenChipTextSelected: {
    color: "#FFFFFF",
  },
  modalButton: {
    backgroundColor: "#F97316",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  modalSecondaryButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  modalSecondaryButtonText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "700",
  },
  bulkMenuList: {
    marginBottom: 16,
  },
  bulkMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  bulkMenuEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  bulkMenuInfo: {
    flex: 1,
  },
  bulkMenuName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  bulkMenuDetails: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  bulkMenuEdit: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  bulkMenuEditIcon: {
    fontSize: 16,
  },
  bulkMenuEmpty: {
    alignItems: "center",
    padding: 40,
  },
  bulkMenuEmptyText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  flex1: {
    flex: 1,
  },
});

export default AdminDashboard;
