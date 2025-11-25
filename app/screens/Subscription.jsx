import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddress } from "../context/AddressContext";
import Loader from "../components/Loader";
import {
  fetchSubscriptionPlans,
  fetchActiveSubscription,
  fetchSubscriptionCalendar,
  createSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
} from "../utils/apiHelpers";
import theme from "../../theme";

export default function Subscription({ navigation }) {
  const insets = useSafeAreaInsets();
  const { selectedAddress } = useAddress();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarData, setCalendarData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeSubscription && showCalendar) {
      loadCalendar();
    }
  }, [activeSubscription, showCalendar, currentMonth, currentYear]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, activeSub] = await Promise.all([
        fetchSubscriptionPlans(),
        fetchActiveSubscription(), // Now returns null instead of throwing 404
      ]);
      setPlans(plansData || []);
      setActiveSubscription(activeSub); // Will be null if no active subscription
    } catch (error) {
      console.error("Error loading subscription data:", error);
      Alert.alert("Error", "Failed to load subscription plans");
      setPlans([]);
      setActiveSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendar = async () => {
    try {
      const data = await fetchSubscriptionCalendar(currentMonth, currentYear);
      setCalendarData(data || { subscription: null, calendar: {} });
    } catch (error) {
      console.error("Error loading calendar:", error);
      setCalendarData({ subscription: null, calendar: {} });
    }
  };

  const handleSelect = (plan) => {
    if (activeSubscription) {
      Alert.alert(
        "Active Subscription",
        "You already have an active subscription. Please cancel it first or wait for it to expire.",
        [{ text: "OK" }, { text: "View Calendar", onPress: () => setShowCalendar(true) }]
      );
      return;
    }
    setSelectedPlan(plan);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSubscribe = async () => {
    if (!selectedAddress) {
      Alert.alert("Address Required", "Please select a delivery address first", [
        { text: "Cancel" },
        { text: "Select Address", onPress: () => navigation.navigate("ManageAddresses") },
      ]);
      return;
    }

    try {
      setSubscribing(true);
      const subscriptionData = {
        planType: selectedPlan.planType,
        deliveryAddress: selectedAddress.address || selectedAddress,
        startDate: new Date().toISOString(),
        paymentMode: "cod",
        autoRenew: false,
      };

      const subscription = await createSubscription(subscriptionData);
      Alert.alert("Success", "Subscription created successfully!", [
        {
          text: "View Calendar",
          onPress: () => {
            setShowSubscribeModal(false);
            setActiveSubscription(subscription);
            setShowCalendar(true);
            loadData();
          },
        },
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create subscription");
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = () => {
    Alert.alert("Cancel Subscription", "Are you sure you want to cancel your subscription?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelSubscription("Cancelled by user");
            Alert.alert("Success", "Subscription cancelled successfully");
            loadData();
          } catch (error) {
            Alert.alert("Error", "Failed to cancel subscription");
          }
        },
      },
    ]);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "#3b82f6",
      preparing: "#f59e0b",
      out_for_delivery: "#8b5cf6",
      delivered: "#10b981",
      skipped: "#6b7280",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const renderCalendar = () => {
    if (!calendarData) return null;

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const deliveries = calendarData.calendar[dateKey] || [];
      days.push({ day, deliveries, dateKey });
    }

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => {
              if (currentMonth === 1) {
                setCurrentMonth(12);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>
            {new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long", year: "numeric" })}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (currentMonth === 12) {
                setCurrentMonth(1);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}>
            <Ionicons name="chevron-forward" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysRow}>
          {weekDays.map((day) => (
            <View key={day} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {days.map((item, index) => {
            if (item === null) {
              return <View key={index} style={styles.calendarDay} />;
            }

            const { day, deliveries } = item;
            const isToday =
              day === new Date().getDate() &&
              currentMonth === new Date().getMonth() + 1 &&
              currentYear === new Date().getFullYear();

            return (
              <TouchableOpacity
                key={index}
                style={[styles.calendarDay, isToday && styles.calendarDayToday]}
                onPress={() => {
                  if (deliveries.length > 0) {
                    Alert.alert(
                      `Deliveries on ${day}/${currentMonth}/${currentYear}`,
                      deliveries
                        .map(
                          (d) =>
                            `${d.mealType.charAt(0).toUpperCase() + d.mealType.slice(1)}: ${d.status.charAt(0).toUpperCase() + d.status.slice(1)}`
                        )
                        .join("\n")
                    );
                  }
                }}>
                <Text style={[styles.calendarDayText, isToday && styles.calendarDayTextToday]}>{day}</Text>
                {deliveries.length > 0 && (
                  <View style={styles.deliveryDots}>
                    {deliveries.map((delivery, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.deliveryDot,
                          { backgroundColor: getStatusColor(delivery.status) },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
            <Text style={styles.legendText}>Scheduled</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.legendText}>Preparing</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
            <Text style={styles.legendText}>Delivered</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedPlan?.id === item.id;
    const gradientColors = {
      weekly: ["#00c6ff", "#0072ff"],
      half_month: ["#ff9966", "#ff5e62"],
      full_month: ["#4776E6", "#8E54E9"],
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, isSelected && styles.cardSelected]}
        activeOpacity={0.9}
        onPress={() => handleSelect(item)}>
        <LinearGradient
          colors={
            isSelected
              ? item.planType === "trial"
                ? ["#00c6ff", "#0072ff"]
                : item.planType === "weekly"
                ? ["#00c6ff", "#0072ff"]
                : item.planType === "half_month"
                ? ["#ff9966", "#ff5e62"]
                : item.planType === "full_month"
                ? ["#4776E6", "#8E54E9"]
                : ["#12c2e9", "#c471ed", "#f64f59"]
              : ["#ffffff", "#f8fafc"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}>
          {item.savings && (
            <View style={styles.savingsTag}>
              <Text style={styles.savingsText}>{item.savings}</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <View
              style={[
                styles.iconContainer,
                { 
                  backgroundColor: (
                    item.planType === "trial" ? "#00c6ff" :
                    item.planType === "weekly" ? "#00c6ff" :
                    item.planType === "half_month" ? "#ff9966" :
                    item.planType === "full_month" ? "#4776E6" :
                    "#12c2e9"
                  ) + "22" 
                },
              ]}>
              <Ionicons
                name={
                  item.planType === "trial" ? "fast-food-outline" :
                  item.planType === "premium" ? "star-outline" :
                  "restaurant-outline"
                }
                size={32}
                color={
                  isSelected ? "#fff" : (
                    item.planType === "trial" ? "#00c6ff" :
                    item.planType === "weekly" ? "#00c6ff" :
                    item.planType === "half_month" ? "#ff9966" :
                    item.planType === "full_month" ? "#4776E6" :
                    "#12c2e9"
                  )
                }
              />
            </View>
            <View style={styles.planDetails}>
              <Text style={[styles.title, isSelected && styles.titleSelected]}>{item.planName}</Text>
              <Text style={[styles.description, isSelected && styles.descriptionSelected]}>{item.description}</Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.price, isSelected && styles.priceSelected]}>₹{item.price.toLocaleString()}</Text>
                <Text style={[styles.period, isSelected && styles.periodSelected]}>
                  /{item.duration} days
                </Text>
              </View>
              <View style={styles.featuresContainer}>
                {item.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={isSelected ? "#fff" : theme.colors.brand.orange}
                    />
                    <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: "center", alignItems: "center" }]}>
        <Loader size="large" color="orange" text="Loading subscription plans..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#f97316", "#ef4444"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Raavito Subscriptions</Text>
          <Text style={styles.headerSubtitle}>Healthy, home-style tiffin plans delivered fresh</Text>
        </View>
        {activeSubscription && (
          <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {activeSubscription ? (
        <ScrollView style={styles.activeSubscriptionContainer} contentContainerStyle={styles.activeSubscriptionContent}>
          <View style={styles.activeSubscriptionCard}>
            <View style={styles.activeSubscriptionHeader}>
              <View>
                <Text style={styles.activePlanName}>{activeSubscription.planName}</Text>
                <Text style={styles.activePlanStatus}>
                  Status: {activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activeSubscription.deliveredMeals || 0}</Text>
                <Text style={styles.statLabel}>Delivered</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {(activeSubscription.totalMeals || 0) - (activeSubscription.deliveredMeals || 0)}
                </Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activeSubscription.totalMeals || 0}</Text>
                <Text style={styles.statLabel}>Total Meals</Text>
              </View>
            </View>

            <View style={styles.datesRow}>
              <View>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>
                  {new Date(activeSubscription.startDate).toLocaleDateString()}
                </Text>
              </View>
              <View>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>
                  {new Date(activeSubscription.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.addressBox}>
              <Text style={styles.addressLabel}>Delivery Address</Text>
              <Text style={styles.addressText}>{activeSubscription.deliveryAddress}</Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.calendarButton2} onPress={() => setShowCalendar(true)}>
                <Ionicons name="calendar" size={20} color="#fff" />
                <Text style={styles.calendarButtonText}>View Calendar</Text>
              </TouchableOpacity>
              {activeSubscription.status === "active" && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedPlan && !activeSubscription && (
        <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
          <LinearGradient colors={["rgb(254, 224, 179)", "rgb(255, 212, 85)"]} style={styles.bottomGradient}>
            <View style={styles.bottomContent}>
              <View style={styles.planInfo}>
                <Text style={styles.selectedLabel}>Selected Plan</Text>
                <Text style={styles.selectedTitle}>{selectedPlan.planName}</Text>
                <View style={styles.selectedPriceRow}>
                  <Text style={styles.selectedPrice}>₹{selectedPlan.price.toLocaleString()}</Text>
                  <Text style={styles.selectedPeriod}>/{selectedPlan.duration} days</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => setShowSubscribeModal(true)}
                disabled={subscribing}>
                <LinearGradient
                  colors={
                    selectedPlan.planType === "trial"
                      ? ["#00c6ff", "#0072ff"]
                      : selectedPlan.planType === "weekly"
                      ? ["#00c6ff", "#0072ff"]
                      : selectedPlan.planType === "half_month"
                      ? ["#ff9966", "#ff5e62"]
                      : selectedPlan.planType === "full_month"
                      ? ["#4776E6", "#8E54E9"]
                      : ["#12c2e9", "#c471ed", "#f64f59"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.subscribeGradient}>
                  <Text style={styles.subscribeText}>
                    {subscribing ? "Subscribing..." : "Subscribe Now"}
                  </Text>
                  {!subscribing && <Ionicons name="arrow-forward" size={18} color="white" />}
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.termsText}>No hidden charges • Cancel anytime • Easy upgrades</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Calendar Modal */}
      <Modal visible={showCalendar} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Calendar</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            {renderCalendar()}
          </View>
        </View>
      </Modal>

      {/* Subscribe Modal */}
      <Modal visible={showSubscribeModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Subscription</Text>
              <TouchableOpacity onPress={() => setShowSubscribeModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>Plan: {selectedPlan?.planName}</Text>
              <Text style={styles.modalText}>Price: ₹{selectedPlan?.price.toLocaleString()}</Text>
              <Text style={styles.modalText}>Duration: {selectedPlan?.duration} days</Text>
              <Text style={styles.modalText}>
                Address: {selectedAddress?.address || "No address selected"}
              </Text>
              {!selectedAddress && (
                <TouchableOpacity
                  style={styles.selectAddressButton}
                  onPress={() => {
                    setShowSubscribeModal(false);
                    navigation.navigate("ManageAddresses");
                  }}>
                  <Text style={styles.selectAddressText}>Select Delivery Address</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.confirmButton, (!selectedAddress || subscribing) && styles.confirmButtonDisabled]}
                onPress={handleSubscribe}
                disabled={!selectedAddress || subscribing}>
                {subscribing ? (
                  <Loader size="small" color="orange" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm & Subscribe</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    elevation: 10,
    shadowColor: "#f97316",
  },
  backButton: { padding: 8, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)" },
  headerContent: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 2 },
  calendarButton: { padding: 8, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)" },
  listContent: { paddingVertical: 20, paddingHorizontal: 16, paddingBottom: 140 },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
    elevation: 4,
    backgroundColor: "white",
  },
  cardSelected: { transform: [{ scale: 1.02 }], elevation: 8 },
  cardGradient: { padding: 20, minHeight: 180 },
  savingsTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#22c55e",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: { color: "white", fontSize: 11, fontWeight: "700" },
  cardContent: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  planDetails: { flex: 1 },
  title: { fontSize: 18, fontWeight: "bold", color: theme.colors.brand.dark, marginBottom: 4 },
  titleSelected: { color: "#fff" },
  description: { fontSize: 13, color: "#64748b" },
  descriptionSelected: { color: "#f8fafc" },
  priceContainer: { flexDirection: "row", alignItems: "baseline", marginTop: 8 },
  price: { fontSize: 22, fontWeight: "bold", color: theme.colors.brand.orange },
  priceSelected: { color: "white" },
  period: { fontSize: 13, color: "#9ca3af", marginLeft: 4 },
  periodSelected: { color: "rgba(255,255,255,0.8)" },
  featuresContainer: { marginTop: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  featureText: { fontSize: 13, color: "#4b5563", flex: 1 },
  featureTextSelected: { color: "#f9fafb" },
  bottomContainer: { position: "absolute", bottom: 0, left: 0, right: 0, elevation: 10 },
  bottomGradient: {
    paddingHorizontal: 18,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  planInfo: { flex: 1 },
  selectedLabel: { fontSize: 11, color: "#1b1b1c", fontWeight: "600" },
  selectedTitle: { fontSize: 18, fontWeight: "bold", color: theme.colors.brand.dark, marginTop: 2 },
  selectedPriceRow: { flexDirection: "row", alignItems: "baseline", marginTop: 4 },
  selectedPrice: { fontSize: 20, fontWeight: "bold", color: theme.colors.brand.orange },
  selectedPeriod: { fontSize: 13, color: "#141414", marginLeft: 4 },
  subscribeButton: { marginLeft: 12, borderRadius: 18, overflow: "hidden", elevation: 6 },
  subscribeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    gap: 6,
  },
  subscribeText: { color: "white", fontSize: 15, fontWeight: "700" },
  termsText: {
    fontSize: 11,
    color: "#151515",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  activeSubscriptionContainer: { flex: 1 },
  activeSubscriptionContent: { padding: 16 },
  activeSubscriptionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  activeSubscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  activePlanName: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  activePlanStatus: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  statusBadge: { backgroundColor: "#d1fae5", borderRadius: 20, padding: 8 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold", color: theme.colors.brand.orange },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  dateLabel: { fontSize: 12, color: "#6b7280" },
  dateValue: { fontSize: 16, fontWeight: "600", color: "#111827", marginTop: 4 },
  addressBox: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addressLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  addressText: { fontSize: 14, color: "#111827" },
  actionsRow: { flexDirection: "row", gap: 12 },
  calendarButton2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand.orange,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  calendarButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    paddingVertical: 12,
    borderRadius: 12,
  },
  cancelButtonText: { color: "#dc2626", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  modalBody: { padding: 20 },
  modalText: { fontSize: 16, color: "#374151", marginBottom: 12 },
  selectAddressButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
  },
  selectAddressText: { color: theme.colors.brand.orange, fontWeight: "600" },
  confirmButton: {
    backgroundColor: theme.colors.brand.orange,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  confirmButtonDisabled: { backgroundColor: "#d1d5db" },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  calendarContainer: { padding: 20 },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarMonth: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  weekDaysRow: { flexDirection: "row", marginBottom: 8 },
  weekDay: { flex: 1, alignItems: "center", paddingVertical: 8 },
  weekDayText: { fontSize: 12, fontWeight: "600", color: "#6b7280" },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  calendarDayToday: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
  },
  calendarDayText: { fontSize: 14, color: "#111827" },
  calendarDayTextToday: { fontWeight: "bold", color: theme.colors.brand.orange },
  deliveryDots: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  deliveryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: { fontSize: 12, color: "#6b7280" },
});
