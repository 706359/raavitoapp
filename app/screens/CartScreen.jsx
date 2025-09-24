import { Box, Text } from "native-base";

export default function CartScreen() {
  return (
    <Box flex={1} safeArea p={4} bg="white">
      <Text fontSize="2xl" bold>
        Cart
      </Text>
      <Text mt={2}>Your selected items will show here.</Text>
    </Box>
  );
}
