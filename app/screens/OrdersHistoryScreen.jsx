import { useOrder } from "@/context/OrderContext";
import { Badge, Box, Divider, HStack, ScrollView, Text, VStack } from "native-base";

export default function OrdersHistoryScreen() {
  const { orders } = useOrder();

  return (
    <Box flex={1} safeArea bg='gray.50'>
      <Box px={4} py={3} borderBottomWidth={1} borderColor='coolGray.200' bg='white'>
        <Text fontSize='2xl' bold>
          Orders
        </Text>
      </Box>

      {orders.length === 0 ? (
        <Box flex={1} alignItems='center' justifyContent='center'>
          <Text mt={2} color='coolGray.500'>
            No past orders yet
          </Text>
        </Box>
      ) : (
        <ScrollView px={4} py={3}>
          <VStack space={4}>
            {orders.map((order) => (
              <Box
                key={order.id}
                bg='white'
                borderRadius='lg'
                shadow={1}
                p={4}
                borderWidth={1}
                borderColor='coolGray.200'>
                <HStack justifyContent='space-between' alignItems='center' mb={2}>
                  <Text bold fontSize='md'>
                    Order #{order.id}
                  </Text>
                  <Badge
                    colorScheme={
                      order.status === "Delivered"
                        ? "green"
                        : order.status === "Confirmed"
                          ? "amber"
                          : "coolGray"
                    }
                    rounded='full'>
                    {order.status}
                  </Badge>
                </HStack>

                <Divider mb={2} />

                <VStack space={1}>
                  <Text fontSize='sm' color='coolGray.600'>
                    Items: {order.items?.length || 0}
                  </Text>
                  {order.total && (
                    <Text fontSize='sm' color='coolGray.800' bold>
                      Total: ₹{order.total}
                    </Text>
                  )}
                  {order.createdAt && (
                    <Text fontSize='xs' color='coolGray.500'>
                      {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  )}
                </VStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      )}
    </Box>
  );
}
