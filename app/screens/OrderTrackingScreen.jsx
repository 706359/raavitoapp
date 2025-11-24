import { Box, Circle, HStack, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { axios_ } from "../../utils/utils";

const statusSteps = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

const steps = ["Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderTrackingScreen({ route }) {
  const { order: initialOrder } = route.params;
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = initialOrder?._id || initialOrder?.id;
        if (!orderId) {
          setLoading(false);
          return;
        }

        const { data } = await axios_.get(`/orders/${orderId}`);
        setOrder(data);
        
        // Map order status to step
        const status = data?.status || 'pending';
        const stepIndex = statusSteps[status] || 0;
        setStep(Math.max(0, Math.min(stepIndex, steps.length - 1)));
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [initialOrder]);

  if (loading) {
    return (
      <Box flex={1} safeArea p={6} bg='white' justifyContent='center' alignItems='center'>
        <ActivityIndicator size='large' color='#b94a01ff' />
      </Box>
    );
  }

  const orderId = order?._id || order?.id || 'N/A';
  const isCancelled = order?.status === 'cancelled';

  return (
    <Box flex={1} safeArea p={6} bg='white'>
      <Text fontSize='2xl' bold mb={2}>
        Tracking Order #{orderId.toString().slice(-6)}
      </Text>
      {order?.status && (
        <Text fontSize='sm' color='gray.500' mb={6}>
          Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
        </Text>
      )}

      {isCancelled ? (
        <Box bg='red.50' p={4} borderRadius='md' borderWidth={1} borderColor='red.200'>
          <Text fontSize='md' color='red.600' bold>
            Order Cancelled
          </Text>
          <Text fontSize='sm' color='red.500' mt={2}>
            This order has been cancelled.
          </Text>
        </Box>
      ) : (
        <VStack space={6}>
          {steps.map((label, index) => {
            const active = index <= step;
            return (
              <HStack key={index} space={4} alignItems='center'>
                <Circle size={8} bg={active ? "green.500" : "coolGray.300"}>
                  <Text color='white' fontSize='sm'>
                    {index + 1}
                  </Text>
                </Circle>
                <Text fontSize='md' bold={active} color={active ? "green.600" : "coolGray.500"}>
                  {label}
                </Text>
              </HStack>
            );
          })}
        </VStack>
      )}

      {order?.address && (
        <Box mt={8} p={4} bg='gray.50' borderRadius='md'>
          <Text fontSize='sm' color='gray.600' mb={2}>
            Delivery Address:
          </Text>
          <Text fontSize='md'>{order.address}</Text>
        </Box>
      )}
    </Box>
  );
}
