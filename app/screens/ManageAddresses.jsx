import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  Pressable,
  Radio,
  Text,
  TextArea,
  useTheme,
  VStack,
} from 'native-base';

import { useAddress } from '../context/AddressContext';

export default function ManageAddresses() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { setSelectedAddress } = useAddress();
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [currentLocation, setCurrentLocation] = useState('Fetching location...');
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ type: 'Home', address: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [saved, savedSelectedId] = await Promise.all([
          AsyncStorage.getItem('addresses'),
          AsyncStorage.getItem('selectedAddressId'),
        ]);

        if (saved) {
          const parsed = JSON.parse(saved);
          setAddresses(parsed);
        } else {
          const seed = [
            {
              id: '1',
              type: 'Office',
              address: '412, Apple Square, Vrajbhumi Society, Mota Varachha, Surat, Gujarat 394101',
            },
            {
              id: '2',
              type: 'Home',
              address: '123, Ashwini Kumar Rd, Khand Bazar, Varachha, Surat, Gujarat 395008',
            },
          ];
          setAddresses(seed);
          await AsyncStorage.setItem('addresses', JSON.stringify(seed));
        }

        if (savedSelectedId) setSelectedId(savedSelectedId);
      } catch (err) {
        console.log('Error loading addresses', err);
      }
    };
    loadData();
  }, []);

  const saveAddresses = async (data) => {
    try {
      await AsyncStorage.setItem('addresses', JSON.stringify(data));
    } catch (err) {
      console.log('Error saving addresses', err);
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setCurrentLocation('Detecting location...');
  //       setTimeout(() => setCurrentLocation('Surat, Gujarat, India'), 700);
  //     } catch (err) {
  //       console.log(err);
  //       setCurrentLocation('Error fetching location');
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      try {
        setCurrentLocation('Detecting location...');

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCurrentLocation('Permission denied. Enable location in settings.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location.coords;

        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (geocode.length > 0) {
          const { name, street, city, region, postalCode, country } = geocode[0];
          const formatted =
            `${name || street || ''}, ${city || ''}, ${region || ''}, ${postalCode || ''}, ${country || ''}`
              .replace(/,\s*,/g, ',')
              .replace(/(^,|,$)/g, '')
              .trim();

          setCurrentLocation(formatted || 'Location found but unreadable');
        } else {
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (err) {
        console.log('Error fetching location:', err);
        setCurrentLocation('Error fetching location');
      }
    })();
  }, []);

  const persistSelectedId = async (id) => {
    try {
      setSelectedId(id);
      await AsyncStorage.setItem('selectedAddressId', id);
    } catch (e) {
      console.log('Error saving selected address id', e);
    }
  };

  const handleSelect = async (addrObj) => {
    try {
      setSelectedAddress(addrObj); // pass full object, not just string
      await persistSelectedId(addrObj.id);
      navigation.goBack();
    } catch (e) {
      console.log('Error on select', e);
    }
  };

  const openEditModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({ type: item.type, address: item.address });
    } else {
      setEditItem(null);
      setForm({ type: 'Home', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const trimmed = form.address.trim();
    if (trimmed.length < 8) return;

    let updated;
    if (editItem) {
      updated = addresses.map((a) =>
        a.id === editItem.id ? { ...a, type: form.type, address: trimmed } : a,
      );
    } else {
      const newItem = {
        id: Date.now().toString(),
        type: form.type,
        address: trimmed,
      };
      updated = [newItem, ...addresses];
    }
    setAddresses(updated);
    await saveAddresses(updated);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    await saveAddresses(updated);
    if (selectedId === id) {
      try {
        setSelectedAddress(null);
        setSelectedId(null);
        await AsyncStorage.removeItem('selectedAddressId');
      } catch (e) {
        console.log('Error clearing selection', e);
      }
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home':
        return {
          name: 'home',
          color: '#10b981',
          bg: '#ecfdf5',
          borderColor: '#a7f3d0',
        };
      case 'Office':
        return {
          name: 'business',
          color: '#f59e0b',
          bg: '#fffbeb',
          borderColor: '#fde68a',
        };
      case 'Other':
        return {
          name: 'place',
          color: '#8b5cf6',
          bg: '#f5f3ff',
          borderColor: '#ddd6fe',
        };
      default:
        return {
          name: 'location-on',
          color: '#6366f1',
          bg: '#eef2ff',
          borderColor: '#c7d2fe',
        };
    }
  };

  const renderItem = ({ item }) => {
    const iconData = getAddressIcon(item.type);
    const isActive = selectedId && selectedId === item.id;

    return (
      <Pressable onPress={() => handleSelect(item)} style={styles.cardPressable}>
        <Box style={styles.card}>
          <HStack style={styles.cardHeader}>
            <HStack style={styles.cardHeaderLeft}>
              <Box
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: iconData.bg,
                    borderColor: iconData.borderColor,
                  },
                ]}>
                <Icon as={MaterialIcons} name={iconData.name} color={iconData.color} size={5} />
              </Box>

              <VStack>
                <Text style={styles.cardTitle}>{item.type}</Text>
                <Text style={styles.cardSubtitle}>Saved Address</Text>
              </VStack>
            </HStack>

            {isActive ? (
              <Badge style={styles.activeBadge}>
                <HStack style={styles.badgeContent}>
                  <Box style={styles.badgeDot} />
                  <Text style={styles.badgeText}>Active</Text>
                </HStack>
              </Badge>
            ) : null}
          </HStack>

          <Box style={[styles.addressBox, { borderLeftColor: iconData.color }]}>
            <Text style={styles.addressText}>{item.address}</Text>
          </Box>

          <HStack style={styles.actionsRow}>
            <Pressable style={styles.actionPressable} onPress={() => openEditModal(item)}>
              <Box style={[styles.actionButton, styles.editButton]}>
                <Icon as={MaterialIcons} name='edit' color='#f59e0b' size='sm' />
                <Text style={styles.editLabel}>Edit</Text>
              </Box>
            </Pressable>

            <Pressable style={styles.actionPressable} onPress={() => handleDelete(item.id)}>
              <Box style={[styles.actionButton, styles.deleteButton]}>
                <Icon as={MaterialIcons} name='delete-outline' color='#ef4444' size='sm' />
                <Text style={styles.deleteLabel}>Delete</Text>
              </Box>
            </Pressable>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  const currentObj = {
    id: 'current',
    type: 'Current',
    address: currentLocation,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box
        style={styles.headerBox}
        bg={{
          linearGradient: {
            colors: ['#f97316', '#ea580c', '#c2410c'],
            start: [0, 0],
            end: [1, 1],
          },
        }}>
        <HStack style={styles.headerInner}>
          <HStack style={styles.headerLeft}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.headerBack}
              accessibilityRole='button'
              accessibilityLabel='Go back'>
              <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
            </Pressable>

            <VStack>
              <Text style={styles.headerTitle}>My Addresses</Text>
              <Text style={styles.headerSubtitle}>Manage delivery locations</Text>
            </VStack>
          </HStack>

          <Box style={styles.headerIconBox}>
            <Icon as={MaterialIcons} name='location-on' color='white' size={6} />
          </Box>
        </HStack>
      </Box>

      <View style={styles.currentLocationWrapper}>
        <Pressable onPress={() => handleSelect(currentObj)} style={styles.currentPressable}>
          <Box style={styles.currentCard}>
            <Box style={styles.currentCardGradient}>
              <HStack style={styles.currentCardInner}>
                <Box style={styles.currentIconBg}>
                  <Icon as={MaterialIcons} name='my-location' color='#ea580c' size={6} />
                </Box>

                <VStack style={styles.currentContentFlex}>
                  <HStack style={styles.currentTitleRow}>
                    <Text style={styles.currentTitle}>Current Location</Text>
                    <Badge style={styles.liveBadge}>
                      <HStack style={styles.liveBadgeContent}>
                        <Box style={styles.livePulse} />
                        <Text style={styles.liveText}>LIVE</Text>
                      </HStack>
                    </Badge>
                  </HStack>

                  <Text style={styles.currentSubtitle} numberOfLines={2}>
                    {currentLocation}
                  </Text>
                </VStack>

                <Icon as={MaterialIcons} name='chevron-right' color='#9ca3af' size={6} />
              </HStack>
            </Box>
          </Box>
        </Pressable>
      </View>

      <Box style={styles.contentBox}>
        <HStack style={styles.sectionHeader}>
          <VStack>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <Text style={styles.sectionSubtitle}>
              {addresses.length} location{addresses.length !== 1 ? 's' : ''} saved
            </Text>
          </VStack>
        </HStack>

        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.flatListContent,
            { paddingBottom: 120 + insets.bottom + 56 },
          ]}
          ListEmptyComponent={() => (
            <Box style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280' }}>No saved addresses yet</Text>
            </Box>
          )}
        />
      </Box>

      <Box
        pointerEvents='none'
        style={styles.bottomFade}
        bg={{
          linearGradient: {
            colors: ['rgba(249, 250, 251, 0)', 'rgba(249, 250, 251, 1)'],
            start: [0, 0],
            end: [0, 1],
          },
        }}
      />

      <View style={[styles.fabWrapper, { bottom: 16 + insets.bottom, zIndex: 50 }]}>
        <Pressable onPress={() => openEditModal()} style={styles.fabPressable}>
          <Box
            style={styles.fab}
            bg={{
              linearGradient: {
                colors: ['#10b981', '#059669', '#047857'],
                start: [0, 0],
                end: [1, 0],
              },
            }}>
            <Icon as={MaterialIcons} name='add-circle-outline' color='white' size={5} />
            <Text style={styles.fabLabel}>Add New Address</Text>
          </Box>
        </Pressable>
      </View>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size='lg'>
        <Modal.Content style={styles.modalContent}>
          <Modal.CloseButton />

          <Modal.Header style={styles.modalHeader}>
            <HStack style={styles.modalHeaderContent}>
              <Box
                style={styles.modalIconBg}
                bg={{
                  linearGradient: {
                    colors: ['#f59e0b', '#ea580c'],
                    start: [0, 0],
                    end: [1, 1],
                  },
                }}>
                <Icon
                  as={MaterialIcons}
                  name={editItem ? 'edit-location' : 'add-location'}
                  color='#10b981'
                  size={7}
                />
              </Box>
              <VStack>
                <Text style={styles.modalTitle}>
                  {editItem ? 'Edit Address' : 'Add New Address'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editItem ? 'Update your delivery location' : 'Add a new delivery location'}
                </Text>
              </VStack>
            </HStack>
          </Modal.Header>

          <Modal.Body style={styles.modalBody}>
            <VStack style={styles.modalVStack}>
              <VStack>
                <Text style={styles.fieldLabel}>Address Type</Text>
                <Radio.Group
                  name='addressType'
                  value={form.type}
                  onChange={(val) => setForm({ ...form, type: val })}>
                  <HStack style={styles.radioGroup}>
                    <Pressable
                      style={[styles.radioCard, form.type === 'Home' && styles.radioCardActive]}
                      onPress={() => setForm({ ...form, type: 'Home' })}>
                      <Radio value='Home' colorScheme='success' />
                      <Text style={styles.radioLabel}>Home</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.radioCard, form.type === 'Office' && styles.radioCardActive]}
                      onPress={() => setForm({ ...form, type: 'Office' })}>
                      <Radio value='Office' colorScheme='warning' />
                      <Text style={styles.radioLabel}>Office</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.radioCard, form.type === 'Other' && styles.radioCardActive]}
                      onPress={() => setForm({ ...form, type: 'Other' })}>
                      <Radio value='Other' colorScheme='purple' />
                      <Text style={styles.radioLabel}>Other</Text>
                    </Pressable>
                  </HStack>
                </Radio.Group>
              </VStack>

              <VStack>
                <Text style={styles.fieldLabel}>Complete Address</Text>
                <TextArea
                  placeholder='Enter your full address with landmarks'
                  value={form.address}
                  onChangeText={(v) => setForm({ ...form, address: v })}
                  totalLines={4}
                  style={styles.input}
                  bg='#fafafa'
                  borderColor='#e5e7eb'
                  _focus={{
                    borderColor: '#f59e0b',
                    backgroundColor: 'white',
                    borderWidth: 2,
                  }}
                />
              </VStack>
            </VStack>
          </Modal.Body>

          <Modal.Footer style={styles.modalFooter}>
            <HStack style={styles.modalFooterButtons}>
              <Button
                onPress={() => setIsModalOpen(false)}
                style={styles.cancelButton}
                variant='outline'>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Button>

              <Button
                onPress={handleSave}
                style={styles.saveButton}
                bg={{
                  linearGradient: {
                    colors: ['#f59e0b', '#ea580c'],
                    start: [0, 0],
                    end: [1, 0],
                  },
                }}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#f9fafb',
    },
    headerBox: {
      marginBottom: 10,
      paddingTop: Platform.OS === 'ios' ? 12 : 16,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: '#FF7A00',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
    },
    headerInner: {
      color: '#fff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 14,
    },
    headerBack: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    headerTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '700',
      fontFamily: 'Poppins',
    },
    headerSubtitle: {
      color: '#fff',
      fontSize: 12,
      fontFamily: 'OpenSans',
      marginTop: 2,
    },
    headerIconBox: {
      padding: 10,
      borderRadius: 12,
      borderColor: '#fff',
      borderWidth: 1,
    },
    currentLocationWrapper: {
      paddingHorizontal: 20,
      marginBottom: 20,
      zIndex: 10,
    },
    currentPressable: {
      opacity: 1,
    },
    currentCard: {
      backgroundColor: '#fff',
      borderRadius: 18,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#f59e0b',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      borderWidth: 1,
      borderColor: '#faeeee',
    },
    currentCardGradient: {
      borderTopWidth: 3,
      borderTopColor: '#f59e0b',
    },
    currentCardInner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      gap: 14,
    },
    currentIconBg: {
      backgroundColor: '#fff7ed',
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#fed7aa',
    },
    currentContentFlex: {
      flex: 1,
    },
    currentTitleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
      marginBottom: 6,
    },
    currentTitle: {
      fontWeight: '700',
      fontSize: 15,
      fontFamily: 'Poppins',
      color: '#111827',
      letterSpacing: -0.2,
    },
    currentSubtitle: {
      fontSize: 13,
      fontFamily: 'OpenSans',
      color: '#6b7280',
      lineHeight: 19,
    },
    liveBadge: {
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    liveBadgeContent: {
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 3,
      backgroundColor: '#fef3c7',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fde68a',
    },
    livePulse: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#f59e0b',
    },
    liveText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#92400e',
      fontFamily: 'Poppins',
      letterSpacing: 0.5,
    },
    contentBox: {
      paddingHorizontal: 20,
      flex: 1,
    },
    sectionHeader: {
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },
    sectionTitle: {
      fontFamily: 'Poppins',
      fontWeight: '700',
      fontSize: 18,
      color: '#111827',
    },
    sectionSubtitle: {
      fontFamily: 'OpenSans',
      fontSize: 13,
      color: '#9ca3af',
      marginTop: 3,
    },
    flatListContent: {
      paddingBottom: 140,
    },
    cardPressable: {
      opacity: 1,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 18,
      padding: 18,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: '#f3f4f6',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    cardHeaderLeft: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
      flex: 1,
    },
    iconBox: {
      padding: 11,
      borderRadius: 13,
      borderWidth: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      fontFamily: 'Poppins',
      color: '#111827',
      letterSpacing: -0.2,
    },
    cardSubtitle: {
      fontSize: 11,
      fontFamily: 'OpenSans',
      color: '#9ca3af',
      marginTop: 2,
    },
    activeBadge: {
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    badgeContent: {
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: '#d1fae5',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#a7f3d0',
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#10b981',
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#065f46',
      fontFamily: 'Poppins',
      letterSpacing: 0.3,
    },
    addressBox: {
      backgroundColor: '#fafafa',
      padding: 14,
      borderRadius: 12,
      borderLeftWidth: 3,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: '#f3f4f6',
    },
    addressText: {
      fontFamily: 'OpenSans',
      color: '#4b5563',
      fontSize: 13,
      lineHeight: 20,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    actionPressable: {
      flex: 1,
    },
    actionButton: {
      backgroundColor: '#fafafa',
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderWidth: 1.5,
    },
    editButton: {
      borderColor: '#fed7aa',
      backgroundColor: '#fffbeb',
    },
    deleteButton: {
      borderColor: '#fecaca',
      backgroundColor: '#fef2f2',
    },
    editLabel: {
      fontFamily: 'Poppins',
      fontWeight: '600',
      fontSize: 13,
      color: '#f59e0b',
      letterSpacing: -0.1,
    },
    deleteLabel: {
      fontFamily: 'Poppins',
      fontWeight: '600',
      fontSize: 13,
      color: '#ef4444',
      letterSpacing: -0.1,
    },
    bottomFade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 96,
      zIndex: 0,
    },
    fabWrapper: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 20,
    },
    fabPressable: {
      opacity: 1,
    },
    fab: {
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      elevation: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
      backgroundColor: '#FF7A00',
    },
    fabLabel: {
      color: '#fff',
      fontFamily: 'Poppins',
      fontWeight: '700',
      fontSize: 15,
      letterSpacing: -0.2,
    },
    modalContent: {
      borderRadius: 24,
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    modalHeader: {
      backgroundColor: '#fafafa',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomWidth: 1,
      borderColor: '#f3f4f6',
      paddingHorizontal: 20,
      paddingVertical: 18,
    },
    modalHeaderContent: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 14,
    },
    modalIconBg: {
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    modalTitle: {
      fontFamily: 'Poppins',
      fontWeight: '700',
      fontSize: 17,
      color: '#111827',
      letterSpacing: -0.3,
    },
    modalSubtitle: {
      fontFamily: 'OpenSans',
      fontSize: 12,
      color: '#6b7280',
      marginTop: 2,
    },
    modalBody: {
      paddingVertical: 24,
      paddingHorizontal: 20,
    },
    modalVStack: {
      gap: 24,
    },
    fieldLabel: {
      fontFamily: 'Poppins',
      fontWeight: '600',
      fontSize: 14,
      marginBottom: 12,
      color: '#374151',
      letterSpacing: -0.1,
    },
    radioGroup: {
      flexDirection: 'row',
      gap: 10,
    },
    radioCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      margin: -7,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      backgroundColor: '#fafafa',
    },
    radioCardActive: {
      borderColor: '#f59e0b',
      backgroundColor: '#fffbeb',
    },
    radioLabel: {
      fontFamily: 'Poppins',
      fontSize: 13,
      fontWeight: '600',
      color: '#374151',
    },
    input: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      fontFamily: 'OpenSans',
      fontSize: 14,
      textAlignVertical: 'top',
      lineHeight: 18,
      borderColor: '#fff',
      borderWidth: 1,
    },
    modalFooter: {
      borderTopWidth: 1,
      borderColor: '#f3f4f6',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#fafafa',
    },
    modalFooterButtons: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: '#d1d5db',
      backgroundColor: '#fff',
      paddingVertical: 14,
    },
    cancelButtonText: {
      fontFamily: 'Poppins',
      fontWeight: '600',
      fontSize: 14,
      color: '#6b7280',
    },
    saveButton: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 14,
      borderWidth: 1,
      backgroundColor: '#06b379',
      borderColor: 'rgba(255,255,255,0.3)',
    },
    saveButtonText: {
      fontFamily: 'Poppins',
      fontWeight: '700',
      fontSize: 14,
      color: '#fff',
    },
  });
}
