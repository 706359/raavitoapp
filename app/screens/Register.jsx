import { Ionicons } from '@expo/vector-icons';
import { Box, Button, HStack, Image, VStack } from 'native-base';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth(); // your register function
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referral, setReferral] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }
    register({ id: Date.now(), firstName, lastName, email, phone });
    Alert.alert('Success', 'Registered successfully!');
    navigation.replace('Login');
  };

  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <Box flex={1} px={8} py={6} bg='white'>
          <VStack flex={1} justifyContent='space-between'>
            {/* Header */}
            <HStack alignItems='center' justifyContent='space-between' mb={-5} space={7}>
              <VStack>
                <Text style={styles.greeting}>Hey,</Text>
                <Text style={styles.subtitle}>Please Sign up to Continue</Text>
              </VStack>
              <Image
                source={require('../assets/logo.png')}
                alt='Raavito'
                size='105'
                resizeMode='contain'
              />
            </HStack>

            {/* Form */}
            <VStack space={6} mt={6}>
              {/* First & Last Name Row */}
              {/* First & Last Name Row */}
              <HStack space={2}>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder='First Name'
                  style={[styles.input, { flex: 1 }]}
                />
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder='Last Name'
                  style={[styles.input, { flex: 1 }]}
                />
              </HStack>

              {/* Other Inputs */}
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder='Email'
                keyboardType='email-address'
                style={styles.input}
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder='Phone Number'
                keyboardType='phone-pad'
                maxLength={10}
                style={styles.input}
              />
              <TextInput
                value={referral}
                onChangeText={setReferral}
                placeholder='Referral Code (Optional)'
                style={styles.input}
              />

              {/* Password Input with toggle */}
              <View style={{ position: 'relative' }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder='Password'
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color='#999' />
                </Pressable>
              </View>

              {/* Terms Text */}
              <Text style={styles.termsText}>
                By clicking Sign Up you certify that you agree to our{' '}
                <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
                <Text style={styles.linkText}>Terms & Conditions</Text>.
              </Text>

              <Button
                onPress={handleSignUp}
                bg='brand.orange'
                _pressed={{ bg: 'brand.green' }}
                _text={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: 16 }}
                borderRadius={10}
                py={4}
                mt={4}>
                Sign Up
              </Button>
            </VStack>

            {/* Footer */}
            <VStack space={4} alignItems='center' mt={10}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.linkText} onPress={handleLoginRedirect}>
                  Sign In
                </Text>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  greeting: { fontSize: 28, fontFamily: 'Poppins', fontWeight: '700', color: '#1A1A1A' },
  subtitle: { fontSize: 16, fontFamily: 'OpenSans', color: '#666' },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'OpenSans',
    backgroundColor: '#fff',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  termsText: { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 },
  linkText: { color: '#ff7a00', fontWeight: '600' },
  footerText: { fontSize: 14, fontFamily: 'OpenSans', color: '#333' },
});
