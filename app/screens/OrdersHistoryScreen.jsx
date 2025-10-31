import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Button, HStack, Icon, Image, Pressable, ScrollView, Text, VStack } from 'native-base';
import { useState } from 'react';
import { Platform } from 'react-native';
import theme from '../../theme';
import { allItems, kitchens } from '../data/menu';

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

export default function OrdersHistoryScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('New');

  const filteredOrders =
    selectedTab === 'All' ? DUMMY_ORDERS : DUMMY_ORDERS.filter((o) => o.status === selectedTab);

  const getKitchen = (id) => kitchens.find((k) => k.id === id);
  const getItem = (id) => allItems.find((i) => i.id === id);

  return (
    <Box flex={1} safeArea bg='gray.50'>
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
              <Text style={styles.headerTitle}>Orders</Text>
              <Text style={styles.headerSubtitle}>Manage Your Orders</Text>
            </VStack>
          </HStack>

          <Box style={styles.headerIconBox}>
            {/* <Icon as={MaterialIcons} name='location-on' color='white' size={6} /> */}
            <Icon as={MaterialIcons} name='takeout-dining' color='white' size={6} />
          </Box>
        </HStack>
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
              const kitchen = getKitchen(order.kitchenId) || { name: 'Unknown Kitchen' };
              const item = getItem(order.itemId) || {
                name: 'Unknown Item',
                price: '-',
                image: null,
              };
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
                    {item.image ? (
                      <Image source={item.image} alt={item.name} size='md' borderRadius='md' />
                    ) : (
                      <Box size='md' borderRadius='md' bg='gray.100' />
                    )}
                    <VStack flex={1} justifyContent='space-between'>
                      <Text style={styles.kitchenName}>{kitchen.name}</Text>
                      <Text style={styles.locationText}>{order.location}</Text>
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.priceText}>₹{item.price}</Text>
                      <Text style={styles.orderIdText}>ID#{order.id}</Text>
                      <HStack space={3} mt={2} justifyContent='flex-end'>
                        <Button
                          variant='outline'
                          borderColor='brand.light'
                          _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                          _linearGradient={{
                            as: LinearGradient,
                            colors: [theme.colors.brand.orange, theme.colors.brand.green],
                            start: [0, 0],
                            end: [1, 1],
                          }}>
                          Cancel
                        </Button>
                        <Button
                          variant='outline'
                          borderColor='brand.light'
                          _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                          _linearGradient={{
                            as: LinearGradient,
                            colors: [theme.colors.brand.orange, theme.colors.brand.green],
                            start: [0, 0],
                            end: [1, 1],
                          }}>
                          Pending
                        </Button>
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
};
