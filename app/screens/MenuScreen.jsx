// screens/MenuScreen.js
import { Ionicons } from "@expo/vector-icons";
import { Box, FlatList, HStack, Icon, Image, Input, Text, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderBar from "../components/HeaderBar"; // ✅ use your header
import { kitchens } from "../data/menu";

export default function MenuScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Box flex={1}>
        {/* Header */}
        <HeaderBar title='Menu' showCart />

        {/* Search Bar */}
        <Box px={4} mt={2}>
          <Input
            placeholder='Search for Kitchen'
            variant='filled'
            bg='gray.100'
            borderRadius='lg'
            fontFamily='OpenSans'
            InputLeftElement={
              <Icon as={Ionicons} name='search' size='md' ml={3} color='coolGray.500' />
            }
          />
        </Box>

        {/* Section Title */}
        <Text mt={4} mb={2} px={4} fontSize='md' bold fontFamily='Poppins'>
          Meal Nearby
        </Text>

        {/* Kitchens List */}
        <FlatList
          data={kitchens}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <HStack
              key={item.id}
              space={3}
              px={4}
              py={3}
              alignItems='center'
              borderBottomWidth={0.5}
              borderColor='coolGray.200'>
              {/* Kitchen Image with discount badge */}
              <Box w={20} h={20} rounded='md' overflow='hidden' position='relative'>
                <Image source={item.image} alt={item.name} w='100%' h='100%' />
                {item.discount && (
                  <Box
                    position='absolute'
                    bottom={1}
                    left={1}
                    bg='red.600'
                    px={2}
                    py={0.5}
                    rounded='sm'>
                    <Text fontSize='2xs' color='white' bold>
                      {item.discount}
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Kitchen Details */}
              <VStack flex={1}>
                <Text bold fontSize='sm' fontFamily='Poppins' numberOfLines={1}>
                  {item.name}
                </Text>
                <HStack alignItems='center' space={1} mt={1}>
                  <Icon as={Ionicons} name='star' size='xs' color='amber.400' />
                  <Text fontSize='xs' color='coolGray.700'>
                    {item.rating} • {item.time}
                  </Text>
                </HStack>
                <Text fontSize='xs' color='coolGray.500' numberOfLines={2}>
                  {item.desc || "Multi-cuisine | Fresh & Hygienic Meals"}
                </Text>
              </VStack>
            </HStack>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}
