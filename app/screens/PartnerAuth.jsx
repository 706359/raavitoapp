// screens/PartnerAuthRedesigned.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Checkbox,
  HStack,
  Icon,
  Image,
  Link,
  Pressable,
  Text,
  VStack,
  useTheme,
} from "native-base";
import React, { useEffect, useState } from "react";
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
import { axios_ } from "../../utils/utils";
import { useAuth } from "../context/AuthContext";

// Shared UI
const Field = ({ icon, children, borderColor }) => (
  <View style={[styles.inputWrapper, { borderColor }]}>
    <Ionicons name={icon} size={20} color='#FF6A00' style={styles.icon} />
    {children}
  </View>
);

const Header = ({ title, subtitle }) => (
  <VStack space={1} alignItems='center'>
    <Text fontSize='2xl' fontFamily='Poppins' fontWeight='700' color='brand.dark'>
      {title}
    </Text>
    <Text fontSize='md' color='coolGray.700' textAlign='center'>
      {subtitle}
    </Text>
  </VStack>
);

// ---------------- Partner Login (redesigned) ----------------
export function PartnerLoginScreen({ navigation }) {
  const { login } = useAuth();
  const [remember, setRemember] = useState(true);
  const [form, setForm] = useState({});
  const theme = useTheme();

  // tokens with fallback
  const ORANGE = theme?.colors?.brand?.orange ?? "#FF6A00";
  const DARK = theme?.colors?.brand?.dark ?? "#111827";
  const GRAY = theme?.colors?.brand?.gray ?? "#9CA3AF";
  const LIGHT = theme?.colors?.brand?.light ?? "#E5E7EB";
  const GREEN = theme?.colors?.brand?.green ?? "#22C55E";

  useEffect(() => {
    (async () => {
      const r = await AsyncStorage.getItem("remember");
      if (r) setForm(JSON.parse(r));
    })();
  }, []);

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onLogin = async () => {
    const { mobile, password } = form;
    if (!mobile || !password) return Alert.alert("Invalid", "Enter mobile and password");
    try {
      if (remember) await AsyncStorage.setItem("remember", JSON.stringify({ mobile, password }));
      else await AsyncStorage.removeItem("remember");

      const { data } = await axios_.post("/partners/login", { mobile, password });
      if (data?.token) {
        login({ id: data._id, name: data.name, mobile, token: data.token, role: "partner" });
        // navigation.replace("MainTabs");
      } else Alert.alert("Login Failed", data?.message || "Invalid credentials");
    } catch (e) {
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/loginbg2.png")}
        resizeMode='cover'
        style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.flex}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
              <VStack space={8} alignItems='center' w='100%'>
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
                <Header title='Welcome Back' subtitle='Partner console access' />

                <VStack space={5} w='100%'>
                  <Field icon='call-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.mobile}
                      onChangeText={(v) => setF("mobile", v.replace(/[^0-9]/g, ""))}
                      placeholder='Mobile number'
                      placeholderTextColor={GRAY}
                      keyboardType='number-pad'
                      maxLength={10}
                    />
                  </Field>

                  <Field icon='lock-closed-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.password}
                      onChangeText={(v) => setF("password", v)}
                      placeholder='Password'
                      placeholderTextColor={GRAY}
                      secureTextEntry
                    />
                  </Field>

                  <HStack justifyContent='space-between' alignItems='center'>
                    <Checkbox
                      value='remember'
                      isChecked={remember}
                      onChange={() => setRemember((p) => !p)}
                      _checked={{ bg: ORANGE, borderColor: ORANGE }}>
                      Remember me
                    </Checkbox>
                    <Link
                      _text={{ color: "brand.orange", fontWeight: "600" }}
                      onPress={() => navigation.navigate?.("ForgotPassword")}>
                      Forgot Password?
                    </Link>
                  </HStack>

                  <Button
                    onPress={onLogin}
                    rounded='xl'
                    shadow={6}
                    _text={{ fontWeight: "700", color: "white" }}
                    leftIcon={<Icon as={Ionicons} name='log-in-outline' size={6} color='white' />}
                    bg={{
                      linearGradient: { colors: [ORANGE, GREEN], start: [0, 0], end: [1, 1] },
                    }}>
                    Partner Sign In
                  </Button>

                  <HStack justifyContent='center'>
                    <Text color='coolGray.700'>New partner? </Text>
                    <Text
                      color='brand.orange'
                      fontWeight='700'
                      onPress={() => navigation.navigate("KitchenRegister")}>
                      Register kitchen
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

// ---------------- Kitchen Register (redesigned) ----------------
export function KitchenRegisterScreen({ navigation }) {
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({});
  const theme = useTheme();

  const ORANGE = theme?.colors?.brand?.orange ?? "#FF6A00";
  const DARK = theme?.colors?.brand?.dark ?? "#111827";
  const GRAY = theme?.colors?.brand?.gray ?? "#9CA3AF";
  const LIGHT = theme?.colors?.brand?.light ?? "#E5E7EB";
  const GREEN = theme?.colors?.brand?.green ?? "#22C55E";

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onRegister = async () => {
    const required = ["kitchenName", "ownerName", "mobile", "email", "city", "pincode", "password"];
    const missing = required.filter((k) => !form[k]);
    if (missing.length) return Alert.alert("Missing", `Fill: ${missing.join(", ")}`);
    if (!agree) return Alert.alert("Terms", "Please accept the terms");

    try {
      setBusy(true);
      const payload = {
        name: form.kitchenName,
        ownerName: form.ownerName,
        mobile: form.mobile,
        email: form.email,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        fssai: form.fssai || undefined,
        password: form.password,
      };
      const { data } = await axios_.post("/kitchens/register", payload);
      if (data?._id) {
        Alert.alert("Registered", "Kitchen created. Please login");
        navigation.replace("PartnerLogin");
      } else Alert.alert("Failed", data?.message || "Could not register");
    } catch {
      Alert.alert("Error", "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/loginbg2.png")}
        resizeMode='cover'
        style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.flex}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
              <VStack space={8} alignItems='center' w='100%'>
                <Text
                  fontFamily='Poppins'
                  fontWeight='500'
                  color='brand.orange'
                  textAlign='right'
                  textDecorationLine='underline'
                  alignSelf='stretch'
                  pr={2}>
                  Register your Kitchen
                </Text>

                <Image
                  source={require("../assets/logo.png")}
                  alt='Raavito'
                  w={100}
                  h={100}
                  resizeMode='contain'
                />
                <Header title='Create partner account' subtitle='Start accepting orders' />

                <VStack space={5} w='100%'>
                  <Field icon='restaurant-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.kitchenName}
                      onChangeText={(v) => setF("kitchenName", v)}
                      placeholder='Kitchen name'
                      placeholderTextColor={GRAY}
                    />
                  </Field>
                  <Field icon='person-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.ownerName}
                      onChangeText={(v) => setF("ownerName", v)}
                      placeholder='Owner name'
                      placeholderTextColor={GRAY}
                    />
                  </Field>
                  <Field icon='call-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.mobile}
                      onChangeText={(v) => setF("mobile", v.replace(/[^0-9]/g, ""))}
                      placeholder='Mobile number'
                      placeholderTextColor={GRAY}
                      keyboardType='number-pad'
                      maxLength={10}
                    />
                  </Field>
                  <Field icon='mail-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.email}
                      onChangeText={(v) => setF("email", v)}
                      placeholder='Email'
                      placeholderTextColor={GRAY}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  </Field>
                  <Field icon='location-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK, height: 70 }]}
                      value={form?.address}
                      onChangeText={(v) => setF("address", v)}
                      placeholder='Address'
                      placeholderTextColor={GRAY}
                      multiline
                    />
                  </Field>
                  <Field icon='business-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.city}
                      onChangeText={(v) => setF("city", v)}
                      placeholder='City'
                      placeholderTextColor={GRAY}
                    />
                  </Field>
                  <Field icon='pricetag-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.pincode}
                      onChangeText={(v) => setF("pincode", v.replace(/[^0-9]/g, ""))}
                      placeholder='Pincode'
                      placeholderTextColor={GRAY}
                      keyboardType='number-pad'
                      maxLength={6}
                    />
                  </Field>
                  <Field icon='document-text-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.fssai}
                      onChangeText={(v) => setF("fssai", v)}
                      placeholder='FSSAI number (optional)'
                      placeholderTextColor={GRAY}
                    />
                  </Field>
                  <Field icon='lock-closed-outline' borderColor={LIGHT}>
                    <TextInput
                      style={[styles.input, { color: DARK }]}
                      value={form?.password}
                      onChangeText={(v) => setF("password", v)}
                      placeholder='Password'
                      placeholderTextColor={GRAY}
                      secureTextEntry
                    />
                  </Field>

                  <Checkbox
                    value='agree'
                    isChecked={agree}
                    onChange={() => setAgree((p) => !p)}
                    _checked={{ bg: ORANGE, borderColor: ORANGE }}>
                    I agree to the <Text color='brand.orange'>Terms</Text> and{" "}
                    <Text color='brand.orange'>Privacy Policy</Text>
                  </Checkbox>

                  <Button
                    isLoading={busy}
                    onPress={onRegister}
                    rounded='xl'
                    shadow={6}
                    _text={{ fontWeight: "700", color: "white" }}
                    leftIcon={<Icon as={Ionicons} name='save-outline' size={6} color='white' />}
                    bg={{
                      linearGradient: { colors: [ORANGE, GREEN], start: [0, 0], end: [1, 1] },
                    }}>
                    Register Kitchen
                  </Button>

                  <HStack justifyContent='center'>
                    <Text color='coolGray.700'>Already registered? </Text>
                    <Text
                      color='brand.orange'
                      fontWeight='700'
                      onPress={() => navigation.replace("PartnerLogin")}>
                      Login
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 24 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  icon: { marginRight: 8, color: "#FF6A00" },
  input: { flex: 1, height: 50, fontSize: 16, fontFamily: "Poppins" },
});
