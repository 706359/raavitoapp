import { Box, Spinner, Text, VStack } from "native-base";
import { useEffect } from "react";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // later we can check auth context here
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Box flex={1} alignItems="center" justifyContent="center" bg="white">
      <VStack space={4} alignItems="center">
        <Text fontSize="3xl" bold color="blue.600">
          Raavito
        </Text>
        <Spinner size="lg" color="blue.600" />
      </VStack>
    </Box>
  );
}
