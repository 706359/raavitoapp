import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';

// Predefined gradient color combinations
const GRADIENT_PRESETS = [
  { name: 'Orange', colors: ['#f57506', '#fb923c'] },
  { name: 'Green', colors: ['#366d59', '#4a9d7a'] },
  { name: 'Blue', colors: ['#0ea5e9', '#38bdf8'] },
  { name: 'Purple', colors: ['#8b5cf6', '#a78bfa'] },
  { name: 'Red', colors: ['#ef4444', '#f87171'] },
  { name: 'Pink', colors: ['#ec4899', '#f472b6'] },
  { name: 'Yellow', colors: ['#eab308', '#facc15'] },
  { name: 'Teal', colors: ['#14b8a6', '#5eead4'] },
  { name: 'Indigo', colors: ['#6366f1', '#818cf8'] },
  { name: 'Rose', colors: ['#f43f5e', '#fb7185'] },
  { name: 'Amber', colors: ['#f59e0b', '#fbbf24'] },
  { name: 'Cyan', colors: ['#06b6d4', '#22d3ee'] },
];

const ColorPicker = ({ value = [], onChange, label = 'Gradient Colors' }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customColors, setCustomColors] = useState(value.length > 0 ? value : ['#f57506', '#fb923c']);

  // Update colors when value prop changes (for editing existing deals)
  useEffect(() => {
    if (value.length > 0) {
      setCustomColors(value);
    }
  }, [value]);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.name);
    setCustomColors(preset.colors);
    onChange(preset.colors);
    setModalVisible(false);
  };

  const handleCustomColorChange = (index, color) => {
    const newColors = [...customColors];
    newColors[index] = color;
    setCustomColors(newColors);
    onChange(newColors);
  };

  const addColor = () => {
    const newColors = [...customColors, '#000000'];
    setCustomColors(newColors);
    onChange(newColors);
  };

  const removeColor = (index) => {
    if (customColors.length > 1) {
      const newColors = customColors.filter((_, i) => i !== index);
      setCustomColors(newColors);
      onChange(newColors);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} *</Text>
      
      {/* Color Preview */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.previewButton}>
        <View style={styles.colorPreview}>
          {customColors.length > 0 ? (
            <View style={styles.gradientPreview}>
              {customColors.map((color, index) => (
                <View
                  key={index}
                  style={[styles.colorSwatch, { backgroundColor: color }]}
                />
              ))}
            </View>
          ) : (
            <View style={[styles.colorSwatch, { backgroundColor: '#f57506' }]} />
          )}
        </View>
        <Text style={styles.previewText}>
          {customColors.length > 0 ? customColors.join(', ') : 'Select colors'}
        </Text>
        <Text style={styles.changeText}>Tap to change</Text>
      </TouchableOpacity>

      {/* Color Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gradient Colors</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Preset Gradients */}
              <Text style={styles.sectionTitle}>Preset Gradients</Text>
              <View style={styles.presetsGrid}>
                {GRADIENT_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.name}
                    onPress={() => handlePresetSelect(preset)}
                    style={[
                      styles.presetCard,
                      selectedPreset === preset.name && styles.presetCardSelected,
                      { marginRight: 12, marginBottom: 12 },
                    ]}>
                    <View style={styles.presetGradient}>
                      {preset.colors.map((color, index) => (
                        <View
                          key={index}
                          style={[styles.presetColor, { backgroundColor: color }]}
                        />
                      ))}
                    </View>
                    <Text style={styles.presetName}>{preset.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Colors */}
              <Text style={styles.sectionTitle}>Custom Colors</Text>
              {customColors.map((color, index) => (
                <View key={index} style={styles.colorInputRow}>
                  <View style={[styles.colorPreviewSmall, { backgroundColor: color, marginRight: 12 }]} />
                  <TextInput
                    style={styles.colorInput}
                    value={color}
                    onChangeText={(text) => handleCustomColorChange(index, text)}
                    placeholder="#f57506"
                    placeholderTextColor="#9CA3AF"
                  />
                  {customColors.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeColor(index)}
                      style={[styles.removeButton, { marginLeft: 12 }]}>
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity onPress={addColor} style={styles.addColorButton}>
                <Text style={styles.addColorButtonText}>+ Add Color</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorPreview: {
    marginRight: 12,
  },
  gradientPreview: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    width: 60,
    height: 40,
  },
  colorSwatch: {
    flex: 1,
    height: '100%',
  },
  previewText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  changeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 28,
    color: '#6B7280',
    fontWeight: '300',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  presetCard: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetCardSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  presetGradient: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  presetColor: {
    flex: 1,
    height: '100%',
  },
  presetName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  colorInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorPreviewSmall: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  colorInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#1F2937',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addColorButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addColorButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ColorPicker;

