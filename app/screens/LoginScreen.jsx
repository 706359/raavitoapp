import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Checkbox, HStack, Icon, Image, Link, Text, VStack, useTheme } from "native-base";
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { axios_ } from "./../../utils/utils";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [remember, setRemember] = useState(true);
  const [formData, setFormData] = useState({});
  const theme = useTheme();

  useEffect(() => {
    getRemembered();
  }, []);

  async function getRemembered() {
    let remember = await AsyncStorage.getItem("remember");
    console.log("remember", remember);
    if (remember) {
      remember = JSON.parse(remember);
      setFormData(remember);
    }
  }
  function handleFormData(name, value) {
    setFormData((prev) => {
      let obj = { ...prev };
      obj[name] = value;
      return obj;
    });
  }
  const handleLogin = async () => {
    try {
      let { mobile, password } = formData;
      if (!mobile || !password) {
        return Alert.alert("Invalid Credentials", "Please enter valid credentials");
      }
      if (remember) {
        AsyncStorage.setItem("remember", JSON.stringify({ mobile, password }));
      } else {
        AsyncStorage.removeItem("remember");
      }
      let response = await axios_.post("/users/login", formData);

      response = response.data;
      if (response.token) {
        // success: save user & token
        login({ id: response._id, name: response.name, mobile, token: response.token });
        Alert.alert("Success", "Login successful!");
        // navigation.replace("MainTabs");
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong while logging in.");
    }
  };

  const handleRegister = () => navigation.navigate("Register");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../assets/loginbg2.png")}
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
                <Pressable onPress={() => navigation.navigate("PartnerLogin")}>
                  <Text
                    fontFamily='Poppins'
                    fontWeight='500'
                    color='brand.orange'
                    w='100%'
                    textAlign='right'
                    textDecorationLine='underline'>
                    Login with Raavito Partner
                  </Text>
                </Pressable>

                <Image
                  source={require("../assets/logo.png")}
                  alt='Raavito'
                  w={120}
                  h={120}
                  resizeMode='contain'
                />

                {/* Title */}
                <VStack space={1} alignItems='center'>
                  <Text
                    fontSize='2xl'
                    fontFamily='Poppins'
                    fontWeight='700'
                    color='brand.dark'
                    shadow={1}>
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
                      value={formData?.mobile}
                      onChangeText={(value) => {
                        handleFormData("mobile", value);
                      }}
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
                      value={formData?.password}
                      onChangeText={(value) => {
                        handleFormData("password", value);
                      }}
                      placeholder='Password'
                      secureTextEntry
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Remember + Forgot */}
                  <HStack justifyContent='space-between' alignItems='center' mt={1}>
                    <Checkbox
                      onChange={() => {
                        setRemember((prev) => !prev);
                      }}
                      defaultIsChecked={remember}>
                      Remember me
                    </Checkbox>
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
                    User Sign In
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
    borderWidth: 0.5,
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
