// screens/LoginScreen.js
import { Box, Button, Checkbox, HStack, Image, Link, Text, VStack, useTheme } from 'native-base';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme(); // 👈 use Raavito theme

  const handleLogin = () => {
    if (!mobile || !password) {
      Alert.alert('Missing Fields', 'Please enter both mobile number and password.');
      return;
    }

    if (mobile === '9999999999' && password === '12345') {
      login({ id: Date.now(), mobile });
      navigation.replace('Main');
    } else {
      Alert.alert('Invalid Credentials', 'Mobile number or password is incorrect.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <Box flex={1} px={8} py={6} bg='white'>
          <VStack flex={1} justifyContent='space-between'>
            {/* Header */}
            <HStack alignItems='center' justifyContent='space-between' mb={10}>
              <VStack>
                <Text fontSize='4xl' bold fontFamily='Poppins' color='brand.dark'>
                  Hello,
                </Text>
                <Text fontSize='16' color='coolGray.500' fontFamily='OpenSans'>
                  Please Log in to Continue
                </Text>
              </VStack>
              <Image
                source={require('../assets/logo.png')}
                alt='Raavito'
                size='75'
                resizeMode='contain'
              />
            </HStack>

            {/* Form */}
            <VStack space={6}>
              {/* Mobile Input */}
              <TextInput
                value={mobile}
                onChangeText={setMobile}
                placeholder='Mobile Number'
                keyboardType='phone-pad'
                maxLength={10}
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  padding: 14,
                  borderRadius: 10,
                  fontSize: 16,
                  fontFamily: 'OpenSans',
                }}
              />

              {/* Password Input */}
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='Password'
                secureTextEntry
                style={{
                  borderWidth: 1,
                  borderColor: 'black.050',
                  padding: 14,
                  borderRadius: 10,
                  fontSize: 16,
                  fontFamily: 'OpenSans',
                }}
              />

              {/* Remember + Forgot */}
              <HStack justifyContent='space-between' alignItems='center'>
                <Checkbox value='remember' accessibilityLabel='Remember me'>
                  Remember me
                </Checkbox>
                <Link
                  _text={{
                    color: 'brand.green',
                    fontSize: 'sm',
                    fontFamily: 'OpenSans',
                  }}>
                  Forgot Password?
                </Link>
              </HStack>

              {/* Terms */}
              <Text
                fontSize='xs'
                color='coolGray.600'
                textAlign='center'
                lineHeight='lg'
                fontFamily='OpenSans'>
                By clicking Sign In you certify that you agree to our{' '}
                <Text color='brand.green'>Privacy Policy</Text> and{' '}
                <Text color='brand.green'>Terms & Conditions</Text>
              </Text>

              {/* Sign In Button */}
              <Button
                onPress={handleLogin}
                bg='brand.green'
                _pressed={{ bg: 'brand.orange' }}
                _text={{
                  fontFamily: 'Poppins',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                }}
                rounded='lg'
                py={4}
                mt={4}>
                Sign In
              </Button>
            </VStack>

            {/* Footer */}
            <VStack space={4} alignItems='center' mt={10}>
              <Text fontSize='md' fontFamily='OpenSans'>
                New User?{' '}
                {/* <Text color='brand.green' bold onPress={() => navigation.navigate('Register')}> */}
                <Text color='brand.green' bold onPress={handleRegister}>
                  Register
                </Text>
              </Text>
              {/* <Text fontSize='sm' color='coolGray.600' fontFamily='OpenSans'>
                Continue as a Guest
              </Text> */}
            </VStack>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
