import { StyleSheet, TextInput, View } from "react-native";

export default function BrandTextInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor='#888'
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  input: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 0.7,
    borderColor: "#ddd",
    backgroundColor: "#F5F5F5", // brand.light
    fontSize: 16,
    color: "#1A1A1A", // brand.dark
  },
});
