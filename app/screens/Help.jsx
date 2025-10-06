import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HELP_DATA = [
  {
    id: "1",
    question: "Privacy Policy",
    answer: "Our privacy policy explains how we handle your data and protect your privacy.",
  },
  {
    id: "2",
    question: "Terms & Conditions",
    answer: "Our terms and conditions describe the rules for using our service.",
  },
  {
    id: "3",
    question: "Contact Us",
    answer: "You can contact us via email at support@example.com or call us at 123-456-7890.",
  },
];

export default function Help({ navigation }) {
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
        <Text style={styles.headerTitle}>Help</Text>
      </View>

      <FlatList
        data={HELP_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
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
    paddingVertical: 20,
    marginBottom: 15,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: { fontSize: 16, fontWeight: "500", color: "#333", flex: 1, paddingRight: 10 },
  answerText: { marginTop: 8, fontSize: 14, color: "#555", lineHeight: 20 },
});
