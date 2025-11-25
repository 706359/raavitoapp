import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Checkbox, HStack, Icon, Image, ScrollView, Text, VStack, useTheme } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { axios_ } from '../../utils/utils';
import { useAuth } from '../context/AuthContext';

const CUISINE_TYPES = [
  'North Indian',
  'South Indian',
  'Gujarati',
  'Rajasthani',
  'Punjabi',
  'Chinese',
  'Continental',
  'Multi Cuisine',
];

export default function KitchenRegisterScreen({ navigation }) {
  const { login } = useAuth();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [agree, setAgree] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [pincodeError, setPincodeError] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showCuisinePicker, setShowCuisinePicker] = useState(false);

  // OTP verification state
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '', '', '']);
  const [mobileOtpLoading, setMobileOtpLoading] = useState(false);
  const [mobileOtpError, setMobileOtpError] = useState('');
  const [mobileCountdown, setMobileCountdown] = useState(0);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailCountdown, setEmailCountdown] = useState(0);

  const mobileOtpRefs = useRef([]);
  const emailOtpRefs = useRef([]);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    // Step 2: Kitchen Details
    kitchenName: '',
    address: '',
    pincode: '',
    location: '',
    cuisineType: '',
    // Step 3: Documents & Banking
    fssai: '',
    pan: '',
    gst: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    // Step 4: Menu Upload
    menuFile: null,
  });

  const debounceTimer = useRef(null);

  // OTP countdown timers
  useEffect(() => {
    if (mobileCountdown > 0) {
      const timer = setTimeout(() => setMobileCountdown(mobileCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [mobileCountdown]);

  useEffect(() => {
    if (emailCountdown > 0) {
      const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailCountdown]);

  // Debounced pincode fetch
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const pin = formData.pincode?.trim();
    if (pin && pin.length === 6 && /^\d{6}$/.test(pin)) {
      debounceTimer.current = setTimeout(() => {
        fetchLocationsByPincode(pin);
      }, 500);
    } else {
      setLocations([]);
      setPincodeError('');
      setFormData((f) => ({ ...f, location: '' }));
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData.pincode]);

  const fetchLocationsByPincode = async (pincode) => {
    setPincodeLoading(true);
    setPincodeError('');
    setLocations([]);
    setFormData((f) => ({ ...f, location: '' }));

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) throw new Error('Failed to fetch pincode data');

      const json = await response.json();
      if (!Array.isArray(json) || json.length === 0) throw new Error('No data for pincode');

      const first = json[0];
      if (first.Status !== 'Success' || !Array.isArray(first.PostOffice) || first.PostOffice.length === 0) {
        throw new Error('No locations found for this pincode');
      }

      const locationNames = first.PostOffice.map((p) => `${p.Name} (${p.Division})`);
      setLocations(locationNames);
    } catch (err) {
      setPincodeError(err.message || 'Unable to load locations');
    } finally {
      setPincodeLoading(false);
    }
  };

  function handleFormData(name, value) {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });

    // Clear error for this field
    setFormErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });

    // Reset OTP verification if mobile/email changes
    if (name === 'mobile') {
      setMobileVerified(false);
      setMobileOtpSent(false);
      setMobileOtp(['', '', '', '', '', '']);
      setMobileOtpError('');
    }
    if (name === 'email') {
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp(['', '', '', '', '', '']);
      setEmailOtpError('');
    }
  }

  // OTP Functions
  const sendOtp = async (type) => {
    const value = type === 'mobile' ? formData.mobile : formData.email;

    if (!value) {
      Alert.alert('Error', `Please enter your ${type === 'mobile' ? 'mobile number' : 'email address'} first`);
      return;
    }

    if (type === 'mobile' && !/^\d{10}$/.test(value)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      if (type === 'mobile') {
        setMobileOtpLoading(true);
        setMobileOtpError('');
      } else {
        setEmailOtpLoading(true);
        setEmailOtpError('');
      }

      const { data } = await axios_.post('/otp/send-otp', { type, value });
      
      if (type === 'mobile') {
        setMobileOtpSent(true);
        setMobileOtpLoading(false);
        setMobileCountdown(30);
        setMobileOtp(['', '', '', '', '', '']);
        Alert.alert('Success', `OTP sent to ${value}${data.otp ? `\n\nOTP: ${data.otp} (for testing)` : ''}`);
        setTimeout(() => mobileOtpRefs.current[0]?.focus(), 100);
      } else {
        setEmailOtpSent(true);
        setEmailOtpLoading(false);
        setEmailCountdown(30);
        setEmailOtp(['', '', '', '', '', '']);
        Alert.alert('Success', `OTP sent to ${value}${data.otp ? `\n\nOTP: ${data.otp} (for testing)` : ''}`);
        setTimeout(() => emailOtpRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to send OTP';
      if (type === 'mobile') {
        setMobileOtpError(errorMsg);
        setMobileOtpLoading(false);
      } else {
        setEmailOtpError(errorMsg);
        setEmailOtpLoading(false);
      }
      Alert.alert('Error', errorMsg);
    }
  };

  const verifyOtp = async (type, otpValue = null) => {
    const otp = type === 'mobile' ? mobileOtp : emailOtp;
    const otpString = otpValue || otp.join('');
    const value = type === 'mobile' ? formData.mobile : formData.email;

    if (!otpString || otpString.length !== 6) {
      Alert.alert('Error', 'Please enter all 6 digits');
      return;
    }

    try {
      if (type === 'mobile') {
        setMobileOtpLoading(true);
        setMobileOtpError('');
      } else {
        setEmailOtpLoading(true);
        setEmailOtpError('');
      }

      const { data } = await axios_.post('/otp/verify-otp', { type, value, otp: otpString });

      if (type === 'mobile') {
        setMobileVerified(true);
        setMobileOtpLoading(false);
        Alert.alert('Success', 'Mobile number verified!');
      } else {
        setEmailVerified(true);
        setEmailOtpLoading(false);
        Alert.alert('Success', 'Email address verified!');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Invalid or expired OTP';
      if (type === 'mobile') {
        setMobileOtpError(errorMsg);
        setMobileOtpLoading(false);
      } else {
        setEmailOtpError(errorMsg);
        setEmailOtpLoading(false);
      }
      Alert.alert('Error', errorMsg);
    }
  };

  const handleOtpChange = (type, index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const setOtp = type === 'mobile' ? setMobileOtp : setEmailOtp;
    const otp = type === 'mobile' ? mobileOtp : emailOtp;
    const refs = type === 'mobile' ? mobileOtpRefs : emailOtpRefs;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (type === 'mobile') {
      setMobileOtpError('');
    } else {
      setEmailOtpError('');
    }

    // Auto-advance
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 filled
    if (newOtp.every((d) => d !== '') && index === 5) {
      setTimeout(() => verifyOtp(type, newOtp.join('')), 300);
    }
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.firstName?.trim() || formData.firstName.trim().length < 2) {
        errors.firstName = 'First name required (min 2 characters)';
      }
      if (!formData.lastName?.trim() || formData.lastName.trim().length < 2) {
        errors.lastName = 'Last name required (min 2 characters)';
      }
      if (!formData.mobile?.trim() || !/^\d{10}$/.test(formData.mobile)) {
        errors.mobile = 'Valid 10-digit mobile required';
      }
      if (!mobileVerified) {
        errors.mobile = 'Please verify your mobile number';
      }
      if (!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Valid email required';
      }
      if (!emailVerified) {
        errors.email = 'Please verify your email address';
      }
      if (!formData.password?.trim() || formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    } else if (step === 2) {
      if (!formData.kitchenName?.trim() || formData.kitchenName.trim().length < 3) {
        errors.kitchenName = 'Kitchen name required (min 3 characters)';
      }
      if (!formData.address?.trim() || formData.address.trim().length < 10) {
        errors.address = 'Complete address required';
      }
      if (!formData.pincode?.trim() || !/^\d{6}$/.test(formData.pincode)) {
        errors.pincode = 'Valid 6-digit pincode required';
      }
      if (!formData.location?.trim()) {
        errors.location = 'Location required';
      }
      if (!formData.cuisineType?.trim()) {
        errors.cuisineType = 'Cuisine type required';
      }
    } else if (step === 3) {
      if (!formData.fssai?.trim() || !/^\d{14}$/.test(formData.fssai)) {
        errors.fssai = 'Valid 14-digit FSSAI required';
      }
      if (!formData.pan?.trim() || !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
        errors.pan = 'Valid PAN required (e.g., ABCDE1234F)';
      }
      if (formData.gst && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(formData.gst.toUpperCase())) {
        errors.gst = 'Invalid GST format';
      }
      if (!formData.bankName?.trim()) {
        errors.bankName = 'Bank name required';
      }
      if (!formData.accountHolderName?.trim()) {
        errors.accountHolderName = 'Account holder name required';
      }
      if (!formData.accountNumber?.trim() || !/^\d{9,18}$/.test(formData.accountNumber)) {
        errors.accountNumber = 'Valid account number required (9-18 digits)';
      }
      if (!formData.ifsc?.trim() || !/^[A-Z]{4}\d{7}$/.test(formData.ifsc.toUpperCase())) {
        errors.ifsc = 'Valid IFSC required (e.g., ABCD0123456)';
      }
    } else if (step === 4) {
      // Menu file is optional but recommended
      // if (!formData.menuFile) {
      //   errors.menuFile = 'Please upload your menu file';
      // }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMenuUpload = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your media library to select a menu file.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const maxSize = 5 * 1024 * 1024; // 5MB

        // Note: expo-image-picker doesn't provide file size directly
        // In production, you might want to use expo-document-picker for PDF support
        const file = {
          uri: asset.uri,
          name: asset.fileName || `menu_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
        };

        if (file.size > maxSize) {
          Alert.alert('Error', 'File size must be less than 5MB. Please choose a smaller file.');
          return;
        }

        handleFormData('menuFile', file);
        Alert.alert('Success', `Menu file "${file.name}" uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Unable to select file. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!validateStep(4)) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }
    if (!agree) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions');
      return;
    }

    try {
      setBusy(true);
      const payload = {
        name: formData.kitchenName,
        ownerName: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        pincode: formData.pincode,
        location: formData.location,
        cuisineType: formData.cuisineType,
        fssai: formData.fssai,
        pan: formData.pan.toUpperCase(),
        gst: formData.gst ? formData.gst.toUpperCase() : undefined,
        bankName: formData.bankName,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc.toUpperCase(),
        password: formData.password,
      };

      const { data } = await axios_.post('/kitchens/register', payload);

      if (data?.token && data?.user) {
        // Auto-login after registration
        await login({
          id: data.user._id || data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          name: `${data.user.firstName} ${data.user.lastName}`,
          mobile: data.user.mobile,
          email: data.user.email,
          role: 'partner',
          token: data.token,
        });

        Alert.alert(
          'Success!',
          'Kitchen registered successfully. Your account will be verified by admin within 24 hours.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigation will be handled by AppNavigator based on user state
              },
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', data?.message || 'Could not register');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require('../assets/loginbg2.png')}
        resizeMode='cover'
        style={styles.backgroundImage}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}>
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps='handled'
              keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}>
              <VStack space={5} alignItems='center' w='100%'>
                {/* Header */}
                <HStack w='100%' justifyContent='space-between' alignItems='center' px={4}>
                  <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' size={24} color={theme.colors.brand.dark} />
                  </Pressable>
                  <Text fontSize='lg' fontWeight='700' fontFamily='Poppins' color='brand.dark'>
                    Step {currentStep} of 4
                  </Text>
                  <View style={{ width: 24 }} />
                </HStack>

                <Image
                  source={require('../assets/logo.png')}
                  alt='Raavito'
                  w={100}
                  h={100}
                  resizeMode='contain'
                />

                {/* Title */}
                <VStack space={2} alignItems='center' mb={2}>
                  <Text
                    fontSize='2xl'
                    fontFamily='Poppins'
                    fontWeight='700'
                    color='brand.dark'
                    shadow={1}
                    letterSpacing={0.5}>
                    {currentStep === 1 && 'Personal Information'}
                    {currentStep === 2 && 'Kitchen Details'}
                    {currentStep === 3 && 'Documents & Banking'}
                    {currentStep === 4 && 'Upload Your Menu'}
                  </Text>
                  <Text fontSize='sm' color='coolGray.700' textAlign='center' fontFamily='OpenSans'>
                    {currentStep === 1 && 'Enter your personal details and verify'}
                    {currentStep === 2 && 'Tell us about your kitchen'}
                    {currentStep === 3 && 'Business documents and banking info'}
                    {currentStep === 4 && 'Share your menu items with us'}
                  </Text>
                </VStack>

                {/* STEP 1: Personal Information */}
                {currentStep === 1 && (
                  <VStack space={4} w='100%'>
                    <HStack space={2}>
                      <View style={[styles.inputWrapper, { flex: 1 }, formErrors.firstName && styles.inputError]}>
                        <Ionicons
                          name='person-outline'
                          size={20}
                          color={theme.colors.brand.orange}
                          style={styles.icon}
                        />
                        <TextInput
                          style={[styles.input, { color: theme.colors.brand.dark }]}
                          value={formData.firstName}
                          onChangeText={(value) => handleFormData('firstName', value)}
                          placeholder='First Name'
                          placeholderTextColor={theme.colors.brand.gray}
                        />
                      </View>
                      <View style={[styles.inputWrapper, { flex: 1 }, formErrors.lastName && styles.inputError]}>
                        <Ionicons
                          name='person-outline'
                          size={20}
                          color={theme.colors.brand.orange}
                          style={styles.icon}
                        />
                        <TextInput
                          style={[styles.input, { color: theme.colors.brand.dark }]}
                          value={formData.lastName}
                          onChangeText={(value) => handleFormData('lastName', value)}
                          placeholder='Last Name'
                          placeholderTextColor={theme.colors.brand.gray}
                        />
                      </View>
                    </HStack>
                    {formErrors.firstName && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.firstName}
                      </Text>
                    )}
                    {formErrors.lastName && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.lastName}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.mobile && styles.inputError]}>
                      <Ionicons
                        name='call-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.mobile}
                        onChangeText={(value) => handleFormData('mobile', value.replace(/[^0-9]/g, ''))}
                        placeholder='Mobile Number'
                        keyboardType='phone-pad'
                        maxLength={10}
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.mobile && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.mobile}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.email && styles.inputError]}>
                      <Ionicons
                        name='mail-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.email}
                        onChangeText={(value) => handleFormData('email', value)}
                        placeholder='Email Address'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.email && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.email}
                      </Text>
                    )}

                    {/* Mobile OTP Verification */}
                    {formData.mobile && formData.mobile.length === 10 && (
                      <VStack space={2} w='100%' mt={2}>
                        {!mobileVerified ? (
                          <>
                            {mobileOtpSent ? (
                              <VStack space={2}>
                                <Text fontSize='sm' fontWeight='600' color='brand.dark'>
                                  Enter OTP sent to {formData.mobile}
                                </Text>
                                <HStack space={2} justifyContent='center'>
                                  {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <TextInput
                                      key={index}
                                      ref={(ref) => (mobileOtpRefs.current[index] = ref)}
                                      style={[
                                        styles.otpInput,
                                        mobileOtp[index] && styles.otpInputFilled,
                                        mobileOtpError && styles.otpInputError,
                                      ]}
                                      value={mobileOtp[index]}
                                      onChangeText={(value) => handleOtpChange('mobile', index, value)}
                                      keyboardType='number-pad'
                                      maxLength={1}
                                      textAlign='center'
                                      selectTextOnFocus
                                    />
                                  ))}
                                </HStack>
                                {mobileOtpError && (
                                  <Text fontSize='xs' color='red.500' textAlign='center'>
                                    {mobileOtpError}
                                  </Text>
                                )}
                                <HStack space={2} justifyContent='center' mt={2}>
                                  <Button
                                    size='sm'
                                    variant='outline'
                                    borderColor='brand.orange'
                                    _text={{ color: 'brand.orange', fontSize: 'xs' }}
                                    onPress={() => verifyOtp('mobile')}
                                    isLoading={mobileOtpLoading}
                                    isDisabled={mobileOtp.some((d) => !d)}>
                                    Verify
                                  </Button>
                                  {mobileCountdown > 0 ? (
                                    <Text fontSize='xs' color='coolGray.500' alignSelf='center'>
                                      Resend in {mobileCountdown}s
                                    </Text>
                                  ) : (
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      _text={{ color: 'brand.orange', fontSize: 'xs' }}
                                      onPress={() => sendOtp('mobile')}>
                                      Resend
                                    </Button>
                                  )}
                                </HStack>
                              </VStack>
                            ) : (
                              <Button
                                size='sm'
                                variant='outline'
                                borderColor='brand.orange'
                                _text={{ color: 'brand.orange', fontSize: 'xs' }}
                                onPress={() => sendOtp('mobile')}
                                isLoading={mobileOtpLoading}
                                leftIcon={<Icon as={Ionicons} name='send-outline' size={4} color='brand.orange' />}>
                                Send OTP
                              </Button>
                            )}
                          </>
                        ) : (
                          <HStack space={2} alignItems='center' justifyContent='center' bg='green.50' p={2} borderRadius='md'>
                            <Ionicons name='checkmark-circle' size={20} color='#366d59' />
                            <Text fontSize='sm' color='green.700' fontWeight='600'>
                              Mobile verified
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    )}

                    {/* Email OTP Verification */}
                    {formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <VStack space={2} w='100%' mt={2}>
                        {!emailVerified ? (
                          <>
                            {emailOtpSent ? (
                              <VStack space={2}>
                                <Text fontSize='sm' fontWeight='600' color='brand.dark'>
                                  Enter OTP sent to {formData.email}
                                </Text>
                                <HStack space={2} justifyContent='center'>
                                  {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <TextInput
                                      key={index}
                                      ref={(ref) => (emailOtpRefs.current[index] = ref)}
                                      style={[
                                        styles.otpInput,
                                        emailOtp[index] && styles.otpInputFilled,
                                        emailOtpError && styles.otpInputError,
                                      ]}
                                      value={emailOtp[index]}
                                      onChangeText={(value) => handleOtpChange('email', index, value)}
                                      keyboardType='number-pad'
                                      maxLength={1}
                                      textAlign='center'
                                      selectTextOnFocus
                                    />
                                  ))}
                                </HStack>
                                {emailOtpError && (
                                  <Text fontSize='xs' color='red.500' textAlign='center'>
                                    {emailOtpError}
                                  </Text>
                                )}
                                <HStack space={2} justifyContent='center' mt={2}>
                                  <Button
                                    size='sm'
                                    variant='outline'
                                    borderColor='brand.orange'
                                    _text={{ color: 'brand.orange', fontSize: 'xs' }}
                                    onPress={() => verifyOtp('email')}
                                    isLoading={emailOtpLoading}
                                    isDisabled={emailOtp.some((d) => !d)}>
                                    Verify
                                  </Button>
                                  {emailCountdown > 0 ? (
                                    <Text fontSize='xs' color='coolGray.500' alignSelf='center'>
                                      Resend in {emailCountdown}s
                                    </Text>
                                  ) : (
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      _text={{ color: 'brand.orange', fontSize: 'xs' }}
                                      onPress={() => sendOtp('email')}>
                                      Resend
                                    </Button>
                                  )}
                                </HStack>
                              </VStack>
                            ) : (
                              <Button
                                size='sm'
                                variant='outline'
                                borderColor='brand.orange'
                                _text={{ color: 'brand.orange', fontSize: 'xs' }}
                                onPress={() => sendOtp('email')}
                                isLoading={emailOtpLoading}
                                leftIcon={<Icon as={Ionicons} name='send-outline' size={4} color='brand.orange' />}>
                                Send OTP
                              </Button>
                            )}
                          </>
                        ) : (
                          <HStack space={2} alignItems='center' justifyContent='center' bg='green.50' p={2} borderRadius='md'>
                            <Ionicons name='checkmark-circle' size={20} color='#366d59' />
                            <Text fontSize='sm' color='green.700' fontWeight='600'>
                              Email verified
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    )}

                    <View style={[styles.inputWrapper, formErrors.password && styles.inputError]}>
                      <Ionicons
                        name='lock-closed-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.password}
                        onChangeText={(value) => handleFormData('password', value)}
                        placeholder='Create Password'
                        secureTextEntry
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.password && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.password}
                      </Text>
                    )}
                  </VStack>
                )}

                {/* STEP 2: Kitchen Details */}
                {currentStep === 2 && (
                  <VStack space={4} w='100%'>
                    <View style={[styles.inputWrapper, formErrors.kitchenName && styles.inputError]}>
                      <Ionicons
                        name='restaurant-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.kitchenName}
                        onChangeText={(value) => handleFormData('kitchenName', value)}
                        placeholder='Kitchen Name'
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.kitchenName && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.kitchenName}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, styles.textAreaWrapper, formErrors.address && styles.inputError]}>
                      <Ionicons
                        name='location-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={[styles.icon, styles.textAreaIcon]}
                      />
                      <TextInput
                        style={[styles.input, styles.textArea, { color: theme.colors.brand.dark }]}
                        value={formData.address}
                        onChangeText={(value) => handleFormData('address', value)}
                        placeholder='Complete Address'
                        multiline
                        numberOfLines={3}
                        textAlignVertical='top'
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.address && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.address}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.pincode && styles.inputError]}>
                      <Ionicons
                        name='pricetag-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.pincode}
                        onChangeText={(value) => handleFormData('pincode', value.replace(/[^0-9]/g, ''))}
                        placeholder='Pincode (6 digits)'
                        keyboardType='number-pad'
                        maxLength={6}
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                      {pincodeLoading && (
                        <View style={styles.loadingIndicator}>
                          <Text fontSize='xs' color='brand.orange'>
                            Loading...
                          </Text>
                        </View>
                      )}
                    </View>
                    {pincodeError && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {pincodeError}
                      </Text>
                    )}
                    {formErrors.pincode && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.pincode}
                      </Text>
                    )}

                    {locations.length > 0 && (
                      <Pressable
                        style={[styles.inputWrapper, formErrors.location && styles.inputError]}
                        onPress={() => setShowLocationPicker(true)}>
                        <Ionicons
                          name='location-outline'
                          size={20}
                          color={theme.colors.brand.orange}
                          style={styles.icon}
                        />
                        <Text
                          style={[
                            styles.input,
                            { color: formData.location ? theme.colors.brand.dark : theme.colors.brand.gray },
                          ]}>
                          {formData.location || 'Select Location'}
                        </Text>
                        <Ionicons name='chevron-down' size={20} color={theme.colors.brand.gray} />
                      </Pressable>
                    )}
                    {formErrors.location && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.location}
                      </Text>
                    )}

                    <Pressable
                      style={[styles.inputWrapper, formErrors.cuisineType && styles.inputError]}
                      onPress={() => setShowCuisinePicker(true)}>
                      <Ionicons
                        name='restaurant-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <Text
                        style={[
                          styles.input,
                          { color: formData.cuisineType ? theme.colors.brand.dark : theme.colors.brand.gray },
                        ]}>
                        {formData.cuisineType || 'Select Cuisine Type'}
                      </Text>
                      <Ionicons name='chevron-down' size={20} color={theme.colors.brand.gray} />
                    </Pressable>
                    {formErrors.cuisineType && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.cuisineType}
                      </Text>
                    )}
                  </VStack>
                )}

                {/* STEP 3: Documents & Banking */}
                {currentStep === 3 && (
                  <VStack space={4} w='100%'>
                    <View style={[styles.inputWrapper, formErrors.fssai && styles.inputError]}>
                      <Ionicons
                        name='document-text-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.fssai}
                        onChangeText={(value) => handleFormData('fssai', value.replace(/[^0-9]/g, ''))}
                        placeholder='FSSAI Number (14 digits)'
                        keyboardType='number-pad'
                        maxLength={14}
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.fssai && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.fssai}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.pan && styles.inputError]}>
                      <Ionicons
                        name='id-card-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark, textTransform: 'uppercase' }]}
                        value={formData.pan}
                        onChangeText={(value) => handleFormData('pan', value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder='PAN Number (e.g., ABCDE1234F)'
                        maxLength={10}
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.pan && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.pan}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.gst && styles.inputError]}>
                      <Ionicons
                        name='id-card-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark, textTransform: 'uppercase' }]}
                        value={formData.gst}
                        onChangeText={(value) => handleFormData('gst', value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder='GST Number (Optional, 15 digits)'
                        maxLength={15}
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.gst && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.gst}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.bankName && styles.inputError]}>
                      <Ionicons
                        name='business-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.bankName}
                        onChangeText={(value) => handleFormData('bankName', value)}
                        placeholder='Bank Name'
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.bankName && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.bankName}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.accountHolderName && styles.inputError]}>
                      <Ionicons
                        name='person-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.accountHolderName}
                        onChangeText={(value) => handleFormData('accountHolderName', value)}
                        placeholder='Account Holder Name'
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.accountHolderName && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.accountHolderName}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.accountNumber && styles.inputError]}>
                      <Ionicons
                        name='card-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark }]}
                        value={formData.accountNumber}
                        onChangeText={(value) => handleFormData('accountNumber', value.replace(/[^0-9]/g, ''))}
                        placeholder='Account Number'
                        keyboardType='number-pad'
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.accountNumber && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.accountNumber}
                      </Text>
                    )}

                    <View style={[styles.inputWrapper, formErrors.ifsc && styles.inputError]}>
                      <Ionicons
                        name='card-outline'
                        size={20}
                        color={theme.colors.brand.orange}
                        style={styles.icon}
                      />
                      <TextInput
                        style={[styles.input, { color: theme.colors.brand.dark, textTransform: 'uppercase' }]}
                        value={formData.ifsc}
                        onChangeText={(value) => handleFormData('ifsc', value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder='IFSC Code (e.g., ABCD0123456)'
                        maxLength={11}
                        placeholderTextColor={theme.colors.brand.gray}
                      />
                    </View>
                    {formErrors.ifsc && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.ifsc}
                      </Text>
                    )}

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
                        I agree to the{' '}
                        <Text color='brand.orange' fontWeight='600'>
                          Terms
                        </Text>{' '}
                        and{' '}
                        <Text color='brand.orange' fontWeight='600'>
                          Privacy Policy
                        </Text>
                      </Text>
                    </Checkbox>
                  </VStack>
                )}

                {/* STEP 4: Menu Upload */}
                {currentStep === 4 && (
                  <VStack space={4} w='100%' alignItems='center'>
                    <View
                      style={[
                        styles.uploadArea,
                        formErrors.menuFile && styles.uploadAreaError,
                        formData.menuFile && styles.uploadAreaFilled,
                      ]}>
                      <Ionicons
                        name='document-attach-outline'
                        size={48}
                        color={formData.menuFile ? theme.colors.brand.green : theme.colors.brand.orange}
                      />
                      <Text fontSize='lg' fontWeight='700' color='brand.dark' mt={2} mb={1}>
                        Upload Menu File
                      </Text>
                      <Text fontSize='sm' color='coolGray.600' textAlign='center' mb={2}>
                        Supported formats: JPG, PNG (Max 5MB)
                      </Text>
                      <Text fontSize='xs' color='coolGray.500' textAlign='center' mb={4}>
                        PDF support coming soon
                      </Text>
                      <Button
                        onPress={handleMenuUpload}
                        bg={formData.menuFile ? 'brand.green' : 'brand.orange'}
                        _text={{ color: 'white', fontWeight: '600' }}
                        leftIcon={<Icon as={Ionicons} name='cloud-upload-outline' size={5} color='white' />}>
                        {formData.menuFile ? 'Change File' : 'Choose File'}
                      </Button>
                      {formData.menuFile && (
                        <HStack space={2} alignItems='center' mt={4} bg='green.50' px={4} py={2} borderRadius='md'>
                          <Ionicons name='checkmark-circle' size={20} color='#10b981' />
                          <Text fontSize='sm' color='green.700' fontWeight='600' flex={1} numberOfLines={1}>
                            {formData.menuFile.name}
                          </Text>
                          <Pressable onPress={() => handleFormData('menuFile', null)}>
                            <Ionicons name='close-circle' size={20} color='#ef4444' />
                          </Pressable>
                        </HStack>
                      )}
                    </View>
                    {formErrors.menuFile && (
                      <Text fontSize='xs' color='red.500' px={2}>
                        {formErrors.menuFile}
                      </Text>
                    )}

                    <View style={styles.infoBox}>
                      <Ionicons name='shield-checkmark-outline' size={24} color={theme.colors.brand.green} />
                      <VStack flex={1} ml={3}>
                        <Text fontSize='sm' fontWeight='700' color='brand.dark'>
                          Your information is safe
                        </Text>
                        <Text fontSize='xs' color='coolGray.600'>
                          All documents are encrypted and reviewed by our team within 24 hours.
                        </Text>
                      </VStack>
                    </View>
                  </VStack>
                )}

                {/* Navigation Buttons */}
                <HStack space={3} w='100%' justifyContent='center' mt={4}>
                  {currentStep > 1 && (
                    <Button
                      onPress={handlePrev}
                      variant='outline'
                      borderColor='brand.orange'
                      _text={{ color: 'brand.orange', fontWeight: '600' }}
                      w='35%'
                      leftIcon={<Icon as={Ionicons} name='arrow-back' size={5} color='brand.orange' />}>
                      Previous
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button
                      onPress={handleNext}
                      bg='brand.orange'
                      _text={{ color: 'white', fontWeight: '700' }}
                      w={currentStep === 1 ? '75%' : '35%'}
                      rightIcon={<Icon as={Ionicons} name='arrow-forward' size={5} color='white' />}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      onPress={handleRegister}
                      isLoading={busy}
                      bg='brand.orange'
                      _text={{ color: 'white', fontWeight: '700' }}
                      w='75%'
                      leftIcon={<Icon as={Ionicons} name='checkmark-circle' size={6} color='white' />}>
                      Submit Application
                    </Button>
                  )}
                </HStack>

                {/* Login Link */}
                <HStack mt={3}>
                  <Text fontSize='md' color='coolGray.700'>
                    Already registered?{' '}
                  </Text>
                  <Text
                    variant='label'
                    color='brand.orange'
                    fontWeight='700'
                    onPress={() => navigation.replace('PartnerLogin')}>
                    Login
                  </Text>
                </HStack>
              </VStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Location Picker Modal */}
        <Modal
          visible={showLocationPicker}
          transparent={true}
          animationType='slide'
          onRequestClose={() => setShowLocationPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <HStack justifyContent='space-between' alignItems='center' mb={4}>
                <Text fontSize='lg' fontWeight='700' fontFamily='Poppins'>
                  Select Location
                </Text>
                <Pressable onPress={() => setShowLocationPicker(false)}>
                  <Ionicons name='close' size={24} color={theme.colors.brand.dark} />
                </Pressable>
              </HStack>
              <ScrollView>
                {locations.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      formData.location === loc && styles.pickerItemSelected,
                    ]}
                    onPress={() => {
                      handleFormData('location', loc);
                      setShowLocationPicker(false);
                    }}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        formData.location === loc && styles.pickerItemTextSelected,
                      ]}>
                      {loc}
                    </Text>
                    {formData.location === loc && (
                      <Ionicons name='checkmark' size={20} color={theme.colors.brand.orange} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Cuisine Picker Modal */}
        <Modal
          visible={showCuisinePicker}
          transparent={true}
          animationType='slide'
          onRequestClose={() => setShowCuisinePicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <HStack justifyContent='space-between' alignItems='center' mb={4}>
                <Text fontSize='lg' fontWeight='700' fontFamily='Poppins'>
                  Select Cuisine Type
                </Text>
                <Pressable onPress={() => setShowCuisinePicker(false)}>
                  <Ionicons name='close' size={24} color={theme.colors.brand.dark} />
                </Pressable>
              </HStack>
              <ScrollView>
                {CUISINE_TYPES.map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    style={[
                      styles.pickerItem,
                      formData.cuisineType === cuisine && styles.pickerItemSelected,
                    ]}
                    onPress={() => {
                      handleFormData('cuisineType', cuisine);
                      setShowCuisinePicker(false);
                    }}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        formData.cuisineType === cuisine && styles.pickerItemTextSelected,
                      ]}>
                      {cuisine}
                    </Text>
                    {formData.cuisineType === cuisine && (
                      <Ionicons name='checkmark' size={20} color={theme.colors.brand.orange} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
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
    fontFamily: 'OpenSans',
    paddingLeft: 4,
  },
  textArea: {
    height: 80,
    paddingTop: 14,
    paddingBottom: 14,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pickerItemSelected: {
    backgroundColor: '#fff7ed',
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: 'OpenSans',
    color: '#111827',
  },
  pickerItemTextSelected: {
    color: '#f57506',
    fontWeight: '600',
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 117, 6, 0.3)',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'white',
  },
  otpInputFilled: {
    borderColor: '#f57506',
    backgroundColor: '#fff7ed',
  },
  otpInputError: {
    borderColor: '#ef4444',
  },
  uploadArea: {
    width: '100%',
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadAreaError: {
    borderColor: '#ef4444',
  },
  uploadAreaFilled: {
    borderColor: '#366d59',
    backgroundColor: '#f0fdf4',
  },
  infoBox: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'flex-start',
  },
});

