import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  Center,
  Divider,
  FlatList,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Spacer,
  Text,
  VStack,
} from "native-base";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { cart, addToCart, removeFromCart, clearCart, getTotal } = useCart();

  const total = useMemo(() => {
    const t = getTotal();
    return Number.isInteger(t) ? `${t}` : t.toFixed(2);
  }, [cart, getTotal]);

  if (!cart || cart.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Center flex={1} px={6} bg='white'>
          <Box
            w='60'
            h='60'
            borderRadius='30'
            bg={{
              linearGradient: {
                colors: ["cyan.400", "blue.500"],
                start: [0, 0],
                end: [1, 1],
              },
            }}
            alignItems='center'
            justifyContent='center'
            mb={6}
            shadow={3}>
            <Icon as={Ionicons} name='cart-outline' color='white' size='2xl' />
          </Box>

          <Text fontSize='xl' bold mb={2}>
            Your cart is empty
          </Text>
          <Text color='muted.500' textAlign='center' mb={6}>
            Add some items to start your order. Great deals await!
          </Text>

          <Button colorScheme='cyan' startIcon={<Icon as={Ionicons} name='storefront-outline' />}>
            Shop now
          </Button>
        </Center>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg='gray.50'>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          ItemSeparatorComponent={() => <Divider my={3} />}
          renderItem={({ item }) => (
            <Pressable>
              {({ isPressed }) => (
                <Box
                  bg='white'
                  borderRadius='lg'
                  p={3}
                  shadow={isPressed ? 0 : 2}
                  opacity={isPressed ? 0.95 : 1}
                  flexDirection='row'
                  alignItems='center'>
                  {/* Use Icon instead of Image */}
                  <Box
                    w={16}
                    h={16}
                    borderRadius='md'
                    bg='cyan.100'
                    alignItems='center'
                    justifyContent='center'
                    mr={3}>
                    <Icon as={Ionicons} name='fast-food-outline' size='lg' color='cyan.600' />
                  </Box>

                  <VStack flex={1} space={1}>
                    <HStack alignItems='flex-start'>
                      <VStack flex={1}>
                        <Text bold fontSize='md' numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.description && (
                          <Text color='muted.500' fontSize='xs' numberOfLines={2}>
                            {item.description}
                          </Text>
                        )}
                        <HStack alignItems='center' mt={2}>
                          <Text bold fontSize='sm' color='emerald.700'>
                            ₹{item.price}
                          </Text>
                          <Spacer />
                          <Text fontSize='xs' color='muted.500'>
                            Subtotal: ₹{(item.price * item.qty).toFixed(2)}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    <HStack mt={3} space={2} alignItems='center'>
                      <IconButton
                        icon={<Icon as={Ionicons} name='remove-outline' />}
                        borderRadius='full'
                        size='sm'
                        variant='ghost'
                        _icon={{ color: "muted.700", size: "md" }}
                        onPress={() =>
                          item.qty > 1
                            ? addToCart({ ...item, qty: -1 }) // reduce qty
                            : removeFromCart(item.id)
                        }
                        accessibilityLabel='Decrease quantity'
                      />
                      <Box
                        px={3}
                        py={1}
                        borderRadius='full'
                        bg='muted.100'
                        minW='10'
                        alignItems='center'>
                        <Text bold>{item.qty}</Text>
                      </Box>
                      <IconButton
                        icon={<Icon as={Ionicons} name='add-outline' />}
                        borderRadius='full'
                        size='sm'
                        variant='ghost'
                        _icon={{ color: "muted.700", size: "md" }}
                        onPress={() => addToCart(item)}
                        accessibilityLabel='Increase quantity'
                      />

                      <Spacer />
                      <IconButton
                        icon={<Icon as={Ionicons} name='trash-outline' />}
                        borderRadius='full'
                        size='sm'
                        variant='ghost'
                        _icon={{ color: "red.500", size: "md" }}
                        onPress={() => removeFromCart(item.id)}
                        accessibilityLabel='Remove item'
                      />
                    </HStack>
                  </VStack>
                </Box>
              )}
            </Pressable>
          )}
        />

        {/* Bottom bar */}
        <Box
          position='absolute'
          left={0}
          right={0}
          bottom={0}
          px={4}
          py={4}
          bg={{
            linearGradient: {
              colors: ["transparent", "white"],
              start: [0, 0],
              end: [0, 1],
            },
          }}>
          <Box
            bg='white'
            p={4}
            borderRadius='xl'
            shadow={3}
            borderColor='muted.200'
            borderWidth={1}>
            <HStack alignItems='center' justifyContent='space-between' mb={3}>
              <VStack>
                <Text fontSize='sm' color='muted.500'>
                  Total
                </Text>
                <Text fontSize='xl' bold color='emerald.700'>
                  ₹{total}
                </Text>
              </VStack>

              <HStack space={2}>
                <Button
                  variant='outline'
                  colorScheme='red'
                  onPress={clearCart}
                  leftIcon={<Icon as={Ionicons} name='trash-outline' />}>
                  Clear
                </Button>

                <Button colorScheme='cyan' leftIcon={<Icon as={Ionicons} name='card-outline' />}>
                  Checkout
                </Button>
              </HStack>
            </HStack>

            <Divider />

            <Text mt={3} fontSize='xs' color='muted.500'>
              By checking out you agree to our terms. Free delivery on orders above ₹120.
            </Text>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
