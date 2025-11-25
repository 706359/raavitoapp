import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Button, HStack, Icon, Image, Pressable, ScrollView, Text, VStack, useTheme } from 'native-base';
import { useState, useEffect } from 'react';
import { Platform, Alert, TextInput, TouchableOpacity } from 'react-native';
import Loader from '../components/Loader';
import theme from '../../theme';
import { fetchUserOrders } from '../utils/apiHelpers';
import { axios_ } from '../../utils/utils';
import { useCart } from '../context/CartContext';

const STATUS_TABS = ['New', 'Ongoing', 'Complete', 'All'];

// Map API status to display status
const mapStatus = (status) => {
  const statusMap = {
    pending: 'New',
    confirmed: 'New',
    preparing: 'Ongoing',
    out_for_delivery: 'Ongoing',
    delivered: 'Complete',
    cancelled: 'Complete',
  };
  return statusMap[status] || 'New';
};

export default function OrdersHistoryScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('New');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const theme = useTheme();

  // Fetch orders from API
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const status = selectedTab === 'All' ? null : selectedTab.toLowerCase();
        let url = '/orders/my';
        if (status) url += `?status=${status}`;
        if (searchQuery) url += `${status ? '&' : '?'}search=${encodeURIComponent(searchQuery)}`;
        
        const { data } = await axios_.get(url);
        setOrders(data || []);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [selectedTab, searchQuery]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios_.put(`/orders/${orderId}/cancel`);
      Alert.alert('Success', 'Order cancelled successfully');
      // Reload orders
      const status = selectedTab === 'All' ? null : selectedTab.toLowerCase();
      const data = await fetchUserOrders(status);
      setOrders(data || []);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleReorder = async (order) => {
    try {
      // Use reorder endpoint
      const { data } = await axios_.get(`/orders/${order._id || order.id}/reorder`);
      
      // Add available items from the order to cart
      if (data.availableItems && data.availableItems.length > 0) {
        for (const item of data.availableItems) {
          const menuItem = item.menuItem;
          if (menuItem && menuItem.isAvailable !== false) {
            addToCart({
              id: menuItem._id || menuItem.id,
              _id: menuItem._id || menuItem.id,
              name: menuItem.name,
              price: item.price,
              qty: item.qty,
              image: menuItem.image,
            });
          }
        }
        
        if (data.unavailableItems > 0) {
          Alert.alert(
            'Items Added',
            `${data.availableItems.length} items added to cart. ${data.unavailableItems} items are no longer available.`,
            [
              {
                text: 'View Cart',
                onPress: () => navigation.navigate('Cart'),
              },
              { text: 'Continue Shopping' },
            ]
          );
        } else {
          Alert.alert('Success', 'Items added to cart', [
            {
              text: 'View Cart',
              onPress: () => navigation.navigate('Cart'),
            },
            { text: 'Continue Shopping' },
          ]);
        }
      } else {
        Alert.alert('Error', 'No items available for reorder');
      }
    } catch (error) {
      console.error('Reorder error:', error);
      Alert.alert('Error', 'Failed to reorder. Please try again.');
    }
  };

  const handleRateOrder = async (order) => {
    Alert.prompt(
      'Rate Your Order',
      'Please rate your order from 1 to 5 stars',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async (rating) => {
            const ratingNum = parseInt(rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
              Alert.alert('Error', 'Please enter a valid rating between 1 and 5');
              return;
            }
            
            try {
              await axios_.post(`/orders/${order._id || order.id}/rate`, {
                rating: ratingNum,
                review: '',
              });
              Alert.alert('Success', 'Thank you for your rating!');
              // Reload orders
              const status = selectedTab === 'All' ? null : selectedTab.toLowerCase();
              const { data } = await axios_.get(`/orders/my${status ? `?status=${status}` : ''}`);
              setOrders(data || []);
            } catch (error) {
              Alert.alert('Error', error?.response?.data?.message || 'Failed to submit rating');
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const filteredOrders = orders;

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

      {/* Search Bar */}
      <Box bg='white' px={4} py={3} borderBottomWidth={1} borderColor='coolGray.200'>
        <HStack space={2} alignItems='center' bg='gray.100' borderRadius='md' px={3} py={2}>
          <Ionicons name='search-outline' size={20} color='#6b7280' />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: '#111827' }}
            placeholder='Search orders by ID or item name...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor='#9ca3af'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name='close-circle' size={20} color='#6b7280' />
            </TouchableOpacity>
          )}
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
          {loading ? (
            <Box alignItems='center' mt={10}>
              <Loader size="large" color="orange" text="Loading orders..." />
            </Box>
          ) : filteredOrders.length === 0 ? (
            <Box alignItems='center' mt={10}>
              <Text style={styles.noOrderText}>No orders found</Text>
            </Box>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items?.[0]?.menuItem || {};
              const itemName = firstItem.name || 'Order Items';
              const itemPrice = order.total || 0;
              const itemImage = firstItem.image
                ? { uri: firstItem.image }
                : require('../assets/food.jpeg');
              const status = mapStatus(order.status);

              return (
                <Box
                  key={order._id || order.id}
                  bg='white'
                  borderRadius='lg'
                  shadow={1}
                  p={4}
                  borderWidth={1}
                  borderColor='coolGray.200'>
                  <HStack space={3}>
                    <Image source={itemImage} alt={itemName} size='md' borderRadius='md' />
                    <VStack flex={1} justifyContent='space-between'>
                      <Text style={styles.kitchenName}>Order #{order._id?.slice(-6) || order.id}</Text>
                      <Text style={styles.locationText}>{order.address}</Text>
                      <Text style={styles.itemText}>
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </Text>
                      <Text style={styles.priceText}>₹{itemPrice.toFixed(2)}</Text>
                      <HStack space={2} alignItems='center' mt={1}>
                        <Text style={styles.orderIdText}>
                          Status: {order.status} • {new Date(order.createdAt || order.created_at).toLocaleDateString()}
                        </Text>
                        {order.rating && (
                          <HStack space={1} alignItems='center'>
                            <Ionicons name='star' size={14} color='#fbbf24' />
                            <Text style={{ fontSize: 12, color: '#fbbf24' }}>{order.rating}</Text>
                          </HStack>
                        )}
                      </HStack>
                      <HStack space={3} mt={2} justifyContent='flex-end'>
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <Button
                            variant='outline'
                            borderColor='brand.light'
                            _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                            _linearGradient={{
                              as: LinearGradient,
                              colors: [theme.colors.brand.orange, theme.colors.brand.green],
                              start: [0, 0],
                              end: [1, 1],
                            }}
                            onPress={() => handleCancelOrder(order._id || order.id)}>
                            Cancel
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <>
                            {!order.rating && (
                              <Button
                                variant='outline'
                                borderColor='yellow.400'
                                _text={{ fontWeight: '700', fontSize: 'sm', color: 'yellow.600' }}
                                onPress={() => handleRateOrder(order)}
                                size='sm'>
                                Rate
                              </Button>
                            )}
                            <Button
                              variant='outline'
                              borderColor='brand.light'
                              _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                              _linearGradient={{
                                as: LinearGradient,
                                colors: [theme.colors.brand.green, theme.colors.brand.orange],
                                start: [0, 0],
                                end: [1, 1],
                              }}
                              onPress={() => handleReorder(order)}>
                              Reorder
                            </Button>
                          </>
                        )}
                        <Button
                          variant='outline'
                          borderColor='brand.light'
                          _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                          _linearGradient={{
                            as: LinearGradient,
                            colors: [theme.colors.brand.orange, theme.colors.brand.green],
                            start: [0, 0],
                            end: [1, 1],
                          }}
                          onPress={() =>
                            navigation.navigate('OrderTracking', { order: order })
                          }>
                          Track
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
