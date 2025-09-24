import FoodCard from "@/components/FoodCard";
import { Ionicons } from "@expo/vector-icons";
import { Divider, Heading, HStack, Icon, ScrollView, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

const menuCategories = [
  {
    title: "Full Tiffin",
    icon: "fast-food-outline",
    items: [{ id: 1, name: "Full Tiffin (Standard)", price: 120 }],
  },
  {
    title: "Mix Match Tiffin",
    icon: "restaurant-outline",
    items: [
      { id: 2, name: "1 Sabzi + 4 Rotis + Chawal", price: 100 },
      { id: 3, name: "2 Sabzis + 4 Rotis", price: 120 },
      { id: 4, name: "1 Sabzi + 6 Rotis", price: 100 },
      { id: 5, name: "1 Sabzi + 4 Rotis", price: 80 },
      { id: 6, name: "1 Sabzi + 2 Bowls Chawal", price: 100 },
      { id: 7, name: "Only 1 Sabzi", price: 40 },
    ],
  },
  {
    title: "Khichdi Tiffin",
    icon: "leaf-outline",
    items: [
      { id: 8, name: "Moong Dal Khichdi", price: 120 },
      { id: 9, name: "Vegetable Khichdi", price: 130 },
      { id: 10, name: "Masala Khichdi", price: 120 },
      { id: 11, name: "Brown Rice Khichdi", price: 150 },
      { id: 12, name: "Daliya (Broken Wheat) Khichdi", price: 140 },
      { id: 13, name: "Sabudana Khichdi (Fasting)", price: 120 },
    ],
  },
  {
    title: "Rotis Parathas",
    icon: "pizza-outline",
    items: [
      { id: 14, name: "Plain Roti", price: 10 },
      { id: 15, name: "Roti with Ghee", price: 12 },
      { id: 16, name: "Plain Paratha", price: 20 },
      { id: 17, name: "Stuffed Paratha", price: 35 },
      { id: 18, name: "3 Stuffed Parathas", price: 100 },
    ],
  },
  {
    title: "Breakfast Combos",
    icon: "sunny-outline",
    items: [
      { id: 19, name: "Stuffed Paratha Combo", price: 120 },
      { id: 20, name: "Paneer Paratha Combo", price: 130 },
      { id: 21, name: "Desi Ghee Paratha Combo", price: 160 },
    ],
  },
  {
    title: "Lunch Combos",
    icon: "cafe-outline",
    items: [
      { id: 22, name: "Full Tiffin Meal", price: 140 },
      { id: 23, name: "Stuffed Parathas with Curd", price: 110 },
      { id: 24, name: "Aloo Matar with Chawal", price: 90 },
      { id: 25, name: "Aloo Matar with Puri + Curd", price: 120 },
      { id: 26, name: "Chhole & Lobhiya Combo", price: 100 },
      { id: 27, name: "Rajma & Kala Chana Combo", price: 100 },
    ],
  },
];

export default function MenuScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView flex={1} bg='white' contentContainerStyle={{ padding: 16 }}>
        {menuCategories.map((category) => (
          <VStack key={category.title} space={4} mb={8}>
            <HStack alignItems='center' space={2}>
              <Icon as={Ionicons} name={category.icon} size='md' color='cyan.600' />
              <Heading size='md' color='coolGray.800'>
                {category.title}
              </Heading>
            </HStack>

            <Divider />

            <VStack space={3}>
              {category.items.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </VStack>
          </VStack>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
