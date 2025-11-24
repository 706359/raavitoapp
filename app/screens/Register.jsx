import { Ionicons } from "@expo/vector-icons";
import { Box, Button, HStack, Image, VStack, useTheme } from "native-base";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { axios_ } from "./../../utils/utils";

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const [formData, setFormData] = useState({});
  const handleSignUp = async () => {
    let { firstName, lastName, mobile, password, referalCode } = formData;
    if (firstName === "" || lastName === "" || mobile === "" || password === "") {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios_.post("/users/register", {
        firstName,
        lastName,
        mobile,
        password,
        referalCode: referalCode || "DEFAULT",
      });

      if (res.data?.token && res.data?.user) {
        Alert.alert("Success", "Registration successful!", [
          {
            text: "OK",
            onPress: () => {
              // Auto-login after registration
              login({
                id: res.data.user._id,
                firstName: res.data.user.firstName,
                lastName: res.data.user.lastName,
                name: `${res.data.user.firstName} ${res.data.user.lastName}`,
                mobile: res.data.user.mobile,
                role: res.data.user.role || "user",
                token: res.data.token,
              });
              // Navigation will be handled by AppNavigator based on user state
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err?.response?.data?.message || "Something went wrong while registering.";
      Alert.alert("Error", errorMessage);
    }
  };

  function handleInputChange(name, value) {
    setFormData((prev) => {
      let obj = { ...prev };
      obj[name] = value;
      return obj;
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../assets/loginbg2.png")}
        resizeMode='cover'
        style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          <Box flex={1} px={8} py={6} bg='transparent'>
            <VStack flex={1} justifyContent='space-between'>
              {/* Header */}
              <HStack alignItems='center' justifyContent='space-between' mb={-5} space={7}>
                <VStack>
                  <Text style={[styles.greeting, { color: theme.colors.brand.dark }]}>Hey,</Text>
                  <Text style={styles.subtitle}>Please Sign up to Continue</Text>
                </VStack>
                <Image
                  source={require("../assets/logo.png")}
                  alt='Raavito'
                  size='105'
                  resizeMode='contain'
                />
              </HStack>

              {/* Form */}
              <VStack space={6} mt={6}>
                {/* First & Last Name */}
                <HStack space={2}>
                  <TextInput
                    value={formData?.firstName || ""}
                    onChangeText={(val) => handleInputChange("firstName", val)}
                    placeholder='First Name'
                    style={[styles.input, { flex: 1, borderColor: theme.colors.brand.dark }]}
                    placeholderTextColor={theme.colors.brand.gray}
                  />
                  <TextInput
                    value={formData?.lastName || ""}
                    onChangeText={(val) => handleInputChange("lastName", val)}
                    placeholder='Last Name'
                    style={[styles.input, { flex: 1, borderColor: theme.colors.brand.dark }]}
                    placeholderTextColor={theme.colors.brand.gray}
                  />
                </HStack>

                {/* Mobile */}
                <TextInput
                  value={formData?.mobile || ""}
                  onChangeText={(val) => handleInputChange("mobile", val)}
                  placeholder='Mobile Number'
                  keyboardType='phone-pad'
                  maxLength={10}
                  style={[styles.input, { borderColor: theme.colors.brand.dark }]}
                  placeholderTextColor={theme.colors.brand.gray}
                />
                {/* Mobile */}
                <TextInput
                  value={formData?.referalCode || ""}
                  onChangeText={(val) => handleInputChange("referalCode", val)}
                  placeholder='Referal Code'
                  keyboardType='phone-pad'
                  maxLength={10}
                  style={[styles.input, { borderColor: theme.colors.brand.dark }]}
                  placeholderTextColor={theme.colors.brand.gray}
                />

                {/* Password Input */}
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={formData?.password || ""}
                    onChangeText={(val) => handleInputChange("password", val)}
                    placeholder='Password'
                    secureTextEntry={!showPassword}
                    style={[styles.input, { borderColor: theme.colors.brand.dark }]}
                    placeholderTextColor={theme.colors.brand.gray}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={theme.colors.brand.gray}
                    />
                  </Pressable>
                </View>

                {/* Terms */}
                <Text style={styles.termsText}>
                  By clicking Sign Up you certify that you agree to our{" "}
                  <Text style={[styles.linkText, { color: theme.colors.brand.orange }]}>
                    Privacy Policy
                  </Text>{" "}
                  and{" "}
                  <Text style={[styles.linkText, { color: theme.colors.brand.orange }]}>
                    Terms & Conditions
                  </Text>
                  .
                </Text>

                {/* Button */}
                <Button
                  onPress={handleSignUp}
                  shadow={6}
                  w='60%'
                  alignSelf='center'
                  _text={{
                    fontFamily: "Poppins",
                    fontWeight: "700",
                    fontSize: "md",
                    color: "white",
                  }}
                  _pressed={{ bg: "brand.green" }}
                  bg='brand.orange'>
                  Sign Up
                </Button>
              </VStack>

              {/* Footer */}
              <VStack space={4} alignItems='center' mt={10}>
                <Text style={styles.footerText}>
                  Already have an account?{" "}
                  <Text
                    style={[styles.linkText, { color: theme.colors.brand.orange }]}
                    onPress={() => navigation.navigate("Login")}>
                    Sign In
                  </Text>
                </Text>
              </VStack>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  greeting: { fontSize: 28, fontFamily: "Poppins", fontWeight: "700" },
  subtitle: { fontSize: 16, fontFamily: "OpenSans", color: "#666" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "OpenSans",
    backgroundColor: "#fff",
  },
  passwordToggle: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  termsText: { fontSize: 12, color: "#666", textAlign: "center", lineHeight: 18 },
  linkText: { fontWeight: "600" },
  footerText: { fontSize: 14, fontFamily: "OpenSans", color: "#333" },
});
