import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Button, HStack, Image, ScrollView, Text, VStack, useTheme } from "native-base";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("Shiv Ram Rana");
  const [email, setEmail] = useState("shiv@example.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [address, setAddress] = useState("Muzaffarnagar, Uttar Pradesh");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handleSave = () => {
    // Save logic here (API call or AsyncStorage)
    navigation.goBack();
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
        <VStack alignItems='center' mt={-60}>
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

        {/* Input Fields */}
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

        {/* Save Button */}
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
          onPress={handleSave}>
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
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  avatarContainer: {
    position: "relative",
  },
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
