import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Checkbox, HStack, Icon, Image, Link, Text, VStack, useTheme } from "native-base";
import React, { useEffect, useState } from "react";
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
import { axios_ } from "../../utils/utils";
import { useAuth } from "../context/AuthContext";

// Partner Login Screen
export function PartnerLoginScreen({ navigation }) {
  const { login } = useAuth();
  const [remember, setRemember] = useState(true);
  const [formData, setFormData] = useState({});
  const theme = useTheme();

  useEffect(() => {
    getRemembered();
  }, []);

  async function getRemembered() {
    let remember = await AsyncStorage.getItem("partnerRemember");
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
        AsyncStorage.setItem("partnerRemember", JSON.stringify({ mobile, password }));
      } else {
        AsyncStorage.removeItem("partnerRemember");
      }

      // Try partner login endpoint
      let response = await axios_.post("/partners/login", formData);
      response = response.data;

      if (response.token) {
        login({
          id: response._id,
          name: response.name,
          mobile,
          token: response.token,
          role: "partner",
        });
        Alert.alert("Success", "Login successful!");
        // Navigate to Partner Dashboard
        navigation.replace("PartnerDashboard");
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Check if it's a 404 error (endpoint not found)
      if (error.response?.status === 404) {
        Alert.alert(
          "Endpoint Not Found",
          "Partner login endpoint is not available. Using temporary authentication.",
          [
            {
              text: "OK",
              onPress: () => {
                // Temporary fallback for development
                if (formData.mobile === "8958111112" && formData.password === "12345") {
                  login({
                    id: "temp_partner_1",
                    name: "Test Kitchen",
                    mobile: formData.mobile,
                    token: "temp_token_v1",
                    role: "partner",
                  });
                  // Navigate to Partner Dashboard
                  navigation.replace("PartnerDashboard");
                } else {
                  Alert.alert("Error", "Invalid test credentials. Use 8958111112 / 12345");
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Something went wrong while logging in."
        );
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../assets/loginbg2.png")}
        resizeMode='cover'
        style={styles.backgroundImage}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.flex}>
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps='handled'
              keyboardDismissMode={Platform.OS === "ios" ? "on-drag" : "none"}>
              <VStack space={10} alignItems='center' w='100%'>
                {/* <Pressable onPress={() => navigation.navigate("AuthStack")}>
                  <Text
                    fontFamily='Poppins'
                    fontWeight='500'
                    color='brand.orange'
                    w='100%'
                    textAlign='right'
                    textDecorationLine='underline'
                    pr={2}>
                    Back to User Login
                  </Text>
                </Pressable> */}

                <Image
                  source={require("../assets/logo.png")}
                  alt='Raavito'
                  w={120}
                  h={120}
                  resizeMode='contain'
                />

                {/* Title */}
                <VStack space={2} alignItems='center' mb={2}>
                  <Text
                    fontSize='3xl'
                    fontFamily='Poppins'
                    fontWeight='700'
                    color='brand.dark'
                    shadow={1}
                    letterSpacing={0.5}>
                    Partner Login
                  </Text>
                  <Text fontSize='md' color='coolGray.700' textAlign='center' fontFamily='OpenSans'>
                    Access your kitchen dashboard
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
                        handleFormData("mobile", value.replace(/[^0-9]/g, ""));
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
                      defaultIsChecked={remember}
                      value='remember'
                      _checked={{
                        bg: theme.colors.brand.orange,
                        borderColor: theme.colors.brand.orange,
                      }}>
                      Remember me
                    </Checkbox>
                    <Link
                      _text={{ color: "brand.orange", fontWeight: "600" }}
                      onPress={() => navigation.navigate?.("ForgotPassword")}>
                      Forgot Password?
                    </Link>
                  </HStack>

                  {/* Partner Sign-in Button with gradient */}
                  <Button
                    onPress={handleLogin}
                    shadow={6}
                    w='75%'
                    alignSelf='center'
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
                    Partner Sign In
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
                    New partner?{" "}
                  </Text>
                  <Text
                    variant='label'
                    color='brand.orange'
                    fontWeight='700'
                    onPress={() => navigation.navigate("KitchenRegister")}>
                    Register Kitchen
                  </Text>
                </HStack>
                <Pressable
                  onPress={() => navigation.navigate("AuthStack")}
                  style={styles.partnerCard}>
                  <View style={styles.partnerCardContent}>
                    <View style={styles.partnerIconContainer}>
                      <Ionicons name='person' size={24} color={theme.colors.brand.green} />
                    </View>
                    <View style={styles.partnerTextContainer}>
                      <Text style={styles.partnerTitle}>Not a Restaurant Partner?</Text>
                      <Text style={styles.partnerSubtitle}>
                        Login as a user to explore kitchens
                      </Text>
                    </View>
                    <Ionicons name='arrow-forward' size={20} color={theme.colors.brand.green} />
                  </View>
                </Pressable>
              </VStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(249, 115, 22, 0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 8,
  },
  textAreaIcon: {
    marginTop: 14,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    fontFamily: "OpenSans",
    paddingLeft: 4,
  },
  textArea: {
    height: 80,
    paddingTop: 14,
    paddingBottom: 14,
  },
  partnerCard: {
    width: "100%",
    marginBottom: 8,
  },
  partnerCardContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#fed7aa",
    shadowColor: "#f57506",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  partnerIconContainer: {
    width: 48,
    height: 30,
    borderRadius: 24,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  partnerTextContainer: {
    flex: 1,
  },
  partnerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Poppins",
    marginBottom: 2,
  },
  partnerSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily: "OpenSans",
  },
});
