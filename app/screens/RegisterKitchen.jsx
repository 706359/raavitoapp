import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Button, HStack, Image, ScrollView, Text, VStack } from "native-base";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export default function KitchenRegistrationScreen() {
  const navigation = useNavigation();
  const [kitchenImage, setKitchenImage] = useState(null);
  const [kitchenName, setKitchenName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setKitchenImage(result.assets[0].uri);
  };

  const handleRegister = () => {
    if (!kitchenName || !ownerName || !phone) {
      alert("Please fill required fields.");
      return;
    }
    // API or database call logic here
    navigation.navigate("ThanksScreen"); // example redirect
  };

  return (
    <Box flex={1} bg='#fff'>
      {/* Header */}
      <LinearGradient colors={["#FF9F43", "#FF6F00"]} style={styles.header}>
        <HStack justifyContent='space-between' alignItems='center'>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={26} color='#fff' />
          </Pressable>
          <Text style={styles.headerTitle}>Kitchen Registration</Text>
          <View style={{ width: 26 }} />
        </HStack>
      </LinearGradient>

      {/* Form */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Kitchen Image */}
        <VStack alignItems='center' mt={-60}>
          <Pressable onPress={pickImage}>
            <Box style={styles.imageContainer}>
              <Image
                source={
                  kitchenImage ? { uri: kitchenImage } : require("../assets/kitchenPlaceholder.png")
                }
                alt='Kitchen'
                style={styles.kitchenImage}
              />
              <Box style={styles.cameraIcon}>
                <Ionicons name='camera' size={18} color='#fff' />
              </Box>
            </Box>
          </Pressable>
          <Text style={styles.imageLabel}>Upload Kitchen Photo</Text>
        </VStack>

        {/* Fields */}
        <VStack space={5} mt={6}>
          <Box>
            <Text style={styles.label}>Kitchen Name *</Text>
            <TextInput
              style={styles.input}
              value={kitchenName}
              onChangeText={setKitchenName}
              placeholder='e.g. Swadisht Kitchen'
            />
          </Box>

          <Box>
            <Text style={styles.label}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder='e.g. Rajan Verma'
            />
          </Box>

          <Box>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder='e.g. kitchen@gmail.com'
              keyboardType='email-address'
            />
          </Box>

          <Box>
            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder='+91 XXXXX XXXXX'
              keyboardType='phone-pad'
            />
          </Box>

          <Box>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: "top" }]}
              value={address}
              onChangeText={setAddress}
              placeholder='Full address'
              multiline
            />
          </Box>

          <Box>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              value={description}
              onChangeText={setDescription}
              placeholder='Tell customers about your kitchen...'
              multiline
            />
          </Box>
        </VStack>

        {/* Register Button */}
        <Button
          mt={8}
          borderRadius={12}
          py={4}
          bg={{
            linearGradient: {
              colors: ["#FF9F43", "#FF6F00"],
              start: [0, 0],
              end: [1, 1],
            },
          }}
          _text={{ fontWeight: "bold", fontSize: 16 }}
          onPress={handleRegister}>
          Register Kitchen
        </Button>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 70,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  imageContainer: {
    position: "relative",
  },
  kitchenImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#f1f1f1",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#FF6F00",
    borderRadius: 15,
    padding: 5,
  },
  imageLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    height: 50,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
});
