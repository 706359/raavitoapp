import { useAddress } from '../context/AddressContext';
import { usePayment } from '../context/PaymentContext';
import { useCart } from '../context/CartContext';
import { axios_ } from '../../utils/utils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen({ navigation }) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { selectedAddress } = useAddress();
  const { selectedPayment } = usePayment();
  const { cart, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [scheduleOrder, setScheduleOrder] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(null);

  // Calculate fees
  const calculateFees = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    const deliveryFee = subtotal >= 200 ? 0 : 30;
    const serviceCharge = Math.round(subtotal * 0.05);
    const tax = Math.round((subtotal + serviceCharge) * 0.05);
    const total = subtotal + deliveryFee + serviceCharge + tax;
    
    return {
      subtotal,
      deliveryFee,
      serviceCharge,
      tax,
      total,
    };
  };

  const fees = calculateFees();

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    if (!cart || cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare order items
      const items = cart.map((item) => ({
        menuItem: item._id || item.id,
        qty: item.qty || 1,
        price: item.price,
      }));

      // Get kitchen ID from first item (assuming all items from same kitchen)
      const kitchenId = cart[0]?.kitchenId || cart[0]?.kitchen?._id || null;

      const orderData = {
        items,
        subtotal: fees.subtotal,
        total: fees.total,
        address: selectedAddress.address || selectedAddress,
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        scheduledTime: scheduleOrder && scheduledTime ? scheduledTime.toISOString() : undefined,
        paymentMode: paymentMethod === 'card' ? 'online' : paymentMethod,
        walletUsed: 0, // TODO: Get from wallet context
        couponCode: null, // TODO: Get from coupon context
        discountAmount: 0,
        kitchenId,
      };

      const { data } = await axios_.post('/orders', orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      Alert.alert('Success', 'Your order has been placed successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('OrderConfirmed', { orderId: data._id }),
        },
      ]);
    } catch (error) {
      console.error('Order error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPayment) {
      const normalized = selectedPayment.toLowerCase();
      if (['card', 'cod'].includes(normalized)) {
        setPaymentMethod(normalized);
      } else {
        setPaymentMethod('custom');
      }
    }
  }, [selectedPayment]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
              <MaterialIcons name='arrow-back' size={24} color='#fff' />
            </TouchableOpacity>

            <View>
              <Text style={styles.headerTitle}>Checkout</Text>
              <Text style={styles.headerSubtitle}>Review and confirm your order</Text>
            </View>
          </View>

          <View style={styles.headerIconBox}>
            <Icon as={MaterialIcons} name='takeout-dining' color='white' size={6} />
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Address Section */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Location</Text>

              <Text style={styles.subText}>
                {selectedAddress?.address || 'No address selected'}
              </Text>
              <Text style={styles.subText}>
                {selectedAddress?.type ? `${selectedAddress.type} Address` : 'Tap edit to add one'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ManageAddresses')}>
              <MaterialIcons name='edit' size={20} color='#9ca3af' />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.subText}>+1-567-543-222</Text>
            </View>
            <MaterialIcons name='edit' size={20} color='#9ca3af' />
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {/* Items List */}
          {cart.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>x{item.qty || 1}</Text>
              <Text style={styles.itemPrice}>₹{(item.price * (item.qty || 1)).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>₹{fees.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Service Charge (5%)</Text>
            <Text style={styles.summaryText}>₹{fees.serviceCharge.toFixed(2)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Tax (GST 5%)</Text>
            <Text style={styles.summaryText}>₹{fees.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Delivery Fee</Text>
            <Text style={fees.deliveryFee === 0 ? styles.freeText : styles.summaryText}>
              {fees.deliveryFee === 0 ? 'Free' : `₹${fees.deliveryFee.toFixed(2)}`}
            </Text>
          </View>

          {fees.subtotal < 200 && (
            <Text style={styles.freeDeliveryHint}>
              Add ₹{(200 - fees.subtotal).toFixed(2)} more for free delivery
            </Text>
          )}

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{fees.total.toFixed(2)}</Text>
          </View>

          <View style={styles.deliveryBox}>
            <MaterialIcons name='access-time' size={20} color='#b95a01ff' />
            <Text style={styles.deliveryText}>
              {scheduleOrder && scheduledTime
                ? `Scheduled for: ${scheduledTime.toLocaleString()}`
                : 'Estimated Delivery: 30–40 mins'}
            </Text>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Instructions (Optional)</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="E.g., Leave at door, Call before delivery, etc."
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
          <Text style={styles.charCount}>{deliveryInstructions.length}/200</Text>
        </View>

        {/* Schedule Order */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sectionTitle}>Schedule Order</Text>
              <Text style={styles.subText}>Order for later delivery</Text>
            </View>
            <TouchableOpacity
              onPress={() => setScheduleOrder(!scheduleOrder)}
              style={styles.toggleSwitch}>
              <View style={[styles.toggleCircle, scheduleOrder && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
          {scheduleOrder && (
            <View style={styles.scheduleOptions}>
              <TouchableOpacity
                style={styles.scheduleOption}
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(12, 0, 0, 0);
                  setScheduledTime(tomorrow);
                }}>
                <Text style={styles.scheduleOptionText}>Tomorrow, 12:00 PM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleOption}
                onPress={() => {
                  const later = new Date();
                  later.setHours(later.getHours() + 2);
                  setScheduledTime(later);
                }}>
                <Text style={styles.scheduleOptionText}>In 2 hours</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Payment Method */}

        {/* <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
              <View style={styles.changeMethod}>
                <MaterialIcons name='edit' size={18} color='#b95a01ff' />
                <Text style={styles.changeText}>Change</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 8 }}>
            <Text style={styles.paymentLabel}>
              {selectedPayment || 'No payment method selected'}
            </Text>
          </View>

          <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('card')}>
            <View style={styles.radioCircle}>
              {paymentMethod === 'card' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.paymentLabel}>Bank Card</Text>
            <MaterialIcons
              name='credit-card'
              size={22}
              color='#9ca3af'
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          <View style={styles.cardBox}>
            <View style={styles.rowAlign}>
              <Ionicons name='card-outline' size={26} color='#2563eb' />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.cardBank}>Capital One Bank</Text>
                <Text style={styles.cardDetails}>**** 8765 • 08/25</Text>
              </View>
              <View style={{ marginLeft: 'auto' }}>
                <View style={styles.radioCircle}>
                  {paymentMethod === 'card' && <View style={styles.radioDot} />}
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.addCardRow}>
              <MaterialIcons name='add' size={18} color='#b95a01ff' />
              <Text style={styles.addCard}>Add New Card</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.paymentOption, { marginTop: 20 }]}
            onPress={() => setPaymentMethod('cod')}>
            <View style={styles.radioCircle}>
              {paymentMethod === 'cod' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.paymentLabel}>Cash on Delivery</Text>
            <Ionicons
              name='cash-outline'
              size={24}
              color='#9ca3af'
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </View> */}
        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
              <View style={styles.changeMethod}>
                <MaterialIcons name='edit' size={18} color='#b95a01ff' />
                <Text style={styles.changeText}>Change</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Selected Payment (like Paytm, GPay, etc.) */}
          {selectedPayment && (
            <TouchableOpacity
              style={[styles.paymentOption, { marginTop: 10 }]}
              onPress={() => {
                setPaymentMethod('custom');
              }}>
              <View style={styles.radioCircle}>
                {paymentMethod === 'custom' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.paymentLabel}>{selectedPayment}</Text>
            </TouchableOpacity>
          )}

          {/* Bank Card Option */}
          <TouchableOpacity
            style={[styles.paymentOption, { marginTop: 16 }]}
            onPress={() => {
              setPaymentMethod('card');
            }}>
            <View style={styles.radioCircle}>
              {paymentMethod === 'card' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.paymentLabel}>Bank Card</Text>
            <MaterialIcons
              name='credit-card'
              size={22}
              color='#9ca3af'
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          {paymentMethod === 'card' && (
            <View style={styles.cardBox}>
              <View style={styles.rowAlign}>
                <Ionicons name='card-outline' size={26} color='#2563eb' />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardBank}>Capital One Bank</Text>
                  <Text style={styles.cardDetails}>**** 8765 • 08/25</Text>
                </View>
                <View style={{ marginLeft: 'auto' }}>
                  <View style={styles.radioCircle}>
                    {paymentMethod === 'card' && <View style={styles.radioDot} />}
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.addCardRow}>
                <MaterialIcons name='add' size={18} color='#b95a01ff' />
                <Text style={styles.addCard}>Add New Card</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cash on Delivery */}
          <TouchableOpacity
            style={[styles.paymentOption, { marginTop: 20 }]}
            onPress={() => {
              setPaymentMethod('cod');
            }}>
            <View style={styles.radioCircle}>
              {paymentMethod === 'cod' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.paymentLabel}>Cash on Delivery</Text>
            <Ionicons
              name='cash-outline'
              size={24}
              color='#9ca3af'
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Ionicons name='bag-handle-outline' size={22} color='#fff' style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },

  headerBox: {
    marginBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF7A00',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  headerBack: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginTop: 2,
  },
  headerIconBox: {
    padding: 10,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
  },

  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  // rowBetween: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 4, // ✅ small safe padding
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    marginVertical: 12,
  },
  label: { fontWeight: '700', fontSize: 14, color: '#111827' },
  subText: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  summaryText: { color: '#374151', fontSize: 14, marginVertical: 3 },
  freeText: { color: '#16a34a', fontSize: 14, marginVertical: 3 },
  totalLabel: { fontWeight: '700', fontSize: 16 },
  totalAmount: { fontWeight: '700', fontSize: 16 },
  deliveryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  deliveryText: { color: '#b95a01ff', fontSize: 13, marginLeft: 5 },

  paymentOption: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  paymentLabel: { fontSize: 14, color: '#111827', marginLeft: 10 },
  cardBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  cardBank: { fontWeight: '600', fontSize: 14 },
  cardDetails: { color: '#6b7280', fontSize: 12 },
  addCardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  addCard: { color: '#b95a01ff', fontWeight: '600', marginLeft: 5 },

  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#b95a01ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#b95a01ff',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 9999,
    paddingVertical: 14,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  changeMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: '#b95a01ff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  itemQty: {
    fontSize: 13,
    color: '#6b7280',
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  freeDeliveryHint: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
    fontStyle: 'italic',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#b95a01ff',
  },
  scheduleOptions: {
    marginTop: 12,
    gap: 8,
  },
  scheduleOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  scheduleOptionText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});
