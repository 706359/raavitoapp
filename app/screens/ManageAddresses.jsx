import CustomButton from '@/components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, Button, HStack, Icon, Pressable, Text } from 'native-base';
import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyData = [
  {
    id: '1',
    type: 'Office',
    address:
      '412, Apple square, 6VPM+P2M, Vrajbhumi Society, Mota Varachha, Surat, Gujarat 394101, India',
  },
  {
    id: '2',
    type: 'Home',
    address:
      '123, said, 6RSR+776, Ashwini Kumar Rd, Khand Bazar, Varachha, Surat, Gujarat 395008, India',
  },
];

export default function ManageAddresses() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <Box
      borderWidth={1}
      borderColor='gray.200'
      borderRadius='md'
      p={4}
      mb={3}
      bg='white'
      shadow={1}>
      <HStack alignItems='center' space={3} mb={2}>
        <Icon
          as={MaterialIcons}
          name={item.type === 'Office' ? 'business' : 'home'}
          size='6'
          color='rgba(255, 122, 0, 1).500'
        />
        <Text fontSize='md' fontFamily='Poppins' fontWeight='600'>
          {item.type}
        </Text>
      </HStack>
      <Text fontSize='sm' fontFamily='OpenSans' mb={2} color='gray.700'>
        {item.address}
      </Text>
      <HStack space={4}>
        <Button
          variant='ghost'
          size='sm'
          _text={{ color: 'rgba(255, 122, 0, 1).500', fontFamily: 'Poppins', fontWeight: '600' }}>
          EDIT
        </Button>
        <Button
          variant='ghost'
          size='sm'
          _text={{ color: 'rgba(255, 122, 0, 1).500', fontFamily: 'Poppins', fontWeight: '600' }}>
          DELETE
        </Button>
      </HStack>
    </Box>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 16, backgroundColor: '#F5F5F5' }}
      edges={['left', 'right', 'top']}>
      {/* Header with back icon */}
      <HStack alignItems='center' mb={4}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon as={MaterialIcons} name='arrow-back' size='6' color='black' />
        </Pressable>
        <Text fontSize='xl' fontFamily='Poppins' fontWeight='600' ml={4}>
          Manage Addresses
        </Text>
      </HStack>

      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      {/* <Button
        mt={4}
        bg='rgba(255, 122, 0, 1).500'
        _text={{ fontFamily: 'Poppins', fontWeight: '600' }}>
        ADD NEW ADDRESS
      </Button> */}
      <CustomButton
        title={'ADD NEW ADDRESS'}
        color='rgba(255, 122, 0, 1)'
        pressedColor={'rgba(7, 192, 53, 1)'}
      />
    </SafeAreaView>
  );
}
