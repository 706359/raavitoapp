import { useAddress } from '@/context/AddressContext';
import { usePayment } from '@/context/PaymentContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  // SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen({ navigation }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { selectedAddress } = useAddress();
  const { selectedPayment } = usePayment();

  const handlePlaceOrder = () => {
    Alert.alert('Order Placed', 'Your order has been successfully placed!');
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

          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>₹529.8</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Delivery Fee</Text>
            <Text style={styles.freeText}>Free</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Tax</Text>
            <Text style={styles.summaryText}>₹14</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹543.8</Text>
          </View>

          <View style={styles.deliveryBox}>
            <MaterialIcons name='access-time' size={20} color='#b95a01ff' />
            <Text style={styles.deliveryText}>Estimated Delivery: 25–35 mins</Text>
          </View>
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
});
