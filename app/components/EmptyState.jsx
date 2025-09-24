import { Box, Text } from "native-base";

export default function EmptyState({ message }) {
  return (
    <Box flex={1} alignItems='center' justifyContent='center' p={6}>
      <Text fontSize='md' color='coolGray.500'>
        {message}
      </Text>
    </Box>
  );
}
