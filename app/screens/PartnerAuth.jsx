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
                <Pressable onPress={() => navigation.navigate("AuthStack")}>
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
                    Partner Login
                  </Text>
                  <Text fontSize='md' color='coolGray.700' textAlign='center'>
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
              </VStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

// Kitchen Register Screen
export function KitchenRegisterScreen({ navigation }) {
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({});
  const theme = useTheme();

  function handleFormData(name, value) {
    setFormData((prev) => {
      let obj = { ...prev };
      obj[name] = value;
      return obj;
    });
  }

  const handleRegister = async () => {
    const required = ["kitchenName", "ownerName", "mobile", "email", "city", "pincode", "password"];
    const missing = required.filter((k) => !formData[k]);
    if (missing.length) {
      return Alert.alert("Missing Fields", `Please fill: ${missing.join(", ")}`);
    }
    if (!agree) {
      return Alert.alert("Terms Required", "Please accept the terms and conditions");
    }

    try {
      setBusy(true);
      const payload = {
        name: formData.kitchenName,
        ownerName: formData.ownerName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        fssai: formData.fssai || undefined,
        password: formData.password,
      };
      const { data } = await axios_.post("/kitchens/register", payload);
      if (data?._id) {
        Alert.alert("Success!", "Kitchen registered. Please login to continue.");
        navigation.replace("PartnerLogin");
      } else {
        Alert.alert("Registration Failed", data?.message || "Could not register");
      }
    } catch (e) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setBusy(false);
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
              <VStack space={8} alignItems='center' w='100%'>
                <Pressable onPress={() => navigation.replace("PartnerLogin")}>
                  <Text
                    fontFamily='Poppins'
                    fontWeight='500'
                    color='brand.orange'
                    w='100%'
                    textAlign='right'
                    textDecorationLine='underline'
                    pr={2}>
                    Back to Login
                  </Text>
                </Pressable>

                <Image
                  source={require("../assets/logo.png")}
                  alt='Raavito'
                  w={100}
                  h={100}
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
                    Register Kitchen
                  </Text>
                  <Text fontSize='md' color='coolGray.700' textAlign='center'>
                    Start accepting orders today
                  </Text>
                </VStack>

                {/* Inputs */}
                <VStack space={4} w='100%'>
                  {/* Kitchen Name */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='restaurant-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={formData?.kitchenName}
                      onChangeText={(value) => handleFormData("kitchenName", value)}
                      placeholder='Kitchen Name'
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Owner Name */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='person-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={formData?.ownerName}
                      onChangeText={(value) => handleFormData("ownerName", value)}
                      placeholder='Owner Name'
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

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
                      onChangeText={(value) =>
                        handleFormData("mobile", value.replace(/[^0-9]/g, ""))
                      }
                      placeholder='Mobile Number'
                      keyboardType='phone-pad'
                      maxLength={10}
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Email */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='mail-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={formData?.email}
                      onChangeText={(value) => handleFormData("email", value)}
                      placeholder='Email Address'
                      keyboardType='email-address'
                      autoCapitalize='none'
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Address */}
                  <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                    <Ionicons
                      name='location-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={[styles.icon, styles.textAreaIcon]}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea, { color: theme.colors.brand.dark }]}
                      value={formData?.address}
                      onChangeText={(value) => handleFormData("address", value)}
                      placeholder='Complete Address'
                      multiline
                      numberOfLines={3}
                      textAlignVertical='top'
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* City */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='business-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={formData?.city}
                      onChangeText={(value) => handleFormData("city", value)}
                      placeholder='City'
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Pincode */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='pricetag-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={formData?.pincode}
                      onChangeText={(value) =>
                        handleFormData("pincode", value.replace(/[^0-9]/g, ""))
                      }
                      placeholder='Pincode'
                      keyboardType='number-pad'
                      maxLength={6}
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* FSSAI */}
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name='document-text-outline'
                      size={20}
                      color={theme.colors.brand.orange}
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.colors.brand.dark }]}
                      value={formData?.fssai}
                      onChangeText={(value) => handleFormData("fssai", value)}
                      placeholder='FSSAI Number (Optional)'
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
                      onChangeText={(value) => handleFormData("password", value)}
                      placeholder='Create Password'
                      secureTextEntry
                      blurOnSubmit={true}
                      placeholderTextColor={theme.colors.brand.gray}
                    />
                  </View>

                  {/* Terms Checkbox */}
                  <Checkbox
                    value='agree'
                    onChange={() => setAgree((prev) => !prev)}
                    isChecked={agree}
                    _checked={{
                      bg: theme.colors.brand.orange,
                      borderColor: theme.colors.brand.orange,
                    }}>
                    <Text fontSize='sm' color='coolGray.700'>
                      I agree to the{" "}
                      <Text color='brand.orange' fontWeight='600'>
                        Terms
                      </Text>{" "}
                      and{" "}
                      <Text color='brand.orange' fontWeight='600'>
                        Privacy Policy
                      </Text>
                    </Text>
                  </Checkbox>

                  {/* Register Button */}
                  <Button
                    onPress={handleRegister}
                    isLoading={busy}
                    shadow={6}
                    rounded='xl'
                    variant='outline'
                    borderColor='brand.light'
                    _text={{ fontWeight: "700", fontSize: "md", color: "white" }}
                    leftIcon={<Icon as={Ionicons} name='save-outline' size={6} color='white' />}
                    bg={{
                      linearGradient: {
                        colors: [theme.colors.brand.orange, theme.colors.brand.green],
                        start: [0, 0],
                        end: [1, 1],
                      },
                    }}>
                    Register Kitchen
                  </Button>

                  {/* Terms */}
                  <Text fontSize='xs' color='coolGray.600' textAlign='center' mt={2}>
                    By registering, you agree to our{" "}
                    <Text variant='label' color='brand.orange'>
                      Privacy Policy
                    </Text>{" "}
                    &{" "}
                    <Text variant='label' color='brand.orange'>
                      Terms
                    </Text>
                  </Text>
                </VStack>

                {/* Login Link */}
                <HStack mt={3}>
                  <Text fontSize='md' color='coolGray.700'>
                    Already registered?{" "}
                  </Text>
                  <Text
                    variant='label'
                    color='brand.orange'
                    fontWeight='700'
                    onPress={() => navigation.replace("PartnerLogin")}>
                    Login
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
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
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
    height: 50,
    fontSize: 16,
    fontFamily: "Poppins",
  },
  textArea: {
    height: 80,
    paddingTop: 14,
    paddingBottom: 14,
  },
});
