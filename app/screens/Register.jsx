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

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();

  const handleSignUp = () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }
    register({ id: Date.now(), firstName, lastName, email, phone });
    Alert.alert("Success", "Registered successfully!");
    navigation.replace("Login");
  };

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
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder='First Name'
                    style={[styles.input, { flex: 1, borderColor: theme.colors.brand.dark }]}
                    placeholderTextColor={theme.colors.brand.gray}
                  />
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder='Last Name'
                    style={[styles.input, { flex: 1, borderColor: theme.colors.brand.dark }]}
                    placeholderTextColor={theme.colors.brand.gray}
                  />
                </HStack>

                {/* Other Inputs */}
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder='Email'
                  keyboardType='email-address'
                  style={[styles.input, { borderColor: theme.colors.brand.dark }]}
                  placeholderTextColor={theme.colors.brand.gray}
                />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder='Phone Number'
                  keyboardType='phone-pad'
                  maxLength={10}
                  style={[styles.input, { borderColor: theme.colors.brand.dark }]}
                  placeholderTextColor={theme.colors.brand.gray}
                />
                <TextInput
                  value={referral}
                  onChangeText={setReferral}
                  placeholder='Referral Code (Optional)'
                  style={[styles.input, { borderColor: theme.colors.brand.dark }]}
                  placeholderTextColor={theme.colors.brand.gray}
                />

                {/* Password Input */}
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
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
