import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Progress,
  ScrollView,
  Text,
  TextArea,
  VStack,
} from "native-base";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, login, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSave = () => {
    if (!user) return;
    login({ ...user, name, email, address });
  };

  const totalFields = 3;
  const filledFields = [name, email, address].filter((f) => f.trim() !== "").length;
  const completion = Math.round((filledFields / totalFields) * 100);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg='white'>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Heading size='lg' mb={4}>
            Profile
          </Heading>

          {user ? (
            <VStack space={5}>
              <HStack alignItems='center' space={3}>
                <Icon as={Ionicons} name='person-circle-outline' size='xl' color='cyan.600' />
                <VStack>
                  <Text fontSize='md' bold>
                    {user.name || "Your Name"}
                  </Text>
                  <Text fontSize='sm' color='muted.500'>
                    Mobile: {user.mobile}
                  </Text>
                </VStack>
              </HStack>

              <Input
                placeholder='Full Name'
                value={name}
                onChangeText={setName}
                InputLeftElement={
                  <Icon as={Ionicons} name='person-outline' size={5} ml={3} color='muted.400' />
                }
              />

              <Input
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                InputLeftElement={
                  <Icon as={Ionicons} name='mail-outline' size={5} ml={3} color='muted.400' />
                }
              />

              <TextArea
                placeholder='Address'
                value={address}
                onChangeText={setAddress}
                h={20}
                totalLines={4}
                InputLeftElement={
                  <Icon as={Ionicons} name='location-outline' size={5} ml={3} color='muted.400' />
                }
              />

              <Button
                colorScheme='blue'
                leftIcon={<Icon as={Ionicons} name='save-outline' size='sm' />}
                onPress={handleSave}>
                Save Profile
              </Button>

              <Button
                colorScheme='red'
                variant='outline'
                leftIcon={<Icon as={Ionicons} name='log-out-outline' size='sm' />}
                onPress={logout}>
                Logout
              </Button>

              <Box mt={6}>
                <Text mb={2} fontSize='sm' color='muted.500'>
                  Profile Completion: {completion}%
                </Text>
                <Progress value={completion} colorScheme='green' />
              </Box>
            </VStack>
          ) : (
            <Text mt={2} color='coolGray.500'>
              No user logged in
            </Text>
          )}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
