import { Box, HStack, Text, VStack } from "native-base";

export default function OrderCard({ order }) {
  return (
    <Box borderWidth={1} borderRadius='lg' p={3} mb={3} borderColor='coolGray.200'>
      <HStack justifyContent='space-between' alignItems='center'>
        <Text bold>Order #{order.id}</Text>
        <Text color={order.status === "Delivered" ? "green.600" : "amber.600"}>{order.status}</Text>
      </HStack>
      <VStack mt={2}>
        <Text fontSize='sm'>Items: {order.items.length}</Text>
        {order.createdAt && (
          <Text fontSize='xs' color='coolGray.500'>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
