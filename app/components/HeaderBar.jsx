// components/HeaderBar.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Box, HStack, Icon, IconButton, Pressable, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCart } from "../context/CartContext";

export default function HeaderBar({ showBack = false, showCart = true }) {
  const navigation = useNavigation();
  const { cart } = useCart(); // get cart items
  const [location, setLocation] = useState("Fetching...");

  // total items in cart
  const totalQty = cart.reduce((s, it) => s + (it.qty || 0), 0);

  // get location once
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
    <SafeAreaView edges={["left", "right"]}>
      <HStack
        justifyContent='space-between'
        alignItems='center'
        p={4}
        bg='white'
        borderBottomWidth={1}
        borderColor='gray.200'>
        {/* Left Side: Back OR Location */}
        {showBack ? (
          <IconButton
            icon={<Icon as={Ionicons} name='arrow-back' size='md' />}
            onPress={() => navigation.goBack()}
            _icon={{ color: "brand.dark" }}
          />
        ) : (
          <VStack>
            <Text fontSize='xs' color='coolGray.500'>
              Delivering to
            </Text>
            <Text fontSize='md' bold color='brand.green'>
              {location}
            </Text>
          </VStack>
        )}

        {/* Right Side Icons */}
        <HStack alignItems='center' space={3}>
          {showCart && (
            <Box>
              {/* <Pressable onPress={() => navigation.navigate('Cart')}>
                <Icon as={Ionicons} name='cart-outline' size='lg' color='brand.dark' />
              </Pressable> */}
              {totalQty > 0 && (
                <Box
                  position='absolute'
                  top={-3}
                  right={-3}
                  bg='brand.orange'
                  rounded='full'
                  px={2}
                  py={0.5}>
                  <Text fontSize='xs' color='white' bold>
                    {totalQty}
                  </Text>
                </Box>
              )}
            </Box>
          )}
          {/* <Pressable onPress={() => navigation.navigate('UserProfile')}>
            <Icon as={Ionicons} name='person-circle-outline' size='lg' color='brand.orange' />
          </Pressable> */}
          <Pressable onPress={() => navigation.navigate("ExtraStack", { screen: "UserProfile" })}>
            <Icon as={Ionicons} name='person-circle-outline' size='lg' color='brand.orange' />
          </Pressable>
        </HStack>
      </HStack>
    </SafeAreaView>
  );
}
