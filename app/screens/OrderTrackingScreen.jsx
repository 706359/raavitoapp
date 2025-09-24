import { Box, Circle, HStack, Text, VStack } from "native-base";
import { useEffect, useState } from "react";

const steps = ["Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderTrackingScreen({ route }) {
  const { order } = route.params;
  const [step, setStep] = useState(0);

  useEffect(() => {
    // simulate order progress
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box flex={1} safeArea p={6} bg='white'>
      <Text fontSize='2xl' bold mb={6}>
        Tracking Order #{order.id}
      </Text>

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
    </Box>
  );
}
