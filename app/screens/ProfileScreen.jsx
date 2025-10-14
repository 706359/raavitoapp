import { Ionicons } from "@expo/vector-icons";
import { Box, Button, HStack, Icon, Image, Pressable, ScrollView, Text, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user = {}, logout = () => {} } = useAuth() || {};
  const { width } = useWindowDimensions();
  const isPremium = !!user?.isPremium;

  const profile = {
    name: user?.name || "Your Name",
    email: user?.email || "",
    mobile: user?.mobile || "+91 0000000000",
  };

  const menuItems = [
    { icon: "restaurant-outline", label: "Meal Subscription", route: "Subscription" },
    { icon: "receipt-outline", label: "Past Orders", route: "Orders" },
    { icon: "heart-outline", label: "Favorites", route: "Favorites" },
    { icon: "fast-food-outline", label: "Meal Plans", route: "MealPlans" },
    { icon: "ticket-outline", label: "Coupons & Offers", route: "Coupons" },
    { icon: "location-outline", label: "Saved Addresses", route: "ManageAddresses" },
    { icon: "wallet-outline", label: "Wallet", route: "Wallet" },
    { icon: "help-circle-outline", label: "Help & Support", route: "Help" },
    { icon: "alert-circle-outline", label: "FAQ's", route: "FAQ" },
    { icon: "star-outline", label: "Chef's Specials", route: "ChefsSpecials", premium: true },
    { icon: "time-outline", label: "Early Menu Access", route: "EarlyAccess", premium: true },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <Box flex={1} bg='white'>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Box
            bg='gray.50'
            p={5}
            rounded='2xl'
            shadow={2}
            mb={6}
            flexDir='row'
            alignItems='center'
            width='100%'>
            <Image
              source={require("../assets/logo.png")}
              alt='Avatar'
              size={width < 380 ? "60px" : "70px"}
              borderRadius={999}
              mr={4}
            />
            <VStack flex={1} space={1}>
              <HStack alignItems='center' space={2} flexWrap='wrap'>
                <Text fontSize={width < 380 ? "md" : "lg"} bold color='gray.800'>
                  {profile.name}
                </Text>
                {isPremium && (
                  <Box bg='orange.500' px={2} py={0.5} rounded='lg'>
                    <Text fontSize='xs' bold color='white'>
                      FOODIE+
                    </Text>
                  </Box>
                )}
              </HStack>
              {/* <Text fontSize='sm' color='gray.500' numberOfLines={1}>
                {profile.email}
              </Text> */}
              <Text fontSize='sm' color='gray.500'>
                {profile.mobile}
              </Text>
            </VStack>
            <Pressable onPress={() => navigation.navigate("EditProfile")}>
              <Text color='orange.500' bold fontSize='sm'>
                Edit
              </Text>
            </Pressable>
          </Box>

          {/* Menu */}
          <VStack space={3}>
            {menuItems.map((item, idx) => {
              const locked = item.premium && !isPremium;
              return (
                <Pressable
                  key={idx}
                  onPress={() =>
                    locked ? navigation.navigate("Subscription") : navigation.navigate(item.route)
                  }>
                  {({ isPressed }) => (
                    <Box
                      px={4}
                      py={3}
                      bg={isPressed ? "gray.200" : "gray.100"}
                      rounded='xl'
                      shadow={1}
                      opacity={locked ? 0.6 : 1}
                      width='100%'>
                      <HStack justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                        <HStack space={3} alignItems='center'>
                          <Icon as={Ionicons} name={item.icon} size={5} color='gray.600' />
                          <Text fontSize={width < 380 ? "sm" : "md"} color='gray.700'>
                            {item.label}
                          </Text>
                          {item.premium && (
                            <Box ml={2} px={2} py={0.5} bg='amber.100' rounded='sm'>
                              <Text fontSize='xs' color='amber.800'>
                                Premium
                              </Text>
                            </Box>
                          )}
                        </HStack>
                        {locked ? (
                          <Icon as={Ionicons} name='lock-closed' size={4} color='gray.400' />
                        ) : (
                          <Icon as={Ionicons} name='chevron-forward' size={5} color='gray.400' />
                        )}
                      </HStack>
                    </Box>
                  )}
                </Pressable>
              );
            })}
          </VStack>

          {/* Logout */}
          <Box mt={10} alignItems='center' width='100%'>
            <Button onPress={logout} colorScheme={isPremium ? "orange" : "red"} width='60%'>
              Logout
            </Button>
            <Text mt={4} fontSize='xs' color='gray.400'>
              App version 1.02
            </Text>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
