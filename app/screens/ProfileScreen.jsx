<<<<<<< HEAD
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { Box, HStack, Icon, Pressable, ScrollView, Text, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../theme";
import { useAuth } from "../context/AuthContext";
=======
// import CustomButton from '@/components/CustomButton';
// import { Ionicons } from '@expo/vector-icons';
// import { Box, HStack, Icon, Pressable, ScrollView, Text, VStack } from 'native-base';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import theme from '../../theme';
// import { useAuth } from '../context/AuthContext';

// export default function ProfileScreen({ navigation }) {
//   const { user, logout } = useAuth();

//   const menuItems = [
//     { icon: 'calendar-outline', label: 'My Subscription Order', route: 'Subscription' },
//     { icon: 'receipt-outline', label: 'My Order', route: 'Orders' },
//     { icon: 'location-outline', label: 'My Address', route: 'ManageAddresses' },
//     { icon: 'wallet-outline', label: 'Wallet', route: 'Wallet' },
//     { icon: 'heart-outline', label: 'Favourites', route: 'Favourites' },
//     { icon: 'help-circle-outline', label: 'Help & Support', route: 'Help' },
//     { icon: 'alert-circle-outline', label: "FAQ's", route: 'FAQ' },
//   ];

//   return (
//     <SafeAreaView style={{ flex: 1 }} edges={['top']}>
//       <Box flex={1} bg='white'>
//         <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
//           {/* Header */}
//           <Box
//             bg='gray.100'
//             p={4}
//             rounded='lg'
//             mb={6}
//             flexDirection='row'
//             justifyContent='space-between'
//             alignItems='center'>
//             <VStack>
//               <Text fontSize='md' bold>
//                 {user?.name || 'Your Name'}
//               </Text>
//               <Text fontSize='sm' color='muted.500'>
//                 {user?.email || 'your@email.com'}
//               </Text>
//               <Text fontSize='sm' color='muted.500'>
//                 {user?.mobile || '+91 0000000000'}
//               </Text>
//             </VStack>
//             <Pressable onPress={() => navigation.navigate('EditProfile')}>
//               <Text color='orange.600' bold>
//                 Edit
//               </Text>
//             </Pressable>
//           </Box>

//           {/* Menu Items */}
//           <VStack space={2}>
//             {menuItems.map((item, idx) => (
//               <Pressable key={idx} onPress={() => navigation.navigate(item.route)}>
//                 <HStack
//                   px={3}
//                   py={4}
//                   alignItems='center'
//                   justifyContent='space-between'
//                   borderBottomWidth={0.5}
//                   borderColor='gray.200'>
//                   <HStack space={3} alignItems='center'>
//                     <Icon as={Ionicons} name={item.icon} size={5} color='muted.600' />
//                     <Text fontSize='md'>{item.label}</Text>
//                   </HStack>
//                   <Icon as={Ionicons} name='chevron-forward' size={5} color='muted.400' />
//                 </HStack>
//               </Pressable>
//             ))}
//           </VStack>

//           {/* Spacer */}
//           <Box flex={1} />

//           {/* Logout */}
//           <Box mt={8} alignItems='center'>
//             {/* <Button
//               variant='outline'
//               colorScheme='red'
//               leftIcon={<Icon as={Ionicons} name='log-out-outline' size='sm' />}
//               onPress={logout}>
//               LOGOUT
//             </Button> */}
//             <CustomButton
//               title='Logout'
//               color='#FF7A00'
//               pressedColor={theme.colors.brand.green}
//               onPress={logout}
//               style={{ width: '100%' }}
//             />
//             <Text mt={4} fontSize='xs' color='muted.400'>
//               App version 1.01
//             </Text>
//           </Box>
//         </ScrollView>
//       </Box>
//     </SafeAreaView>
//   );
// }

import CustomButton from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, Icon, Image, Pressable, ScrollView, Text, VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../theme';
import { useAuth } from '../context/AuthContext';
>>>>>>> 6494936f28ec9788daea78a4a0c304e62e96dc8d

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: "calendar-outline", label: "My Subscription Order", route: "Subscription" },
    { icon: "receipt-outline", label: "My Order", route: "Orders" },
    { icon: "location-outline", label: "My Address", route: "ManageAddresses" },
    { icon: "wallet-outline", label: "Wallet", route: "Wallet" },
    { icon: "heart-outline", label: "Favourites", route: "Favourites" },
    { icon: "help-circle-outline", label: "Help & Support", route: "Help" },
    { icon: "alert-circle-outline", label: "FAQ's", route: "FAQ" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Box flex={1} bg='white'>
        <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
          {/* Header */}
          <Box
            bg='gray.100'
            p={4}
            rounded='lg'
            mb={6}
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'>
<<<<<<< HEAD
            <VStack>
              <Text fontSize='md' bold>
                {user?.name || "Your Name"}
              </Text>
              <Text fontSize='sm' color='muted.500'>
                {user?.email || "your@email.com"}
              </Text>
              <Text fontSize='sm' color='muted.500'>
                {user?.mobile || "+91 0000000000"}
              </Text>
            </VStack>
            <Pressable onPress={() => navigation.navigate("EditProfile")}>
=======
            <HStack space={4} alignItems='center' flex={1}>
              {/* Profile Image */}
              <Image
                source={require('../assets/lunch.jpg')} // replace with your asset image
                alt='Profile'
                size='60px'
                borderRadius={999}
              />

              {/* User Info */}
              <VStack flex={1}>
                <Text fontSize='md' bold>
                  {user?.name || 'Your Name'}
                </Text>
                <Text fontSize='sm' color='muted.500'>
                  {user?.email || 'your@email.com'}
                </Text>
                <Text fontSize='sm' color='muted.500'>
                  {user?.mobile || '+91 0000000000'}
                </Text>
              </VStack>
            </HStack>

            {/* Edit Button */}
            <Pressable onPress={() => navigation.navigate('EditProfile')}>
>>>>>>> 6494936f28ec9788daea78a4a0c304e62e96dc8d
              <Text color='orange.600' bold>
                Edit
              </Text>
            </Pressable>
          </Box>

          {/* Menu Items */}
          <VStack space={2}>
            {menuItems.map((item, idx) => (
              <Pressable key={idx} onPress={() => navigation.navigate(item.route)}>
                <HStack
                  px={3}
                  py={4}
                  alignItems='center'
                  justifyContent='space-between'
                  borderBottomWidth={0.5}
                  borderColor='gray.200'>
                  <HStack space={3} alignItems='center'>
                    <Icon as={Ionicons} name={item.icon} size={5} color='muted.600' />
                    <Text fontSize='md'>{item.label}</Text>
                  </HStack>
                  <Icon as={Ionicons} name='chevron-forward' size={5} color='muted.400' />
                </HStack>
              </Pressable>
            ))}
          </VStack>

          {/* Spacer */}
          <Box flex={1} />

          {/* Logout */}
          <Box mt={8} alignItems='center'>
            <CustomButton
              title='Logout'
              color='#FF7A00'
              pressedColor={theme.colors.brand.green}
              onPress={logout}
              style={{ width: "100%" }}
            />
            <Text mt={4} fontSize='xs' color='muted.400'>
              App version 1.01
            </Text>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
