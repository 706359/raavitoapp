// screens/HomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Box, FlatList, HStack, Icon, Image, Input, ScrollView, Text, VStack } from "native-base";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderBar from "../components/HeaderBar";
import { kitchens } from "../data/menu";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    title: "Subscription Packages",
    subtitle: "Up to 60% OFF | 6 months+",
    bg: "brand.orange",
  },
  {
    id: "2",
    title: "Today’s Special",
    subtitle: "Get free dessert with every thali",
    bg: "brand.green",
  },
  { id: "3", title: "Weekend Offer", subtitle: "Flat 20% OFF on family packs", bg: "yellow.400" },
];

const categories = [
  { id: "1", name: "Dosa Thali", image: require("../assets/Dosa.jpg") },
  { id: "2", name: "Gujarati Thali", image: require("../assets/Gujarati.jpeg") },
  { id: "3", name: "Rajasthani Thali", image: require("../assets/Rajasthani.jpg") },
  { id: "4", name: "Punjabi Thali", image: require("../assets/Punjabi.webp") },
];

export default function HomeScreen() {
  const [location, setLocation] = useState("Fetching...");
  const scrollRef = useRef(null);

  // Auto-scroll banners
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: currentIndex * width * 0.85, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Location fetch
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Permission denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        let geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geo.length > 0) {
          const place = geo[0];
          setLocation(`${place.city || place.district}, ${place.region}`);
        }
      } catch {
        setLocation("Error");
      }
    })();
  }, []);

  // Card dimensions for consistent layout
  const CARD_WIDTH = width * 0.44;
  const CARD_HEIGHT = 180;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg='brand.light'>
        <HeaderBar title='Home' showCart location={location} />

        <FlatList
          data={kitchens.slice(0, 6)}
          keyExtractor={(item) => `kitchen-${item.id}`}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <VStack space={8} mb={6}>
              {/* Search */}
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

              {/* Banners */}
              <Box>
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}>
                  {banners.map((banner) => (
                    <Box
                      key={banner.id}
                      width={width * 0.85}
                      mx={3}
                      p={6}
                      rounded='xl'
                      bg={banner.bg}>
                      <Text bold fontSize='lg' color='white' fontFamily='Poppins'>
                        {banner.title}
                      </Text>
                      <Text fontSize='sm' color='brand.light' mt={2} fontFamily='OpenSans'>
                        {banner.subtitle}
                      </Text>
                    </Box>
                  ))}
                </ScrollView>
              </Box>

              {/* Categories */}
              <Box px={4}>
                <Text bold fontSize='lg' mb={4} color='brand.dark' fontFamily='Poppins'>
                  <Text>What&apos;s on your mind?</Text>
                </Text>
                <HStack justifyContent='space-between'>
                  {categories.map((cat) => (
                    <VStack key={cat.id} alignItems='center' flex={1}>
                      <Image
                        source={cat.image}
                        alt={cat.name}
                        w={16}
                        h={16}
                        rounded='full'
                        mb={2}
                      />
                      <Text fontSize='sm' fontFamily='OpenSans' textAlign='center'>
                        {cat.name}
                      </Text>
                    </VStack>
                  ))}
                </HStack>
              </Box>

              {/* Offers */}
              <Box px={4}>
                <Text bold fontSize='lg' mb={4}>
                  Deals for You
                </Text>
                <HStack space={4}>
                  <Box bg='pink.100' px={5} py={4} rounded='xl'>
                    <Text bold>₹50 OFF</Text>
                    <Text fontSize='xs'>on Mini Thali</Text>
                  </Box>
                  <Box bg='yellow.100' px={5} py={4} rounded='xl'>
                    <Text bold>Combo Saver</Text>
                    <Text fontSize='xs'>Thali + Drink</Text>
                  </Box>
                  <Box bg='green.100' px={5} py={4} rounded='xl'>
                    <Text bold>Family Pack</Text>
                    <Text fontSize='xs'>Up to 20% OFF</Text>
                  </Box>
                </HStack>
              </Box>

              {/* Top Kitchens */}
              <Box px={4}>
                <Text bold fontSize='lg' mb={4}>
                  Top kitchens near you
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {kitchens.slice(6, 11).map((kitchen) => (
                    <Box
                      key={`top-${kitchen.id}`}
                      width={CARD_WIDTH}
                      height={CARD_HEIGHT}
                      mr={4}
                      rounded='xl'
                      overflow='hidden'
                      shadow={2}
                      bg='white'>
                      <Image
                        source={kitchen.image}
                        alt={kitchen.name}
                        height={CARD_HEIGHT * 0.55}
                        width='100%'
                        resizeMode='cover'
                      />
                      <Box
                        position='absolute'
                        top={2}
                        left={2}
                        bg='red.600'
                        px={2}
                        py={1}
                        rounded='sm'>
                        <Text fontSize='xs' color='white' bold>
                          {kitchen.discount}
                        </Text>
                      </Box>
                      <VStack p={3}>
                        <Text bold fontSize='sm' numberOfLines={1}>
                          {kitchen.name}
                        </Text>
                        <HStack mt={1} alignItems='center' space={1}>
                          <Icon as={Ionicons} name='star' size='xs' color='amber.400' />
                          <Text fontSize='xs' color='coolGray.600'>
                            ⭐ {kitchen.rating} • {kitchen.time}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </ScrollView>
              </Box>
            </VStack>
          }
          renderItem={({ item }) => (
            <Box
              key={`grid-${item.id}`}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              mb={5}
              rounded='xl'
              overflow='hidden'
              shadow={1}
              bg='white'>
              <Image
                source={item.image}
                alt={item.name}
                height={CARD_HEIGHT * 0.55}
                width='100%'
                resizeMode='cover'
              />
              <VStack p={3}>
                <Text bold fontSize='sm' numberOfLines={1}>
                  {item.name}
                </Text>
                <HStack mt={1} alignItems='center' space={1}>
                  <Icon as={Ionicons} name='star' size='xs' color='amber.400' />
                  <Text fontSize='xs' color='coolGray.600'>
                    ⭐ {item.rating} • {item.time}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}
