import { useAuth } from "@/context/AuthContext";
import { Box, Button, Text, VStack } from "native-base";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, TextInput } from "react-native";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!mobile || !password) {
      Alert.alert("Missing Fields", "Please enter both mobile number and password.");
      return;
    }

    if (mobile === "9999999999" && password === "12345") {
      login({ id: Date.now(), mobile });
      navigation.replace("Main");
    } else {
      Alert.alert("Invalid Credentials", "Mobile number or password is incorrect.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <Box flex={1} safeArea p={4} bg='white'>
        <Text fontSize='2xl' bold mb={6}>
          Login
        </Text>

        <VStack space={4}>
          <TextInput
            value={mobile}
            onChangeText={setMobile}
            placeholder='Mobile Number'
            keyboardType='phone-pad'
            maxLength={10}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 6,
            }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder='Password'
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 6,
            }}
          />

          <Button onPress={handleLogin} colorScheme='blue'>
            Login
          </Button>
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  );
}
