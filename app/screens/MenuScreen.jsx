// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { Badge, Box, FlatList, HStack, Icon, Image, Pressable, Text, VStack } from "native-base";
// import { useState } from "react";
// import { StyleSheet, TextInput, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import HeaderBar from "../components/HeaderBar";
// import { kitchens } from "../data/menu";

// export default function MenuScreen() {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Filter kitchens by name or description
//   const filteredKitchens = kitchens.filter(
//     (k) =>
//       k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (k.desc && k.desc.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }} edges={["top"]}>
//       <Box flex={1}>
//         {/* Header */}
//         <HeaderBar title='Menu' showCart />

//         {/* Premium Search Bar */}
//         <Box px={4} mt={3} mb={2}>
//           <View style={styles.searchContainer}>
//             <Icon as={Ionicons} name='search' size='md' color='orange.500' style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder='Search kitchens, cuisines...'
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               placeholderTextColor='#9ca3af'
//             />
//             {searchQuery.length > 0 && (
//               <Pressable onPress={() => setSearchQuery("")}>
//                 <Icon as={Ionicons} name='close-circle' size='sm' color='gray.400' />
//               </Pressable>
//             )}
//           </View>
//         </Box>

//         {/* Section Header with count */}
//         <HStack px={4} py={3} alignItems='center' justifyContent='space-between'>
//           <VStack>
//             <Text fontSize='lg' bold fontFamily='Poppins' color='gray.800'>
//               Kitchens Nearby
//             </Text>
//             <Text fontSize='xs' color='gray.500' mt={0.5}>
//               {filteredKitchens.length} {filteredKitchens.length === 1 ? "kitchen" : "kitchens"}{" "}
//               available
//             </Text>
//           </VStack>
//           <Pressable>
//             <HStack space={1} alignItems='center'>
//               <Icon as={MaterialIcons} name='tune' size='sm' color='orange.600' />
//               <Text fontSize='sm' color='orange.600' fontWeight='600'>
//                 Filters
//               </Text>
//             </HStack>
//           </Pressable>
//         </HStack>

//         {/* Premium Kitchens List */}
//         <FlatList
//           data={filteredKitchens}
//           keyExtractor={(item) => item.id}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
//           renderItem={({ item }) => (
//             <Pressable
//               onPress={() => navigation.navigate("KitchenScreen", { kitchen: item })}
//               mb={3}>
//               {({ isPressed }) => (
//                 <Box
//                   bg='white'
//                   borderRadius='2xl'
//                   overflow='hidden'
//                   shadow={isPressed ? 4 : 6}
//                   opacity={isPressed ? 0.95 : 1}
//                   transform={isPressed ? [{ scale: 0.98 }] : [{ scale: 1 }]}>
//                   {/* Kitchen Image with gradient overlay */}
//                   <Box position='relative' h='180'>
//                     <Image
//                       source={item.image}
//                       alt={item.name}
//                       w='100%'
//                       h='100%'
//                       resizeMode='cover'
//                     />

//                     {/* Gradient overlay at bottom */}
//                     <Box
//                       position='absolute'
//                       bottom={0}
//                       left={0}
//                       right={0}
//                       h='24'
//                       bg={{
//                         linearGradient: {
//                           colors: ["transparent", "rgba(0,0,0,0.7)"],
//                           start: [0, 0],
//                           end: [0, 1],
//                         },
//                       }}
//                     />

//                     {/* Discount Badge */}
//                     {item.discount && (
//                       <Box
//                         position='absolute'
//                         top={3}
//                         left={3}
//                         bg={{
//                           linearGradient: {
//                             colors: ["#dc2626", "#991b1b"],
//                             start: [0, 0],
//                             end: [1, 0],
//                           },
//                         }}
//                         px={3}
//                         py={1.5}
//                         borderRadius='full'
//                         shadow={3}>
//                         <Text fontSize='xs' color='white' bold>
//                           {item.discount}
//                         </Text>
//                       </Box>
//                     )}

//                     {/* Fast Delivery Badge */}
//                     <HStack
//                       position='absolute'
//                       top={3}
//                       right={3}
//                       bg='white'
//                       px={2.5}
//                       py={1}
//                       borderRadius='full'
//                       alignItems='center'
//                       space={1}
//                       shadow={2}>
//                       <Icon as={Ionicons} name='flash' size='xs' color='orange.500' />
//                       <Text fontSize='2xs' color='gray.700' bold>
//                         {item.time}
//                       </Text>
//                     </HStack>

//                     {/* Rating Badge at bottom */}
//                     <HStack
//                       position='absolute'
//                       bottom={3}
//                       left={3}
//                       bg='rgba(255, 255, 255, 0.95)'
//                       px={2.5}
//                       py={1}
//                       borderRadius='lg'
//                       alignItems='center'
//                       space={1}
//                       shadow={2}>
//                       <Icon as={Ionicons} name='star' size='xs' color='amber.500' />
//                       <Text fontSize='xs' color='gray.800' bold>
//                         {item.rating}
//                       </Text>
//                     </HStack>
//                   </Box>

//                   {/* Kitchen Details */}
//                   <VStack p={4} space={2}>
//                     <HStack justifyContent='space-between' alignItems='flex-start'>
//                       <VStack flex={1} mr={2}>
//                         <Text
//                           bold
//                           fontSize='md'
//                           fontFamily='Poppins'
//                           color='gray.800'
//                           numberOfLines={1}>
//                           {item.name}
//                         </Text>
//                         <Text
//                           fontSize='xs'
//                           color='gray.500'
//                           numberOfLines={2}
//                           mt={1}
//                           lineHeight='sm'>
//                           {item.desc || "Multi-cuisine | Fresh & Hygienic Meals"}
//                         </Text>
//                       </VStack>
//                       <Icon as={Ionicons} name='chevron-forward' size='sm' color='orange.500' />
//                     </HStack>

//                     {/* Tags/Badges */}
//                     <HStack space={2} flexWrap='wrap' mt={1}>
//                       <Badge
//                         bg='orange.50'
//                         borderRadius='md'
//                         _text={{ color: "orange.700", fontSize: "2xs", fontWeight: "600" }}
//                         px={2}
//                         py={0.5}>
//                         Popular
//                       </Badge>
//                       <Badge
//                         bg='green.50'
//                         borderRadius='md'
//                         _text={{ color: "green.700", fontSize: "2xs", fontWeight: "600" }}
//                         px={2}
//                         py={0.5}>
//                         Free Delivery
//                       </Badge>
//                     </HStack>
//                   </VStack>
//                 </Box>
//               )}
//             </Pressable>
//           )}
//           ListEmptyComponent={() => (
//             <Box alignItems='center' mt={20}>
//               <Box
//                 w='100'
//                 h='100'
//                 borderRadius='50'
//                 bg='gray.100'
//                 alignItems='center'
//                 justifyContent='center'
//                 mb={4}>
//                 <Icon as={Ionicons} name='search-outline' size='4xl' color='gray.400' />
//               </Box>
//               <Text fontSize='lg' bold color='gray.700' mb={2}>
//                 No kitchens found
//               </Text>
//               <Text fontSize='sm' color='gray.500' textAlign='center' px={8}>
//                 Try adjusting your search or filters
//               </Text>
//             </Box>
//           )}
//         />
//       </Box>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     paddingHorizontal: 14,
//     paddingVertical: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#f3f4f6",
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontFamily: "OpenSans",
//     fontSize: 15,
//     color: "#1f2937",
//     paddingVertical: 10,
//   },
// });

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Badge, Box, FlatList, HStack, Icon, Image, Pressable, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterModal from '../components/FilterModal'; // 👈 make sure this path is correct
import HeaderBar from '../components/HeaderBar';
import { kitchens } from '../data/menu';

export default function MenuScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  // const [appliedFilters, setAppliedFilters] = useState({});
  // const filterSheetRef = useRef(null);

  const [filterVisible, setFilterVisible] = useState(false);

  // const openFilter = () => {
  //   filterSheetRef.current?.expand();
  // };

  // const closeFilter = () => {
  //   filterSheetRef.current?.close();
  // };

  // const applyFilters = (selectedFilters) => {
  //   setAppliedFilters(selectedFilters);
  //   console.log('Applied Filters:', selectedFilters);
  //   closeFilter();
  // };

  // Filter logic (temporary — you can expand this later)
  const filteredKitchens = kitchens.filter((k) =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }} edges={['top']}>
      <Box flex={1}>
        {/* Header */}
        <HeaderBar title='Menu' showCart />

        {/* Search Bar */}
        <Box px={4} mt={3} mb={2}>
          <View style={styles.searchContainer}>
            <Icon as={Ionicons} name='search' size='md' color='orange.500' style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder='Search kitchens, cuisines...'
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor='#9ca3af'
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Icon as={Ionicons} name='close-circle' size='sm' color='gray.400' />
              </Pressable>
            )}
          </View>
        </Box>

        {/* Section Header */}
        <HStack px={4} py={3} alignItems='center' justifyContent='space-between'>
          <VStack>
            <Text fontSize='lg' bold fontFamily='Poppins' color='gray.800'>
              Kitchens Nearby
            </Text>
            <Text fontSize='xs' color='gray.500' mt={0.5}>
              {filteredKitchens.length} {filteredKitchens.length === 1 ? 'kitchen' : 'kitchens'}{' '}
              available
            </Text>
          </VStack>
          <Pressable onPress={() => setFilterVisible(true)}>
            <HStack space={1} alignItems='center'>
              <Icon as={MaterialIcons} name='tune' size='sm' color='orange.600' />
              <Text fontSize='sm' color='orange.600' fontWeight='600'>
                Filters
              </Text>
            </HStack>
          </Pressable>
        </HStack>

        {/* Kitchens List */}
        <FlatList
          data={filteredKitchens}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('KitchenScreen', { kitchen: item })}
              mb={3}>
              {({ isPressed }) => (
                <Box
                  bg='white'
                  borderRadius='2xl'
                  overflow='hidden'
                  shadow={isPressed ? 4 : 6}
                  opacity={isPressed ? 0.95 : 1}
                  transform={isPressed ? [{ scale: 0.98 }] : [{ scale: 1 }]}>
                  <Box position='relative' h='180'>
                    <Image
                      source={item.image}
                      alt={item.name}
                      w='100%'
                      h='100%'
                      resizeMode='cover'
                    />

                    <Box
                      position='absolute'
                      bottom={0}
                      left={0}
                      right={0}
                      h='24'
                      bg={{
                        linearGradient: {
                          colors: ['transparent', 'rgba(0,0,0,0.7)'],
                          start: [0, 0],
                          end: [0, 1],
                        },
                      }}
                    />

                    {item.discount && (
                      <Box
                        position='absolute'
                        top={3}
                        left={3}
                        bg={{
                          linearGradient: {
                            colors: ['#dc2626', '#991b1b'],
                            start: [0, 0],
                            end: [1, 0],
                          },
                        }}
                        px={3}
                        py={1.5}
                        borderRadius='full'
                        shadow={3}>
                        <Text fontSize='xs' color='white' bold>
                          {item.discount}
                        </Text>
                      </Box>
                    )}

                    <HStack
                      position='absolute'
                      top={3}
                      right={3}
                      bg='white'
                      px={2.5}
                      py={1}
                      borderRadius='full'
                      alignItems='center'
                      space={1}
                      shadow={2}>
                      <Icon as={Ionicons} name='flash' size='xs' color='orange.500' />
                      <Text fontSize='2xs' color='gray.700' bold>
                        {item.time}
                      </Text>
                    </HStack>

                    <HStack
                      position='absolute'
                      bottom={3}
                      left={3}
                      bg='rgba(255, 255, 255, 0.95)'
                      px={2.5}
                      py={1}
                      borderRadius='lg'
                      alignItems='center'
                      space={1}
                      shadow={2}>
                      <Icon as={Ionicons} name='star' size='xs' color='amber.500' />
                      <Text fontSize='xs' color='gray.800' bold>
                        {item.rating}
                      </Text>
                    </HStack>
                  </Box>

                  <VStack p={4} space={2}>
                    <HStack justifyContent='space-between' alignItems='flex-start'>
                      <VStack flex={1} mr={2}>
                        <Text
                          bold
                          fontSize='md'
                          fontFamily='Poppins'
                          color='gray.800'
                          numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text
                          fontSize='xs'
                          color='gray.500'
                          numberOfLines={2}
                          mt={1}
                          lineHeight='sm'>
                          {item.desc || 'Multi-cuisine | Fresh & Hygienic Meals'}
                        </Text>
                      </VStack>
                      <Icon as={Ionicons} name='chevron-forward' size='sm' color='orange.500' />
                    </HStack>

                    <HStack space={2} flexWrap='wrap' mt={1}>
                      <Badge
                        bg='orange.50'
                        borderRadius='md'
                        _text={{ color: 'orange.700', fontSize: '2xs', fontWeight: '600' }}
                        px={2}
                        py={0.5}>
                        Popular
                      </Badge>
                      <Badge
                        bg='green.50'
                        borderRadius='md'
                        _text={{ color: 'green.700', fontSize: '2xs', fontWeight: '600' }}
                        px={2}
                        py={0.5}>
                        Free Delivery
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Box alignItems='center' mt={20}>
              <Box
                w='100'
                h='100'
                borderRadius='50'
                bg='gray.100'
                alignItems='center'
                justifyContent='center'
                mb={4}>
                <Icon as={Ionicons} name='search-outline' size='4xl' color='gray.400' />
              </Box>
              <Text fontSize='lg' bold color='gray.700' mb={2}>
                No kitchens found
              </Text>
              <Text fontSize='sm' color='gray.500' textAlign='center' px={8}>
                Try adjusting your search or filters
              </Text>
            </Box>
          )}
        />

        {/* 👇 Zomato-style Filter Bottom Sheet */}
        {/* <FilterModal ref={filterSheetRef} onApply={applyFilters} onClose={closeFilter} /> */}
        <FilterModal
          open={filterVisible}
          onClose={() => setFilterVisible(false)}
          // onApply={(filters) => console.log(filters)}
        />
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 10,
  },
});
