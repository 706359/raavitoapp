import { useCart } from "../context/CartContext";
import { Box, Button, HStack, Image, Text, VStack } from "native-base";

export default function FoodCard({ item }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(item); // push item into cart context
  };

  return (
    <Box borderWidth={1} borderRadius='lg' p={3} bg='white' shadow={1} borderColor='coolGray.200'>
      <HStack space={2} alignItems='center'>
        {item.image && (
          <Image source={{ uri: item.image }} alt={item.name} size='md' borderRadius='md' />
        )}

        <VStack flex={1} space={2}>
          <Text bold fontSize='md'>
            {item.name}
          </Text>
          <Text color='coolGray.600' fontSize='sm'>
            ₹{item.price}
          </Text>
        </VStack>

        <Button size='sm' colorScheme='green' onPress={handleAdd}>
          Add
        </Button>
      </HStack>
    </Box>
  );
}
