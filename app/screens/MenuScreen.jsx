import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, FlatList, HStack, Icon, Image, Pressable, Text, VStack } from "native-base";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native"; // ✅ use TextInput from react-native
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBar from "../components/HeaderBar";
import { kitchens } from "../data/menu";

export default function MenuScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter kitchens by name or description
  const filteredKitchens = kitchens.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.desc && k.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <Box flex={1}>
        {/* Header */}
        <HeaderBar title='Menu' showCart />

        {/* Search Bar */}
        <Box px={4} mt={2}>
          <View style={styles.searchContainer}>
            <Ionicons name='search' size={20} color='#888' style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder='Search for Kitchen'
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor='#888'
            />
          </View>
        </Box>

        {/* Section Title */}
        <Text mt={4} mb={2} px={4} fontSize='md' bold fontFamily='Poppins'>
          Meal Nearby
        </Text>

        {/* Kitchens List */}
        <FlatList
          data={filteredKitchens}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate("KitchenScreen", { kitchen: item })}>
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
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text textAlign='center' mt={8} color='coolGray.400'>
              No kitchens found
            </Text>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3", // ✅ Background color
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: "OpenSans",
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
  },
});
