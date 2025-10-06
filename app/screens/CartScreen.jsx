// import { useCart } from '@/context/CartContext';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   Box,
//   Button,
//   Center,
//   Divider,
//   FlatList,
//   HStack,
//   Icon,
//   IconButton,
//   Pressable,
//   Spacer,
//   Text,
//   VStack,
// } from 'native-base';
// import { useMemo } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function CartScreen() {
//   const { cart, addToCart, removeFromCart, clearCart, getTotal } = useCart();

//   const total = useMemo(() => {
//     const t = getTotal();
//     return Number.isInteger(t) ? `${t}` : t.toFixed(2);
//   }, [cart, getTotal]);

//   if (!cart || cart.length === 0) {
//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         <Center flex={1} px={6} bg='white'>
//           <Box
//             w='60'
//             h='60'
//             borderRadius='30'
//             bg={{
//               linearGradient: {
//                 colors: ['cyan.400', 'blue.500'],
//                 start: [0, 0],
//                 end: [1, 1],
//               },
//             }}
//             alignItems='center'
//             justifyContent='center'
//             mb={6}
//             shadow={3}>
//             <Icon as={Ionicons} name='cart-outline' color='white' size='2xl' />
//           </Box>

//           <Text fontSize='xl' bold mb={2}>
//             Your cart is empty
//           </Text>
//           <Text color='muted.500' textAlign='center' mb={6}>
//             Add some items to start your order. Great deals await!
//           </Text>

//           <Button colorScheme='cyan' startIcon={<Icon as={Ionicons} name='storefront-outline' />}>
//             Shop now
//           </Button>
//         </Center>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Box flex={1} bg='gray.50'>
//         <FlatList
//           data={cart}
//           keyExtractor={(item) => item.id?.toString()}
//           contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
//           ItemSeparatorComponent={() => <Divider my={3} />}
//           renderItem={({ item }) => (
//             <Pressable>
//               {({ isPressed }) => (
//                 <Box
//                   bg='white'
//                   borderRadius='lg'
//                   p={3}
//                   shadow={isPressed ? 0 : 2}
//                   opacity={isPressed ? 0.95 : 1}
//                   flexDirection='row'
//                   alignItems='center'>
//                   {/* Use Icon instead of Image */}
//                   <Box
//                     w={16}
//                     h={16}
//                     borderRadius='md'
//                     bg='cyan.100'
//                     alignItems='center'
//                     justifyContent='center'
//                     mr={3}>
//                     <Icon as={Ionicons} name='fast-food-outline' size='lg' color='cyan.600' />
//                   </Box>

//                   <VStack flex={1} space={1}>
//                     <HStack alignItems='flex-start'>
//                       <VStack flex={1}>
//                         <Text bold fontSize='md' numberOfLines={1}>
//                           {item.name}
//                         </Text>
//                         {item.description && (
//                           <Text color='muted.500' fontSize='xs' numberOfLines={2}>
//                             {item.description}
//                           </Text>
//                         )}
//                         <HStack alignItems='center' mt={2}>
//                           <Text bold fontSize='sm' color='emerald.700'>
//                             ₹{item.price}
//                           </Text>
//                           <Spacer />
//                           <Text fontSize='xs' color='muted.500'>
//                             Subtotal: ₹{(item.price * item.qty).toFixed(2)}
//                           </Text>
//                         </HStack>
//                       </VStack>
//                     </HStack>

//                     <HStack mt={3} space={2} alignItems='center'>
//                       <IconButton
//                         icon={<Icon as={Ionicons} name='remove-outline' />}
//                         borderRadius='full'
//                         size='sm'
//                         variant='ghost'
//                         _icon={{ color: 'muted.700', size: 'md' }}
//                         onPress={() =>
//                           item.qty > 1
//                             ? addToCart({ ...item, qty: -1 }) // reduce qty
//                             : removeFromCart(item.id)
//                         }
//                         accessibilityLabel='Decrease quantity'
//                       />
//                       <Box
//                         px={3}
//                         py={1}
//                         borderRadius='full'
//                         bg='muted.100'
//                         minW='10'
//                         alignItems='center'>
//                         <Text bold>{item.qty}</Text>
//                       </Box>
//                       <IconButton
//                         icon={<Icon as={Ionicons} name='add-outline' />}
//                         borderRadius='full'
//                         size='sm'
//                         variant='ghost'
//                         _icon={{ color: 'muted.700', size: 'md' }}
//                         onPress={() => addToCart(item)}
//                         accessibilityLabel='Increase quantity'
//                       />

//                       <Spacer />
//                       <IconButton
//                         icon={<Icon as={Ionicons} name='trash-outline' />}
//                         borderRadius='full'
//                         size='sm'
//                         variant='ghost'
//                         _icon={{ color: 'red.500', size: 'md' }}
//                         onPress={() => removeFromCart(item.id)}
//                         accessibilityLabel='Remove item'
//                       />
//                     </HStack>
//                   </VStack>
//                 </Box>
//               )}
//             </Pressable>
//           )}
//         />

//         {/* Bottom bar */}
//         <Box
//           position='absolute'
//           left={0}
//           right={0}
//           bottom={0}
//           px={4}
//           py={4}
//           bg={{
//             linearGradient: {
//               colors: ['transparent', 'white'],
//               start: [0, 0],
//               end: [0, 1],
//             },
//           }}>
//           <Box
//             bg='white'
//             p={4}
//             borderRadius='xl'
//             shadow={3}
//             borderColor='muted.200'
//             borderWidth={1}>
//             <HStack alignItems='center' justifyContent='space-between' mb={3}>
//               <VStack>
//                 <Text fontSize='sm' color='muted.500'>
//                   Total
//                 </Text>
//                 <Text fontSize='xl' bold color='emerald.700'>
//                   ₹{total}
//                 </Text>
//               </VStack>

//               <HStack space={2}>
//                 <Button
//                   variant='outline'
//                   colorScheme='red'
//                   onPress={clearCart}
//                   leftIcon={<Icon as={Ionicons} name='trash-outline' />}>
//                   Clear
//                 </Button>

//                 <Button colorScheme='cyan' leftIcon={<Icon as={Ionicons} name='card-outline' />}>
//                   Checkout
//                 </Button>
//               </HStack>
//             </HStack>

//             <Divider />

//             <Text mt={3} fontSize='xs' color='muted.500'>
//               By checking out you agree to our terms. Free delivery on orders above ₹120.
//             </Text>
//           </Box>
//         </Box>
//       </Box>
//     </SafeAreaView>
//   );
// }

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  ScrollView,
  Spacer,
  Text,
  VStack,
} from "native-base";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../theme";
import CustomButton from "../components/CustomButton";
import { allItems } from "../data/menu";

export default function CartScreen() {
  const [cart, setCart] = useState(
    allItems.slice(0, 3).map((item) => ({ ...item, qty: 1, note: "" }))
  );

  const couponCode = "SAVE10";
  const couponDiscount = 10;
  const walletBalance = 750;
  const storeCharge = 10;
  const deliveryFee = 0;

  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateItemNote = (id, note) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, note } : item)));
  };

  const itemTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const grandTotal = itemTotal + storeCharge + deliveryFee - couponDiscount;
  const walletUsed = Math.min(walletBalance, grandTotal);
  const amountToPay = Math.max(grandTotal - walletUsed, 0);

  const deliveryAddress =
    "123, saiid 6&SR+7F6, Ashwini Kumar Rd, Khand Bazar, Varachha, Surat, Gujarat 395006";

  if (!cart || cart.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} bg='white' alignItems='center' justifyContent='center'>
          <Text fontSize='xl' bold mb={2}>
            Your cart is empty
          </Text>
          <Text color='muted.500' textAlign='center'>
            Add some items to start your order. Great deals await!
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Box flex={1} bg='gray.50'>
        {/* Top Heading */}
        <Box px={4} py={3} bg='white' borderBottomWidth={1} borderColor='muted.200'>
          <Text fontSize='xl' bold color='black'>
            My Cart
          </Text>
        </Box>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
          <VStack space={4}>
            {/* Cart Items */}
            {cart.map((item) => (
              <Box key={item.id} style={styles.itemBox}>
                <HStack alignItems='center' space={3}>
                  <Image source={item.image} alt={item.name} size='16' borderRadius='md' />
                  <VStack flex={1} space={1}>
                    <Text bold fontSize='md'>
                      {item.name}
                    </Text>
                    <Text fontSize='xs' color='muted.500'>
                      {item.desc}
                    </Text>

                    <HStack mt={3} space={2} alignItems='center'>
                      <IconButton
                        icon={<Icon as={Ionicons} name='remove-outline' />}
                        borderRadius='full'
                        size='sm'
                        variant='ghost'
                        onPress={() => decreaseQty(item.id)}
                        _icon={{ color: "orange.500" }}
                      />
                      <Box px={3} py={1} borderRadius='full' bg='muted.100' alignItems='center'>
                        <Text bold>{item.qty}</Text>
                      </Box>
                      <IconButton
                        icon={<Icon as={Ionicons} name='add-outline' />}
                        borderRadius='full'
                        size='sm'
                        variant='ghost'
                        onPress={() => increaseQty(item.id)}
                        _icon={{ color: "orange.500" }}
                      />
                      <Spacer />
                      <IconButton
                        icon={<Icon as={Ionicons} name='trash-outline' />}
                        borderRadius='full'
                        size='sm'
                        variant='ghost'
                        _icon={{ color: "red.500" }}
                        onPress={() => removeItem(item.id)}
                      />
                    </HStack>

                    {/* Additional Note under quantity */}
                    <Input
                      placeholder='Add a note for this item...'
                      fontSize='xs'
                      mt={2}
                      value={item.note}
                      onChangeText={(text) => updateItemNote(item.id, text)}
                      variant='filled'
                      bg='muted.100'
                    />
                  </VStack>
                </HStack>
              </Box>
            ))}

            {/* Coupon Code Card */}
            <Box style={styles.itemBox}>
              <HStack alignItems='center' justifyContent='space-between'>
                <HStack alignItems='center' space={2}>
                  <Icon as={MaterialIcons} name='local-offer' size='sm' color='green.600' />
                  <Text bold fontSize='md' color='green.600'>
                    Coupon Applied
                  </Text>
                </HStack>
                <Text fontSize='sm' color='muted.500'>
                  Code: {couponCode} | Discount: ₹{couponDiscount.toFixed(2)}
                </Text>
              </HStack>
            </Box>

            {/* Wallet Card */}
            <Box style={styles.itemBox}>
              <HStack alignItems='center' justifyContent='space-between'>
                <HStack alignItems='center' space={2}>
                  <Icon
                    as={MaterialIcons}
                    name='account-balance-wallet'
                    size='sm'
                    color='orange.600'
                  />
                  <Text bold fontSize='md'>
                    Wallet
                  </Text>
                </HStack>
                <Text fontSize='sm' color='muted.500'>
                  Balance: ₹{walletBalance.toFixed(2)} | Used: ₹{walletUsed.toFixed(2)}
                </Text>
              </HStack>
            </Box>

            {/* Delivery Address */}
            <Box style={styles.itemBox}>
              <Text bold fontSize='md' mb={1}>
                Delivery Address
              </Text>
              <Text fontSize='xs' color='muted.500'>
                {deliveryAddress}
              </Text>
            </Box>

            {/* Bill Summary */}
            <Box style={styles.itemBox}>
              <VStack space={2}>
                <HStack justifyContent='space-between'>
                  <Text>Item Total</Text>
                  <Text>₹{itemTotal.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text>Delivery Fee</Text>
                  <Text>₹{deliveryFee.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text>Store Charge</Text>
                  <Text>₹{storeCharge.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text>Coupon Discount</Text>
                  <Text color='green.600'>-₹{couponDiscount.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent='space-between'>
                  <Text>Wallet Used</Text>
                  <Text color='red.600'>₹{walletUsed.toFixed(2)}</Text>
                </HStack>
                <HStack justifyContent='space-between' mt={2}>
                  <Text bold>Total Payable</Text>
                  <Text bold color={theme.colors.brand.green}>
                    ₹{amountToPay.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ScrollView>

        {/* Proceed to Pay Button */}
        <Box
          position='absolute'
          bottom={0}
          // bottom={-35}
          left={0}
          right={0}
          bg='white'
          p={4}
          borderTopWidth={1}
          borderColor='muted.200'>
          <CustomButton
            title='PROCEED TO PAY'
            onPress={() => {
              console.log("Payment initiated!", cart);
            }}
            pressedColor={"green"}
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
}

const styles = {
  itemBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
};
