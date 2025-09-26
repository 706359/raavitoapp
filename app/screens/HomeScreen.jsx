// screens/HomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Box, FlatList, HStack, Icon, Image, Input, ScrollView, Text, VStack } from "native-base";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderBar from "../components/HeaderBar";
import { menuCategories } from "../data/menu";

const { width } = Dimensions.get("window");

// 🔸 Banners
const banners = [
  {
    id: "1",
    title: "Subscription based Packages !!!",
    subtitle: "Up to 60% OFF | 6 months & more",
    bg: "brand.orange",
  },
  {
    id: "2",
    title: "Today’s Special",
    subtitle: "Get free dessert with every thali",
    bg: "brand.green",
  },
  {
    id: "3",
    title: "Weekend Offer",
    subtitle: "Flat 20% OFF on family packs",
    bg: "yellow.400",
  },
];

// 🔸 Categories
const categories = [
  { id: "1", name: "Dosa Thali", image: require("../assets/Dosa.jpg") },
  { id: "2", name: "Gujarati Thali", image: require("../assets/Gujarati.jpeg") },
  { id: "3", name: "Rajasthani Thali", image: require("../assets/Rajasthani.jpg") },
  { id: "4", name: "Punjabi Thali", image: require("../assets/Punjabi.webp") },
];

export default function HomeScreen() {
  const [location, setLocation] = useState("Fetching...");
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  // 🔸 Auto-scroll banners
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: currentIndex * width, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔸 Location fetch
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg='brand.light'>
        {/* 🔹 Header */}
        <HeaderBar title='Home' showCart location={location} />

        {/* 🔹 Main Content */}
        <FlatList
          data={menuCategories.slice(0, 6)} // Kitchens grid
          keyExtractor={(item, idx) => `kitchen-${idx}`}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <VStack space={6} mb={4}>
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

              {/* Banner Carousel */}
              <Box>
                <Animated.ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                  })}
                  scrollEventThrottle={16}>
                  {banners.map((banner) => (
                    <Box
                      key={`banner-${banner.id}`}
                      width={width * 0.85}
                      mx={3}
                      p={5}
                      rounded='lg'
                      bg={banner.bg}>
                      <Text bold fontSize='md' color='white' fontFamily='Poppins'>
                        {banner.title}
                      </Text>
                      <Text fontSize='xs' color='brand.light' mt={1} fontFamily='OpenSans'>
                        {banner.subtitle}
                      </Text>
                    </Box>
                  ))}
                </Animated.ScrollView>
              </Box>

              {/* Categories */}
              <Box px={4}>
                <Text bold fontSize='md' mb={3} color='brand.dark' fontFamily='Poppins'>
                  What&apos;s on your mind?
                </Text>
                <HStack justifyContent='space-between'>
                  {categories.map((cat) => (
                    <VStack key={`cat-${cat.id}`} alignItems='center' flex={1}>
                      <Image
                        source={cat.image}
                        alt={cat.name}
                        w={16}
                        h={16}
                        rounded='full'
                        mb={2}
                      />
                      <Text fontSize='xs' fontFamily='OpenSans' textAlign='center'>
                        {cat.name}
                      </Text>
                    </VStack>
                  ))}
                </HStack>
              </Box>

              {/* Offers */}
              <Box px={4}>
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

              {/* Top Kitchens */}
              <Box px={4}>
                <Text bold fontSize='md' mb={3}>
                  Top kitchens near you
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {menuCategories.slice(0, 5).map((cat, idx) => (
                    <Box
                      key={`top-${idx}`}
                      w={56}
                      mr={4}
                      rounded='lg'
                      overflow='hidden'
                      shadow={2}
                      bg='white'>
                      <Image source={cat.items[0].image} alt={cat.title} h={32} w='100%' />
                      <Box
                        position='absolute'
                        top={2}
                        left={2}
                        bg='red.600'
                        px={2}
                        py={1}
                        rounded='sm'>
                        <Text fontSize='xs' color='white' bold>
                          20% OFF upto ₹100
                        </Text>
                      </Box>
                      <VStack p={3}>
                        <Text bold fontSize='sm' numberOfLines={1}>
                          {cat.title} Kitchen
                        </Text>
                        <HStack mt={1} alignItems='center' space={1}>
                          <Icon as={Ionicons} name='star' size='xs' color='amber.400' />
                          <Text fontSize='xs' color='coolGray.600'>
                            4.{idx + 1} • {20 + idx * 5} mins
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </ScrollView>
              </Box>
            </VStack>
          }
          renderItem={({ item, index }) => (
            <Box
              key={`grid-${index}`}
              w='48%'
              mb={4}
              rounded='lg'
              overflow='hidden'
              shadow={1}
              bg='white'>
              <Image source={item.items[0].image} alt={item.title} h={32} w='100%' />
              <VStack p={3}>
                <Text bold fontSize='sm' numberOfLines={1}>
                  {item.title} Kitchen
                </Text>
                <HStack mt={1} alignItems='center' space={1}>
                  <Icon as={Ionicons} name='star' size='xs' color='amber.400' />
                  <Text fontSize='xs' color='coolGray.600'>
                    4.{index + 1} • {15 + index * 5} mins
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
