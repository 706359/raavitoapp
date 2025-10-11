import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQ_DATA = [
  {
    id: "1",
    question: "What are your delivery hours?",
    answer: "We deliver daily from 8 AM to 9 PM, including weekends.",
  },
  {
    id: "2",
    question: "Can I customize my meal?",
    answer: "Yes, you can add preferences or remove ingredients during checkout.",
  },
  {
    id: "3",
    question: "Do you offer vegetarian or vegan options?",
    answer: "Absolutely! We have a wide range of plant-based meals.",
  },
  {
    id: "4",
    question: "How do I report a missing item?",
    answer: "Use the 'Help' section in the app to report issues within 24 hours.",
  },
  {
    id: "5",
    question: "Is contactless delivery available?",
    answer: "Yes, just select 'Leave at door' during checkout.",
  },
  {
    id: "6",
    question: "Are your meals hygienically prepared?",
    answer: "All meals are prepared in FSSAI-certified kitchens with strict hygiene protocols.",
  },
  {
    id: "7",
    question: "Can I schedule orders in advance?",
    answer: "Yes, you can pre-book meals up to 3 days ahead.",
  },
  {
    id: "8",
    question: "What payment methods do you accept?",
    answer: "We accept UPI, credit/debit cards, and cash on delivery.",
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
