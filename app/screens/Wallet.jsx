import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, Button, HStack, Icon, Pressable, ScrollView, Text, VStack } from 'native-base';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Wallet() {
  const navigation = useNavigation();

  // 🔹 Dummy transaction data
  const transactions = [
    { desc: 'Wallet Used in Order Id#10', date: '8th October, 06:49 PM', amount: -112 },
    { desc: 'Wallet Balance Added!!', date: '8th October, 06:48 PM', amount: 100 },
    { desc: 'Wallet Balance Added!!', date: '8th October, 03:06 PM', amount: 112 },
    { desc: 'Wallet Used in Order Id#2', date: '25th September, 02:35 PM', amount: -100 },
    { desc: 'Wallet Balance Added!!', date: '24th September, 02:27 PM', amount: 100 },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <ScrollView>
        {/* 🔙 Back Arrow */}
        <Pressable onPress={() => navigation.goBack()}>
          <HStack alignItems='center' px={4} py={3}>
            <Icon as={MaterialIcons} name='arrow-back' size='md' color='black' />
          </HStack>
        </Pressable>

        {/* 💰 Top Section */}
        <Box bg='brand.green' px={6} py={8} borderBottomRadius='3xl'>
          <VStack space={2} alignItems='start'>
            <Icon as={MaterialIcons} name='account-balance-wallet' size='2xl' color='white' />
            <Text fontSize='4xl' fontWeight='bold' color='white' fontFamily='Poppins'>
              $0
            </Text>
            <Text fontSize='md' color='white' fontFamily='OpenSans'>
              E-Wallet
            </Text>
            <Button mt={4} alignSelf='flex-end'>
              + ADD MONEY
            </Button>
          </VStack>
        </Box>

        {/* 📜 Transaction History */}
        <Box px={6} py={4}>
          <Text fontSize='lg' fontWeight='bold' mb={4} fontFamily='Poppins'>
            Transaction History
          </Text>

          <VStack space={4}>
            {transactions.map((tx, index) => (
              <Box key={index} bg='white' p={4} borderRadius='lg' shadow={1}>
                <HStack justifyContent='space-between'>
                  <VStack>
                    <Text fontWeight='600' fontFamily='OpenSans'>
                      {tx.desc}
                    </Text>
                    <Text fontSize='xs' color='gray.500' fontFamily='OpenSans'>
                      {tx.date}
                    </Text>
                  </VStack>
                  <Text
                    fontWeight='bold'
                    color={tx.amount < 0 ? 'red.500' : 'brand.green'}
                    fontFamily='Poppins'>
                    {tx.amount < 0 ? `-$${Math.abs(tx.amount)}` : `+$${tx.amount}`}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
