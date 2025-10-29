// import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { Box, Divider, HStack, Icon, Pressable, ScrollView, VStack } from 'native-base';
// import React from 'react';
// import { Image, Platform, StyleSheet, Text } from 'react-native';
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
//         <HStack alignItems='center' justifyContent='space-between'>
//           <HStack alignItems='center' space={3}>
//             <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
//               <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
//             </Pressable>
//             <VStack>
//               <Text style={styles.headerTitle}>Payment Methods</Text>
//               <Text style={styles.headerSubtitle}>Manage your saved options</Text>
//             </VStack>
//           </HStack>

//           <Box style={styles.headerIconBox}>
//             <Icon as={MaterialIcons} name='credit-card' color='white' size={6} />
//           </Box>
//         </HStack>
//       </Box>

//       {/* 🔸 BODY */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 24 }}>
//         {/* ---- CARDS ---- */}
//         <VStack style={styles.section}>
//           <Text style={styles.sectionTitle}>CARDS</Text>

//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Icon as={MaterialIcons} name='credit-card' size={6} color='#374151' />
//               <Text style={styles.itemText}>Add credit or debit cards</Text>
//             </HStack>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>

//           <Divider />
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Box style={styles.pluxeeLogo}>
//                 <Text style={styles.pluxeeText}>pluxee</Text>
//               </Box>
//               <Text style={styles.itemText}>Add Pluxee</Text>
//             </HStack>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </VStack>

//         {/* ---- UPI ---- */}
//         <VStack style={styles.section}>
//           <Text style={styles.sectionTitle}>UPI</Text>

//           {/* Google Pay */}
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Image
//                 source={require('../assets/google-pay-mark.png')}
//                 style={styles.logoImage}
//                 resizeMode='contain'
//               />
//               <Text style={styles.itemText}>Google Pay UPI</Text>
//             </HStack>
//           </Pressable>

//           {/* Paytm */}
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Image
//                 source={require('../assets/Paytm-Logo.png')}
//                 style={styles.logoImage}
//                 resizeMode='contain'
//               />
//               <Text style={styles.itemText}>Paytm UPI</Text>
//             </HStack>
//           </Pressable>

//           {/* Amazon Pay */}
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Image
//                 source={require('../assets/Amazon_Pay_logo.png')}
//                 style={styles.logoImage}
//                 resizeMode='contain'
//               />
//               <Text style={styles.itemText}>Amazon Pay UPI</Text>
//             </HStack>
//           </Pressable>

//           <Divider />
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Icon as={MaterialIcons} name='add-circle-outline' size={6} color='#f97316' />
//               <Text style={styles.itemText}>Add new UPI ID</Text>
//             </HStack>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </VStack>

//         {/* ---- WALLETS ---- */}
//         <VStack style={styles.section}>
//           <Text style={styles.sectionTitle}>WALLETS</Text>

//           {/* Amazon Pay Balance */}
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Image
//                 source={require('../assets/Amazon_Pay_logo.png')}
//                 style={styles.logoImage}
//                 resizeMode='contain'
//               />
//               <Text style={styles.itemText}>Amazon Pay Balance</Text>
//             </HStack>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>

//           {/* Mobikwik */}
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Image
//                 source={require('../assets/mobikwik-logo-icon.png')}
//                 style={styles.logoImage}
//                 resizeMode='contain'
//               />
//               <Text style={styles.itemText}>Mobikwik</Text>
//             </HStack>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </VStack>

//         {/* ---- PAY LATER ---- */}
//         <VStack style={styles.section}>
//           <Text style={styles.sectionTitle}>PAY LATER</Text>

//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Image
//                 source={require('../assets/Amazon_Pay_logo.png')}
//                 style={styles.logoImage}
//                 resizeMode='contain'
//               />
//               <Text style={styles.itemText}>Amazon Pay Later</Text>
//             </HStack>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>

//           <Divider />

//           {/* LazyPay Section Fixed */}
//           <Box style={styles.paymentItemColumn}>
//             <HStack alignItems='center' space={3}>
//               <Icon as={MaterialIcons} name='play-circle-outline' size={6} color='#9ca3af' />
//               <Text style={[styles.itemText, { color: '#9ca3af' }]}>LazyPay</Text>
//             </HStack>
//             <Text style={styles.disabledText}>
//               Payment method unavailable due to restrictions from LazyPay
//             </Text>
//           </Box>
//         </VStack>

//         {/* ---- NETBANKING ---- */}
//         <VStack style={styles.section}>
//           <Text style={styles.sectionTitle}>NETBANKING</Text>
//           <Pressable style={styles.paymentItem}>
//             <HStack alignItems='center' space={3}>
//               <Icon as={FontAwesome5} name='university' size={5} color='#374151' />
//               <Text style={styles.itemText}>Netbanking</Text>
//             </HStack>
//             <Icon as={Entypo} name='plus' size={5} color='#f97316' />
//           </Pressable>
//         </VStack>

//         {/* ---- SETTINGS ---- */}
//         <VStack style={styles.section}>
//           <Text style={styles.sectionTitle}>SETTINGS</Text>
//           <Box style={styles.paymentItem}>
//             <HStack alignItems='center' justifyContent='space-between' flex={1}>
//               <HStack alignItems='center' space={3}>
//                 <Icon as={MaterialIcons} name='payments' size={5} color='#374151' />
//                 <VStack>
//                   <Text style={styles.settingLabel}>If online payment fails</Text>
//                   <Text style={styles.settingValue}>Pay on delivery</Text>
//                 </VStack>
//               </HStack>
//               <Text style={styles.enableText}>ENABLE</Text>
//             </HStack>
//           </Box>
//         </VStack>
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
//   headerInner: {
//     color: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerLeft: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 14,
//   },
//   headerBack: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
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
//   section: {
//     // backgroundColor: '#f3f4f6',
//     marginHorizontal: 12,
//     marginVertical: 6,
//     padding: 10,
//     borderRadius: 12,
//   },
//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#9ca3af',
//     marginBottom: 6,
//   },
//   paymentItem: {
//     // backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   paymentItemColumn: {
//     // backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginBottom: 6,
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
//     paddingRight: 8,
//     lineHeight: 16,
//   },
//   pluxeeLogo: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor: '#e5e7eb',
//     borderWidth: 1,
//   },
//   pluxeeText: { fontWeight: '700', color: '#111827' },
//   settingLabel: { fontSize: 13, color: '#6b7280' },
//   settingValue: { fontSize: 15, fontWeight: '600', color: '#111827' },
//   enableText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },

//   // 🔸 added for logo images
//   logoImage: {
//     width: 45,
//     height: 45,
//     borderRadius: 6,
//   },
// });

import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, Divider, HStack, Icon, Pressable, ScrollView, VStack } from 'native-base';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentMethod() {
  const navigation = useNavigation();

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
        <HStack alignItems='center' justifyContent='space-between'>
          <HStack alignItems='center' space={3}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
            </Pressable>
            <VStack>
              <Text style={styles.headerTitle}>Payment Methods</Text>
              <Text style={styles.headerSubtitle}>Manage your saved options</Text>
            </VStack>
          </HStack>

          <Box style={styles.headerIconBox}>
            <Icon as={MaterialIcons} name='credit-card' color='white' size={6} />
          </Box>
        </HStack>
      </Box>

      {/* 🔸 BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {/* ---- CARDS ---- */}
        <VStack style={styles.section}>
          <Text style={styles.sectionTitle}>CARDS</Text>

          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.iconCircle}>
                <Icon as={MaterialIcons} name='credit-card' size={5} color='#f97316' />
              </View>
              <Text style={styles.itemText}>Add credit or debit cards</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable>

          <Divider />

          {/* <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.iconCircle}>
                <Text style={styles.pluxeeText}>P</Text>
              </View>
              <Text style={styles.itemText}>Add Pluxee</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable> */}
          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/Pluxee_Logo.png')} style={styles.logo} />
              </View>
              <Text style={styles.itemText}>Add Pluxee</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable>
        </VStack>

        {/* ---- UPI ---- */}
        <VStack style={styles.section}>
          <Text style={styles.sectionTitle}>UPI</Text>

          {/* Google Pay */}
          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/google-pay-mark.png')} style={styles.logo} />
              </View>
              <Text style={styles.itemText}>Google Pay UPI</Text>
            </HStack>
          </Pressable>

          {/* Paytm */}
          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/Paytm-Logo.png')} style={styles.paytmLogo} />
              </View>
              <Text style={styles.itemText}>Paytm UPI</Text>
            </HStack>
          </Pressable>

          {/* Amazon Pay */}
          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/amazon-pay-svgrepo-com.png')}
                  // source={require('../assets/Amazon_Pay_logo.png')}
                  style={styles.amazonLogo}
                />
              </View>
              <Text style={styles.itemText}>Amazon Pay UPI</Text>
            </HStack>
          </Pressable>

          <Divider />

          {/* <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.iconCircle}>
                <Icon as={MaterialIcons} name='add-circle-outline' size={5} color='#f97316' />
              </View>
              <Text style={styles.itemText}>Add new UPI ID</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable> */}

          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/upi.png')}
                  // source={require('../assets/Amazon_Pay_logo.png')}
                  style={styles.amazonLogo}
                />
              </View>
              <Text style={styles.itemText}>Add New UPI ID</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable>
        </VStack>

        {/* ---- WALLETS ---- */}
        <VStack style={styles.section}>
          <Text style={styles.sectionTitle}>WALLETS</Text>

          {/* Amazon Pay Balance */}
          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/amazon-pay-svgrepo-com.png')}
                  style={styles.amazonLogo}
                />
              </View>
              <Text style={styles.itemText}>Amazon Pay Balance</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable>

          {/* Mobikwik */}
          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/mobikwik-logo-icon.png')} style={styles.logo} />
              </View>
              <Text style={styles.itemText}>Mobikwik</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable>
        </VStack>

        {/* ---- PAY LATER ---- */}
        <VStack style={styles.section}>
          <Text style={styles.sectionTitle}>PAY LATER</Text>

          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/amazon-pay-svgrepo-com.png')}
                  style={styles.amazonLogo}
                />
              </View>
              <Text style={styles.itemText}>Amazon Pay Later</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable>

          <Divider />

          <Box style={styles.paymentItemColumn}>
            <HStack alignItems='center' space={3}>
              <View style={[styles.iconCircle, { backgroundColor: '#f3f4f6' }]}>
                <Icon as={MaterialIcons} name='play-circle-outline' size={5} color='#9ca3af' />
              </View>
              <Text style={[styles.itemText, { color: '#9ca3af' }]}>LazyPay</Text>
            </HStack>
            <Text style={styles.disabledText}>
              Payment method unavailable due to restrictions from LazyPay
            </Text>
          </Box>
        </VStack>

        {/* ---- NETBANKING ---- */}
        <VStack style={styles.section}>
          <Text style={styles.sectionTitle}>NETBANKING</Text>
          <Pressable style={styles.paymentItem}>
            <HStack alignItems='center' space={3}>
              <View style={styles.iconCircle}>
                <Icon as={FontAwesome5} name='university' size={4} color='#f97316' />
              </View>
              <Text style={styles.itemText}>Netbanking</Text>
            </HStack>
            <Icon as={Entypo} name='plus' size={5} color='#f97316' />
          </Pressable>
        </VStack>

        {/* ---- SETTINGS ---- */}
        <VStack style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <Box style={styles.paymentItem}>
            <HStack alignItems='center' justifyContent='space-between' flex={1}>
              <HStack alignItems='center' space={3}>
                <View style={styles.iconCircle}>
                  <Icon as={MaterialIcons} name='payments' size={5} color='#f97316' />
                </View>
                <VStack>
                  <Text style={styles.settingLabel}>If online payment fails</Text>
                  <Text style={styles.settingValue}>Pay on delivery</Text>
                </VStack>
              </HStack>
              <Text style={styles.enableText}>ENABLE</Text>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
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
    color: '#fff',
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

  // SECTIONS
  section: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 10,
    borderRadius: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 8,
  },

  // ITEMS
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
  itemText: { fontSize: 15, fontWeight: '500', color: '#111827' },
  disabledText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    lineHeight: 16,
  },
  settingLabel: { fontSize: 13, color: '#6b7280' },
  settingValue: { fontSize: 15, fontWeight: '600', color: '#111827' },
  enableText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },

  // ICON + LOGO STYLES
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logo: { width: 28, height: 28, resizeMode: 'contain' },
  paytmLogo: { width: 34, height: 22, resizeMode: 'contain' },
  amazonLogo: { width: 34, height: 24, resizeMode: 'contain' },
  pluxeeText: { fontWeight: '700', color: '#f97316', fontSize: 16 },
});
