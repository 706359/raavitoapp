import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, Button, HStack, Icon, Pressable, ScrollView, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  const navigation = useNavigation();

  // 🔙 Handle Android back button
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [navigation]);

  // 🪙 Raavito Coin transactions
  const transactions = [
    { desc: "Used in Order #10", date: "8 Oct, 06:49 PM", amount: -112 },
    { desc: "Coins Added", date: "8 Oct, 06:48 PM", amount: 100 },
    { desc: "Coins Added", date: "8 Oct, 03:06 PM", amount: 112 },
    { desc: "Used in Order #2", date: "25 Sep, 02:35 PM", amount: -100 },
    { desc: "Coins Added", date: "24 Sep, 02:27 PM", amount: 100 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 🔙 Back Arrow */}
        <Pressable onPress={() => navigation.goBack()}>
          <HStack alignItems='center' style={styles.header}>
            <Icon as={MaterialIcons} name='arrow-back' size='md' color='black' />
            <Text style={styles.headerText}>Wallet</Text>
          </HStack>
        </Pressable>

        {/* 🪙 Coin Balance Section */}
        <Box bg='brand.orange' px={6} py={8} borderBottomRadius='3xl'>
          <VStack space={2} alignItems='start'>
            <Icon as={MaterialIcons} name='account-balance-wallet' size='2xl' color='white' />
            <Text style={styles.coinBalance}>🪙 0</Text>
            <Text style={styles.coinLabel}>Raavito Coins</Text>
            <Button mt={4} alignSelf='flex-end'>
              + ADD COINS
            </Button>
          </VStack>
        </Box>

        {/* 📜 Transaction History */}
        <Box px={6} py={4}>
          <Text style={styles.sectionTitle}>Transaction History</Text>

          <VStack space={4}>
            {transactions.map((tx, index) => (
              <Box key={index} bg='white' p={4} borderRadius='lg' shadow={1}>
                <HStack justifyContent='space-between'>
                  <VStack>
                    <Text style={styles.txDesc}>{tx.desc}</Text>
                    <Text style={styles.txDate}>{tx.date}</Text>
                  </VStack>
                  <Text style={[styles.txAmount, { color: tx.amount < 0 ? "#EF4444" : "#22C55E" }]}>
                    {tx.amount < 0 ? `-${Math.abs(tx.amount)} RC` : `+${tx.amount} RC`}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
  coinBalance: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Poppins",
  },
  coinLabel: {
    fontSize: 16,
    color: "white",
    fontFamily: "OpenSans",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "Poppins",
  },
  txDesc: {
    fontWeight: "600",
    fontFamily: "OpenSans",
  },
  txDate: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "OpenSans",
  },
  txAmount: {
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
});
