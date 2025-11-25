// AdminDashboard.js - Screen Component for your existing app
import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { axios_ } from "../../utils/utils";
import ColorPicker from "../components/ColorPicker";

const AdminDashboard = ({ navigation }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(false);

  const [kitchens, setKitchens] = useState([
    {
      id: 1,
      name: "Italian Delights",
      cuisine: "Italian",
      status: "active",
      rating: 4.8,
      orders: 234,
      location: "Downtown",
    },
    {
      id: 2,
      name: "Spice Paradise",
      cuisine: "Indian",
      status: "active",
      rating: 4.6,
      orders: 189,
      location: "Midtown",
    },
    {
      id: 3,
      name: "Burger House",
      cuisine: "American",
      status: "inactive",
      rating: 4.3,
      orders: 156,
      location: "Uptown",
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
    },
    {
      id: 2,
      kitchenId: 1,
      name: "Pasta Carbonara",
      price: 14.99,
      category: "Pasta",
      available: true,
    },
    {
      id: 3,
      kitchenId: 2,
      name: "Butter Chicken",
      price: 15.99,
      category: "Main Course",
      available: true,
    },
    { id: 4, kitchenId: 2, name: "Biryani", price: 13.99, category: "Rice", available: false },
    {
      id: 5,
      kitchenId: 3,
      name: "Classic Burger",
      price: 9.99,
      category: "Burgers",
      available: true,
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
    },
    {
      id: 1002,
      customer: "Jane Smith",
      kitchen: "Spice Paradise",
      items: 2,
      total: 29.98,
      status: "in-progress",
      time: "30m ago",
    },
    {
      id: 1003,
      customer: "Mike Johnson",
      kitchen: "Burger House",
      items: 1,
      total: 18.99,
      status: "pending",
      time: "10m ago",
    },
    {
      id: 1004,
      customer: "Sarah Williams",
      kitchen: "Italian Delights",
      items: 4,
      total: 56.5,
      status: "preparing",
      time: "5m ago",
    },
  ]);

  const [formData, setFormData] = useState({});

  // Load deals from API
  useEffect(() => {
    if (activeTab === "deals") {
      loadDeals();
    }
  }, [activeTab]);

  const loadDeals = async () => {
    try {
      setLoadingDeals(true);
      const { data } = await axios_.get("/deals");
      setDeals(data);
    } catch (error) {
      console.error("Error loading deals:", error);
      Alert.alert("Error", "Failed to load deals");
    } finally {
      setLoadingDeals(false);
    }
  };

  const stats = {
    totalRevenue: 24580,
    totalOrders: 579,
    activeKitchens: kitchens.filter((k) => k.status === "active").length,
    avgRating: 4.6,
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (data) {
      setFormData(data);
      if (type === "menu") setSelectedKitchen(data.kitchenId);
    } else {
      setFormData({});
      // Keep selected kitchen when opening add menu modal
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
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (formData.id) {
      setKitchens(kitchens.map((k) => (k.id === formData.id ? { ...k, ...formData } : k)));
    } else {
      setKitchens([
        ...kitchens,
        { ...formData, id: Date.now(), status: "active", rating: 0, orders: 0 },
      ]);
    }
    closeModal();
    Alert.alert("Success", "Kitchen saved successfully!");
  };

  const handleSaveMenu = () => {
    if (!formData.name || !formData.price || !selectedKitchen || !formData.category) {
      Alert.alert("Error", "Please fill all fields and select a kitchen");
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
        { ...menuData, id: Date.now(), kitchenId: selectedKitchen, available: true },
      ]);
    }
    closeModal();
    Alert.alert("Success", "Menu item saved successfully!");
  };

  const handleSaveDeal = async () => {
    if (!formData.title || !formData.gradient || formData.gradient.length === 0) {
      Alert.alert("Error", "Please fill title and gradient colors");
      return;
    }

    try {
      const dealData = {
        title: formData.title,
        subtitle: formData.subtitle || "",
        description: formData.description || "",
        gradient: formData.gradient || [],
        image: formData.image || "",
        isActive: formData.isActive !== false,
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || null,
      };

      if (formData._id || formData.id) {
        const { data } = await axios_.put(`/deals/${formData._id || formData.id}`, dealData);
        setDeals(deals.map((d) => (d._id || d.id) === (formData._id || formData.id) ? data : d));
        Alert.alert("Success", "Deal updated successfully!");
      } else {
        const { data } = await axios_.post("/deals", dealData);
        setDeals([...deals, data]);
        Alert.alert("Success", "Deal created successfully!");
      }
      closeModal();
    } catch (error) {
      console.error("Error saving deal:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to save deal");
    }
  };

  const handleDelete = (type, id) => {
    Alert.alert("Confirm Delete", `Are you sure you want to delete this ${type}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (type === "deal") {
            try {
              await axios_.delete(`/deals/${id}`);
              setDeals(deals.filter((d) => (d._id || d.id) !== id));
              Alert.alert("Success", "Deal deleted successfully!");
            } catch (error) {
              console.error("Error deleting deal:", error);
              Alert.alert("Error", "Failed to delete deal");
            }
          } else if (type === "kitchen") {
            setKitchens(kitchens.filter((k) => k.id !== id));
            setMenuItems(menuItems.filter((m) => m.kitchenId !== id));
            Alert.alert("Success", `${type} deleted successfully!`);
          } else if (type === "menu") {
            setMenuItems(menuItems.filter((m) => m.id !== id));
            Alert.alert("Success", `${type} deleted successfully!`);
          }
        },
      },
    ]);
  };

  const toggleAvailability = (itemId) => {
    setMenuItems(menuItems.map((m) => (m.id === itemId ? { ...m, available: !m.available } : m)));
  };

  const NavItem = ({ icon, label, tab }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[styles.navItem, activeTab === tab && styles.navItemActive]}>
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderDashboard = () => (
    <View>
      <View style={styles.statsContainer}>
        <StatCard
          label='Total Revenue'
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon='💰'
          color='#10B981'
        />
        <StatCard label='Total Orders' value={stats.totalOrders} icon='🛍️' color='#3B82F6' />
      </View>
      <View style={styles.statsContainer}>
        <StatCard label='Active Kitchens' value={stats.activeKitchens} icon='🏪' color='#F59E0B' />
        <StatCard label='Avg Rating' value={stats.avgRating} icon='⭐' color='#8B5CF6' />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Orders</Text>
        {orders.slice(0, 4).map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>#{order.id}</Text>
                <View style={[styles.badge, styles[`badge${order.status.replace("-", "")}`]]}>
                  <Text style={styles.badgeText}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.orderCustomer}>{order.customer}</Text>
              <Text style={styles.orderDetails}>
                {order.kitchen} • {order.items} items • {order.time}
              </Text>
            </View>
            <Text style={styles.orderTotal}>${order.total}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Performing Kitchens</Text>
        {kitchens
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map((kitchen, index) => (
            <View key={kitchen.id} style={styles.kitchenRankItem}>
              <View
                style={[
                  styles.rankBadge,
                  index === 0
                    ? styles.rankBadgeGold
                    : index === 1
                      ? styles.rankBadgeSilver
                      : styles.rankBadgeBronze,
                ]}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.kitchenRankInfo}>
                <Text style={styles.kitchenRankName}>{kitchen.name}</Text>
                <Text style={styles.kitchenRankDetails}>
                  {kitchen.cuisine} • {kitchen.location}
                </Text>
              </View>
              <View style={styles.kitchenRankStats}>
                <Text style={styles.kitchenRankRating}>⭐ {kitchen.rating}</Text>
                <Text style={styles.kitchenRankOrders}>{kitchen.orders} orders</Text>
              </View>
            </View>
          ))}
      </View>
    </View>
  );

  const renderKitchens = () => (
    <View>
      <TouchableOpacity onPress={() => openModal("kitchen")} style={styles.addButton}>
        <Text style={styles.addButtonText}>➕ Add New Kitchen</Text>
      </TouchableOpacity>

      {kitchens.map((kitchen) => {
        const kitchenMenuCount = menuItems.filter((m) => m.kitchenId === kitchen.id).length;

        return (
          <View key={kitchen.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.flex1}>
                <Text style={styles.itemTitle}>{kitchen.name}</Text>
                <Text style={styles.itemSubtitle}>{kitchen.cuisine} Cuisine</Text>
                <Text style={styles.itemLocation}>📍 {kitchen.location}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  kitchen.status === "active" ? styles.statusActive : styles.statusInactive,
                ]}>
                <Text style={styles.statusText}>{kitchen.status}</Text>
              </View>
            </View>

            <View style={styles.kitchenStats}>
              <View style={styles.kitchenStat}>
                <Text style={styles.kitchenStatValue}>⭐ {kitchen.rating}</Text>
                <Text style={styles.kitchenStatLabel}>Rating</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.kitchenStat}>
                <Text style={styles.kitchenStatValue}>{kitchen.orders}</Text>
                <Text style={styles.kitchenStatLabel}>Orders</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.kitchenStat}>
                <Text style={styles.kitchenStatValue}>{kitchenMenuCount}</Text>
                <Text style={styles.kitchenStatLabel}>Menu Items</Text>
              </View>
            </View>

            {/* Manage Menu Button */}
            <TouchableOpacity
              onPress={() => {
                setSelectedKitchen(kitchen.id);
                setActiveTab("menu");
              }}
              style={[styles.actionButton, styles.manageMenuButton]}>
              <Text style={styles.manageMenuButtonText}>
                🍽️ Manage Menu ({kitchenMenuCount} items)
              </Text>
            </TouchableOpacity>

            {/* Edit Kitchen & Update Menu Button */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => openModal("kitchen", kitchen)}
                style={[styles.actionButton, styles.editButton]}>
                <Text style={styles.editButtonText}>✏️ Edit Kitchen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openModal("bulkMenu", kitchen)}
                style={[styles.actionButton, styles.updateMenuButton]}>
                <Text style={styles.updateMenuButtonText}>📋 Update Menu</Text>
              </TouchableOpacity>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleDelete("kitchen", kitchen.id)}
              style={[styles.actionButton, styles.deleteButtonFull]}>
              <Text style={styles.deleteButtonText}>🗑️ Delete Kitchen & Menu</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  const renderMenu = () => {
    // Filter menu items if a kitchen is selected
    const filteredItems = selectedKitchen
      ? menuItems.filter((item) => item.kitchenId === selectedKitchen)
      : menuItems;

    const selectedKitchenData = kitchens.find((k) => k.id === selectedKitchen);

    return (
      <View>
        {/* Kitchen Filter */}
        {kitchens.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Filter by Kitchen:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}>
              <TouchableOpacity
                onPress={() => setSelectedKitchen(null)}
                style={[styles.filterChip, !selectedKitchen && styles.filterChipSelected]}>
                <Text
                  style={[
                    styles.filterChipText,
                    !selectedKitchen && styles.filterChipTextSelected,
                  ]}>
                  All Kitchens ({menuItems.length})
                </Text>
              </TouchableOpacity>
              {kitchens.map((kitchen) => (
                <TouchableOpacity
                  key={kitchen.id}
                  onPress={() => setSelectedKitchen(kitchen.id)}
                  style={[
                    styles.filterChip,
                    selectedKitchen === kitchen.id && styles.filterChipSelected,
                  ]}>
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedKitchen === kitchen.id && styles.filterChipTextSelected,
                    ]}>
                    {kitchen.name} ({menuItems.filter((m) => m.kitchenId === kitchen.id).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Add Menu Item Button */}
        <TouchableOpacity
          onPress={() => {
            if (kitchens.length === 0) {
              Alert.alert("No Kitchens", "Please add a kitchen first before adding menu items.");
              return;
            }
            openModal("menu");
          }}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>
            ➕ Add Menu Item {selectedKitchenData ? `to ${selectedKitchenData.name}` : ""}
          </Text>
        </TouchableOpacity>

        {/* No kitchens message */}
        {kitchens.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏪</Text>
            <Text style={styles.emptyStateTitle}>No Kitchens Yet</Text>
            <Text style={styles.emptyStateText}>
              Add a kitchen first to start creating menu items
            </Text>
            <TouchableOpacity
              onPress={() => {
                setActiveTab("kitchens");
              }}
              style={styles.emptyStateButton}>
              <Text style={styles.emptyStateButtonText}>Go to Kitchens</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🍽️</Text>
            <Text style={styles.emptyStateTitle}>No Menu Items</Text>
            <Text style={styles.emptyStateText}>
              {selectedKitchenData
                ? `No menu items for ${selectedKitchenData.name} yet`
                : "Start adding menu items for your kitchens"}
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const kitchen = kitchens.find((k) => k.id === item.kitchenId);
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.flex1}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>🏪 {kitchen?.name}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleAvailability(item.id)}
                    style={[
                      styles.availabilityBadge,
                      item.available ? styles.availabilityActive : styles.availabilityInactive,
                    ]}>
                    <Text style={styles.availabilityText}>
                      {item.available ? "✓ Available" : "✕ Unavailable"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => openModal("menu", item)}
                    style={[styles.actionButton, styles.editButton]}>
                    <Text style={styles.editButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete("menu", item.id)}
                    style={[styles.actionButton, styles.deleteButton]}>
                    <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    );
  };

  const renderOrders = () => (
    <View>
      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <View style={styles.orderCardHeader}>
            <View style={styles.flex1}>
              <Text style={styles.itemTitle}>Order #{order.id}</Text>
              <Text style={styles.orderCustomer}>{order.customer}</Text>
              <Text style={styles.itemSubtitle}>{order.kitchen}</Text>
              <Text style={styles.orderDetails}>
                {order.items} items • {order.time}
              </Text>
            </View>
            <View>
              <Text style={styles.orderTotal}>${order.total}</Text>
              <View style={[styles.badge, styles[`badge${order.status.replace("-", "")}`]]}>
                <Text style={styles.badgeText}>{order.status}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderDeals = () => (
    <View>
      <TouchableOpacity onPress={() => openModal("deal")} style={styles.addButton}>
        <Text style={styles.addButtonText}>➕ Add New Deal</Text>
      </TouchableOpacity>

      {loadingDeals ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading deals...</Text>
        </View>
      ) : deals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎁</Text>
          <Text style={styles.emptyStateTitle}>No Deals Yet</Text>
          <Text style={styles.emptyStateText}>Start creating exclusive deals for your customers</Text>
        </View>
      ) : (
        deals.map((deal) => (
          <View key={deal._id || deal.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.flex1}>
                <Text style={styles.itemTitle}>{deal.title}</Text>
                <Text style={styles.itemSubtitle}>{deal.subtitle || "Exclusive Deal"}</Text>
                {deal.description && (
                  <Text style={styles.itemLocation}>{deal.description}</Text>
                )}
              </View>
              <View
                style={[
                  styles.statusBadge,
                  deal.isActive ? styles.statusActive : styles.statusInactive,
                ]}>
                <Text style={styles.statusText}>{deal.isActive ? "Active" : "Inactive"}</Text>
              </View>
            </View>

            {(deal.startDate || deal.endDate) && (
              <View style={styles.kitchenStats}>
                <View style={styles.kitchenStat}>
                  <Text style={styles.kitchenStatValue}>
                    {deal.startDate ? new Date(deal.startDate).toLocaleDateString() : "N/A"}
                  </Text>
                  <Text style={styles.kitchenStatLabel}>Start Date</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.kitchenStat}>
                  <Text style={styles.kitchenStatValue}>
                    {deal.endDate ? new Date(deal.endDate).toLocaleDateString() : "No End"}
                  </Text>
                  <Text style={styles.kitchenStatLabel}>End Date</Text>
                </View>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => openModal("deal", deal)}
                style={[styles.actionButton, styles.editButton]}>
                <Text style={styles.editButtonText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete("deal", deal._id || deal.id)}
                style={[styles.actionButton, styles.deleteButton]}>
                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
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
                  {formData.id ? "Edit Kitchen" : "Add Kitchen"}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>Kitchen Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Enter kitchen name'
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

                <TouchableOpacity onPress={handleSaveKitchen} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>
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
                  <Text style={styles.modalTitle}>Update Menu</Text>
                  <Text style={styles.modalSubtitle}>{kitchen.name}</Text>
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.bulkMenuInfo}>
                  Current menu has {kitchenMenu.length} items. You can view, edit, or add new items.
                </Text>

                {kitchenMenu.length > 0 ? (
                  <View style={styles.bulkMenuList}>
                    {kitchenMenu.map((item, index) => (
                      <View key={item.id} style={styles.bulkMenuItem}>
                        <View style={styles.flex1}>
                          <Text style={styles.bulkMenuItemName}>
                            {index + 1}. {item.name}
                          </Text>
                          <Text style={styles.bulkMenuItemDetails}>
                            ${item.price.toFixed(2)} • {item.category} •{" "}
                            {item.available ? "✓ Available" : "✕ Unavailable"}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            closeModal();
                            setTimeout(() => openModal("menu", item), 300);
                          }}
                          style={styles.bulkMenuEditButton}>
                          <Text style={styles.bulkMenuEditText}>✏️</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.bulkMenuEmpty}>
                    <Text style={styles.bulkMenuEmptyText}>No menu items yet for this kitchen</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => {
                    setSelectedKitchen(kitchen.id);
                    closeModal();
                    setTimeout(() => openModal("menu"), 300);
                  }}
                  style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>➕ Add New Menu Item</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedKitchen(kitchen.id);
                    setActiveTab("menu");
                    closeModal();
                  }}
                  style={styles.viewAllButton}>
                  <Text style={styles.viewAllButtonText}>View All in Menu Tab</Text>
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
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeButton}>✕</Text>
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
                  placeholder='Enter item name'
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

                <TouchableOpacity onPress={handleSaveMenu} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>
                    {formData.id ? "Update Menu Item" : "Save Menu Item"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }

    if (modalType === "deal") {
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
                  {formData._id || formData.id ? "Edit Deal" : "Add Deal"}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., Premium Subscription'
                  placeholderTextColor='#9CA3AF'
                  value={formData.title || ""}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />

                <Text style={styles.inputLabel}>Subtitle</Text>
                <TextInput
                  style={styles.input}
                  placeholder='e.g., Save up to 60% for 6 months'
                  placeholderTextColor='#9CA3AF'
                  value={formData.subtitle || ""}
                  onChangeText={(text) => setFormData({ ...formData, subtitle: text })}
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                  placeholder='Deal description (optional)'
                  placeholderTextColor='#9CA3AF'
                  multiline
                  numberOfLines={3}
                  value={formData.description || ""}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />

                <ColorPicker
                  label="Gradient Colors"
                  value={formData.gradient || []}
                  onChange={(colors) => setFormData({ ...formData, gradient: colors })}
                />

                <Text style={styles.inputLabel}>Image URL (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder='https://example.com/image.jpg'
                  placeholderTextColor='#9CA3AF'
                  value={formData.image || ""}
                  onChangeText={(text) => setFormData({ ...formData, image: text })}
                />

                <Text style={styles.inputLabel}>Start Date (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder='YYYY-MM-DD or leave empty for now'
                  placeholderTextColor='#9CA3AF'
                  value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ""}
                  onChangeText={(text) => {
                    if (text) {
                      setFormData({ ...formData, startDate: new Date(text) });
                    } else {
                      setFormData({ ...formData, startDate: null });
                    }
                  }}
                />

                <Text style={styles.inputLabel}>End Date (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder='YYYY-MM-DD or leave empty for no end date'
                  placeholderTextColor='#9CA3AF'
                  value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ""}
                  onChangeText={(text) => {
                    if (text) {
                      setFormData({ ...formData, endDate: new Date(text) });
                    } else {
                      setFormData({ ...formData, endDate: null });
                    }
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setFormData({ ...formData, isActive: !formData.isActive });
                  }}
                  style={[
                    styles.actionButton,
                    { marginTop: 12, backgroundColor: formData.isActive !== false ? '#D1FAE5' : '#E5E7EB' },
                  ]}>
                  <Text style={[styles.editButtonText, { color: formData.isActive !== false ? '#059669' : '#6B7280' }]}>
                    {formData.isActive !== false ? '✓ Active' : '✕ Inactive'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSaveDeal} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>
                    {formData._id || formData.id ? "Update Deal" : "Save Deal"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Call AuthContext logout method
            // This will clear auth state and trigger AppNavigator to show login screens
            await logout();

            Alert.alert("Success", "You have been logged out successfully!");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#F97316' />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your food delivery business</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <NavItem icon='📊' label='Dashboard' tab='dashboard' />
          <NavItem icon='🏪' label='Kitchens' tab='kitchens' />
          <NavItem icon='🍽️' label='Menu' tab='menu' />
          <NavItem icon='🛍️' label='Orders' tab='orders' />
          <NavItem icon='🎁' label='Deals' tab='deals' />
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "kitchens" && renderKitchens()}
        {activeTab === "menu" && renderMenu()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "deals" && renderDeals()}
      </ScrollView>

      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#F97316",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FED7AA",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  navigation: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  navItemActive: {
    backgroundColor: "#F97316",
  },
  navIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  navLabelActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#D1FAE5",
  },
  statusInactive: {
    backgroundColor: "#E5E7EB",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  kitchenStats: {
    flexDirection: "row",
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  kitchenStat: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#D1D5DB",
  },
  kitchenStatValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EA580C",
    marginBottom: 4,
  },
  kitchenStatLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: "#DBEAFE",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
  },
  editButtonText: {
    color: "#1D4ED8",
    fontWeight: "600",
    fontSize: 14,
  },
  deleteButtonText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#F97316",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    color: "#EA580C",
    fontSize: 12,
    fontWeight: "600",
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityActive: {
    backgroundColor: "#D1FAE5",
  },
  availabilityInactive: {
    backgroundColor: "#E5E7EB",
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceContainer: {
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#059669",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgedelivered: {
    backgroundColor: "#D1FAE5",
  },
  badgeinprogress: {
    backgroundColor: "#DBEAFE",
  },
  badgepending: {
    backgroundColor: "#FEF3C7",
  },
  badgepreparing: {
    backgroundColor: "#FED7AA",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 12,
    color: "#6B7280",
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  kitchenRankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankBadgeGold: {
    backgroundColor: "#FEF3C7",
  },
  rankBadgeSilver: {
    backgroundColor: "#E5E7EB",
  },
  rankBadgeBronze: {
    backgroundColor: "#FED7AA",
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  kitchenRankInfo: {
    flex: 1,
  },
  kitchenRankName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  kitchenRankDetails: {
    fontSize: 12,
    color: "#6B7280",
  },
  kitchenRankStats: {
    alignItems: "flex-end",
  },
  kitchenRankRating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  kitchenRankOrders: {
    fontSize: 11,
    color: "#6B7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    fontSize: 28,
    color: "#6B7280",
    fontWeight: "300",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 2,
    borderColor: "transparent",
  },
  kitchenSelector: {
    marginBottom: 8,
  },
  kitchenChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  kitchenChipSelected: {
    backgroundColor: "#F97316",
  },
  kitchenChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  kitchenChipTextSelected: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#F97316",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButton: {
    backgroundColor: "#F97316",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuButton: {
    backgroundColor: "#FFF7ED",
    marginBottom: 8,
  },
  menuButtonText: {
    color: "#EA580C",
    fontWeight: "600",
    fontSize: 14,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: "#F97316",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  manageMenuButton: {
    backgroundColor: "#FFF7ED",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  manageMenuButtonText: {
    color: "#EA580C",
    fontWeight: "700",
    fontSize: 14,
  },
  updateMenuButton: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  updateMenuButtonText: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 14,
  },
  deleteButtonFull: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  bulkMenuInfo: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  bulkMenuList: {
    marginBottom: 16,
  },
  bulkMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  bulkMenuItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  bulkMenuItemDetails: {
    fontSize: 12,
    color: "#6B7280",
  },
  bulkMenuEditButton: {
    backgroundColor: "#DBEAFE",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  bulkMenuEditText: {
    fontSize: 16,
  },
  bulkMenuEmpty: {
    backgroundColor: "#F9FAFB",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  bulkMenuEmptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
  viewAllButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  viewAllButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AdminDashboard;
