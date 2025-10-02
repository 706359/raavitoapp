import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Icon, IconButton, Pressable, Text, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "react-native";
import { useAddress } from "../context/AddressContext";
import { useCart } from "../context/CartContext";

export default function HeaderBar({ showBack = false, showCart = true }) {
  const navigation = useNavigation();
  const { cart } = useCart();
  const { selectedAddress } = useAddress();

  const totalQty = cart.reduce((s, it) => s + (it.qty || 0), 0);

  return (
    <SafeAreaView edges={["left", "right"]}>
      <HStack
        justifyContent='space-between'
        alignItems='flex-start' // align top
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
          <Pressable
            onPress={() => navigation.navigate("ProfileTab", { screen: "ManageAddresses" })}>
            <VStack>
              <View style={{ flexDirection: "row", alignItems: "center", gap: "5" }}>
                <Text fontSize='xs' color='coolGray.500'>
                  Delivering to
                </Text>
                <Icon as={Ionicons} name='chevron-down' size='sm' color='brand.green' />
              </View>
              <Text
                fontSize='md'
                bold
                color='brand.green'
                maxW='90%'
                numberOfLines={1}
                ellipsizeMode='tail'>
                {selectedAddress || "Fetching..."}
              </Text>
            </VStack>
          </Pressable>
        )}

        <HStack alignItems='flex-start' space={3}>
          {showCart && (
            <Box>
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
          <Pressable onPress={() => navigation.navigate("ExtraStack", { screen: "UserProfile" })}>
            <Icon as={Ionicons} name='person-circle-outline' size='lg' color='brand.orange' />
          </Pressable>
        </HStack>
      </HStack>
    </SafeAreaView>
  );
}
