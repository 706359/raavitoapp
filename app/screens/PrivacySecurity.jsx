import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, Divider, HStack, Icon, Pressable, ScrollView, Text, VStack, useTheme } from 'native-base';
import { useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { axios_ } from '../../utils/utils';

export default function PrivacySecurity() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const theme = useTheme();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Prompt for password
            Alert.prompt(
              'Confirm Deletion',
              'Enter your password to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async (password) => {
                    try {
                      await axios_.delete('/users/account', { data: { password } });
                      Alert.alert('Success', 'Your account has been deleted', [
                        {
                          text: 'OK',
                          onPress: () => {
                            logout();
                            navigation.navigate('Login');
                          },
                        },
                      ]);
                    } catch (error) {
                      Alert.alert(
                        'Error',
                        error?.response?.data?.message || 'Failed to delete account'
                      );
                    }
                  },
                },
              ],
              'secure-text'
            );
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Change Password',
      icon: 'lock-outline',
      onPress: () => navigation.navigate('ChangePassword'),
    },
    {
      id: 2,
      title: 'Privacy Policy',
      icon: 'privacy-tip',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy content goes here...'),
    },
    {
      id: 3,
      title: 'Terms & Conditions',
      icon: 'description',
      onPress: () => Alert.alert('Terms & Conditions', 'Terms and conditions content goes here...'),
    },
    {
      id: 4,
      title: 'Delete Account',
      icon: 'delete-outline',
      onPress: handleDeleteAccount,
      destructive: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.headerBack}
              accessibilityRole='button'
              accessibilityLabel='Go back'>
              <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
            </Pressable>

            <VStack>
              <Text style={styles.headerTitle}>Privacy and Security</Text>
              <Text style={styles.headerSubtitle}>Manage Your Privacy and Security</Text>
            </VStack>
          </HStack>

          <Box style={styles.headerIconBox}>
            <Icon as={MaterialIcons} name='privacy-tip' color='white' size={6} />
          </Box>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.content}>
        <VStack space={2}>
          {menuItems.map((item, index) => (
            <Box key={item.id}>
              <Pressable
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  item.destructive && styles.destructiveItem,
                ]}>
                <HStack alignItems='center' justifyContent='space-between' p={4}>
                  <HStack alignItems='center' space={4}>
                    <Box
                      style={[
                        styles.iconBox,
                        item.destructive && styles.destructiveIconBox,
                      ]}>
                      <Icon
                        as={MaterialIcons}
                        name={item.icon}
                        color={item.destructive ? '#ef4444' : theme.colors.brand.orange}
                        size={6}
                      />
                    </Box>
                    <Text
                      style={[
                        styles.menuText,
                        item.destructive && styles.destructiveText,
                      ]}>
                      {item.title}
                    </Text>
                  </HStack>
                  <Icon
                    as={MaterialIcons}
                    name='chevron-right'
                    color={item.destructive ? '#ef4444' : '#9ca3af'}
                    size={6}
                  />
                </HStack>
              </Pressable>
              {index < menuItems.length - 1 && <Divider />}
            </Box>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
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
    color: '#fff',
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
  headerIconBox: {
    padding: 10,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
  },
  content: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  destructiveItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveIconBox: {
    backgroundColor: '#fee2e2',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Poppins',
  },
  destructiveText: {
    color: '#ef4444',
  },
});
