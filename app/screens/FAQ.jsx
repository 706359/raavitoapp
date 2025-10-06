import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQ_DATA = [
  {
    id: "1",
    question: "What is your return policy?",
    answer: "You can return any item within 30 days of purchase.",
  },
  {
    id: "2",
    question: "How long does shipping take?",
    answer: "Shipping usually takes 3-5 business days.",
  },
  {
    id: "3",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide.",
  },
  {
    id: "4",
    question: "How can I track my order?",
    answer: "You will receive a tracking number once your order is shipped.",
  },
  {
    id: "5",
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled within 24 hours of placing them.",
  },
  {
    id: "6",
    question: "How do I change my address?",
    answer: "You can update your address in the account settings.",
  },
  {
    id: "7",
    question: "Do you offer discounts?",
    answer: "Yes, subscribe to our newsletter for exclusive discounts.",
  },
  {
    id: "8",
    question: "Is my payment secure?",
    answer: "We use secure payment gateways to protect your information.",
  },
];

export default function FAQ({ navigation }) {
  const [expanded, setExpanded] = useState({});

  const toggleAnswer = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }) => {
    const isOpen = expanded[item.id];
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.questionContainer} onPress={() => toggleAnswer(item.id)}>
          <Text style={styles.questionText}>{item.question}</Text>
          <Ionicons
            name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color='#333'
          />
        </TouchableOpacity>
        {isOpen && <Text style={styles.answerText}>{item.answer}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name='arrow-back'
          size={24}
          color='#000'
          onPress={() => navigation.goBack()}
          style={{ marginRight: 15 }}
        />
        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      <FlatList
        data={FAQ_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 20, // thoda zyada space inside each item
    marginBottom: 5, // thoda gap between items
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: { fontSize: 16, fontWeight: "500", color: "#333", flex: 1, paddingRight: 10 },
  answerText: { marginTop: 8, fontSize: 14, color: "#555", lineHeight: 20 },
});
