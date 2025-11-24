// screens/EditProfile.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Button, HStack, Image, ScrollView, Text, VStack, useTheme } from "native-base";
import React, { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const incoming = route.params?.profile || {};

  const [profileImage, setProfileImage] = useState(incoming.image || null);
  const [name, setName] = useState(incoming.name || "");
  const [email, setEmail] = useState(incoming.email || "");
  const [phone, setPhone] = useState(incoming.mobile || "");
  const [address, setAddress] = useState(incoming.address || "");
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to your media library to select a profile image."
        );
        return;
      }

      const mediaType = ImagePicker.MediaTypeOptions.Images;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        allowsEditing: true,
        aspect: [1, 1],
        quality: Platform.OS === "ios" ? 1 : 0.8,
        base64: false,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Unable to select image. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Split name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Update profile via API
      const response = await axios_.put('/users/profile', {
        firstName,
        lastName,
        email: email || undefined,
        profileImage: profileImage || undefined,
      });

      // Also save to AsyncStorage for local caching
      const updated = { name, email, mobile: phone, address, image: profileImage };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updated));

      Alert.alert("Profile Updated", "Your profile information has been saved successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong while saving your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box flex={1} bg='#fff'>
      {/* Header */}
      <LinearGradient colors={["#FF9F43", "#FF6F00"]} style={styles.header}>
        <HStack justifyContent='space-between' alignItems='center'>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={26} color='#fff' />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 26 }} />
        </HStack>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile Image */}
        <VStack alignItems='center'>
          <Pressable onPress={pickImage}>
            <Box style={styles.avatarContainer}>
              <Image
                source={profileImage ? { uri: profileImage } : require("../assets/logo.png")}
                alt='Profile'
                style={styles.avatar}
              />
              <Box style={styles.cameraIcon}>
                <Ionicons name='camera' size={18} color='#fff' />
              </Box>
            </Box>
          </Pressable>
        </VStack>

        {/* Inputs */}
        <VStack space={5} mt={6}>
          <Box>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </Box>

          <Box>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </Box>

          <Box>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType='phone-pad'
            />
          </Box>

          <Box>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </Box>
        </VStack>

        <Button
          isLoading={saving}
          onPress={handleSave}
          mt={10}
          shadow={6}
          variant='outline'
          borderColor='brand.light'
          _text={{ fontWeight: "700", fontSize: "md", color: "white" }}
          _linearGradient={{
            as: LinearGradient,
            colors: [theme.colors.brand.orange, theme.colors.brand.green],
            start: [0, 0],
            end: [1, 1],
          }}>
          Save Changes
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
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 110,
    height: 110,
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
  label: { fontSize: 14, fontWeight: "500", color: "#555", marginBottom: 6 },
  input: {
    height: 50,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
});
