import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Button, HStack, Icon, Image, Text, VStack, useTheme } from 'native-base';
import { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { axios_ } from '../../utils/utils';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: mobile, 2: OTP, 3: new password
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSendOTP = async () => {
    if (!mobile || mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      await axios_.post('/users/forgot-password', { mobile });
      Alert.alert('Success', 'OTP sent to your mobile number');
      setStep(2);
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await axios_.post('/users/verify-otp', { mobile, otp });
      Alert.alert('Success', 'OTP verified successfully');
      setStep(3);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await axios_.post('/users/reset-password', { mobile, otp, newPassword });
      Alert.alert('Success', 'Password reset successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <ImageBackground
        source={require('../assets/loginbg2.png')}
        resizeMode='cover'
        style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
              <VStack space={8} alignItems='center' w='100%'>
                {/* Back Button */}
                <HStack w='100%' justifyContent='flex-start' alignItems='center'>
                  <Pressable onPress={() => navigation.goBack()}>
                    <Icon as={Ionicons} name='arrow-back' size={8} color='brand.dark' />
                  </Pressable>
                </HStack>

                <Image
                  source={require('../assets/logo.png')}
                  alt='Raavito'
                  w={100}
                  h={100}
                  resizeMode='contain'
                />

                <VStack space={2} alignItems='center'>
                  <Text fontSize='2xl' fontFamily='Poppins' fontWeight='700' color='brand.dark'>
                    {step === 1
                      ? 'Forgot Password?'
                      : step === 2
                        ? 'Verify OTP'
                        : 'Reset Password'}
                  </Text>
                  <Text fontSize='sm' color='coolGray.600' textAlign='center'>
                    {step === 1
                      ? 'Enter your mobile number to receive OTP'
                      : step === 2
                        ? 'Enter the OTP sent to your mobile'
                        : 'Enter your new password'}
                  </Text>
                </VStack>

                <VStack space={5} w='100%'>
                  {/* Step 1: Mobile Number */}
                  {step === 1 && (
                    <>
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
                          placeholderTextColor={theme.colors.brand.gray}
                        />
                      </View>

                      <Button
                        onPress={handleSendOTP}
                        isLoading={loading}
                        shadow={6}
                        variant='outline'
                        borderColor='brand.light'
                        _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                        leftIcon={<Icon as={Ionicons} name='send-outline' size={6} color='white' />}
                        _linearGradient={{
                          as: LinearGradient,
                          colors: [theme.colors.brand.orange, theme.colors.brand.green],
                          start: [0, 0],
                          end: [1, 1],
                        }}>
                        Send OTP
                      </Button>
                    </>
                  )}

                  {/* Step 2: OTP Verification */}
                  {step === 2 && (
                    <>
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name='key-outline'
                          size={20}
                          color={theme.colors.brand.orange}
                          style={styles.icon}
                        />
                        <TextInput
                          style={[styles.input, { color: theme.colors.brand.dark }]}
                          value={otp}
                          onChangeText={setOtp}
                          placeholder='Enter 6-digit OTP'
                          keyboardType='number-pad'
                          maxLength={6}
                          placeholderTextColor={theme.colors.brand.gray}
                        />
                      </View>

                      <Button
                        onPress={handleVerifyOTP}
                        isLoading={loading}
                        shadow={6}
                        variant='outline'
                        borderColor='brand.light'
                        _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                        leftIcon={
                          <Icon as={Ionicons} name='checkmark-circle-outline' size={6} color='white' />
                        }
                        _linearGradient={{
                          as: LinearGradient,
                          colors: [theme.colors.brand.orange, theme.colors.brand.green],
                          start: [0, 0],
                          end: [1, 1],
                        }}>
                        Verify OTP
                      </Button>

                      <Pressable onPress={handleSendOTP}>
                        <Text
                          fontSize='sm'
                          color='brand.orange'
                          textAlign='center'
                          fontWeight='600'>
                          Resend OTP
                        </Text>
                      </Pressable>
                    </>
                  )}

                  {/* Step 3: New Password */}
                  {step === 3 && (
                    <>
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name='lock-closed-outline'
                          size={20}
                          color={theme.colors.brand.orange}
                          style={styles.icon}
                        />
                        <TextInput
                          style={[styles.input, { color: theme.colors.brand.dark }]}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder='New Password'
                          secureTextEntry
                          placeholderTextColor={theme.colors.brand.gray}
                        />
                      </View>

                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name='lock-closed-outline'
                          size={20}
                          color={theme.colors.brand.orange}
                          style={styles.icon}
                        />
                        <TextInput
                          style={[styles.input, { color: theme.colors.brand.dark }]}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          placeholder='Confirm Password'
                          secureTextEntry
                          placeholderTextColor={theme.colors.brand.gray}
                        />
                      </View>

                      <Button
                        onPress={handleResetPassword}
                        isLoading={loading}
                        shadow={6}
                        variant='outline'
                        borderColor='brand.light'
                        _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
                        leftIcon={
                          <Icon as={Ionicons} name='checkmark-done-outline' size={6} color='white' />
                        }
                        _linearGradient={{
                          as: LinearGradient,
                          colors: [theme.colors.brand.orange, theme.colors.brand.green],
                          start: [0, 0],
                          end: [1, 1],
                        }}>
                        Reset Password
                      </Button>
                    </>
                  )}
                </VStack>
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
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  icon: { marginRight: 8 },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
});

