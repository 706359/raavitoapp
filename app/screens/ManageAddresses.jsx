// import CustomButton from '@/components/CustomButton';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import * as Location from 'expo-location';
// import { Box, Button, HStack, Icon, Pressable, Text, VStack } from 'native-base';
// import React, { useEffect, useState } from 'react';
// import { FlatList } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAddress } from '../context/AddressContext'; // 👈 Import AddressContext

// const dummyData = [
//   {
//     id: '1',
//     type: 'Office',
//     address:
//       '412, Apple square, 6VPM+P2M, Vrajbhumi Society, Mota Varachha, Surat, Gujarat 394101, India',
//   },
//   {
//     id: '2',
//     type: 'Home',
//     address:
//       '123, said, 6RSR+776, Ashwini Kumar Rd, Khand Bazar, Varachha, Surat, Gujarat 395008, India',
//   },
// ];

// export default function ManageAddresses() {
//   const navigation = useNavigation();
//   const { setSelectedAddress } = useAddress(); // 👈 use context
//   const [currentLocation, setCurrentLocation] = useState('Fetching location...');

//   // Get current location
//   useEffect(() => {
//     (async () => {
//       try {
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           setCurrentLocation('Permission denied');
//           return;
//         }

//         let loc = await Location.getCurrentPositionAsync({});
//         let geo = await Location.reverseGeocodeAsync({
//           latitude: loc.coords.latitude,
//           longitude: loc.coords.longitude,
//         });

//         if (geo.length > 0) {
//           const place = geo[0];
//           setCurrentLocation(
//             `${place.name || ''} ${place.street || ''}, ${place.city}, ${place.region}`,
//           );
//         }
//       } catch (err) {
//         console.log(err);
//         setCurrentLocation('Error fetching location');
//       }
//     })();
//   }, []);

//   // Handle selection of current location
//   const handleSelectCurrentLocation = () => {
//     setSelectedAddress(currentLocation);
//     navigation.goBack();
//   };

//   // Handle selection of saved address
//   const handleSelectSavedAddress = (address) => {
//     setSelectedAddress(address);
//     navigation.goBack();
//   };

//   const renderItem = ({ item }) => (
//     <Pressable onPress={() => handleSelectSavedAddress(item.address)}>
//       <Box
//         borderWidth={1}
//         borderColor='gray.200'
//         borderRadius='md'
//         p={4}
//         mb={3}
//         bg='white'
//         shadow={1}>
//         <HStack alignItems='center' space={3} mb={2}>
//           <Icon
//             as={MaterialIcons}
//             name={item.type === 'Office' ? 'business' : 'home'}
//             size='6'
//             color='rgba(255, 122, 0, 1)'
//           />
//           <Text fontSize='md' fontFamily='Poppins' fontWeight='600'>
//             {item.type}
//           </Text>
//         </HStack>
//         <Text fontSize='sm' fontFamily='OpenSans' mb={2} color='gray.700'>
//           {item.address}
//         </Text>
//         <HStack space={4}>
//           <Button
//             variant='ghost'
//             size='sm'
//             _text={{ color: 'rgba(255, 122, 0, 1)', fontFamily: 'Poppins', fontWeight: '600' }}>
//             EDIT
//           </Button>
//           <Button
//             variant='ghost'
//             size='sm'
//             _text={{ color: 'rgba(255, 122, 0, 1)', fontFamily: 'Poppins', fontWeight: '600' }}>
//             DELETE
//           </Button>
//         </HStack>
//       </Box>
//     </Pressable>
//   );

//   return (
//     <SafeAreaView
//       style={{ flex: 1, padding: 16, backgroundColor: '#F5F5F5' }}
//       edges={['left', 'right', 'top']}>
//       {/* Header with back icon */}
//       <HStack alignItems='center' mb={4}>
//         <Pressable onPress={() => navigation.goBack()}>
//           <Icon as={MaterialIcons} name='arrow-back' size='6' color='black' />
//         </Pressable>
//         <Text fontSize='xl' fontFamily='Poppins' fontWeight='600' ml={4}>
//           Manage Addresses
//         </Text>
//       </HStack>

//       {/* Current Location */}
//       <Pressable onPress={handleSelectCurrentLocation} mb={4}>
//         <Box borderWidth={1} borderColor='gray.300' borderRadius='md' p={4} bg='white'>
//           <HStack alignItems='center' space={3}>
//             <Icon as={MaterialIcons} name='my-location' size='6' color='rgba(255, 122, 0, 1)' />
//             <VStack>
//               <Text fontSize='md' fontWeight='600'>
//                 Use Current Location
//               </Text>
//               <Text fontSize='sm' color='gray.600'>
//                 {currentLocation}
//               </Text>
//             </VStack>
//           </HStack>
//         </Box>
//       </Pressable>

//       {/* Saved Addresses Section */}
//       <Text fontSize='md' fontWeight='600' mb={2}>
//         Saved Addresses
//       </Text>
//       <FlatList
//         data={dummyData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* Add New Address Button */}
//       <CustomButton
//         title={'ADD NEW ADDRESS'}
//         color='rgba(255, 122, 0, 1)'
//         pressedColor={'rgba(7, 192, 53, 1)'}
//         mt={4}
//       />
//     </SafeAreaView>
//   );
// }

import CustomButton from '@/components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Box, Button, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddress } from '../context/AddressContext';

export default function ManageAddresses() {
  const navigation = useNavigation();
  const { setSelectedAddress } = useAddress();
  const [currentLocation, setCurrentLocation] = useState('Fetching location...');
  const [addresses, setAddresses] = useState([]);

  // Load addresses from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem('addresses');
        if (saved) {
          setAddresses(JSON.parse(saved));
        } else {
          // default data
          setAddresses([
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
          ]);
        }
      } catch (err) {
        console.log('Error loading addresses', err);
      }
    };
    loadData();
  }, []);

  // Save addresses to AsyncStorage
  const saveAddresses = async (data) => {
    try {
      await AsyncStorage.setItem('addresses', JSON.stringify(data));
    } catch (err) {
      console.log('Error saving addresses', err);
    }
  };

  // Get current location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCurrentLocation('Permission denied');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        let geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (geo.length > 0) {
          const place = geo[0];
          setCurrentLocation(
            `${place.name || ''} ${place.street || ''}, ${place.city}, ${place.region}`,
          );
        }
      } catch (err) {
        console.log(err);
        setCurrentLocation('Error fetching location');
      }
    })();
  }, []);

  // Handle selection
  const handleSelectCurrentLocation = () => {
    setSelectedAddress(currentLocation);
    navigation.goBack();
  };

  const handleSelectSavedAddress = (address) => {
    setSelectedAddress(address);
    navigation.goBack();
  };

  // Edit address
  const handleEdit = (id) => {
    const found = addresses.find((a) => a.id === id);
    if (!found) return;

    Alert.prompt(
      'Edit Address',
      'Update your address below:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: (newAddress) => {
            if (newAddress) {
              const updated = addresses.map((a) =>
                a.id === id ? { ...a, address: newAddress } : a,
              );
              setAddresses(updated);
              saveAddresses(updated);
            }
          },
        },
      ],
      'plain-text',
      found.address,
    );
  };

  // Delete address
  const handleDelete = (id) => {
    const filtered = addresses.filter((a) => a.id !== id);
    setAddresses(filtered);
    saveAddresses(filtered);
  };

  // Add new address
  const handleAdd = () => {
    const newAddr = {
      id: Date.now().toString(),
      type: 'Other',
      address: 'New Address Example, Update this...',
    };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    saveAddresses(updated);
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleSelectSavedAddress(item.address)}>
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
            name={item.type === 'Office' ? 'business' : item.type === 'Home' ? 'home' : 'place'}
            size='6'
            color='rgba(255, 122, 0, 1)'
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
            onPress={() => handleEdit(item.id)}
            _text={{ color: 'rgba(255, 122, 0, 1)', fontFamily: 'Poppins', fontWeight: '600' }}>
            EDIT
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onPress={() => handleDelete(item.id)}
            _text={{ color: 'rgba(255, 122, 0, 1)', fontFamily: 'Poppins', fontWeight: '600' }}>
            DELETE
          </Button>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 16, backgroundColor: '#F5F5F5' }}
      edges={['left', 'right', 'top']}>
      {/* Header */}
      <HStack alignItems='center' mb={4}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon as={MaterialIcons} name='arrow-back' size='6' color='black' />
        </Pressable>
        <Text fontSize='xl' fontFamily='Poppins' fontWeight='600' ml={4}>
          Manage Addresses
        </Text>
      </HStack>

      {/* Current Location */}
      <Pressable onPress={handleSelectCurrentLocation} mb={4}>
        <Box borderWidth={1} borderColor='gray.300' borderRadius='md' p={4} bg='white'>
          <HStack alignItems='center' space={3}>
            <Icon as={MaterialIcons} name='my-location' size='6' color='rgba(255, 122, 0, 1)' />
            <VStack>
              <Text fontSize='md' fontWeight='600'>
                Use Current Location
              </Text>
              <Text fontSize='sm' color='gray.600'>
                {currentLocation}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Pressable>

      {/* Saved Addresses */}
      <Text fontSize='md' fontWeight='600' mb={2}>
        Saved Addresses
      </Text>
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* Add New Address */}
      <CustomButton
        title={'ADD NEW ADDRESS'}
        color='rgba(255, 122, 0, 1)'
        pressedColor={'rgba(7, 192, 53, 1)'}
        mt={4}
        onPress={handleAdd}
      />
    </SafeAreaView>
  );
}
