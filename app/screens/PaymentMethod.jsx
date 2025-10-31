// import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { Box, Divider, Icon, Pressable, ScrollView } from 'native-base';
// import React from 'react';
// import { Image, Platform, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function PaymentMethod() {
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* 🔸 HEADER */}
//       <Box
//         style={styles.headerBox}
//         bg={{
//           linearGradient: {
//             colors: ['#f97316', '#ea580c', '#c2410c'],
//             start: [0, 0],
//             end: [1, 1],
//           },
//         }}>
//         <View style={styles.headerContainer}>
//           <View style={styles.headerLeftContainer}>
//             <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
//               <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
//             </Pressable>
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.headerTitle}>Payment Methods</Text>
//               <Text style={styles.headerSubtitle}>Manage your saved options</Text>
//             </View>
//           </View>

//           <View style={styles.headerIconBox}>
//             <Icon as={MaterialIcons} name='credit-card' color='white' size={6} />
//           </View>
//         </View>
//       </Box>

//       {/* 🔸 BODY */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 24 }}>
//         {/* ---- CARDS ---- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>CARDS</Text>

//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.iconCircle}>
//                 <Icon as={MaterialIcons} name='credit-card' size={5} color='#f97316' />
//               </View>
//               <Text style={styles.itemText}>Add credit or debit cards</Text>
//             </View>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>

//           <Divider />

//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image source={require('../assets/Pluxee_Logo.png')} style={styles.logo} />
//               </View>
//               <Text style={styles.itemText}>Add Pluxee</Text>
//             </View>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </View>

//         {/* ---- UPI ---- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>UPI</Text>

//           {/* Google Pay */}
//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image source={require('../assets/google-pay-mark.png')} style={styles.logo} />
//               </View>
//               <Text style={styles.itemText}>Google Pay UPI</Text>
//             </View>
//           </Pressable>

//           {/* Paytm */}
//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image source={require('../assets/Paytm-Logo.png')} style={styles.paytmLogo} />
//               </View>
//               <Text style={styles.itemText}>Paytm UPI</Text>
//             </View>
//           </Pressable>

//           {/* Amazon Pay */}
//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image
//                   source={require('../assets/amazon-pay-svgrepo-com.png')}
//                   style={styles.amazonLogo}
//                 />
//               </View>
//               <Text style={styles.itemText}>Amazon Pay UPI</Text>
//             </View>
//           </Pressable>

//           <Divider />

//           {/* Add new UPI */}
//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image source={require('../assets/upi.png')} style={styles.amazonLogo} />
//               </View>
//               <Text style={styles.itemText}>Add New UPI ID</Text>
//             </View>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </View>

//         {/* ---- WALLETS ---- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>WALLETS</Text>

//           {/* Amazon Pay Balance */}
//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image
//                   source={require('../assets/amazon-pay-svgrepo-com.png')}
//                   style={styles.amazonLogo}
//                 />
//               </View>
//               <Text style={styles.itemText}>Amazon Pay Balance</Text>
//             </View>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>

//           {/* Mobikwik */}
//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image source={require('../assets/mobikwik-logo-icon.png')} style={styles.logo} />
//               </View>
//               <Text style={styles.itemText}>Mobikwik</Text>
//             </View>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </View>

//         {/* ---- PAY LATER ---- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>PAY LATER</Text>

//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.logoCircle}>
//                 <Image
//                   source={require('../assets/amazon-pay-svgrepo-com.png')}
//                   style={styles.amazonLogo}
//                 />
//               </View>
//               <Text style={styles.itemText}>Amazon Pay Later</Text>
//             </View>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>

//           <Divider />

//           <View style={styles.paymentItemColumn}>
//             <View style={styles.row}>
//               <View style={[styles.iconCircle, { backgroundColor: '#f3f4f6' }]}>
//                 <Icon as={MaterialIcons} name='play-circle-outline' size={5} color='#9ca3af' />
//               </View>
//               <Text style={[styles.itemText, { color: '#9ca3af' }]}>LazyPay</Text>
//             </View>
//             <Text style={styles.disabledText}>
//               Payment method unavailable due to restrictions from LazyPay
//             </Text>
//           </View>
//         </View>

//         {/* ---- NETBANKING ---- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>NETBANKING</Text>
//           <Pressable style={styles.paymentItem}>
//             <View style={styles.row}>
//               <View style={styles.iconCircle}>
//                 <Icon as={FontAwesome5} name='university' size={4} color='#f97316' />
//               </View>
//               <Text style={styles.itemText}>Netbanking</Text>
//             </View>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </View>

//         {/* ---- SETTINGS ---- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>SETTINGS</Text>
//           <View style={styles.paymentItem}>
//             <View style={styles.settingRow}>
//               <View style={styles.row}>
//                 <View style={styles.iconCircle}>
//                   <Icon as={MaterialIcons} name='payments' size={5} color='#f97316' />
//                 </View>
//                 <View>
//                   <Text style={styles.settingLabel}>If online payment fails</Text>
//                   <Text style={styles.settingValue}>Pay on delivery</Text>
//                 </View>
//               </View>
//               <Text style={styles.enableText}>ENABLE</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   headerBox: {
//     marginBottom: 10,
//     paddingTop: Platform.OS === 'ios' ? 12 : 16,
//     paddingBottom: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#FF7A00',
//     borderBottomRightRadius: 20,
//     borderBottomLeftRadius: 20,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerLeftContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTextContainer: {
//     marginLeft: 12,
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '700',
//     fontFamily: 'Poppins',
//   },
//   headerSubtitle: {
//     color: '#fff',
//     fontSize: 12,
//     fontFamily: 'OpenSans',
//     marginTop: 2,
//   },
//   headerIconBox: {
//     padding: 10,
//     borderRadius: 12,
//     borderColor: '#fff',
//     borderWidth: 1,
//   },
//   backBtn: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   section: {
//     marginHorizontal: 12,
//     marginVertical: 8,
//     padding: 10,
//     borderRadius: 14,
//   },
//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#9ca3af',
//     marginBottom: 8,
//   },
//   paymentItem: {
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   paymentItemColumn: {
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginBottom: 6,
//     backgroundColor: '#fff',
//     elevation: 1,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   settingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flex: 1,
//   },
//   itemText: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   disabledText: {
//     fontSize: 12,
//     color: '#ef4444',
//     marginTop: 6,
//     lineHeight: 16,
//   },
//   settingLabel: { fontSize: 13, color: '#6b7280' },
//   settingValue: { fontSize: 15, fontWeight: '600', color: '#111827' },
//   enableText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
//   iconCircle: {
//     width: 42,
//     height: 42,
//     borderRadius: 50,
//     backgroundColor: '#fff7ed',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   logoCircle: {
//     width: 42,
//     height: 42,
//     borderRadius: 50,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#f3f4f6',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   logo: { width: 28, height: 28, resizeMode: 'contain' },
//   paytmLogo: { width: 34, height: 22, resizeMode: 'contain' },
//   amazonLogo: { width: 34, height: 24, resizeMode: 'contain' },
// });

import { usePayment } from '@/context/PaymentContext'; // ✅ make sure you have this context
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, Divider, Icon, Pressable, ScrollView } from 'native-base';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentMethod() {
  const navigation = useNavigation();
  const { selectedPayment, setSelectedPayment } = usePayment();

  const handleSelect = (method) => {
    setSelectedPayment(method);
    navigation.goBack();
  };

  const renderRadio = (method) => (
    <View style={styles.radioCircle}>
      {selectedPayment === method && <View style={styles.radioDot} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔸 HEADER */}
      <Box
        style={styles.headerBox}
        bg={{
          linearGradient: {
            colors: ['#f97316', '#ea580c', '#c2410c'],
            start: [0, 0],
            end: [1, 1],
          },
        }}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeftContainer}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
            </Pressable>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Payment Methods</Text>
              <Text style={styles.headerSubtitle}>Manage your saved options</Text>
            </View>
          </View>

          <View style={styles.headerIconBox}>
            <Icon as={MaterialIcons} name='credit-card' color='white' size={6} />
          </View>
        </View>
      </Box>

      {/* 🔸 BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {/* ---- CARDS ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CARDS</Text>

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Credit / Debit Card')}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Icon as={MaterialIcons} name='credit-card' size={5} color='#f97316' />
              </View>
              <Text style={styles.itemText}>Add credit or debit cards</Text>
            </View>
            {renderRadio('Credit / Debit Card')}
          </Pressable>

          <Divider />

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Pluxee')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/Pluxee_Logo.png')} style={styles.logo} />
              </View>
              <Text style={styles.itemText}>Pluxee</Text>
            </View>
            {renderRadio('Pluxee')}
          </Pressable>
        </View>

        {/* ---- UPI ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPI</Text>

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Google Pay UPI')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/google-pay-mark.png')} style={styles.logo} />
              </View>
              <Text style={styles.itemText}>Google Pay UPI</Text>
            </View>
            {renderRadio('Google Pay UPI')}
          </Pressable>

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Paytm UPI')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/Paytm-Logo.png')} style={styles.paytmLogo} />
              </View>
              <Text style={styles.itemText}>Paytm UPI</Text>
            </View>
            {renderRadio('Paytm UPI')}
          </Pressable>

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Amazon Pay UPI')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/amazon-pay-svgrepo-com.png')}
                  style={styles.amazonLogo}
                />
              </View>
              <Text style={styles.itemText}>Amazon Pay UPI</Text>
            </View>
            {renderRadio('Amazon Pay UPI')}
          </Pressable>

          <Divider />

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('New UPI ID')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/upi.png')} style={styles.amazonLogo} />
              </View>
              <Text style={styles.itemText}>Add New UPI ID</Text>
            </View>
            {renderRadio('New UPI ID')}
          </Pressable>
        </View>

        {/* ---- WALLETS ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WALLETS</Text>

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Amazon Pay Balance')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/amazon-pay-svgrepo-com.png')}
                  style={styles.amazonLogo}
                />
              </View>
              <Text style={styles.itemText}>Amazon Pay Balance</Text>
            </View>
            {renderRadio('Amazon Pay Balance')}
          </Pressable>

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Mobikwik')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/mobikwik-logo-icon.png')} style={styles.logo} />
              </View>
              <Text style={styles.itemText}>Mobikwik</Text>
            </View>
            {renderRadio('Mobikwik')}
          </Pressable>
        </View>

        {/* ---- PAY LATER ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAY LATER</Text>

          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Amazon Pay Later')}>
            <View style={styles.row}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/amazon-pay-svgrepo-com.png')}
                  style={styles.amazonLogo}
                />
              </View>
              <Text style={styles.itemText}>Amazon Pay Later</Text>
            </View>
            {renderRadio('Amazon Pay Later')}
          </Pressable>

          <Divider />

          <View style={styles.paymentItemColumn}>
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: '#f3f4f6' }]}>
                <Icon as={MaterialIcons} name='play-circle-outline' size={5} color='#9ca3af' />
              </View>
              <Text style={[styles.itemText, { color: '#9ca3af' }]}>LazyPay</Text>
            </View>
            <Text style={styles.disabledText}>
              Payment method unavailable due to restrictions from LazyPay
            </Text>
          </View>
        </View>

        {/* ---- NETBANKING ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NETBANKING</Text>
          <Pressable style={styles.paymentItem} onPress={() => handleSelect('Netbanking')}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Icon as={FontAwesome5} name='university' size={4} color='#f97316' />
              </View>
              <Text style={styles.itemText}>Netbanking</Text>
            </View>
            {renderRadio('Netbanking')}
          </Pressable>
        </View>

        {/* ---- SETTINGS ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.paymentItem}>
            <View style={styles.settingRow}>
              <View style={styles.row}>
                <View style={styles.iconCircle}>
                  <Icon as={MaterialIcons} name='payments' size={5} color='#f97316' />
                </View>
                <View>
                  <Text style={styles.settingLabel}>If online payment fails</Text>
                  <Text style={styles.settingValue}>Pay on delivery</Text>
                </View>
              </View>
              <Text style={styles.enableText}>ENABLE</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 💅 Styles
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTextContainer: { marginLeft: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700', fontFamily: 'Poppins' },
  headerSubtitle: { color: '#fff', fontSize: 12, fontFamily: 'OpenSans', marginTop: 2 },
  headerIconBox: { padding: 10, borderRadius: 12, borderColor: '#fff', borderWidth: 1 },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  section: { marginHorizontal: 12, marginVertical: 8, padding: 10, borderRadius: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#9ca3af', marginBottom: 8 },
  paymentItem: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  paymentItemColumn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    backgroundColor: '#fff',
    elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  itemText: { fontSize: 15, fontWeight: '500', color: '#111827' },
  disabledText: { fontSize: 12, color: '#ef4444', marginTop: 6, lineHeight: 16 },
  settingLabel: { fontSize: 13, color: '#6b7280' },
  settingValue: { fontSize: 15, fontWeight: '600', color: '#111827' },
  enableText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  logo: { width: 28, height: 28, resizeMode: 'contain' },
  paytmLogo: { width: 34, height: 22, resizeMode: 'contain' },
  amazonLogo: { width: 34, height: 24, resizeMode: 'contain' },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f97316' },
});
