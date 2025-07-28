import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { Colors } from '../lib/colors';

interface ColorPickerModalProps {
  isVisible: boolean;
  onSelectColor: (hex: string) => void;
  onClose: () => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ isVisible, onSelectColor, onClose }) => {
  const [currentColor, setCurrentColor] = useState(Colors.white);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const handleSelect = () => {
    onSelectColor(currentColor);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: currentColor }]}>
          <Text style={styles.modalTitle}>Pick a Base Color</Text>
          <ColorPicker
            onColorChange={handleColorChange}
            color={currentColor}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
            swatchesLast={false}
            swatches={false}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSelect}>
              <Text style={styles.buttonText}>Select Color</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    height: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: Colors.blue,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: Colors.red,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ColorPickerModal;
