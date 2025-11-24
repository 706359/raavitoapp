import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, FlatList, HStack, Image, Pressable, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import HeaderBar from '../components/HeaderBar';

export default function Favourites() {
  const navigation = useNavigation();
  const { favorites, loadFavorites, loading } = useFavorites();

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleKitchenPress = (kitchen) => {
    navigation.navigate('KitchenScreen', { kitchen });
  };

  if (loading && favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderBar title='Favourites' showBack />
        <Box flex={1} justifyContent='center' alignItems='center'>
          <ActivityIndicator size='large' color='#b94a01ff' />
        </Box>
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderBar title='Favourites' showBack />
        <Box flex={1} justifyContent='center' alignItems='center' px={6}>
          <Ionicons name='heart-outline' size={80} color='#ccc' />
          <Text fontSize='xl' bold mt={4} color='gray.500'>
            No Favorites Yet
          </Text>
          <Text fontSize='sm' color='gray.400' textAlign='center' mt={2}>
            Start adding kitchens to your favorites to see them here
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title='Favourites' showBack />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id || item.id || item.kitchen?._id || item.kitchen?.id}
        renderItem={({ item }) => {
          const kitchen = item.kitchen || item;
          return (
            <Pressable onPress={() => handleKitchenPress(kitchen)}>
              <Box
                bg='white'
                mx={4}
                my={2}
                p={4}
                borderRadius='xl'
                shadow={2}
                style={styles.card}>
                <HStack space={4}>
                  <Image
                    source={
                      kitchen.image
                        ? { uri: kitchen.image }
                        : require('../assets/food.jpeg')
                    }
                    alt={kitchen.name}
                    style={styles.image}
                  />
                  <VStack flex={1} justifyContent='space-between'>
                    <VStack>
                      <Text fontSize='lg' bold>
                        {kitchen.name}
                      </Text>
                      <Text fontSize='sm' color='gray.500' numberOfLines={1}>
                        {kitchen.description || kitchen.address || ''}
                      </Text>
                    </VStack>
                    <HStack space={2} mt={2}>
                      <Ionicons name='star' size={16} color='#FFD700' />
                      <Text fontSize='sm' color='gray.600'>
                        {kitchen.rating || '4.0'}
                      </Text>
                      <Text fontSize='sm' color='gray.400'>
                        •
                      </Text>
                      <Text fontSize='sm' color='gray.600'>
                        {kitchen.deliveryTime || '30 mins'}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadFavorites} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    paddingVertical: 8,
  },
  card: {
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
});
