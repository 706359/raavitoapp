// import { useOrder } from "@/context/OrderContext";
// import { Badge, Box, Divider, HStack, ScrollView, Text, VStack } from "native-base";

// export default function OrdersHistoryScreen() {
//   const { orders } = useOrder();

//   return (
//     <Box flex={1} safeArea bg='gray.50'>
//       <Box px={4} py={3} borderBottomWidth={1} borderColor='coolGray.200' bg='white'>
//         <Text fontSize='2xl' bold>
//           Orders
//         </Text>
//       </Box>

//       {orders.length === 0 ? (
//         <Box flex={1} alignItems='center' justifyContent='center'>
//           <Text mt={2} color='coolGray.500'>
//             No past orders yet
//           </Text>
//         </Box>
//       ) : (
//         <ScrollView px={4} py={3}>
//           <VStack space={4}>
//             {orders.map((order) => (
//               <Box
//                 key={order.id}
//                 bg='white'
//                 borderRadius='lg'
//                 shadow={1}
//                 p={4}
//                 borderWidth={1}
//                 borderColor='coolGray.200'>
//                 <HStack justifyContent='space-between' alignItems='center' mb={2}>
//                   <Text bold fontSize='md'>
//                     Order #{order.id}
//                   </Text>
//                   <Badge
//                     colorScheme={
//                       order.status === "Delivered"
//                         ? "green"
//                         : order.status === "Confirmed"
//                           ? "amber"
//                           : "coolGray"
//                     }
//                     rounded='full'>
//                     {order.status}
//                   </Badge>
//                 </HStack>

//                 <Divider mb={2} />

//                 <VStack space={1}>
//                   <Text fontSize='sm' color='coolGray.600'>
//                     Items: {order.items?.length || 0}
//                   </Text>
//                   {order.total && (
//                     <Text fontSize='sm' color='coolGray.800' bold>
//                       Total: ₹{order.total}
//                     </Text>
//                   )}
//                   {order.createdAt && (
//                     <Text fontSize='xs' color='coolGray.500'>
//                       {new Date(order.createdAt).toLocaleString()}
//                     </Text>
//                   )}
//                 </VStack>
//               </Box>
//             ))}
//           </VStack>
//         </ScrollView>
//       )}
//     </Box>
//   );
// }

// screens/OrdersHistoryScreen.js
import CustomButton from '@/components/CustomButton';
import { allItems, kitchens } from '@/data/menu';
import { Box, HStack, Image, Pressable, ScrollView, Text, VStack } from 'native-base';
import { useState } from 'react';
import theme from '../../theme';

// Dummy orders
const DUMMY_ORDERS = [
  {
    id: 1,
    kitchenId: 'k1',
    itemId: 'i1',
    status: 'New',
    location: 'Sector 22, Delhi',
  },
  {
    id: 2,
    kitchenId: 'k2',
    itemId: 'i4',
    status: 'Ongoing',
    location: 'Sector 12, Delhi',
  },
  {
    id: 3,
    kitchenId: 'k3',
    itemId: 'i5',
    status: 'Complete',
    location: 'Sector 9, Delhi',
  },
  {
    id: 4,
    kitchenId: 'k1',
    itemId: 'i2',
    status: 'New',
    location: 'Sector 22, Delhi',
  },
];

const STATUS_TABS = ['New', 'Ongoing', 'Complete', 'All'];

export default function OrdersHistoryScreen() {
  const [selectedTab, setSelectedTab] = useState('New');

  const filteredOrders =
    selectedTab === 'All' ? DUMMY_ORDERS : DUMMY_ORDERS.filter((o) => o.status === selectedTab);

  const getKitchen = (id) => kitchens.find((k) => k.id === id);
  const getItem = (id) => allItems.find((i) => i.id === id);

  return (
    <Box flex={1} safeArea bg='gray.50'>
      {/* Header */}
      <Box px={4} py={3} borderBottomWidth={1} borderColor='coolGray.200' bg='white'>
        <Text style={styles.headerText}>Orders</Text>
      </Box>

      {/* Tabs */}
      <HStack bg='white' px={4} py={2} borderBottomWidth={1} borderColor='coolGray.200'>
        {STATUS_TABS.map((tab) => (
          <Pressable key={tab} onPress={() => setSelectedTab(tab)} flex={1}>
            <Box
              py={2}
              alignItems='center'
              borderBottomWidth={selectedTab === tab ? 2 : 0}
              borderColor={theme.colors.brand.orange}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && { fontWeight: 'bold', color: theme.colors.brand.orange },
                ]}>
                {tab}
              </Text>
            </Box>
          </Pressable>
        ))}
      </HStack>

      {/* Orders List */}
      <ScrollView px={4} py={3}>
        <VStack space={4}>
          {filteredOrders.length === 0 ? (
            <Box alignItems='center' mt={10}>
              <Text style={styles.noOrderText}>No orders found</Text>
            </Box>
          ) : (
            filteredOrders.map((order) => {
              const kitchen = getKitchen(order.kitchenId);
              const item = getItem(order.itemId);
              return (
                <Box
                  key={order.id}
                  bg='white'
                  borderRadius='lg'
                  shadow={1}
                  p={4}
                  borderWidth={1}
                  borderColor='coolGray.200'>
                  <HStack space={3}>
                    <Image source={item.image} alt={item.name} size='md' borderRadius='md' />
                    <VStack flex={1} justifyContent='space-between'>
                      <Text style={styles.kitchenName}>{kitchen.name}</Text>
                      <Text style={styles.locationText}>{order.location}</Text>
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.priceText}>₹{item.price}</Text>
                      <Text style={styles.orderIdText}>ID#{order.id}</Text>
                      <HStack space={3} mt={2} justifyContent='flex-end'>
                        <CustomButton title='Cancel' bg={theme.colors.brand.orange} flex={1} />
                        <CustomButton title='Pending' color='green' flex={1} />
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              );
            })
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}

// Separate CSS
const styles = {
  headerText: { fontSize: 22, fontWeight: 'bold' },
  tabText: { fontSize: 16, color: '#555' },
  noOrderText: { fontSize: 16, color: '#999' },
  kitchenName: { fontSize: 16, fontWeight: 'bold' },
  locationText: { fontSize: 14, color: '#666' },
  itemText: { fontSize: 14, color: '#333' },
  priceText: { fontSize: 14, fontWeight: 'bold', color: theme.colors.brand.orange },
  orderIdText: { fontSize: 12, color: '#999' },
};
