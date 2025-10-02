import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Checkbox, HStack, Icon, Image, Link, Text, VStack, useTheme } from "native-base";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const theme = useTheme();

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

  const handleRegister = () => navigation.navigate("Register");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../assets/loginbg.png")}
        resizeMode='cover'
        style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.flex}>
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps='handled'
              keyboardDismissMode={Platform.OS === "ios" ? "on-drag" : "none"}>
              <VStack space={10} alignItems='center' w='100%'>
                {/* Logo */}
                <Image
                  source={require("../assets/logo.png")}
                  alt='Raavito'
                  w={120}
                  h={120}
                  resizeMode='contain'
                  mb={2}
                />

                {/* Title */}
                <VStack space={1} alignItems='center'>
                  <Text
                    fontSize='3xl'
                    fontFamily='Poppins'
                    fontWeight='700'
                    color='brand.dark'
                    shadow={2}>
                    Welcome Back
                  </Text>
                  <Text fontSize='md' color='coolGray.700' textAlign='center'>
                    Trusted app for Desi Homemade food
                  </Text>
                </VStack>

                {/* Inputs */}
                <VStack space={5} w='100%'>
                  {/* Mobile */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='call-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder='Mobile Number'
                      keyboardType='phone-pad'
                      maxLength={10}
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Password */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='lock-closed-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={password}
                      onChangeText={setPassword}
                      placeholder='Password'
                      secureTextEntry
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Remember + Forgot */}
                  <HStack justifyContent='space-between' alignItems='center' mt={1}>
                    <Checkbox value='remember'>Remember me</Checkbox>
                    <Link _text={{ color: "brand.orange", fontWeight: "600" }}>
                      Forgot Password?
                    </Link>
                  </HStack>

                  {/* Sign-in Button with gradient */}
                  <Button
                    onPress={handleLogin}
                    shadow={6}
                    variant='outline'
                    borderColor='brand.light'
                    _text={{ fontWeight: "700", fontSize: "md", color: "white" }}
                    leftIcon={<Icon as={Ionicons} name='log-in-outline' size={6} color='white' />}
                    _linearGradient={{
                      as: LinearGradient,
                      colors: [theme.colors.brand.orange, theme.colors.brand.green],
                      start: [0, 0],
                      end: [1, 1],
                    }}>
                    Sign In
                  </Button>

                  {/* Google login */}
                  <Button
                    variant='outline'
                    borderColor='brand.light'
                    _text={{ color: "brand.light", fontWeight: "600" }}
                    leftIcon={
                      <Icon as={Ionicons} name='logo-google' size={5} color='brand.orange' />
                    }>
                    Continue with Google
                  </Button>

                  {/* Terms */}
                  <Text fontSize='xs' color='coolGray.600' textAlign='center' mt={2}>
                    By signing in, you agree to our{" "}
                    <Text variant='label' color='brand.orange'>
                      Privacy Policy
                    </Text>{" "}
                    &{" "}
                    <Text variant='label' color='brand.orange'>
                      Terms
                    </Text>
                  </Text>
                </VStack>

                {/* Register */}
                <HStack mt={5}>
                  <Text fontSize='md' color='coolGray.700'>
                    New here?{" "}
                  </Text>
                  <Text
                    variant='label'
                    color='brand.orange'
                    fontWeight='700'
                    onPress={handleRegister}>
                    Register
                  </Text>
                </HStack>
              </VStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  icon: { marginRight: 8 },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
});
