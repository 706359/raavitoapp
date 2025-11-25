import { Box, Button, Circle, HStack, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { axios_ } from "../../utils/utils";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../components/Loader";

const statusSteps = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

const steps = ["Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderTrackingScreen({ route, navigation }) {
  const { order: initialOrder } = route.params;
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [cancelling, setCancelling] = useState(false);

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

  useEffect(() => {
    fetchOrderDetails();

    // Poll for order updates every 10 seconds if order is not delivered/cancelled
    const interval = setInterval(() => {
      if (order && !['delivered', 'cancelled'].includes(order.status)) {
        fetchOrderDetails();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [initialOrder]);

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await axios_.put(`/orders/${order._id || order.id}/cancel`);
              Alert.alert('Success', 'Order cancelled successfully');
              fetchOrderDetails();
            } catch (error) {
              Alert.alert('Error', error?.response?.data?.message || 'Failed to cancel order');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });
  };

  const getTimeRemaining = (estimatedTime) => {
    if (!estimatedTime) return null;
    const now = new Date();
    const estimated = new Date(estimatedTime);
    const diff = estimated - now;
    if (diff <= 0) return 'Delivered';
    const minutes = Math.floor(diff / 60000);
    return `${minutes} mins`;
  };

  if (loading) {
    return (
      <Box flex={1} safeArea p={6} bg='white' justifyContent='center' alignItems='center'>
        <Loader size="large" color="orange" text="Loading order details..." />
      </Box>
    );
  }

  const orderId = order?._id || order?.id || 'N/A';
  const isCancelled = order?.status === 'cancelled';
  const canCancel = !['delivered', 'cancelled', 'out_for_delivery'].includes(order?.status);
  const timeRemaining = getTimeRemaining(order?.estimatedDeliveryTime);

  return (
    <Box flex={1} safeArea bg='white'>
      <ScrollView p={6}>
        {/* Order Header */}
        <VStack space={2} mb={6}>
          <Text fontSize='2xl' bold>
            Order #{orderId.toString().slice(-6)}
          </Text>
          {order?.status && (
            <Text fontSize='sm' color='gray.500'>
              Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
            </Text>
          )}
          {order?.estimatedDeliveryTime && !isCancelled && (
            <Box bg='orange.50' p={3} borderRadius='md' mt={2}>
              <HStack alignItems='center' space={2}>
                <Ionicons name='time-outline' size={18} color='#f97316' />
                <Text fontSize='sm' color='orange.700'>
                  {timeRemaining ? `Estimated delivery in ${timeRemaining}` : 'Delivered'}
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>

        {isCancelled ? (
          <Box bg='red.50' p={4} borderRadius='md' borderWidth={1} borderColor='red.200' mb={6}>
            <Text fontSize='md' color='red.600' bold>
              Order Cancelled
            </Text>
            <Text fontSize='sm' color='red.500' mt={2}>
              {order?.refundReason || 'This order has been cancelled.'}
            </Text>
            {order?.refundAmount > 0 && (
              <Text fontSize='sm' color='green.600' mt={2}>
                Refund of ₹{order.refundAmount.toFixed(2)} will be processed.
              </Text>
            )}
          </Box>
        ) : (
          <>
            {/* Order Progress */}
            <Box mb={6}>
              <Text fontSize='lg' bold mb={4}>
                Order Progress
              </Text>
              <VStack space={4}>
                {steps.map((label, index) => {
                  const active = index <= step;
                  const completed = index < step;
                  return (
                    <HStack key={index} space={4} alignItems='center'>
                      <Circle size={10} bg={active ? "green.500" : "coolGray.300"}>
                        {completed ? (
                          <Ionicons name='checkmark' size={16} color='white' />
                        ) : (
                          <Text color='white' fontSize='sm' bold>
                            {index + 1}
                          </Text>
                        )}
                      </Circle>
                      <VStack flex={1}>
                        <Text fontSize='md' bold={active} color={active ? "green.600" : "coolGray.500"}>
                          {label}
                        </Text>
                        {order?.statusHistory && order.statusHistory[index] && (
                          <Text fontSize='xs' color='gray.400'>
                            {formatTime(order.statusHistory[index].timestamp)}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  );
                })}
              </VStack>
            </Box>

            {/* Order Details */}
            <Box bg='gray.50' p={4} borderRadius='md' mb={4}>
              <Text fontSize='md' bold mb={3}>
                Order Details
              </Text>
              {order?.items && order.items.length > 0 && (
                <VStack space={2} mb={3}>
                  {order.items.map((item, index) => (
                    <HStack key={index} justifyContent='space-between'>
                      <Text fontSize='sm' flex={1}>
                        {item.menuItem?.name || 'Item'} x{item.qty}
                      </Text>
                      <Text fontSize='sm' fontWeight='600'>
                        ₹{(item.price * item.qty).toFixed(2)}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              )}
              {order?.subtotal && (
                <>
                  <HStack justifyContent='space-between' mb={1}>
                    <Text fontSize='sm' color='gray.600'>Subtotal</Text>
                    <Text fontSize='sm'>₹{order.subtotal.toFixed(2)}</Text>
                  </HStack>
                  {order.deliveryFee !== undefined && (
                    <HStack justifyContent='space-between' mb={1}>
                      <Text fontSize='sm' color='gray.600'>Delivery Fee</Text>
                      <Text fontSize='sm'>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee.toFixed(2)}`}</Text>
                    </HStack>
                  )}
                  {order.serviceCharge !== undefined && order.serviceCharge > 0 && (
                    <HStack justifyContent='space-between' mb={1}>
                      <Text fontSize='sm' color='gray.600'>Service Charge</Text>
                      <Text fontSize='sm'>₹{order.serviceCharge.toFixed(2)}</Text>
                    </HStack>
                  )}
                  {order.tax !== undefined && order.tax > 0 && (
                    <HStack justifyContent='space-between' mb={1}>
                      <Text fontSize='sm' color='gray.600'>Tax</Text>
                      <Text fontSize='sm'>₹{order.tax.toFixed(2)}</Text>
                    </HStack>
                  )}
                  {order.discountAmount > 0 && (
                    <HStack justifyContent='space-between' mb={1}>
                      <Text fontSize='sm' color='green.600'>Discount</Text>
                      <Text fontSize='sm' color='green.600'>-₹{order.discountAmount.toFixed(2)}</Text>
                    </HStack>
                  )}
                  <HStack justifyContent='space-between' mt={2} pt={2} borderTopWidth={1} borderColor='gray.200'>
                    <Text fontSize='md' bold>Total</Text>
                    <Text fontSize='md' bold>₹{order.total.toFixed(2)}</Text>
                  </HStack>
                </>
              )}
            </Box>

            {/* Delivery Address */}
            {order?.address && (
              <Box bg='gray.50' p={4} borderRadius='md' mb={4}>
                <Text fontSize='sm' color='gray.600' mb={2}>
                  Delivery Address:
                </Text>
                <Text fontSize='md'>{order.address}</Text>
                {order?.deliveryInstructions && (
                  <Box mt={2} pt={2} borderTopWidth={1} borderColor='gray.200'>
                    <Text fontSize='sm' color='gray.600' mb={1}>
                      Instructions:
                    </Text>
                    <Text fontSize='sm'>{order.deliveryInstructions}</Text>
                  </Box>
                )}
              </Box>
            )}

            {/* Action Buttons */}
            {canCancel && (
              <Button
                variant='outline'
                colorScheme='red'
                onPress={handleCancelOrder}
                isLoading={cancelling}
                mb={4}>
                Cancel Order
              </Button>
            )}

            <Button
              variant='outline'
              leftIcon={<Ionicons name='call-outline' size={20} />}
              onPress={() => {
                // TODO: Implement call support
                Alert.alert('Support', 'Call: +91-XXXXX-XXXXX');
              }}>
              Contact Support
            </Button>
          </>
        )}
      </ScrollView>
    </Box>
  );
}
