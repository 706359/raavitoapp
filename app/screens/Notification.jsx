// import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { Box, HStack, Icon, ScrollView, Switch, VStack } from 'native-base';
// import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function NotificationPreferences() {
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Header */}
//       <Box
//         style={styles.headerBox}
//         bg={{
//           linearGradient: {
//             colors: ['#f97316', '#ea580c', '#c2410c'],
//             start: [0, 0],
//             end: [1, 1],
//           },
//         }}>
//         <HStack style={styles.headerInner}>
//           <HStack style={styles.headerLeft}>
//             <Pressable
//               onPress={() => navigation.goBack()}
//               style={styles.headerBack}
//               accessibilityRole='button'
//               accessibilityLabel='Go back'>
//               <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
//             </Pressable>

//             <VStack>
//               <Text style={styles.headerTitle}>Notifications</Text>
//               <Text style={styles.headerSubtitle}>Manage Your Notifications</Text>
//             </VStack>
//           </HStack>

//           <Box style={styles.headerIconBox}>
//             <Icon as={MaterialIcons} name='notifications' color='white' size={6} />
//           </Box>
//         </HStack>
//       </Box>

//       {/* Body */}
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 120 }}>
//         {/* Push Notifications */}
//         <View style={styles.section}>
//           <HStack style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Push Notifications</Text>
//             <View style={styles.switchContainer}>
//               <Text style={styles.switchLabelOff}>OFF</Text>
//             </View>
//           </HStack>
//           <Text style={styles.sectionSubtitle}>Tap to enable notifications</Text>
//         </View>

//         <View style={styles.divider} />

//         {/* Enable all */}
//         <View style={styles.section}>
//           <HStack style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Enable all</Text>
//             <Switch size='md' onTrackColor='#ea580c' />
//           </HStack>
//           <Text style={styles.sectionSubtitle}>Activate all notifications</Text>
//         </View>

//         <View style={styles.divider} />

//         {/* Promos and offers */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Promos and offers</Text>
//           <Text style={styles.sectionSubtitle}>
//             Receive updates about coupons, promotions and money-saving offers
//           </Text>
//           <HStack style={styles.optionRow}>
//             <HStack style={styles.iconLabel}>
//               <Icon as={MaterialIcons} name='notifications-none' size={5} color='#111827' />
//               <Text style={styles.optionText}>Push</Text>
//             </HStack>
//             <Switch size='md' onTrackColor='#ea580c' />
//           </HStack>
//           <HStack style={styles.optionRow}>
//             <HStack style={styles.iconLabel}>
//               {/* <Icon as={MaterialIcons} name='whatsapp' size={5} color='#25D366' /> */}
//               <Icon as={FontAwesome} name='whatsapp' size={5} color='#25D366' />
//               <Text style={styles.optionText}>WhatsApp</Text>
//             </HStack>
//             <Switch size='md' onTrackColor='#ea580c' />
//           </HStack>
//         </View>

//         <View style={styles.divider} />

//         {/* Social notifications */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Social notifications</Text>
//           <Text style={styles.sectionSubtitle}>
//             Get notified when someone follows your profile, or when you get likes and comments on
//             reviews and photos posted by you
//           </Text>
//           <HStack style={styles.optionRow}>
//             <HStack style={styles.iconLabel}>
//               <Icon as={MaterialIcons} name='notifications-none' size={5} color='#111827' />
//               <Text style={styles.optionText}>Push</Text>
//             </HStack>
//             <Switch size='md' onTrackColor='#ea580c' />
//           </HStack>
//           <HStack style={styles.optionRow}>
//             <HStack style={styles.iconLabel}>
//               {/* <Icon as={MaterialIcons} name='whatsapp' size={5} color='#25D366' /> */}
//               <Icon as={FontAwesome} name='whatsapp' size={5} color='#25D366' />
//               <Text style={styles.optionText}>WhatsApp</Text>
//             </HStack>
//             <Switch size='md' onTrackColor='#ea580c' />
//           </HStack>
//         </View>

//         <View style={styles.divider} />

//         {/* Orders and purchases */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Orders and purchases</Text>
//           <Text style={styles.sectionSubtitle}>
//             Receive updates related to your order status, memberships, table bookings and more
//           </Text>
//           <HStack style={styles.optionRow}>
//             <HStack style={styles.iconLabel}>
//               <Icon as={MaterialIcons} name='notifications-none' size={5} color='#111827' />
//               <Text style={styles.optionText}>Push</Text>
//             </HStack>
//             <Switch size='md' onTrackColor='#ea580c' />
//           </HStack>
//           <HStack style={styles.optionRow}>
//             <HStack style={styles.iconLabel}>
//               {/* <Icon as={MaterialIcons} name='whatsapp' size={5} color='#25D366' /> */}
//               <Icon as={FontAwesome} name='whatsapp' size={5} color='#25D366' />

//               <Text style={styles.optionText}>WhatsApp</Text>
//             </HStack>
//             <Switch size='md' onTrackColor='#ea580c' />
//           </HStack>
//         </View>
//       </ScrollView>

//       {/* Save Button */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.saveButton}>
//           <Text style={styles.saveButtonText}>Save changes</Text>
//         </TouchableOpacity>
//       </View>
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
//   scrollView: {
//     paddingHorizontal: 20,
//     paddingTop: 10,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//     fontFamily: 'Poppins',
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#6b7280',
//     fontFamily: 'OpenSans',
//     marginTop: 4,
//     lineHeight: 18,
//   },
//   switchContainer: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 6,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//   },
//   switchLabelOff: {
//     fontSize: 12,
//     color: '#6b7280',
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 6,
//   },
//   optionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   iconLabel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   optionText: {
//     fontSize: 14,
//     color: '#111827',
//     fontFamily: 'Poppins',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#f9fafb',
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     padding: 16,
//   },
//   saveButton: {
//     backgroundColor: '#ea580c',
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   saveButtonText: {
//     textAlign: 'center',
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//     fontFamily: 'Poppins',
//   },
// });

import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Icon, ScrollView, Switch, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationPreferences() {
  const navigation = useNavigation();

  // ✅ Notification states
  const [enableAll, setEnableAll] = useState(false);
  const [promosPush, setPromosPush] = useState(false);
  const [promosWhatsApp, setPromosWhatsApp] = useState(false);
  const [socialPush, setSocialPush] = useState(false);
  const [socialWhatsApp, setSocialWhatsApp] = useState(false);
  const [ordersPush, setOrdersPush] = useState(false);
  const [ordersWhatsApp, setOrdersWhatsApp] = useState(false);

  // ✅ Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem('notificationPreferences');
        if (saved) {
          const data = JSON.parse(saved);
          setEnableAll(data.enableAll);
          setPromosPush(data.promosPush);
          setPromosWhatsApp(data.promosWhatsApp);
          setSocialPush(data.socialPush);
          setSocialWhatsApp(data.socialWhatsApp);
          setOrdersPush(data.ordersPush);
          setOrdersWhatsApp(data.ordersWhatsApp);
        }
      } catch (e) {
        console.log('Error loading notification prefs:', e);
      }
    };
    loadPreferences();
  }, []);

  // ✅ Handle enable all
  const handleEnableAll = (value) => {
    setEnableAll(value);
    setPromosPush(value);
    setPromosWhatsApp(value);
    setSocialPush(value);
    setSocialWhatsApp(value);
    setOrdersPush(value);
    setOrdersWhatsApp(value);
  };

  // ✅ Save all preferences
  const savePreferences = async () => {
    try {
      const preferences = {
        enableAll,
        promosPush,
        promosWhatsApp,
        socialPush,
        socialWhatsApp,
        ordersPush,
        ordersWhatsApp,
      };
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(preferences));
      alert('✅ Preferences saved successfully!');
    } catch (e) {
      console.log('Error saving prefs:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Box
        style={styles.headerBox}
        bg={{
          linearGradient: {
            colors: ['#f97316', '#ea580c', '#c2410c'],
            start: [0, 0],
            end: [1, 1],
          },
        }}>
        <HStack style={styles.headerInner}>
          <HStack style={styles.headerLeft}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.headerBack}
              accessibilityRole='button'
              accessibilityLabel='Go back'>
              <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
            </Pressable>

            <VStack>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSubtitle}>Manage Your Notifications</Text>
            </VStack>
          </HStack>

          <Box style={styles.headerIconBox}>
            <Icon as={MaterialIcons} name='notifications' color='white' size={6} />
          </Box>
        </HStack>
      </Box>

      {/* Body */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Push Notifications */}
        <View style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabelOff}>OFF</Text>
            </View>
          </HStack>
          <Text style={styles.sectionSubtitle}>Tap to enable notifications</Text>
        </View>

        <View style={styles.divider} />

        {/* Enable all */}
        <View style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Enable all</Text>
            <Switch
              size='md'
              onTrackColor='#ea580c'
              isChecked={enableAll}
              onToggle={handleEnableAll}
            />
          </HStack>
          <Text style={styles.sectionSubtitle}>Activate all notifications</Text>
        </View>

        <View style={styles.divider} />

        {/* Promos and offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promos and offers</Text>
          <Text style={styles.sectionSubtitle}>
            Receive updates about coupons, promotions and money-saving offers
          </Text>
          <HStack style={styles.optionRow}>
            <HStack style={styles.iconLabel}>
              <Icon as={MaterialIcons} name='notifications-none' size={5} color='#111827' />
              <Text style={styles.optionText}>Push</Text>
            </HStack>
            <Switch
              size='md'
              onTrackColor='#ea580c'
              isChecked={promosPush}
              onToggle={setPromosPush}
            />
          </HStack>
          <HStack style={styles.optionRow}>
            <HStack style={styles.iconLabel}>
              <Icon as={FontAwesome} name='whatsapp' size={5} color='#25D366' />
              <Text style={styles.optionText}>WhatsApp</Text>
            </HStack>
            <Switch
              size='md'
              onTrackColor='#ea580c'
              isChecked={promosWhatsApp}
              onToggle={setPromosWhatsApp}
            />
          </HStack>
        </View>

        <View style={styles.divider} />

        {/* Social notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social notifications</Text>
          <Text style={styles.sectionSubtitle}>
            Get notified when someone follows your profile, or when you get likes and comments on
            reviews and photos posted by you
          </Text>
          <HStack style={styles.optionRow}>
            <HStack style={styles.iconLabel}>
              <Icon as={MaterialIcons} name='notifications-none' size={5} color='#111827' />
              <Text style={styles.optionText}>Push</Text>
            </HStack>
            <Switch
              size='md'
              onTrackColor='#ea580c'
              isChecked={socialPush}
              onToggle={setSocialPush}
            />
          </HStack>
          <HStack style={styles.optionRow}>
            <HStack style={styles.iconLabel}>
              <Icon as={FontAwesome} name='whatsapp' size={5} color='#25D366' />
              <Text style={styles.optionText}>WhatsApp</Text>
            </HStack>
            <Switch
              size='md'
              onTrackColor='#ea580c'
              isChecked={socialWhatsApp}
              onToggle={setSocialWhatsApp}
            />
          </HStack>
        </View>

        <View style={styles.divider} />

        {/* Orders and purchases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders and purchases</Text>
          <Text style={styles.sectionSubtitle}>
            Receive updates related to your order status, memberships, table bookings and more
          </Text>
          <HStack style={styles.optionRow}>
            <HStack style={styles.iconLabel}>
              <Icon as={MaterialIcons} name='notifications-none' size={5} color='#111827' />
              <Text style={styles.optionText}>Push</Text>
            </HStack>
            <Switch
              size='md'
              onTrackColor='#ea580c'
              isChecked={ordersPush}
              onToggle={setOrdersPush}
            />
          </HStack>
          <HStack style={styles.optionRow}>
            <HStack style={styles.iconLabel}>
              <Icon as={FontAwesome} name='whatsapp' size={5} color='#25D366' />
              <Text style={styles.optionText}>WhatsApp</Text>
            </HStack>
            <Switch
              size='md'
              onTrackColor='#ea580c'
              isChecked={ordersWhatsApp}
              onToggle={setOrdersWhatsApp}
            />
          </HStack>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Poppins',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: 'OpenSans',
    marginTop: 4,
    lineHeight: 18,
  },
  switchContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  switchLabelOff: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 6,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Poppins',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#ea580c',
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});
