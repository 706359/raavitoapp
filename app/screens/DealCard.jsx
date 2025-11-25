import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Dimensions.get("window");

export default function DealsScreen() {
  const navigation = useNavigation();
  const [expandedDeal, setExpandedDeal] = useState(null);

  const theme = {
    colors: {
      brand: {
        orange: "#f57506",
        green: "#366d59",
        dark: "#111827",
        light: "#fcf8ec",
        gray: "#9CA3AF",
      },
    },
  };

  const allDeals = [
    {
      id: "1",
      title: "Premium Subscription",
      subtitle: "Save up to 60% for 6 months",
      description:
        "Get unlimited access to all kitchens with our premium subscription. Enjoy free delivery, exclusive discounts, and priority support.",
      terms: "Valid for new subscribers only. Auto-renewal after 6 months.",
      validUntil: "Dec 31, 2024",
      code: "PREMIUM60",
      gradient: ["#f57506", "#fb923c"],
      image: require("../assets/Rajasthani.jpg"),
      savings: "₹2,999",
      minOrder: "No minimum order",
    },
    {
      id: "2",
      title: "Fresh & Healthy",
      subtitle: "Farm to table daily specials",
      description:
        "Enjoy fresh, organic ingredients delivered daily from local farms. Perfect for health-conscious food lovers.",
      terms: "Available Monday to Friday. Limited quantities daily.",
      validUntil: "Ongoing",
      code: "FRESH25",
      gradient: ["#366d59", "#4a9d7a"],
      image: require("../assets/Gujarati.jpeg"),
      savings: "25% OFF",
      minOrder: "₹500",
    },
    {
      id: "3",
      title: "Weekend Feast",
      subtitle: "20% off on family combos",
      description:
        "Perfect for family gatherings! Get 20% off on all family combo meals. Includes appetizers, main course, and desserts.",
      terms: "Valid on Saturdays and Sundays only.",
      validUntil: "Every Weekend",
      code: "WEEKEND20",
      gradient: ["#0ea5e9", "#38bdf8"],
      image: require("../assets/Dosa.jpg"),
      savings: "20% OFF",
      minOrder: "₹1,200",
    },
    {
      id: "4",
      title: "First Order Special",
      subtitle: "₹200 OFF on your first order",
      description:
        "New to our platform? Get a flat ₹200 discount on your first order. No restrictions, just pure savings!",
      terms: "Valid for first-time users only. One use per account.",
      validUntil: "Limited Time",
      code: "FIRST200",
      gradient: ["#8b5cf6", "#7c3aed"],
      image: require("../assets/Punjabi.webp"),
      savings: "₹200",
      minOrder: "₹300",
    },
    {
      id: "5",
      title: "Lunch Hour Rush",
      subtitle: "15% OFF between 12-3 PM",
      description:
        "Beat the lunch rush with great savings! Order during lunch hours and get instant 15% discount on all meals.",
      terms: "Valid from 12:00 PM to 3:00 PM daily.",
      validUntil: "Ongoing",
      code: "LUNCH15",
      gradient: ["#f59e0b", "#fbbf24"],
      image: require("../assets/Dosa.jpg"),
      savings: "15% OFF",
      minOrder: "₹400",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedDeal(expandedDeal === id ? null : id);
  };

  const copyCode = (code) => {
    // In a real app, you'd use Clipboard API
    alert(`Code "${code}" copied to clipboard!`);
  };

  const renderDealCard = ({ item }) => {
    const isExpanded = expandedDeal === item.id;

    return (
      <View style={styles.dealCardWrapper}>
        <Pressable onPress={() => toggleExpand(item.id)} style={styles.dealCard}>
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dealGradient}>
            <View style={styles.dealHeader}>
              <View style={styles.dealHeaderLeft}>
                <Image source={item.image} style={styles.dealImage} resizeMode='cover' />
                <View style={styles.dealHeaderText}>
                  <Text style={styles.dealTitle}>{item.title}</Text>
                  <Text style={styles.dealSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>{item.savings}</Text>
              </View>
            </View>

            <View style={styles.dealMeta}>
              <View style={styles.metaItem}>
                <Ionicons name='time-outline' size={16} color='rgba(255,255,255,0.9)' />
                <Text style={styles.metaText}>Valid: {item.validUntil}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name='cart-outline' size={16} color='rgba(255,255,255,0.9)' />
                <Text style={styles.metaText}>Min: {item.minOrder}</Text>
              </View>
            </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.divider} />

                <Text style={styles.descriptionLabel}>Description</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>

                <Text style={styles.termsLabel}>Terms & Conditions</Text>
                <Text style={styles.termsText}>{item.terms}</Text>

                <View style={styles.codeSection}>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>Coupon Code</Text>
                    <Text style={styles.codeText}>{item.code}</Text>
                  </View>
                  <Pressable style={styles.copyButton} onPress={() => copyCode(item.code)}>
                    <Ionicons name='copy-outline' size={18} color='white' />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </Pressable>
                </View>

                <Pressable style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply Offer</Text>
                  <Ionicons name='arrow-forward' size={18} color='white' />
                </Pressable>
              </View>
            )}

            <View style={styles.expandToggle}>
              <Text style={styles.expandToggleText}>
                {isExpanded ? "Show Less" : "View Details"}
              </Text>
              <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color='white' />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: theme.colors.brand.light }]}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.colors.brand.orange, "#ea580c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}>
            <View style={styles.headerInner}>
              <View style={styles.headerLeft}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name='arrow-back' size={24} color='white' />
                </Pressable>
                <View>
                  <Text style={styles.headerTitle}>Exclusive Deals</Text>
                  <Text style={styles.headerSubtitle}>
                    {allDeals.length} amazing offers for you
                  </Text>
                </View>
              </View>
              <View style={styles.headerIcon}>
                <Ionicons name='pricetag' size={24} color='white' />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Deals List */}
        <FlatList
          data={allDeals}
          renderItem={renderDealCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fcf8ec",
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingBottom: 24,
    paddingTop: Platform.OS === "ios" ? 12 : 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  dealCardWrapper: {
    marginBottom: 16,
  },
  dealCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  dealGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  dealHeaderLeft: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  dealImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  dealHeaderText: {
    flex: 1,
    justifyContent: "center",
  },
  dealTitle: {
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  dealSubtitle: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
  },
  savingsBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  savingsText: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.2,
  },
  dealMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  expandedContent: {
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "OpenSans",
    fontWeight: "500",
    color: "rgba(255,255,255,0.95)",
    lineHeight: 20,
    marginBottom: 16,
  },
  termsLabel: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  termsText: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
    marginBottom: 20,
  },
  codeSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  codeBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
  },
  codeLabel: {
    fontSize: 11,
    fontFamily: "OpenSans",
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codeText: {
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  copyButtonText: {
    fontSize: 13,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.2,
  },
  applyButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: 16,
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.2,
  },
  expandToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  expandToggleText: {
    fontSize: 13,
    fontFamily: "Poppins",
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.2,
  },
});
