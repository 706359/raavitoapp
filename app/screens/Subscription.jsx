// import CustomButton from '@/components/CustomButton'; // your button component
// import { Ionicons } from '@expo/vector-icons';
// import { useState } from 'react';
// import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import theme from '../../theme';

// export default function Subscription({ navigation }) {
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   // Dummy data
//   const data = [
//     {
//       id: '1',
//       icon: 'card-outline',
//       title: 'Basic Plan',
//       description: 'Access to 1 kitchen per day',
//       price: '₹199',
//     },
//     {
//       id: '2',
//       icon: 'restaurant-outline',
//       title: 'Standard Plan',
//       description: 'Access to 3 kitchens per day',
//       price: '₹399',
//     },
//     {
//       id: '3',
//       icon: 'rocket-outline',
//       title: 'Premium Plan',
//       description: 'Unlimited kitchen access',
//       price: '₹699',
//     },
//     {
//       id: '4',
//       icon: 'star-outline',
//       title: 'VIP Plan',
//       description: 'All perks + special discounts',
//       price: '₹999',
//     },
//   ];

//   const renderItem = ({ item }) => {
//     const isSelected = selectedPlan?.id === item.id;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.card,
//           {
//             borderColor: isSelected ? theme.colors.brand.green : '#fff',
//             borderWidth: isSelected ? 2 : 0,
//           },
//         ]}
//         onPress={() => setSelectedPlan(item)}>
//         <View style={styles.cardContent}>
//           <Ionicons
//             name={item.icon}
//             size={30}
//             color={theme.colors.brand.green}
//             style={styles.icon}
//           />
//           <View style={styles.textContainer}>
//             <Text style={[styles.title, { color: theme.colors.brand.dark }]}>{item.title}</Text>
//             <Text style={styles.description}>{item.description}</Text>
//             <Text style={[styles.price, { color: theme.colors.brand.green }]}>{item.price}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name='arrow-back'
//           size={24}
//           color='black'
//           onPress={() => navigation.goBack()}
//           style={{ marginRight: 10 }}
//         />
//         <Text style={styles.headerTitle}>Subscription</Text>
//       </View>

//       {/* Plans List */}
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 15 }}
//         renderItem={renderItem}
//       />

//       {/* Bottom Selected Plan */}
//       {selectedPlan && (
//         <View style={styles.bottomContainer}>
//           <View style={styles.planInfo}>
//             <Text style={styles.selectedTitle}>{selectedPlan.title}</Text>
//             <Text style={styles.selectedPrice}>{selectedPlan.price}</Text>
//           </View>
//           <CustomButton title='Subscribe Now' onPress={() => console.log('Subscribe clicked')} />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   card: {
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     height: 140,
//     padding: 15,
//     marginBottom: 15,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   icon: {
//     marginRight: 15,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 6,
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   bottomContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//     backgroundColor: '#fff',
//   },
//   planInfo: {
//     flexDirection: 'column',
//   },
//   selectedTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: theme.colors.brand.dark,
//   },
//   selectedPrice: {
//     fontSize: 16,
//     color: theme.colors.brand.green,
//     marginTop: 4,
//   },
// });

import CustomButton from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';

export default function Subscription({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const data = [
    {
      id: '1',
      icon: 'card-outline',
      title: 'Basic Plan',
      description: 'Access to 1 kitchen per day',
      price: '₹199',
    },
    {
      id: '2',
      icon: 'restaurant-outline',
      title: 'Standard Plan',
      description: 'Access to 3 kitchens per day',
      price: '₹399',
    },
    {
      id: '3',
      icon: 'rocket-outline',
      title: 'Premium Plan',
      description: 'Unlimited kitchen access',
      price: '₹699',
    },
    {
      id: '4',
      icon: 'star-outline',
      title: 'VIP Plan',
      description: 'All perks + special discounts',
      price: '₹999',
    },
  ];

  const renderItem = ({ item }) => {
    const isSelected = selectedPlan?.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderColor: isSelected ? theme.colors.brand.green : '#fff',
            borderWidth: isSelected ? 2 : 0,
          },
        ]}
        onPress={() => setSelectedPlan(item)}>
        <View style={styles.cardContent}>
          <Ionicons
            name={item.icon}
            size={30}
            color={theme.colors.brand.green}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.brand.dark }]}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={[styles.price, { color: theme.colors.brand.green }]}>{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name='arrow-back'
          size={24}
          color='black'
          onPress={() => navigation.goBack()}
          style={{ marginRight: 10 }}
        />
        <Text style={styles.headerTitle}>Subscription</Text>
      </View>

      {/* Plans List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 15 }}
        renderItem={renderItem}
      />

      {/* Bottom Selected Plan */}
      {selectedPlan && (
        <View style={styles.bottomContainer}>
          <View style={styles.planInfo}>
            <Text style={styles.selectedTitle}>{selectedPlan.title}</Text>
            <Text style={styles.selectedPrice}>{selectedPlan.price}</Text>
          </View>
          <CustomButton title='Subscribe Now' onPress={() => console.log('Subscribe clicked')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 140,
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 15 },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  description: { fontSize: 14, color: '#555', marginBottom: 6 },
  price: { fontSize: 16, fontWeight: 'bold' },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  planInfo: { flexDirection: 'column' },
  selectedTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.brand.dark },
  selectedPrice: { fontSize: 16, color: theme.colors.brand.green, marginTop: 4 },
});
