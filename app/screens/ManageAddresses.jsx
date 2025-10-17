// ManageAddresses.expanded.js
// Fully expanded verbose version using your theme (brand.orange, brand.green, brand.dark, brand.light, brand.gray, brand.softGray)
// Fonts from theme: Poppins (heading), OpenSans (body).
// NativeBase v3 compatible. Minimal abstraction. Explicit styles and props for clarity.

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  Badge,
  Box,
  Center,
  Divider,
  HStack,
  Icon,
  Input,
  Modal,
  Pressable,
  Radio,
  Text,
  useTheme,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddress } from "../context/AddressContext";

export default function ManageAddresses() {
  const navigation = useNavigation();
  const { setSelectedAddress } = useAddress();
  const theme = useTheme();

  // DO NOT abstract styles. Explicit per-element styles follow.
  const styles = makeStyles(theme);

  const [currentLocation, setCurrentLocation] = useState("Fetching location...");
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ type: "Home", address: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem("addresses");
        if (saved) {
          setAddresses(JSON.parse(saved));
        } else {
          setAddresses([
            {
              id: "1",
              type: "Office",
              address: "412, Apple Square, Vrajbhumi Society, Mota Varachha, Surat, Gujarat 394101",
            },
            {
              id: "2",
              type: "Home",
              address: "123, Ashwini Kumar Rd, Khand Bazar, Varachha, Surat, Gujarat 395008",
            },
          ]);
        }
      } catch (err) {
        console.log("Error loading addresses", err);
      }
    };
    loadData();
  }, []);

  const saveAddresses = async (data) => {
    try {
      await AsyncStorage.setItem("addresses", JSON.stringify(data));
    } catch (err) {
      console.log("Error saving addresses", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setCurrentLocation("Detecting location...");
        setTimeout(() => setCurrentLocation("Surat, Gujarat, India"), 700);
      } catch (err) {
        setCurrentLocation("Error fetching location");
      }
    })();
  }, []);

  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    navigation.goBack();
  };

  const openEditModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({ type: item.type, address: item.address });
    } else {
      setEditItem(null);
      setForm({ type: "Home", address: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.address.trim()) return;
    let updated;
    if (editItem) {
      updated = addresses.map((a) =>
        a.id === editItem.id ? { ...a, type: form.type, address: form.address } : a
      );
    } else {
      updated = [
        ...addresses,
        { id: Date.now().toString(), type: form.type, address: form.address },
      ];
    }
    setAddresses(updated);
    saveAddresses(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    saveAddresses(updated);
  };

  // Icon and bg per type with theme
  const getAddressIcon = (type) => {
    if (type === "Home") {
      return { name: "home", color: theme.colors.brand.green, bg: "#e7f9f1" };
    }
    if (type === "Office") {
      return { name: "business", color: theme.colors.brand.orange, bg: "#fff2e5" };
    }
    return { name: "place", color: theme.colors.brand.gray, bg: "#eef2f7" };
  };

  // Render a single saved address card
  const renderAddressItem = ({ item }) => {
    const icon = getAddressIcon(item.type);

    return (
      <Pressable onPress={() => handleSelect(item.address)} _pressed={{ opacity: 0.9 }}>
        <Box style={styles.cardRoot}>
          {/* Card header row with type and Active badge */}
          <HStack style={styles.cardHeaderRow}>
            <HStack alignItems='center' space={3}>
              <Box style={{ padding: 10, borderRadius: 12, backgroundColor: icon.bg }}>
                <Icon as={MaterialIcons} name={icon.name} color={icon.color} size={6} />
              </Box>
              <VStack>
                <Text style={styles.cardTitleText}>{item.type}</Text>
                <Text style={styles.cardSubText}>Saved Address</Text>
              </VStack>
            </HStack>

            <Badge
              alignSelf='center'
              variant='subtle'
              borderRadius='full'
              _text={{ fontSize: 10, fontWeight: "700", fontFamily: "OpenSans" }}
              style={styles.activeBadge}>
              Active
            </Badge>
          </HStack>

          {/* Address body with left accent */}
          <Box
            style={{
              backgroundColor: theme.colors.brand.light,
              padding: 12,
              borderRadius: 14,
              borderLeftWidth: 3,
              borderLeftColor: icon.color,
              marginBottom: 12,
            }}>
            <Text
              style={{
                fontFamily: "OpenSans",
                color: theme.colors.brand.dark,
                fontSize: 13,
                lineHeight: 18,
              }}>
              {item.address}
            </Text>
          </Box>

          {/* Actions explicit: Edit and Delete as distinct buttons */}
          <HStack space={3} style={styles.cardActionsRow}>
            {/* Edit button explicit */}
            <Pressable
              onPress={() => openEditModal(item)}
              _pressed={{ opacity: 0.92 }}
              style={{ flex: 1 }}>
              <Box
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 14,
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.2,
                  borderColor: theme.colors.brand.orange,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                }}>
                <HStack alignItems='center' space={2}>
                  <Icon as={MaterialIcons} name='edit' color={theme.colors.brand.orange} size={4} />
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      fontSize: 14,
                      color: theme.colors.brand.orange,
                    }}>
                    Edit
                  </Text>
                </HStack>
              </Box>
            </Pressable>

            {/* Delete button explicit */}
            <Pressable
              onPress={() => handleDelete(item.id)}
              _pressed={{ opacity: 0.92 }}
              style={{ flex: 1 }}>
              <Box
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 14,
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.2,
                  borderColor: "#ef4444",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                }}>
                <HStack alignItems='center' space={2}>
                  <Icon as={MaterialIcons} name='delete-outline' color='#ef4444' size={4} />
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      fontSize: 14,
                      color: "#ef4444",
                    }}>
                    Delete
                  </Text>
                </HStack>
              </Box>
            </Pressable>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaRoot}>
      {/* Header explicit with solid brand.orange and white text/icons */}
      <Box
        style={{
          backgroundColor: theme.colors.brand.orange,
          paddingBottom: 18,
          paddingTop: Platform.OS === "ios" ? 20 : 18,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
        }}>
        <HStack
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <HStack alignItems='center' space={3}>
            <Pressable onPress={() => navigation.goBack()} _pressed={{ opacity: 0.85 }}>
              <Box
                style={{
                  padding: 8,
                  borderRadius: 999,
                  borderColor: "rgba(255,255,255,0.6)",
                  borderWidth: 1,
                }}>
                <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
              </Box>
            </Pressable>

            <VStack>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: "800",
                  fontFamily: "Poppins",
                }}>
                My Addresses
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 12,
                  fontFamily: "OpenSans",
                }}>
                Manage your delivery locations
              </Text>
            </VStack>
          </HStack>

          <Center
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 8,
              borderRadius: 999,
            }}>
            <Icon as={MaterialIcons} name='location-on' color='white' size={6} />
          </Center>
        </HStack>
      </Box>

      {/* Current location card explicit */}
      <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
        <Pressable onPress={() => handleSelect(currentLocation)} _pressed={{ opacity: 0.92 }}>
          <Box
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: theme.colors.brand.softGray,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
            }}>
            <Box style={{ height: 4, backgroundColor: theme.colors.brand.orange, opacity: 0.95 }} />
            <HStack
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
              }}>
              <Box
                style={{
                  backgroundColor: "#fff7ed",
                  padding: 12,
                  borderRadius: 12,
                }}>
                <Icon as={MaterialIcons} name='my-location' color='#c2410c' size={7} />
              </Box>

              <VStack flex={1} style={{ marginLeft: 12 }}>
                <HStack alignItems='center' space={2} style={{ marginBottom: 4 }}>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 15,
                      fontFamily: "Poppins",
                      color: theme.colors.brand.dark,
                    }}>
                    Current Location
                  </Text>
                  <Badge
                    colorScheme='warning'
                    variant='subtle'
                    borderRadius='full'
                    _text={{ fontSize: 9, fontWeight: "700", fontFamily: "OpenSans" }}>
                    LIVE
                  </Badge>
                </HStack>

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 13,
                    fontFamily: "OpenSans",
                    color: "#6b7280",
                  }}>
                  {currentLocation}
                </Text>
              </VStack>

              <Icon as={MaterialIcons} name='chevron-right' color='coolGray.400' size={6} />
            </HStack>
          </Box>
        </Pressable>
      </View>

      {/* Section heading explicit */}
      <Box style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <HStack alignItems='center' justifyContent='space-between'>
          <VStack>
            <Text
              style={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: 18,
                color: theme.colors.brand.dark,
              }}>
              Saved Addresses
            </Text>
            <Text
              style={{
                fontFamily: "OpenSans",
                fontSize: 12,
                color: theme.colors.brand.gray,
              }}>
              {addresses.length} {addresses.length === 1 ? "location" : "locations"} saved
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* List explicit */}
      <Box style={{ paddingHorizontal: 20, flex: 1, marginTop: 12 }}>
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      </Box>

      {/* Bottom gradient fade explicit */}
      <Box
        pointerEvents='none'
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 96,
          backgroundColor: "transparent",
        }}
      />

      {/* Floating Add button explicit with gradient-like two-tone using brand colors */}
      <View
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 20,
        }}>
        <Pressable onPress={() => openEditModal()} _pressed={{ opacity: 0.9 }}>
          <Box
            style={{
              borderRadius: 18,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              elevation: 10,
              shadowColor: theme.colors.brand.green,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 14,
              backgroundColor: theme.colors.brand.green,
            }}>
            <HStack alignItems='center' justifyContent='center' space={3}>
              <Icon as={MaterialIcons} name='add-circle-outline' color='white' size={6} />
              <Text
                style={{
                  color: "#ffffff",
                  fontFamily: "Poppins",
                  fontWeight: "700",
                  fontSize: 16,
                }}>
                Add New Address
              </Text>
            </HStack>
          </Box>
        </Pressable>
      </View>

      {/* Modal explicit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size='lg'>
        <Modal.Content
          style={{
            borderRadius: 24,
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}>
          <Modal.CloseButton _icon={{ color: "coolGray.500" }} _pressed={{ bg: "coolGray.100" }} />

          <Modal.Header
            style={{
              backgroundColor: "#f8fafb",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderBottomWidth: 1,
              borderColor: theme.colors.brand.softGray,
              paddingHorizontal: 18,
              paddingVertical: 12,
            }}>
            <HStack alignItems='center' space={3}>
              <Box
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: theme.colors.brand.orange,
                }}>
                <Icon
                  as={MaterialIcons}
                  name={editItem ? "edit-location" : "add-location"}
                  color='white'
                  size={5}
                />
              </Box>
              <Text
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "700",
                  fontSize: 16,
                  color: theme.colors.brand.dark,
                }}>
                {editItem ? "Edit Address" : "Add New Address"}
              </Text>
            </HStack>
          </Modal.Header>

          <Modal.Body
            style={{
              paddingVertical: 18,
              paddingHorizontal: 12,
            }}>
            {/* Address Type explicit */}
            <VStack space={3} style={{ marginBottom: 14 }}>
              <Text
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: 14,
                  color: theme.colors.brand.dark,
                  marginBottom: 6,
                }}>
                Address Type
              </Text>
              <Radio.Group
                name='addressType'
                value={form.type}
                onChange={(val) => setForm({ ...form, type: val })}>
                <HStack space={4}>
                  <Radio
                    value='Home'
                    colorScheme='success'
                    _text={{ fontFamily: "OpenSans", fontSize: "sm" }}>
                    Home
                  </Radio>
                  <Radio
                    value='Office'
                    colorScheme='info'
                    _text={{ fontFamily: "OpenSans", fontSize: "sm" }}>
                    Office
                  </Radio>
                  <Radio
                    value='Other'
                    colorScheme='warning'
                    _text={{ fontFamily: "OpenSans", fontSize: "sm" }}>
                    Other
                  </Radio>
                </HStack>
              </Radio.Group>
            </VStack>

            <Divider bg={theme.colors.brand.softGray} />

            {/* Address Field explicit */}
            <VStack space={2} style={{ marginTop: 14 }}>
              <Text
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: 14,
                  color: theme.colors.brand.dark,
                }}>
                Complete Address
              </Text>
              <Input
                placeholder='Enter your full address with landmarks'
                multiline
                numberOfLines={4}
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
                bg='white'
                borderColor='coolGray.300'
                borderWidth={1}
                style={{
                  borderRadius: 14,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  fontFamily: "OpenSans",
                  fontSize: 14,
                  color: theme.colors.brand.dark,
                }}
                _focus={{
                  borderColor: theme.colors.brand.orange,
                  backgroundColor: "white",
                  borderWidth: 2,
                }}
              />
            </VStack>
          </Modal.Body>

          <Modal.Footer
            style={{
              borderTopWidth: 1,
              borderColor: theme.colors.brand.softGray,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}>
            <HStack space={3} style={{ width: "100%" }}>
              {/* Cancel explicit */}
              <Pressable
                onPress={() => setIsModalOpen(false)}
                style={{ flex: 1 }}
                _pressed={{ opacity: 0.9 }}>
                <Box
                  style={{
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}>
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      fontSize: 14,
                      color: theme.colors.brand.dark,
                    }}>
                    Cancel
                  </Text>
                </Box>
              </Pressable>

              {/* Save explicit */}
              <Pressable onPress={handleSave} style={{ flex: 1 }} _pressed={{ opacity: 0.9 }}>
                <Box
                  style={{
                    borderRadius: 24,
                    backgroundColor: theme.colors.brand.orange,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    elevation: 3,
                  }}>
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: 14,
                      color: "#ffffff",
                    }}>
                    Save Address
                  </Text>
                </Box>
              </Pressable>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(theme) {
  // Keep explicit even for root to increase readability and maintainability.
  return StyleSheet.create({
    safeAreaRoot: {
      flex: 1,
      backgroundColor: theme.colors.brand.light,
    },

    // Card root explicit
    cardRoot: {
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.brand.softGray,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },

    // Header row for card
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    // Card title text explicit
    cardTitleText: {
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Poppins",
      color: theme.colors.brand.dark,
    },

    // Card subtitle explicit
    cardSubText: {
      fontSize: 12,
      fontFamily: "OpenSans",
      color: theme.colors.brand.gray,
    },

    // Action row explicit
    cardActionsRow: {
      flexDirection: "row",
    },

    // Active badge explicit extra outline via shadow for clarity
    activeBadge: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      backgroundColor: "#ecfdf5",
    },
  });
}
