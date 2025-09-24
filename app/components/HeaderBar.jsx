import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HStack, Icon, IconButton, Text } from "native-base";
import { SafeAreaView } from "react-native";

export default function HeaderBar({ title, showCart }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <HStack justifyContent='space-between' alignItems='center' p={4} bg='red.500'>
        {!showCart && (
          <IconButton
            icon={<Icon as={Ionicons} name='arrow-back' size='sm' />}
            onPress={() => navigation.goBack()}
          />
        )}
        <Text fontSize='xl' bold flex={1}>
          {title}
        </Text>
        {showCart && (
          <IconButton
            icon={<Icon as={Ionicons} name='cart-outline' size='sm' />}
            onPress={() => navigation.navigate("Cart")}
          />
        )}
      </HStack>
    </SafeAreaView>
  );
}
