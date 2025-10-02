<<<<<<< HEAD
import { Box, Button, Checkbox, HStack, Image, Link, Text, VStack, useTheme } from "native-base";
import { useState } from "react";
=======
// // screens/LoginScreen.js
// import { Box, Button, Checkbox, HStack, Image, Link, Text, VStack, useTheme } from 'native-base';
// import { useState } from 'react';
// import { Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '../context/AuthContext';

// export default function LoginScreen({ navigation }) {
//   const { login } = useAuth();
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const { colors } = useTheme(); // 👈 use Raavito theme

//   const handleLogin = () => {
//     if (!mobile || !password) {
//       Alert.alert('Missing Fields', 'Please enter both mobile number and password.');
//       return;
//     }

//     if (mobile === '9999999999' && password === '12345') {
//       login({ id: Date.now(), mobile });
//       navigation.replace('Main');
//     } else {
//       Alert.alert('Invalid Credentials', 'Mobile number or password is incorrect.');
//     }
//   };

//   const handleRegister = () => {
//     navigation.navigate('Register');
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}>
//         <Box flex={1} px={8} py={6} bg='white'>
//           <VStack flex={1} justifyContent='space-between'>
//             {/* Header */}
//             <HStack alignItems='center' justifyContent='space-between' mb={-5} space={7}>
//               <VStack>
//                 <Text fontSize='4xl' bold fontFamily='Poppins' color='brand.dark'>
//                   Hello,
//                 </Text>
//                 <Text fontSize='16' color='coolGray.500' fontFamily='OpenSans'>
//                   Please Log in to Continue
//                 </Text>
//               </VStack>
//               <Image
//                 source={require('../assets/logo.png')}
//                 alt='Raavito'
//                 size='175'
//                 // size='75'
//                 resizeMode='contain'
//               />
//             </HStack>

//             {/* Form */}
//             <VStack space={6}>
//               {/* Mobile Input */}
//               <TextInput
//                 value={mobile}
//                 onChangeText={setMobile}
//                 placeholder='Mobile Number'
//                 keyboardType='phone-pad'
//                 maxLength={10}
//                 style={{
//                   borderWidth: 1,
//                   borderColor: 'black',
//                   padding: 14,
//                   borderRadius: 10,
//                   fontSize: 16,
//                   fontFamily: 'OpenSans',
//                 }}
//               />

//               {/* Password Input */}
//               <TextInput
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder='Password'
//                 secureTextEntry
//                 style={{
//                   borderWidth: 1,
//                   borderColor: 'black.050',
//                   padding: 14,
//                   borderRadius: 10,
//                   fontSize: 16,
//                   fontFamily: 'OpenSans',
//                 }}
//               />

//               {/* Remember + Forgot */}
//               <HStack justifyContent='space-between' alignItems='center'>
//                 <Checkbox value='remember' accessibilityLabel='Remember me'>
//                   Remember me
//                 </Checkbox>
//                 <Link
//                   _text={{
//                     color: 'brand.orange',
//                     fontSize: 'sm',
//                     fontFamily: 'OpenSans',
//                   }}>
//                   Forgot Password?
//                 </Link>
//               </HStack>

//               {/* Terms */}
//               <Text
//                 fontSize='xs'
//                 color='coolGray.600'
//                 textAlign='center'
//                 lineHeight='lg'
//                 fontFamily='OpenSans'>
//                 By clicking Sign In you certify that you agree to our{' '}
//                 <Text color='brand.orange'>Privacy Policy</Text> and{' '}
//                 <Text color='brand.orange'>Terms & Conditions</Text>
//               </Text>

//               {/* Sign In Button */}
//               <Button
//                 onPress={handleLogin}
//                 bg='brand.orange'
//                 _pressed={{ bg: 'brand.green' }}
//                 _text={{
//                   fontFamily: 'Poppins',
//                   fontWeight: 'bold',
//                   fontSize: 'lg',
//                 }}
//                 rounded='lg'
//                 py={4}
//                 mt={4}>
//                 Sign In
//               </Button>
//             </VStack>

//             {/* Footer */}
//             <VStack space={4} alignItems='center' mt={10}>
//               <Text fontSize='md' fontFamily='OpenSans'>
//                 New User?{' '}
//                 {/* <Text color='brand.green' bold onPress={() => navigation.navigate('Register')}> */}
//                 <Text color='brand.orange' bold onPress={handleRegister}>
//                   Register
//                 </Text>
//               </Text>
//               {/* <Text fontSize='sm' color='coolGray.600' fontFamily='OpenSans'>
//                 Continue as a Guest
//               </Text> */}
//             </VStack>
//           </VStack>
//         </Box>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

import { Box, Button, Checkbox, HStack, Image, Link, Text, VStack, useTheme } from 'native-base';
import { useState } from 'react';
>>>>>>> 6494936f28ec9788daea78a4a0c304e62e96dc8d
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
