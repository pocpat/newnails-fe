
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, ScrollView } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import SelectorRow from '../components/SelectorRow'; // Import the new component

// Data arrays for selection categories
const lengthOptions = ["Short", "Medium", "Long"];
const shapeOptions = ["Square", "Round", "Almond", "Squoval", "Pointed", "Ballerina"];
const styleOptions = ["Classic French", "Floral", "Line Art", "Geometric", "Ombre", "Abstract", "Dot Nails", "Glitter"];
const colorConfigOptions = ["Base Color Picker", "Monochromatic", "Analogous", "Complimentary", "Triad", "Tetradic"];

const DesignFormScreen = ({ navigation, route }) => {
  // State for user's selections
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedColorConfig, setSelectedColorConfig] = useState(null);

  // State to control the active part of the form
  const [activeSection, setActiveSection] = useState('length'); // Initial active section
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.clear) {
      setSelectedLength(null);
      setSelectedShape(null);
      setSelectedStyle(null);
      setSelectedColorConfig(null);
      setActiveSection('length');
      // Reset the navigation params to avoid an infinite loop
      navigation.setParams({ clear: false });
    }
  }, [route.params?.clear]);

  // Function to handle selection and advance the active section
  const handleSelect = (category, value) => {
    switch (category) {
      case 'length':
        setSelectedLength(value);
        setActiveSection('shape');
        break;
      case 'shape':
        setSelectedShape(value);
        setActiveSection('style');
        break;
      case 'style':
        setSelectedStyle(value);
        setActiveSection('color');
        break;
      case 'color':
        setSelectedColorConfig(value);
        // No next section, all options selected
        break;
      default:
        break;
    }
  };

  // Check if all options are selected to enable the "Impress Me" button
  const allOptionsSelected = selectedLength && selectedShape && selectedStyle && selectedColorConfig;

  const handleImpressMe = () => {
    setLoading(true);
    // Simulate API call or processing time
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Results', {
        length: selectedLength,
        shape: selectedShape,
        style: selectedStyle,
        colorConfig: selectedColorConfig,
      });
    }, 1500); // Simulate a short delay
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Design</Text>

        <SelectorRow
          title="Nail Length"
          options={lengthOptions}
          onSelect={(value) => handleSelect('length', value)}
          selectedValue={selectedLength}
          isActive={activeSection === 'length'}
          onPress={() => setActiveSection('length')}
        />
        <SelectorRow
          title="Nail Shape"
          options={shapeOptions}
          onSelect={(value) => handleSelect('shape', value)}
          selectedValue={selectedShape}
          isActive={activeSection === 'shape'}
          onPress={() => setActiveSection('shape')}
        />
        <SelectorRow
          title="Nail Style"
          options={styleOptions}
          onSelect={(value) => handleSelect('style', value)}
          selectedValue={selectedStyle}
          isActive={activeSection === 'style'}
          onPress={() => setActiveSection('style')}
        />
        <SelectorRow
          title="Color Configuration"
          options={colorConfigOptions}
          onSelect={(value) => handleSelect('color', value)}
          selectedValue={selectedColorConfig}
          isActive={activeSection === 'color'}
          onPress={() => setActiveSection('color')}
        />

        {allOptionsSelected && (
          <View style={styles.impressMeButtonContainer}>
            <Button
              mode="contained"
              onPress={handleImpressMe}
              style={styles.impressMeButton}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : "Impress Me"}
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40, // Adjust for header if needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  impressMeButtonContainer: {
    marginTop: 30,
    alignSelf: 'center',
  },
  impressMeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#6200ee', // Example primary color
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DesignFormScreen;
