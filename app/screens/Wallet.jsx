import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useTheme,
} from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { BackHandler, RefreshControl, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchWallet } from "../utils/apiHelpers";

export default function WalletScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const brand = colors.brand;

  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("all");
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const walletData = await fetchWallet();
      setWallet(walletData);
    } catch (error) {
      console.error("Error loading wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const transactions = useMemo(() => {
    if (!wallet?.transactions) return [];
    return wallet.transactions.map((tx) => ({
      desc: tx.description || "Transaction",
      date: new Date(tx.createdAt).toLocaleString(),
      amount: tx.type === "credit" ? tx.amount : -tx.amount,
      type: tx.type,
    }));
  }, [wallet]);

  const list = useMemo(
    () => (tab === "all" ? transactions : transactions.filter((d) => d.type === tab)),
    [tab, transactions]
  );

  const balance = wallet?.balance || 0;
  const earned = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const spent = Math.abs(
    transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWallet();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: brand.light }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Top Hero */}
        <LinearGradient colors={[brand.orange, "#ffb864"]} style={styles.hero}>
          <HStack alignItems='center' justifyContent='space-between' px={12}>
            <Pressable onPress={() => navigation.goBack()}>
              <Icon as={MaterialIcons} name='arrow-back' size='lg' color='white' />
            </Pressable>
            <Text style={styles.heroTitle}>Wallet</Text>
            <Box w={6} />
          </HStack>

          {/* Balance Card */}
          <Box mx={4} mt={14} borderRadius='2xl' overflow='hidden' shadow={4}>
            <LinearGradient colors={["#FFFFFFCC", "#F7F7F7F0"]} style={styles.balanceCard}>
              <HStack alignItems='center' justifyContent='space-between'>
                <VStack>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  {loading ? (
                    <ActivityIndicator size='small' color={brand.orange} style={{ marginTop: 10 }} />
                  ) : (
                    <>
                      <HStack alignItems='flex-end'>
                        <Text style={[styles.balanceValue, { color: brand.orange }]}>
                          {balance.toFixed(2)}
                        </Text>
                        <Text style={styles.balanceUnit}> ₹</Text>
                      </HStack>
                      <HStack mt={3} space={3}>
                        <StatPill
                          icon='trending-up'
                          label='Earned'
                          value={`+${earned.toFixed(2)}`}
                          tint={brand.green}
                        />
                        <StatPill
                          icon='trending-down'
                          label='Spent'
                          value={`-${spent.toFixed(2)}`}
                          tint='#EF4444'
                        />
                      </HStack>
                    </>
                  )}
                </VStack>
                <Avatar bg={brand.light} shadow={3}>
                  <Icon as={MaterialIcons} name='account-balance-wallet' color={brand.orange} />
                </Avatar>
              </HStack>
            </LinearGradient>
          </Box>
        </LinearGradient>

        {/* Quick Actions */}
        <HStack px={4} mt={4} space={3}>
          <QuickAction icon='add-circle' label='Add' />
          <QuickAction icon='qr-code-scanner' label='Scan' outline />
          <QuickAction icon='card-giftcard' label='Offers' outline />
        </HStack>

        {/* Promo Banner */}
        <Box px={4} mt={5}>
          <LinearGradient
            colors={[brand.light, "#FFF5EB"]}
            style={[styles.promo, { shadowColor: "#000", shadowOpacity: 0.05, elevation: 2 }]}>
            <HStack alignItems='center' space={3}>
              <Avatar bg={brand.orange} size='sm'>
                <Icon as={MaterialIcons} name='bolt' color='white' />
              </Avatar>
              <VStack flex={1}>
                <Text style={styles.promoTitle}>Boost your balance</Text>
                <Text style={styles.promoSub}>Add ₹500 and get +5% coins</Text>
              </VStack>
              {/* <Button size='sm' px={4} borderRadius='full' shadow={2}>
                Add Now
              </Button> */}
            </HStack>
          </LinearGradient>
        </Box>

        {/* Tabs */}
        <HStack px={4} mt={6} bg='white' borderRadius='full' alignSelf='center' p={1} shadow={1}>
          <Segment label='All' active={tab === "all"} onPress={() => setTab("all")} />
          <Segment label='Credits' active={tab === "credit"} onPress={() => setTab("credit")} />
          <Segment label='Debits' active={tab === "debit"} onPress={() => setTab("debit")} />
        </HStack>

        {/* Transaction List */}
        <VStack px={4} mt={5} space={3}>
          {list.map((tx, i) => (
            <Box key={i} bg='white' borderRadius='2xl' p={4} shadow={1}>
              <HStack alignItems='center' justifyContent='space-between'>
                <HStack space={3} alignItems='center'>
                  <Avatar bg={tx.amount < 0 ? "#FEE2E2" : "#DCFCE7"}>
                    <Icon
                      as={MaterialIcons}
                      name={tx.amount < 0 ? "south" : "north"}
                      color={tx.amount < 0 ? "#DC2626" : "#059669"}
                    />
                  </Avatar>
                  <VStack>
                    <Text style={styles.txTitle}>{tx.desc}</Text>
                    <Text style={styles.txDate}>{tx.date}</Text>
                  </VStack>
                </HStack>

                <VStack alignItems='flex-end'>
                  <Text style={[styles.txAmount, { color: tx.amount < 0 ? "#DC2626" : "#059669" }]}>
                    {tx.amount < 0 ? `-${Math.abs(tx.amount)} RC` : `+${tx.amount} RC`}
                  </Text>
                  <Box
                    mt={1}
                    px={3}
                    py={0.5}
                    rounded='full'
                    bg={tx.amount < 0 ? "#FFF1F2" : "#ECFDF5"}
                    borderWidth={1}
                    borderColor={tx.amount < 0 ? "#FCA5A5" : "#6EE7B7"}>
                    <Text style={styles.txPill}>{tx.amount < 0 ? "Debit" : "Credit"}</Text>
                  </Box>
                </VStack>
              </HStack>
            </Box>
          ))}

          {/* Info Box */}
          <Box mt={3} p={4} bg='white' borderRadius='2xl' shadow={1}>
            <HStack alignItems='center' justifyContent='space-between'>
              <HStack space={2} alignItems='center'>
                <Icon as={MaterialIcons} name='shield' color={brand.orange} />
                <Text style={styles.infoTitle}>Wallet Protection</Text>
              </HStack>
              <Text style={styles.infoLink}>Learn more</Text>
            </HStack>
            <Divider my={3} />
            <Text style={styles.infoSub}>
              Your wallet is secured. Unauthorized transactions are protected under Raavito safety
              policy.
            </Text>
          </Box>
        </VStack>

        <Box h={16} />
      </ScrollView>

      {/* Floating Add Button */}
      <Box position='absolute' bottom={20} right={20}>
        <Button
          borderRadius='full'
          shadow={4}
          leftIcon={<Icon as={MaterialIcons} name='add' color='white' />}>
          Add Coins
        </Button>
      </Box>
    </SafeAreaView>
  );
}

/* Components */
function StatPill({ icon, label, value, tint }) {
  return (
    <HStack px={3} py={1} alignItems='center' space={1.5} bg='#F3F4F680' borderRadius='full'>
      <Icon as={MaterialIcons} name={icon} size='xs' color={tint} />
      <Text style={{ fontSize: 12, color: "#374151" }}>{label}</Text>
      <Text style={{ fontSize: 12, color: tint, fontWeight: "700" }}>{value}</Text>
    </HStack>
  );
}

function QuickAction({ icon, label, outline }) {
  return (
    <Pressable style={{ flex: 1 }}>
      <HStack
        bg={outline ? "white" : "#0B1220"}
        borderColor={outline ? "#E5E7EB" : "transparent"}
        borderWidth={outline ? 1 : 0}
        p={4}
        borderRadius={16}
        alignItems='center'
        justifyContent='center'
        space={2}
        shadow={outline ? 0 : 2}>
        <Icon as={MaterialIcons} name={icon} color={outline ? "#111827" : "white"} />
        <Text
          style={{
            fontWeight: "700",
            color: outline ? "#111827" : "white",
            fontFamily: "OpenSans",
          }}>
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
}

function Segment({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Box
        px={4}
        py={2}
        rounded='full'
        bg={active ? "#0B1220" : "transparent"}
        shadow={active ? 2 : 0}>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 13,
            color: active ? "white" : "#0B1220",
            fontFamily: "OpenSans",
          }}>
          {label}
        </Text>
      </Box>
    </Pressable>
  );
}

/* Styles */
const styles = StyleSheet.create({
  hero: {
    paddingTop: 10,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTitle: {
    color: "white",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 20,
  },
  balanceCard: {
    padding: 18,
    borderRadius: 20,
    backdropFilter: "blur(12px)",
  },
  balanceLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontFamily: "OpenSans",
  },
  balanceValue: {
    paddingTop: 15,
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 34,
  },
  balanceUnit: {
    color: "#A1A1A1",
    fontFamily: "OpenSans",
    marginLeft: 4,
    marginBottom: 3,
  },
  promo: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
  promoTitle: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    color: "#7C2D12",
  },
  promoSub: {
    fontFamily: "OpenSans",
    fontSize: 13,
    color: "#9A3412",
  },
  txTitle: {
    fontFamily: "OpenSans",
    fontWeight: "700",
    fontSize: 15,
    color: "#111827",
  },
  txDate: {
    fontFamily: "OpenSans",
    fontSize: 12,
    color: "#6B7280",
  },
  txAmount: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
  },
  txPill: {
    fontFamily: "OpenSans",
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  infoTitle: {
    fontFamily: "OpenSans",
    fontWeight: "700",
    color: "#111827",
  },
  infoLink: {
    fontFamily: "OpenSans",
    fontWeight: "700",
    color: "#2563EB",
    fontSize: 13,
  },
  infoSub: {
    fontFamily: "OpenSans",
    fontSize: 12.5,
    color: "#6B7280",
  },
});
