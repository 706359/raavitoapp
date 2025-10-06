import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import {
  Box,
  Button,
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

import { allItems } from "../data/menu";

export default function CartScreen({ navigation }) {
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
        <Box px={4} py={3} bg='white' borderBottomWidth={1} borderColor='muted.200'>
          <HStack alignItems='center' space={3}>
            <IconButton
              icon={<Icon as={Ionicons} name='arrow-back' color='black' />}
              onPress={() => navigation.goBack()}
            />
            <Text fontSize='xl' bold color='black'>
              My Cart
            </Text>
          </HStack>
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
                    color='orange.500'
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
          left={0}
          right={0}
          bg='white'
          p={4}
          borderTopWidth={1}
          borderColor='muted.200'>
          <Button
            onPress={() => {
              console.log("Payment initiated", cart);
            }}
            colorScheme='cyan'>
            PROCEED TO PAY
          </Button>
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
