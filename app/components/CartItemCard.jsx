import { useCart } from "../context/CartContext";
import { Box, Button, HStack, Text } from "native-base";

export default function CartItemCard({ item }) {
  const { addToCart, removeFromCart } = useCart();

  return (
    <Box borderWidth={1} borderRadius='lg' p={3} mb={3} borderColor='coolGray.200'>
      <HStack justifyContent='space-between' alignItems='center'>
        <Text flex={1} bold>
          {item.name}
        </Text>
        <Text>₹{item.price * (item.qty || 1)}</Text>
        <HStack space={2} alignItems='center' ml={3}>
          <Button size='sm' onPress={() => removeFromCart(item.id)}>
            -
          </Button>
          <Text>{item.qty || 1}</Text>
          <Button size='sm' onPress={() => addToCart(item)}>
            +
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
