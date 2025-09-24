import { Box, Text } from "native-base";

export default function ProfileScreen() {
  return (
    <Box flex={1} safeArea p={4} bg="white">
      <Text fontSize="2xl" bold>
        Profile
      </Text>
      <Text mt={2}>User details will be shown here.</Text>
    </Box>
  );
}
