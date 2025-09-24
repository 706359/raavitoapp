import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { Box, Button, HStack, Text, VStack } from "native-base";

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart, getTotal } = useCart();
  const { addOrder } = useOrder();

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const order = {
      id: Date.now(),
      items: cart,
      total: getTotal(),
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    navigation.replace("OrderTracking", { order });
  };

  return (
    <Box flex={1} safeArea p={4} bg='white'>
      <Text fontSize='2xl' bold mb={4}>
        Checkout
      </Text>

      <VStack space={3} flex={1}>
        {cart.map((item) => (
          <HStack
            key={item.id}
            justifyContent='space-between'
            borderBottomWidth={1}
            borderColor='coolGray.200'
            pb={2}>
            <Text flex={1}>{item.name}</Text>
            <Text>₹{item.price * (item.qty || 1)}</Text>
          </HStack>
        ))}

        {/* Order Summary */}
        <Box mt='auto' pt={4} borderTopWidth={1} borderColor='coolGray.200'>
          <HStack justifyContent='space-between' mb={4}>
            <Text bold>Total:</Text>
            <Text bold>₹{getTotal()}</Text>
          </HStack>

          <Button colorScheme='green' onPress={handlePlaceOrder}>
            Place Order
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
