import FoodCard from "@/components/FoodCard";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Box, HStack, Icon, Input, Pressable, ScrollView, Text, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const menu = [
    { id: 1, name: "Full Veg Thali", price: 120, image: "https://picsum.photos/200/200?random=1" },
    { id: 2, name: "Mini Veg Thali", price: 80, image: "https://picsum.photos/200/200?random=2" },
    {
      id: 3,
      name: "Paneer Tikka Tiffin",
      price: 150,
      image: "https://picsum.photos/200/200?random=3",
    },
    {
      id: 4,
      name: "Dal Chawal Tiffin",
      price: 90,
      image: "https://picsum.photos/200/200?random=4",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg='white'>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Header */}
          <HStack justifyContent='space-between' alignItems='center' px={4} py={3} bg='cyan.600'>
            <VStack>
              <Text color='white' fontSize='sm'>
                Delivering to
              </Text>
              <HStack alignItems='center' space={1}>
                <Icon as={Ionicons} name='location' size='sm' color='white' />
                <Text color='white' fontSize='md' bold>
                  Dadri, UP
                </Text>
              </HStack>
            </VStack>
            <Icon as={Ionicons} name='person-circle-outline' size='xl' color='white' />
          </HStack>

          {/* Search Bar */}
          <Box px={4} mt={4}>
            <Input
              placeholder='Search meals or thalis'
              variant='filled'
              bg='gray.100'
              borderRadius='lg'
              InputLeftElement={<Icon as={Ionicons} name='search' size='md' ml={3} />}
            />
          </Box>

          {/* Quick Menu */}
          <HStack px={4} mt={6} justifyContent='space-between'>
            <VStack alignItems='center'>
              <Pressable bg='orange.400' p={4} rounded='full'>
                <Icon as={Ionicons} name='fast-food-outline' color='white' size='lg' />
              </Pressable>
              <Text mt={2} fontSize='xs'>
                Meals
              </Text>
            </VStack>

            <VStack alignItems='center'>
              <Pressable bg='green.400' p={4} rounded='full'>
                <Icon as={Ionicons} name='leaf-outline' color='white' size='lg' />
              </Pressable>
              <Text mt={2} fontSize='xs'>
                Healthy
              </Text>
            </VStack>

            <VStack alignItems='center'>
              <Pressable bg='purple.400' p={4} rounded='full'>
                <Icon as={Ionicons} name='cafe-outline' color='white' size='lg' />
              </Pressable>
              <Text mt={2} fontSize='xs'>
                Snacks
              </Text>
            </VStack>

            <VStack alignItems='center'>
              <Pressable bg='red.400' p={4} rounded='full'>
                <Icon as={MaterialIcons} name='local-drink' color='white' size='lg' />
              </Pressable>
              <Text mt={2} fontSize='xs'>
                Drinks
              </Text>
            </VStack>
          </HStack>

          {/* Highlight Banner */}
          <Box mx={4} mt={6} p={5} rounded='xl' bg='cyan.100'>
            <Text fontSize='lg' bold color='cyan.800'>
              Special Offer
            </Text>
            <Text color='cyan.700' mt={1}>
              Free drink with every Full Veg Thali today.
            </Text>
            <Pressable mt={3} bg='cyan.600' px={4} py={2} rounded='lg' alignSelf='flex-start'>
              <Text color='white' bold>
                Order Now
              </Text>
            </Pressable>
          </Box>

          {/* Offers Section */}
          <Box px={4} mt={6}>
            <Text bold fontSize='md' mb={3}>
              Deals for You
            </Text>
            <HStack space={3}>
              <Box bg='pink.100' px={4} py={3} rounded='lg'>
                <Text bold>₹50 OFF</Text>
                <Text fontSize='xs'>on Mini Thali</Text>
              </Box>
              <Box bg='yellow.100' px={4} py={3} rounded='lg'>
                <Text bold>Combo Saver</Text>
                <Text fontSize='xs'>Thali + Drink</Text>
              </Box>
              <Box bg='green.100' px={4} py={3} rounded='lg'>
                <Text bold>Family Pack</Text>
                <Text fontSize='xs'>Up to 20% OFF</Text>
              </Box>
            </HStack>
          </Box>

          {/* Menu Section */}
          <Box px={4} mt={8}>
            <Text fontSize='2xl' bold mb={1}>
              Welcome to Raavito
            </Text>
            <Text fontSize='sm' color='coolGray.600' mb={4}>
              Fresh homemade thalis & tiffins
            </Text>

            <VStack space={4}>
              {menu.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </VStack>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
