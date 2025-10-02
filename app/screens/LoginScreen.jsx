import { Box, Button, Checkbox, HStack, Image, Link, Text, VStack, useTheme } from "native-base";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard as RNKeyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);

  const { colors } = useTheme();

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

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}>
        <TouchableWithoutFeedback onPress={RNKeyboard.dismiss} accessible={false}>
          <Box flex={1} px={8} py={6}>
            <VStack flex={1} justifyContent='space-between'>
              {/* Header */}
              <VStack alignItems='center' mt={12} space={2}>
                <Image
                  source={require("../assets/logo.png")}
                  alt='Raavito'
                  size='xl'
                  resizeMode='contain'
                />
                <Text fontSize='2xl' bold>
                  Welcome Back
                </Text>
                <Text fontSize='md' color='coolGray.500'>
                  Please log in to continue
                </Text>
              </VStack>

              {/* Form */}
              <VStack space={5} mt={8}>
                {/* Mobile Input */}
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: focused === "mobile" ? colors.brand.orange : colors.brand.gray,
                    },
                  ]}>
                  <TextInput
                    value={mobile}
                    onChangeText={setMobile}
                    placeholder='Mobile Number'
                    placeholderTextColor='#777'
                    keyboardType='phone-pad'
                    maxLength={10}
                    onFocus={() => setFocused("mobile")}
                    onBlur={() => setFocused(null)}
                    style={styles.input}
                  />
                </View>

                {/* Password Input */}
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: focused === "password" ? colors.brand.orange : colors.brand.gray,
                    },
                  ]}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Password'
                    placeholderTextColor='#777'
                    secureTextEntry
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    style={styles.input}
                  />
                </View>

                {/* Remember + Forgot */}
                <HStack justifyContent='space-between' alignItems='center'>
                  <Checkbox value='remember' accessibilityLabel='Remember me'>
                    Remember me
                  </Checkbox>
                  <Link>Forgot Password?</Link>
                </HStack>

                {/* Terms */}
                <Text fontSize='xs' color='coolGray.600' textAlign='center'>
                  By clicking Sign In you certify that you agree to our{" "}
                  <Text color='brand.orange'>Privacy Policy</Text> and{" "}
                  <Text color='brand.orange'>Terms & Conditions</Text>
                </Text>

                {/* Sign In Button */}
                <Button
                  onPress={handleLogin}
                  mt={4}
                  bg='brand.orange'
                  _pressed={{ bg: "brand.green" }}>
                  Sign In
                </Button>
              </VStack>

              {/* Footer */}
              <VStack space={4} alignItems='center' mb={12}>
                <Text fontSize='md'>
                  New User?{" "}
                  <Text color='brand.orange' bold onPress={handleRegister}>
                    Register
                  </Text>
                </Text>
              </VStack>
            </VStack>
          </Box>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  inputWrapper: {
    borderRadius: 25,
    borderWidth: 1.5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: "OpenSans",
    color: "#000",
  },
});
