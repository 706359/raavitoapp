import { Box, Text } from "native-base";

export default function OrdersHistoryScreen() {
  return (
    <Box flex={1} safeArea p={4} bg="white">
      <Text fontSize="2xl" bold>
        Orders
      </Text>
      <Text mt={2}>Your past orders will show here.</Text>
    </Box>
  );
}
