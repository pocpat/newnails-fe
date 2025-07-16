
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

interface SelectorRowProps {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
  isActive: boolean;
  onPress?: () => void; // Optional for making inactive rows tappable
}

const SelectorRow: React.FC<SelectorRowProps> = ({
  title,
  options,
  onSelect,
  selectedValue,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.rowContainer, !isActive && styles.inactiveRow]}
      onPress={onPress}
      disabled={isActive} // Disable touch feedback if already active
    >
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={styles.buttonsContainer}>
        {options.map((option) => (
          <Button
            key={option}
            mode={selectedValue === option ? 'contained' : 'outlined'}
            onPress={() => onSelect(option)}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={!isActive} // Disable buttons if the row is not active
          >
            {option}
          </Button>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  inactiveRow: {
    opacity: 0.5,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    margin: 5,
  },
  buttonLabel: {
    fontSize: 14,
  },
});

export default SelectorRow;
