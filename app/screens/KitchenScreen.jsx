import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

export default function KitchenScreen({ route, navigation }) {
  const { kitchen } = route.params;

  const { addToCart, removeFromCart, cart } = useCart();

  const menuTabs = ['Lunch', 'Dinner', 'Breakfast', 'Snacks'];
  const [activeTab, setActiveTab] = useState('Lunch');

  // Example menu items
  const menuItems = [
    {
      id: '1',
      name: 'Small Lunch',
      price: 50,
      desc: 'Max veg 3, Chapati',
      // img: 'https://via.placeholder.com/120',
      img: require('../assets/Dosa.jpg'),
    },
    {
      id: '2',
      name: 'Medium Lunch',
      price: 90,
      desc: 'Veg thali with rice, chapati',
      // img: 'https://via.placeholder.com/120',
      img: require('../assets/Gujarati.jpeg'),
    },
  ];

  // Get qty from cart
  const getQty = (id) => {
    const item = cart.find((c) => c.id === id);
    return item ? item.qty : 0;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg='white'>
        <ScrollView>
          {/* Header */}
          <HStack alignItems='center' justifyContent='space-between' px={4} py={3} bg='orange.500'>
            <HStack alignItems='center' space={3}>
              <IconButton
                icon={<Icon as={Ionicons} name='arrow-back' color='white' />}
                onPress={() => navigation.goBack()}
              />
              <Text color='white' bold fontSize='md'>
                {kitchen?.name || 'Kitchen'}
              </Text>
            </HStack>
            <HStack space={4} alignItems='center'>
              <Icon as={Ionicons} name='search' size={6} color='white' />
              <Icon as={Ionicons} name='heart-outline' size={6} color='white' />
            </HStack>
          </HStack>

          {/* Restaurant Info */}
          <Box px={4} py={3}>
            <Text bold fontSize='lg'>
              {kitchen?.name || 'Taste of India Tiffin Services'}
            </Text>
            <Text color='muted.500' fontSize='sm'>
              {kitchen?.location || 'Gotala Nagar'}
            </Text>
            <HStack space={4} mt={2} alignItems='center'>
              <HStack space={1} alignItems='center'>
                <Icon as={Ionicons} name='star' color='green.500' size={4} />
                <Text fontSize='sm'>{kitchen?.rating || '4.00'}</Text>
              </HStack>
              <Text fontSize='sm'>{kitchen?.time || '30 min'}</Text>
              <Text fontSize='sm'>{kitchen?.distance || '14.39 kms'}</Text>
            </HStack>
            <Text mt={1} color='muted.500' fontSize='xs'>
              {kitchen?.desc || 'American, Fast Food Inner Circle, Connaught Place | Change Outlet'}
            </Text>
          </Box>

          {/* Food Gallery */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} px={4} py={2}>
            {[1].map((i) => (
              <Image
                key={i}
                source={require('../assets/food.jpeg')}
                // source={{ uri: 'https://via.placeholder.com/100' }}
                alt='Food'
                size='lg'
                mr={3}
                rounded='md'
              />
            ))}
          </ScrollView>

          {/* Offer Box */}
          <Box
            bg='orange.50'
            borderWidth={1}
            borderColor='orange.200'
            p={4}
            mx={4}
            rounded='lg'
            my={3}>
            <HStack alignItems='center' space={3}>
              <Icon as={Ionicons} name='pricetag-outline' color='orange.500' size={6} />
              <VStack>
                <Text bold color='orange.700'>
                  30% off upto $75
                </Text>
                <Text fontSize='xs' color='muted.500'>
                  USE KITCHENWALA | ABOVE $100
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Menu Tabs */}
          <HStack px={4} space={6} mb={3}>
            {menuTabs.map((tab) => (
              <Pressable key={tab} onPress={() => setActiveTab(tab)}>
                <Text
                  bold={activeTab === tab}
                  color={activeTab === tab ? 'orange.600' : 'muted.500'}
                  borderBottomWidth={activeTab === tab ? 2 : 0}
                  borderColor='orange.600'
                  pb={1}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </HStack>

          {/* Menu Section */}
          <Box px={4} mb={6}>
            <Text bold fontSize='md' mb={3}>
              Maharashtrian
            </Text>
            {menuItems.map((item) => {
              const qty = getQty(item.id);
              return (
                <HStack
                  key={item.id}
                  space={3}
                  py={3}
                  borderBottomWidth={0.5}
                  borderColor='gray.200'
                  alignItems='center'>
                  <VStack flex={1}>
                    <Text bold>{item.name}</Text>
                    <Text fontSize='xs' color='muted.500'>
                      ${item.price.toFixed(2)}
                    </Text>
                    <Text fontSize='xs' color='muted.400'>
                      {item.desc}
                    </Text>
                  </VStack>
                  {/* <Image source={{ uri: item.img }} alt={item.name} size='xl' rounded='md' /> */}
                  <Image source={item.img} alt={item.name} size='xl' rounded='md' />
                  <HStack alignItems='center' space={2}>
                    {qty > 0 ? (
                      <>
                        <IconButton
                          icon={<Icon as={Ionicons} name='remove-outline' />}
                          onPress={() => removeFromCart(item.id)}
                        />
                        <Text>{qty}</Text>
                        <IconButton
                          icon={<Icon as={Ionicons} name='add-outline' />}
                          onPress={() => addToCart(item)}
                        />
                      </>
                    ) : (
                      <Pressable
                        onPress={() => addToCart(item)}
                        px={3}
                        py={1}
                        bg='orange.500'
                        rounded='md'>
                        <Text color='white' fontSize='xs'>
                          Add
                        </Text>
                      </Pressable>
                    )}
                  </HStack>
                </HStack>
              );
            })}
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
