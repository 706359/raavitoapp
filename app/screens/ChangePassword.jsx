import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Button, HStack, Icon, ScrollView, Text, VStack, useTheme } from 'native-base';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { axios_ } from '../../utils/utils';

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    try {
      setLoading(true);
      await axios_.put('/users/change-password', {
        currentPassword,
        newPassword,
      });

      Alert.alert('Success', 'Password changed successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Box
        style={styles.headerBox}
        bg={{
          linearGradient: {
            colors: ['#f97316', '#ea580c', '#c2410c'],
            start: [0, 0],
            end: [1, 1],
          },
        }}>
        <HStack style={styles.headerInner}>
          <HStack style={styles.headerLeft}>
            <Pressable onPress={() => navigation.goBack()} style={styles.headerBack}>
              <Icon as={Ionicons} name='arrow-back' color='white' size={6} />
            </Pressable>
            <VStack>
              <Text style={styles.headerTitle}>Change Password</Text>
              <Text style={styles.headerSubtitle}>Update your account password</Text>
            </VStack>
          </HStack>
        </HStack>
      </Box>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
          <VStack space={6} w='100%'>
            {/* Current Password */}
            <VStack space={2}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name='lock-closed-outline'
                  size={20}
                  color={theme.colors.brand.orange}
                  style={styles.icon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.brand.dark }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder='Enter current password'
                  secureTextEntry={!showCurrentPassword}
                  placeholderTextColor={theme.colors.brand.gray}
                />
                <Pressable onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Ionicons
                    name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={theme.colors.brand.gray}
                  />
                </Pressable>
              </View>
            </VStack>

            {/* New Password */}
            <VStack space={2}>
              <Text style={styles.label}>New Password</Text>
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
                  placeholder='Enter new password (min 6 characters)'
                  secureTextEntry={!showNewPassword}
                  placeholderTextColor={theme.colors.brand.gray}
                />
                <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons
                    name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={theme.colors.brand.gray}
                  />
                </Pressable>
              </View>
            </VStack>

            {/* Confirm Password */}
            <VStack space={2}>
              <Text style={styles.label}>Confirm New Password</Text>
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
                  placeholder='Confirm new password'
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={theme.colors.brand.gray}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={theme.colors.brand.gray}
                  />
                </Pressable>
              </View>
            </VStack>

            <Button
              onPress={handleChangePassword}
              isLoading={loading}
              shadow={6}
              variant='outline'
              borderColor='brand.light'
              _text={{ fontWeight: '700', fontSize: 'md', color: 'white' }}
              leftIcon={<Icon as={Ionicons} name='checkmark-done-outline' size={6} color='white' />}
              _linearGradient={{
                as: LinearGradient,
                colors: [theme.colors.brand.orange, theme.colors.brand.green],
                start: [0, 0],
                end: [1, 1],
              }}>
              Change Password
            </Button>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: { flex: 1 },
  headerBox: {
    marginBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF7A00',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  headerBack: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  icon: { marginRight: 8 },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
});

