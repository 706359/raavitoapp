// ✅ Final Standard ManageAddresses Screen for Raavito Food App
// Stable, fully working, production-ready version
// Built with NativeBase + Expo + AsyncStorage + Expo Location

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import {
  Box,
  Button,
  CheckIcon,
  HStack,
  Icon,
  Input,
  Modal,
  Pressable,
  Select,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddress } from "../context/AddressContext";

export default function ManageAddresses() {
  const navigation = useNavigation();
  const { setSelectedAddress } = useAddress();

  const [currentLocation, setCurrentLocation] = useState("Fetching location...");
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ type: "Home", address: "" });

  // Load saved addresses
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem("addresses");
        if (saved) setAddresses(JSON.parse(saved));
        else {
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

  // Save to AsyncStorage
  const saveAddresses = async (data) => {
    try {
      await AsyncStorage.setItem("addresses", JSON.stringify(data));
    } catch (err) {
      console.log("Error saving addresses", err);
    }
  };

  // Fetch current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCurrentLocation("Permission denied");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const geo = await Location.reverseGeocodeAsync(loc.coords);
        if (geo.length > 0) {
          const place = geo[0];
          const str = `${place.name || ""} ${place.street || ""}, ${place.city || ""}, ${
            place.region || ""
          }`.trim();
          setCurrentLocation(str || "Location unavailable");
        }
      } catch (err) {
        console.log(err);
        setCurrentLocation("Error fetching location");
      }
    })();
  }, []);

  // Select address
  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    navigation.goBack();
  };

  // Open modal for new/edit
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

  // Save edited or new
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

  // Delete address
  const handleDelete = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    saveAddresses(updated);
  };

  // Render item
  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleSelect(item.address)}>
      <Box bg='white' borderWidth={1} borderColor='gray.200' borderRadius='lg' p={4} mb={3}>
        <HStack alignItems='center' mb={2}>
          <Icon
            as={MaterialIcons}
            name={item.type === "Office" ? "business" : item.type === "Home" ? "home" : "place"}
            color='#f97316'
            size={6}
          />
          <Text ml={2} fontWeight='700' fontSize='md'>
            {item.type}
          </Text>
        </HStack>

        <Text fontSize='sm' color='gray.700'>
          {item.address}
        </Text>

        <HStack mt={4} space={3}>
          <Button
            flex={1}
            bg='#f59e0b'
            _pressed={{ bg: "#d97706" }}
            onPress={() => openEditModal(item)}>
            Edit
          </Button>
          <Button
            flex={1}
            bg='#ef4444'
            _pressed={{ bg: "#dc2626" }}
            onPress={() => handleDelete(item.id)}>
            Delete
          </Button>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <HStack alignItems='center' p={4} bg='#f97316' shadow={2}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon as={MaterialIcons} name='arrow-back' color='white' size={6} />
        </Pressable>
        <Text color='white' fontSize='xl' fontWeight='bold' ml={4}>
          Manage Addresses
        </Text>
      </HStack>

      {/* Current location */}
      <Pressable onPress={() => handleSelect(currentLocation)}>
        <Box
          borderWidth={1}
          borderColor='#fde68a'
          bg='white'
          p={4}
          m={4}
          borderRadius='lg'
          shadow={1}>
          <HStack alignItems='center' space={3}>
            <Icon as={MaterialIcons} name='my-location' color='#f59e0b' size={6} />
            <VStack>
              <Text fontWeight='700'>Use Current Location</Text>
              <Text fontSize='sm' color='gray.600'>
                {currentLocation}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Pressable>

      {/* List */}
      <Box px={4} flex={1}>
        <Text mb={2} fontWeight='700'>
          Saved Addresses
        </Text>
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        />

        <Button
          mt={4}
          bg='#16a34a'
          _pressed={{ bg: "#15803d" }}
          borderRadius='lg'
          onPress={() => openEditModal()}>
          Add New Location
        </Button>
      </Box>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Content borderRadius='2xl'>
          <Modal.CloseButton />
          <Modal.Header>{editItem ? "Edit Address" : "Add New Address"}</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Select
                selectedValue={form.type}
                minWidth='200'
                placeholder='Choose Type'
                onValueChange={(v) => setForm({ ...form, type: v })}
                _selectedItem={{ bg: "orange.100", endIcon: <CheckIcon size='5' /> }}>
                <Select.Item label='Home' value='Home' />
                <Select.Item label='Office' value='Office' />
                <Select.Item label='Other' value='Other' />
              </Select>
              <Input
                placeholder='Enter full address'
                multiline
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex={1}
              bg='#f97316'
              _pressed={{ bg: "#ea580c" }}
              borderRadius='lg'
              onPress={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
}
