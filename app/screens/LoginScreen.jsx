import { useAuth } from "@/context/AuthContext";
import { Box, Button, Input, Text, VStack } from "native-base";
import { useState } from "react";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;
    // mock login user object
    login({ id: Date.now(), email });
    navigation.replace("Main");
  };

  return (
    <Box flex={1} safeArea p={4} bg="white">
      <Text fontSize="2xl" bold mb={6}>
        Login
      </Text>

      <VStack space={4}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          type="password"
        />

        <Button onPress={handleLogin} colorScheme="blue">
          Login
        </Button>
      </VStack>
    </Box>
  );
}
