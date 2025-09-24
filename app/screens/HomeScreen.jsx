import { Box, Text } from "native-base";

export default function HomeScreen() {
  return (
    <Box flex={1} safeArea p={4} bg="white">
      <Text fontSize="2xl" bold>
        Home
      </Text>
      <Text mt={2}>Welcome to Raavito</Text>
    </Box>
  );
}
