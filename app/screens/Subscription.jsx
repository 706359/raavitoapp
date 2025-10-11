import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Animated, Easing, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../../theme";

export default function Subscription({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const plans = [
    {
      id: "1",
      icon: "fast-food-outline",
      title: "Trial Plan",
      description: "1 meal per day • 5 days",
      price: "₹499",
      period: "/5 days",
      features: ["Home-style meal", "Choice of Veg menu", "Delivered at lunchtime"],
      gradient: ["#00c6ff", "#0072ff"],
    },
    {
      id: "2",
      icon: "restaurant-outline",
      title: "Weekly Saver",
      description: "2 meals per day • 6 days/week",
      price: "₹1,799",
      period: "/week",
      features: [
        "Lunch & Dinner included",
        "Chef-curated balanced menu",
        "Free delivery in city limits",
        "Hygienic reusable packaging",
      ],
      gradient: ["#ff9966", "#ff5e62"],
      savings: "Save ₹200",
    },
    {
      id: "3",
      icon: "nutrition-outline",
      title: "Monthly Standard",
      description: "2 meals per day • 26 days",
      price: "₹6,999",
      period: "/month",
      features: [
        "Lunch & Dinner",
        "Daily changing menu",
        "Free weekend special",
        "Priority delivery slot",
      ],
      gradient: ["#4776E6", "#8E54E9"],
      savings: "Save ₹500",
    },
    {
      id: "4",
      icon: "star-outline",
      title: "Premium Unlimited",
      description: "All meals • All days",
      price: "₹10,499",
      period: "/month",
      features: [
        "Breakfast, Lunch, Dinner",
        "Personalized menu",
        "Chef’s special every Sunday",
        "Dessert included",
        "Priority customer support",
      ],
      gradient: ["#12c2e9", "#c471ed", "#f64f59"],
      savings: "Save ₹1200",
    },
  ];

  const renderItem = ({ item }) => {
    const isSelected = selectedPlan?.id === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, isSelected && styles.cardSelected]}
        activeOpacity={0.9}
        onPress={() => handleSelect(item)}>
        <LinearGradient
          colors={isSelected ? item.gradient : ["#ffffff", "#f8fafc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}>
          {item.savings && (
            <View style={styles.savingsTag}>
              <Text style={styles.savingsText}>{item.savings}</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: item.gradient[0] + "22" }]}>
              <Ionicons name={item.icon} size={32} color={isSelected ? "#fff" : item.gradient[0]} />
            </View>
            <View style={styles.planDetails}>
              <Text style={[styles.title, isSelected && styles.titleSelected]}>{item.title}</Text>
              <Text style={[styles.description, isSelected && styles.descriptionSelected]}>
                {item.description}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.price, isSelected && styles.priceSelected]}>{item.price}</Text>
                <Text style={[styles.period, isSelected && styles.periodSelected]}>
                  {item.period}
                </Text>
              </View>
              <View style={styles.featuresContainer}>
                {item.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons
                      name='checkmark-circle'
                      size={16}
                      color={isSelected ? "#fff" : theme.colors.brand.orange}
                    />
                    <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#f97316", "#ef4444"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Raavito Subscriptions</Text>
          <Text style={styles.headerSubtitle}>
            Healthy, home-style tiffin plans delivered fresh
          </Text>
        </View>
      </LinearGradient>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedPlan && (
        <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={["rgb(254, 224, 179)", "rgb(255, 212, 85)"]}
            style={styles.bottomGradient}>
            <View style={styles.bottomContent}>
              <View style={styles.planInfo}>
                <Text style={styles.selectedLabel}>Selected Plan</Text>
                <Text style={styles.selectedTitle}>{selectedPlan.title}</Text>
                <View style={styles.selectedPriceRow}>
                  <Text style={styles.selectedPrice}>{selectedPlan.price}</Text>
                  <Text style={styles.selectedPeriod}>{selectedPlan.period}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.subscribeButton}>
                <LinearGradient
                  colors={selectedPlan.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.subscribeGradient}>
                  <Text style={styles.subscribeText}>Subscribe Now</Text>
                  <Ionicons name='arrow-forward' size={18} color='white' />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.termsText}>No hidden charges • Cancel anytime • Easy upgrades</Text>
          </LinearGradient>
        </Animated.View>
      )}
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
});
