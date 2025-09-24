import { Box, Text } from "native-base";

export default function MenuScreen() {
  return (
    <Box flex={1} safeArea p={4} bg="white">
      <Text fontSize="2xl" bold>
        Menu
      </Text>
      <Text mt={2}>Our daily thali & tiffin options will appear here.</Text>
    </Box>
  );
}
