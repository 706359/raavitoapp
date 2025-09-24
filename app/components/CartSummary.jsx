import { useCart } from "@/context/CartContext";
import { Box, Button, HStack, Text } from "native-base";

export default function CartSummary({ onCheckout }) {
  const { getTotal } = useCart();

  return (
    <Box mt={4} p={3} borderTopWidth={1} borderColor='coolGray.200'>
      <HStack justifyContent='space-between' alignItems='center'>
        <Text bold>Total: ₹{getTotal()}</Text>
        <Button colorScheme='blue' onPress={onCheckout}>
          Checkout
        </Button>
      </HStack>
    </Box>
  );
}
