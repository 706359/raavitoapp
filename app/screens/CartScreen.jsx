import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Tag,
  Trash2,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample menu items
export const raavitoMenu = [
  {
    id: 1,
    name: "South Indian Dosa Thali",
    desc: "Crispy dosa with sambar, coconut chutney, and mini idlis — a true southern delight.",
    price: 149,
    image: require("../assets/Dosa.jpg"),
    category: "Dosa Thali",
    rating: 4.7,
    veg: true,
  },
  {
    id: 2,
    name: "Gujarati Thali Special",
    desc: "Rotli, dal, rice, shaak, farsan, sweet, and chaas — complete comfort in one plate.",
    price: 179,
    image: require("../assets/Gujarati.jpeg"),
    category: "Gujarati Thali",
    rating: 4.8,
    veg: true,
  },
  {
    id: 3,
    name: "Rajasthani Thali Royal",
    desc: "Dal baati churma, gatte ki sabzi, ker sangri, and more — rich and hearty flavors.",
    price: 199,
    image: require("../assets/Rajasthani.jpg"),
    category: "Rajasthani Thali",
    rating: 4.9,
    veg: true,
  },
  {
    id: 4,
    name: "Punjabi Thali Feast",
    desc: "Butter naan, paneer butter masala, dal makhani, rice, and salad — bold & flavorful.",
    price: 189,
    image: require("../assets/Punjabi.webp"),
    category: "Punjabi Thali",
    rating: 4.8,
    veg: true,
  },
];
export default function PremiumCartScreen({ navigation, route }) {
  // accept kitchen details via route.params.kitchen = { name, menu }
  const kitchen = route?.params?.kitchen ?? { name: "Kitchen", menu: raavitoMenu };
  const kitchenMenu = Array.isArray(kitchen.menu) ? kitchen.menu : raavitoMenu;

  const [cart, setCart] = useState(kitchenMenu.map((item) => ({ ...item, qty: 1, note: "" })));
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("SAVE10");
  const [appliedCoupon, setAppliedCoupon] = useState(true);

  const couponDiscount = appliedCoupon ? 10 : 0;
  const walletBalance = 750;
  const storeCharge = 10;
  const deliveryFee = 0;

  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateItemNote = (id, note) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, note } : item)));
  };

  const itemTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const grandTotal = itemTotal + storeCharge + deliveryFee - couponDiscount;
  const walletUsed = Math.min(walletBalance, grandTotal);
  const amountToPay = Math.max(grandTotal - walletUsed, 0);

  const deliveryAddress = "123, Ashwini Kumar Rd, Khand Bazar, Varachha, Surat, Gujarat 395006";

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='dark-content' />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <ShoppingCart size={64} color='#fff' />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious items to start your order. Great deals await!
          </Text>
          <TouchableOpacity style={styles.shopButton}>
            <Store size={20} color='#fff' />
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />

      {/* <Text style={styles.headerTitle}>{kitchenName} - Cart</Text> */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <ChevronLeft size={24} color='#000' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cart.length} items</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {cart.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemContent}>
              <View style={styles.itemImageContainer}>
                <Image source={item.image} style={styles.itemImage} resizeMode='cover' />
              </View>
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDesc} numberOfLines={2}>
                      {item.desc}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
                    <Trash2 size={20} color='#b95a01ff' />
                  </TouchableOpacity>
                </View>

                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>

                  <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => decreaseQty(item.id)}>
                      <Minus size={16} color='#b95a01ff' />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => increaseQty(item.id)}>
                      <Plus size={16} color='#b95a01ff' />
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  style={styles.noteInput}
                  placeholder='Add a note for this item...'
                  value={item.note}
                  onChangeText={(text) => updateItemNote(item.id, text)}
                  placeholderTextColor='#9ca3af'
                />

                <View style={styles.subtotalRow}>
                  <Text style={styles.subtotalLabel}>Subtotal: </Text>
                  <Text style={styles.subtotalValue}>₹{(item.price * item.qty).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Coupon Card */}
        <View style={[styles.couponCard, appliedCoupon && styles.couponCardActive]}>
          {appliedCoupon ? (
            <View style={styles.couponContent}>
              <View style={styles.couponLeft}>
                <View style={styles.couponIconActive}>
                  <Tag size={24} color='#fff' />
                </View>
                <View>
                  <Text style={styles.couponTitle}>Coupon Applied!</Text>
                  <Text style={styles.couponCode}>Code: {couponCode}</Text>
                </View>
              </View>
              <View style={styles.couponRight}>
                <Text style={styles.couponDiscount}>-₹{couponDiscount}</Text>
                <TouchableOpacity onPress={() => setAppliedCoupon(false)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <TouchableOpacity
                style={styles.couponButton}
                onPress={() => setShowCouponInput(!showCouponInput)}>
                <Tag size={20} color='#ea580c' />
                <Text style={styles.couponButtonText}>Apply Coupon Code</Text>
                {showCouponInput ? (
                  <ChevronUp size={16} color='#ea580c' />
                ) : (
                  <ChevronDown size={16} color='#ea580c' />
                )}
              </TouchableOpacity>
              {showCouponInput && (
                <View style={styles.couponInputRow}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder='Enter coupon code'
                    value={couponCode}
                    onChangeText={setCouponCode}
                    placeholderTextColor='#9ca3af'
                  />
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => {
                      setAppliedCoupon(true);
                      setShowCouponInput(false);
                    }}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletContent}>
            <View style={styles.walletLeft}>
              <View style={styles.walletIcon}>
                <Wallet size={24} color='#fff' />
              </View>
              <View>
                <Text style={styles.walletTitle}>Wallet</Text>
                <Text style={styles.walletBalance}>Balance: ₹{walletBalance.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.walletRight}>
              <Text style={styles.walletLabel}>Using</Text>
              <Text style={styles.walletUsed}>₹{walletUsed.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Address Card */}
        <View style={styles.addressCard}>
          <View style={styles.addressContent}>
            <View style={styles.addressIcon}>
              <MapPin size={24} color='#2563eb' />
            </View>
            <View style={styles.addressDetails}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressTitle}>Delivery Address</Text>
                <TouchableOpacity>
                  <Text style={styles.changeButton}>Change</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.addressText}>{deliveryAddress}</Text>
            </View>
          </View>
        </View>

        {/* Bill Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Summary</Text>
          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Total</Text>
            <Text style={styles.summaryValue}>₹{itemTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValueGreen}>
              {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Store Charge</Text>
            <Text style={styles.summaryValue}>₹{storeCharge.toFixed(2)}</Text>
          </View>
          {appliedCoupon && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelGreen}>Coupon Discount</Text>
              <Text style={styles.summaryValueGreen}>-₹{couponDiscount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelOrange}>Wallet Used</Text>
            <Text style={styles.summaryValueOrange}>-₹{walletUsed.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryTotalDivider} />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total Payable</Text>
            <Text style={styles.summaryTotalValue}>₹{amountToPay.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>Total Amount</Text>
            <Text style={styles.footerTotal}>₹{amountToPay.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={() => alert("Payment initiated!")}>
            <Text style={styles.payButtonText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footerNote}>
          By proceeding, you agree to our terms. Free delivery on orders above ₹120.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef3e2",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyIconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#fb923c",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#fb923c",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  shopButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#b95a01ff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#fb923c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ea580c",
  },
  badge: {
    backgroundColor: "#fed7aa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: "#c2410c",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 220,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  itemContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  itemImageContainer: {
    width: 96,
    height: 96,
    backgroundColor: "#fed7aa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemEmoji: {
    fontSize: 48,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
  },
  itemPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ea580c",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 24,
    padding: 4,
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  qtyText: {
    width: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1f2937",
  },
  noteInput: {
    width: "100%",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    color: "#1f2937",
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  subtotalLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  subtotalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  couponCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  couponCardActive: {
    backgroundColor: "#ecfdf5",
    borderWidth: 2,
    borderColor: "#86efac",
  },
  couponContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  couponLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  couponIconActive: {
    width: 48,
    height: 48,
    backgroundColor: "#22c55e",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 4,
  },
  couponCode: {
    fontSize: 14,
    color: "#16a34a",
  },
  couponRight: {
    alignItems: "flex-end",
  },
  couponDiscount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 4,
  },
  removeButton: {
    fontSize: 12,
    color: "#dc2626",
    textDecorationLine: "underline",
  },
  couponButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  couponButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ea580c",
    flex: 1,
  },
  couponInputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  couponInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    fontSize: 14,
    color: "#1f2937",
  },
  applyButton: {
    backgroundColor: "#ea580c",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  walletCard: {
    backgroundColor: "#fed7aa",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fdba74",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  walletContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  walletIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#fb923c",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 14,
    color: "#6b7280",
  },
  walletRight: {
    alignItems: "flex-end",
  },
  walletLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  walletUsed: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ea580c",
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  addressContent: {
    flexDirection: "row",
    gap: 12,
  },
  addressIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#dbeafe",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  addressDetails: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  changeButton: {
    fontSize: 14,
    color: "#ea580c",
    fontWeight: "600",
  },
  addressText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#4b5563",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  summaryLabelGreen: {
    fontSize: 14,
    color: "#16a34a",
  },
  summaryValueGreen: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16a34a",
  },
  summaryLabelOrange: {
    fontSize: 14,
    color: "#ea580c",
  },
  summaryValueOrange: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ea580c",
  },
  summaryTotalDivider: {
    height: 2,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  summaryTotalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ea580c",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  footerTotal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ea580c",
  },
  payButton: {
    backgroundColor: "#fb923c",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#fb923c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerNote: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 16,
  },
});
