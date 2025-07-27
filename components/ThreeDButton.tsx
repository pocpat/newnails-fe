import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

interface ThreeDButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
}

const ThreeDButton: React.FC<ThreeDButtonProps> = ({ onPress, title, disabled, loading }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.buttonContainer, disabled && styles.disabledButton]}
    >
      <View style={styles.buttonInner}>
        {loading ? (
          <ActivityIndicator color="#4B0082" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 30,
    backgroundColor: '#E0E0E0', // Base color for the button
    shadowColor: '#A3A3A3', // Darker shadow for depth
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10, // Android shadow
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonInner: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    backgroundColor: '#E0E0E0', // Inner surface color
    shadowColor: '#FFFFFF', // Lighter shadow for highlight
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10, // Android highlight
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4B0082',
  },
});

export default ThreeDButton;
